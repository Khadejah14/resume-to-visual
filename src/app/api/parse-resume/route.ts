import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let extractedText = ''
    try {
      const pdfParse = (await import('pdf-parse')).default
      const pdfData = await pdfParse(buffer)
      extractedText = pdfData.text
    } catch {
      // Fallback: try to extract readable text from buffer
      extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ')
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' }, { status: 422 })
    }

    // Use Claude API via Anthropic to parse resume
    const apiKey = process.env.ANTHROPIC_API_KEY
    const openAiKey = process.env.OPENAI_API_KEY

    let resumeData

    if (apiKey) {
      resumeData = await parseWithAnthropic(extractedText, apiKey)
    } else if (openAiKey) {
      resumeData = await parseWithOpenAI(extractedText, openAiKey)
    } else {
      // Fallback: basic regex-based extraction for demo
      resumeData = basicExtract(extractedText)
    }

    return NextResponse.json({ data: resumeData, rawText: extractedText.slice(0, 500) })
  } catch (err) {
    console.error('Parse error:', err)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the resume text and return ONLY valid JSON matching this schema exactly. No markdown, no explanation, just the JSON object.

{
  "name": "string",
  "title": "string (current or most recent job title)",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string (professional summary or objective, or generate a 2-sentence one from context)",
  "linkedin": "string or null",
  "github": "string or null",
  "website": "string or null",
  "skills": ["array of skill strings"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string (e.g. Jan 2020)",
      "endDate": "string (e.g. Present or Dec 2023)",
      "location": "string or null",
      "description": ["array of bullet point strings"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string or null",
      "honors": "string or null"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["array of tech strings"],
      "url": "string or null"
    }
  ],
  "certifications": ["array of strings or empty array"],
  "languages": ["array of strings or empty array"]
}`

async function parseWithAnthropic(text: string, apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Parse this resume:\n\n${text}` }],
    }),
  })

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`)
  const result = await response.json()
  const content = result.content[0]?.text || ''
  return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
}

async function parseWithOpenAI(text: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parse this resume:\n\n${text}` },
      ],
    }),
  })

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`)
  const result = await response.json()
  return JSON.parse(result.choices[0].message.content)
}

function basicExtract(text: string) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/)?.[0] || ''
  const phoneMatch = text.match(/[\+]?[\d\s\-().]{10,15}/)?.[0]?.trim() || ''
  const lines = text.split('\n').filter(l => l.trim())
  const name = lines[0]?.trim() || 'Unknown'

  return {
    name,
    title: lines[1]?.trim() || 'Professional',
    email: emailMatch,
    phone: phoneMatch,
    location: '',
    summary: 'Please add your professional summary here.',
    linkedin: null,
    github: null,
    website: null,
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
  }
}

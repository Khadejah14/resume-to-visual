import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null
    const customPromptStr = formData.get('customPrompt') as string | null
    
    let customPrompt = null
    if (customPromptStr) {
      try {
        customPrompt = JSON.parse(customPromptStr)
      } catch {
        customPrompt = null
      }
    }

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
      // Improved fallback: try multiple encodings and extract readable text
      let textUtf8 = buffer.toString('utf-8')
      let textLatin1 = buffer.toString('latin1')
      // Extract sequences of printable characters (words, lines)
      const extractReadable = (str: string) =>
        (str.match(/[\x20-\x7E\n]{3,}/g) || []).join(' ')
      let extracted = extractReadable(textUtf8)
      // If too short, try latin1
      if (!extracted || extracted.length < 50) {
        extracted = extractReadable(textLatin1)
      }
      // Final cleanup: collapse whitespace
      extractedText = extracted.replace(/\s+/g, ' ').trim()
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' }, { status: 422 })
    }

    // Use Claude API via Anthropic to parse resume
    const apiKey = process.env.ANTHROPIC_API_KEY
    const openAiKey = process.env.OPENAI_API_KEY

    let resumeData

    if (apiKey) {
      resumeData = await parseWithAnthropic(extractedText, apiKey, customPrompt)
    } else if (openAiKey) {
      resumeData = await parseWithOpenAI(extractedText, openAiKey, customPrompt)
    } else {
      // Fallback: basic regex-based extraction for demo
      resumeData = basicExtract(extractedText, customPrompt)
    }

    resumeData.customPrompt = customPrompt

    return NextResponse.json({ data: resumeData, rawText: extractedText.slice(0, 500) })
  } catch (err) {
    console.error('Parse error:', err);
    if (
      err instanceof Error &&
      err.message &&
      err.message.includes('Failed to parse AI response as JSON')
    ) {
      return NextResponse.json(
        {
          error:
            'The AI could not parse your resume into structured data. Please try again, adjust your resume formatting, or use a different file.',
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
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

async function parseWithAnthropic(text: string, apiKey: string, customPrompt: { jobPosition: string; visualStyle: string; theme: string } | null) {
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
  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
  } catch (err) {
    console.error('Anthropic API response JSON parse error:', err, '\nRaw content:', content)
    throw new Error('Failed to parse AI response as JSON. Please try again or adjust your resume.')
  }
}

async function parseWithOpenAI(text: string, apiKey: string, customPrompt: { jobPosition: string; visualStyle: string; theme: string } | null) {
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
  try {
    return JSON.parse(result.choices[0].message.content)
  } catch (err) {
    console.error('OpenAI API response JSON parse error:', err, '\nRaw content:', result.choices[0].message.content)
    throw new Error('Failed to parse AI response as JSON. Please try again or adjust your resume.')
  }
}

function basicExtract(text: string, customPrompt: { jobPosition: string; visualStyle: string; theme: string } | null) {
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

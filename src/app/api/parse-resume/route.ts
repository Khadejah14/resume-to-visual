import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse PDF using dynamic import to handle CJS/ESM interop
    const pdfParseModule = await import("pdf-parse");
    // `pdf-parse` may export as default (CJS) or named; handle both
    const pdfParse = (pdfParseModule && (pdfParseModule.default ?? pdfParseModule)) as any;
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    // Use OpenAI to extract structured data
    const prompt = `
    Extract the following information from this resume text and return it as valid JSON:
    {
      "name": "person's full name",
      "headline": "job title or professional headline",
      "email": "email address",
      "phone": "phone number",
      "experience": [
        {
          "title": "job title",
          "company": "company name",
          "startDate": "start date",
          "endDate": "end date",
          "description": "job description/responsibilities"
        }
      ],
      "skills": [
        {
          "category": "skill category",
          "items": ["skill1", "skill2"]
        }
      ],
      "education": [
        {
          "school": "school/university name",
          "degree": "degree name",
          "year": "graduation year"
        }
      ],
      "projects": [
        {
          "title": "project title",
          "description": "project description",
          "link": "project link or empty string"
        }
      ],
      "links": [
        {
          "name": "LinkedIn",
          "url": "https://..."
        }
      ]
    }
    
    Resume text:
    ${pdfText}
    
    Return ONLY the JSON object, no additional text.
    `;

    const message = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.choices[0].message.content || "";

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse resume data" },
        { status: 400 }
      );
    }

    const resumeData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "failed to parse resume" },
      { status: 500 }
    );
  }
}

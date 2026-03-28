import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { generateResumeHTML } from '@/lib/generateHTML'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 })
    }

    // Generate HTML from resume data
    const html = generateResumeHTML(data)

    // Launch Puppeteer and render PDF
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 24, bottom: 24, left: 24, right: 24 },
    })
    await browser.close()

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    })
  } catch (err: any) {
    console.error('PDF export error:', err)
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 })
  }
}

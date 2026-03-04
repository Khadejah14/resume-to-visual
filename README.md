# Resume-to-Visual

> Upload a PDF résumé → AI extracts structured data → Review & edit → Download a stunning self-contained HTML resume.

![Screenshot placeholder](https://placehold.co/900x500/0a0a12/00d4ff?text=Resume-to-Visual)

---

## Features

- **PDF Upload & Parsing** — drag-and-drop or click, powered by `pdf-parse`
- **AI Extraction** — sends raw text to Claude (Anthropic) or GPT-4o (OpenAI), returns structured JSON: name, title, experience, education, skills, projects, certifications, languages, links
- **Live Editor Dashboard** — dark-mode, responsive, click-to-edit any field inline
- **Download HTML** — fully self-contained, offline-ready visual resume with all styles inlined
- **Zero-dependency export** — no CDN required in the downloaded file

---

## Project Structure

```
resume-to-visual/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── parse-resume/
│   │   │       └── route.ts        # POST /api/parse-resume — PDF → AI → JSON
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Root page (upload or dashboard)
│   ├── components/
│   │   ├── UploadZone.tsx          # Drag-and-drop upload UI
│   │   └── Dashboard.tsx           # Editor dashboard with inline editing
│   ├── lib/
│   │   └── generateHTML.ts         # Self-contained HTML resume generator
│   └── types/
│       └── resume.ts               # TypeScript interfaces
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/resume-to-visual.git
cd resume-to-visual
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add **at least one** API key:

```env
# Option A — Claude (Anthropic)  ← recommended
ANTHROPIC_API_KEY=sk-ant-...

# Option B — GPT-4o (OpenAI)
OPENAI_API_KEY=sk-...
```

> **No API key?** The app falls back to basic regex extraction (name, email, phone). This is limited but functional for a quick demo.

### 3. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

### 4. Build for production

```bash
npm run build
npm start
```

---

## How It Works

```
User uploads PDF
      ↓
/api/parse-resume (Next.js App Router route)
      ↓
pdf-parse → raw text
      ↓
Anthropic Claude / OpenAI GPT-4o
  (system prompt asks for strict JSON schema)
      ↓
ResumeData typed object returned to frontend
      ↓
Dashboard.tsx — live editing with inline click-to-edit
      ↓
generateHTML.ts — produces self-contained HTML string
      ↓
Browser downloads <name>_resume.html
```

---

## API Reference

### `POST /api/parse-resume`

**Request:** `multipart/form-data` with field `resume` (PDF file)

**Response (success):**
```json
{
  "data": {
    "name": "Jane Smith",
    "title": "Senior Software Engineer",
    "email": "jane@example.com",
    "phone": "+1 555-0100",
    "location": "San Francisco, CA",
    "summary": "...",
    "linkedin": "https://linkedin.com/in/janesmith",
    "github": "https://github.com/janesmith",
    "website": null,
    "skills": ["TypeScript", "React", "Node.js"],
    "experience": [...],
    "education": [...],
    "projects": [...],
    "certifications": [],
    "languages": []
  },
  "rawText": "First 500 chars of extracted text..."
}
```

**Response (error):**
```json
{ "error": "Only PDF files are supported" }
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Recommended | Claude API key (claude-sonnet-4) |
| `OPENAI_API_KEY` | Optional | OpenAI API key (gpt-4o), used if Anthropic key absent |
| `NEXT_PUBLIC_SUPABASE_URL` | Future | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Future | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Future | Supabase service role key |

---

## Roadmap

### v0.2 — Multiple Themes
- [ ] Theme picker (dark/light/minimal/creative)
- [ ] Color accent customization
- [ ] Font pairing selector

### v0.3 — Supabase Storage
- [ ] Save parsed resumes to Supabase
- [ ] Generate shareable links (`/r/:id`)
- [ ] Version history

### v0.4 — Authentication
- [ ] Supabase Auth (email + OAuth)
- [ ] User dashboard with resume history
- [ ] Resume CRUD operations

### v0.5 — PDF Export
- [ ] Puppeteer/Playwright server-side PDF rendering
- [ ] ATS-friendly plain text export
- [ ] LinkedIn integration

### v1.0 — Polish
- [ ] Resume scoring / improvement suggestions
- [ ] Job description matching
- [ ] AI rewrite suggestions per section

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| PDF Parsing | pdf-parse |
| AI | Anthropic Claude / OpenAI GPT-4o |
| Icons | Lucide React |
| Fonts | DM Serif Display + DM Sans + JetBrains Mono |

---

## License

MIT

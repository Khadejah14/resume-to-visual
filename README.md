# Resume to Visual 📄➡️✨

Transform your resume into a stunning, interactive visual experience. Instead of sending a traditional PDF, share a beautifully designed HTML file that showcases your creativity and personality.

## Features

✅ **PDF Upload & Auto-Parse** – Upload your resume and let AI extract the data  
✅ **Dashboard Theme** – Clean, modern dark theme with organized sections  
✅ **Downloadable HTML** – Export your visual resume as a standalone HTML file  
✅ **Responsive Design** – Works seamlessly on desktop, tablet, and mobile  
✅ **Zero-Dependency HTML** – Download file works offline with all styles embedded  

## Tech Stack

- **Frontend**: Next.js (React + TypeScript), Tailwind CSS
- **Backend**: Next.js API Routes
- **PDF Parsing**: pdf-parse
- **AI**: Claude (Anthropic) for intelligent resume parsing
- **Database**: Supabase (future iterations)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (or Anthropic Claude key)

### Installation

```bash
git clone <your-repo>
cd resume-to-visual
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key  # or ANTHROPIC_API_KEY
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Resume** – Click "Upload Your Resume" and select a PDF file
2. **Auto-Parse** – The app extracts your information using AI
3. **Review & Edit** – Check the parsed data and make corrections if needed
4. **Preview** – See your visual resume in the Dashboard theme
5. **Download** – Click "📥 Download HTML" to get a standalone file

## Project Structure

```
src/
  ├── app/
  │   ├── api/
  │   │   └── parse-resume/        # PDF parsing endpoint
  │   ├── layout.tsx               # Root layout
  │   └── page.tsx                 # Main home page
  ├── components/
  │   ├── ResumeUpload.tsx          # Upload form component
  │   └── DashboardTheme.tsx        # Dashboard theme display
  └── lib/
      ├── supabaseClient.ts         # Supabase initialization
      └── exportHTML.ts             # HTML generation & download
styles/
  └── globals.css                   # Tailwind directives
```

## MVP Features (Current)

- ✅ PDF upload and parsing
- ✅ Dashboard theme visualization
- ✅ HTML export/download
- ✅ Responsive design

## Roadmap (Future)

- [ ] Theme system (Terminal, Studio, Map, Campfire)
- [ ] User authentication (NextAuth.js)
- [ ] Save resumes to database
- [ ] Shareable links with IDs
- [ ] Theme customization/colors
- [ ] PDF export option
- [ ] Analytics on shared resumes

## API Endpoints

### POST `/api/parse-resume`

Parses a PDF resume and returns structured data.

**Request:**
```json
FormData {
  "file": File (PDF)
}
```

**Response:**
```json
{
  "name": "John Doe",
  "headline": "Full Stack Developer",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "experience": [ ... ],
  "skills": [ ... ],
  "education": [ ... ],
  "projects": [ ... ],
  "links": [ ... ]
}
```

## Development Notes

- Uses Claude 3.5 Sonnet for intelligent data extraction
- PDF text extraction via pdf-parse
- All styles are inlined in exported HTML for offline compatibility
- Tailwind CSS for rapid UI prototyping

## License

MIT

## Contact & Support

For questions or feedback, open an issue in the repository.

---

**Made with ❤️ to help you stand out**

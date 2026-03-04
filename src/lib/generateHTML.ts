import { ResumeData } from '@/types/resume'

export function generateResumeHTML(data: ResumeData): string {
  const skills = data.skills.slice(0, 30)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.name} — Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0d14;
    --surface: #13131f;
    --border: #1e1e30;
    --text: #e8e8f0;
    --muted: #888899;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --white: #ffffff;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .page {
    max-width: 900px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  /* Header */
  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: start;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 36px;
  }
  .name {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, var(--white) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .title {
    font-size: 15px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 8px;
  }
  .contact-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: right;
    padding-top: 6px;
  }
  .contact-grid a, .contact-item {
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    transition: color 0.2s;
  }
  .contact-grid a:hover { color: var(--accent); }
  /* Summary */
  .summary {
    background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06));
    border: 1px solid rgba(0,212,255,0.15);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 36px;
    font-size: 14.5px;
    color: #b8b8cc;
    line-height: 1.75;
  }
  /* Two column layout */
  .layout {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 48px;
  }
  /* Section */
  .section { margin-bottom: 32px; }
  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,212,255,0.3), transparent);
  }
  /* Experience */
  .exp-item { margin-bottom: 24px; }
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 2px;
  }
  .exp-role {
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
  }
  .exp-dates {
    font-size: 12px;
    color: var(--muted);
    font-family: monospace;
  }
  .exp-company {
    font-size: 13px;
    color: var(--accent);
    font-weight: 500;
    margin-bottom: 8px;
  }
  .exp-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .exp-bullets li {
    font-size: 13.5px;
    color: #a0a0b8;
    padding-left: 16px;
    position: relative;
    line-height: 1.55;
  }
  .exp-bullets li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent2);
    font-size: 10px;
    top: 3px;
  }
  /* Education */
  .edu-item { margin-bottom: 16px; }
  .edu-school { font-size: 14px; font-weight: 600; color: var(--white); }
  .edu-degree { font-size: 13px; color: var(--muted); }
  .edu-dates { font-size: 12px; color: var(--muted); font-family: monospace; }
  /* Projects */
  .project-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .project-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 4px;
  }
  .project-desc {
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .tech-tag {
    font-size: 10.5px;
    font-family: monospace;
    padding: 2px 7px;
    border-radius: 4px;
    background: rgba(124,58,237,0.15);
    color: #a78bfa;
    border: 1px solid rgba(124,58,237,0.25);
  }
  /* Skills sidebar */
  .skills-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .skill-pill {
    font-size: 11.5px;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(0,212,255,0.08);
    color: var(--accent);
    border: 1px solid rgba(0,212,255,0.2);
    font-weight: 500;
  }
  /* Sidebar sections */
  .sidebar .section-label::after { display: none; }
  .info-row {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .cert-item {
    font-size: 12.5px;
    color: var(--muted);
    padding: 4px 0;
    border-bottom: 1px solid var(--border);
  }
  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 11px;
    color: #444458;
    letter-spacing: 0.05em;
  }
  @media print {
    body { background: #fff !important; color: #111 !important; }
    .page { padding: 24px; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <header class="header">
    <div>
      <div class="name">${escapeHtml(data.name)}</div>
      <div class="title">${escapeHtml(data.title)}</div>
    </div>
    <div class="contact-grid">
      ${data.email ? `<a href="mailto:${escapeHtml(data.email)}">✉ ${escapeHtml(data.email)}</a>` : ''}
      ${data.phone ? `<span class="contact-item">☎ ${escapeHtml(data.phone)}</span>` : ''}
      ${data.location ? `<span class="contact-item">⌖ ${escapeHtml(data.location)}</span>` : ''}
      ${data.linkedin ? `<a href="${escapeHtml(data.linkedin)}" target="_blank">in LinkedIn</a>` : ''}
      ${data.github ? `<a href="${escapeHtml(data.github)}" target="_blank">⌥ GitHub</a>` : ''}
      ${data.website ? `<a href="${escapeHtml(data.website)}" target="_blank">↗ Portfolio</a>` : ''}
    </div>
  </header>

  ${data.summary ? `<div class="summary">${escapeHtml(data.summary)}</div>` : ''}

  <div class="layout">
    <!-- Main column -->
    <main>
      ${data.experience.length > 0 ? `
      <section class="section">
        <div class="section-label">Experience</div>
        ${data.experience.map(exp => `
        <div class="exp-item">
          <div class="exp-header">
            <span class="exp-role">${escapeHtml(exp.role)}</span>
            <span class="exp-dates">${escapeHtml(exp.startDate)} – ${escapeHtml(exp.endDate)}</span>
          </div>
          <div class="exp-company">${escapeHtml(exp.company)}${exp.location ? ` · ${escapeHtml(exp.location)}` : ''}</div>
          ${exp.description.length > 0 ? `
          <ul class="exp-bullets">
            ${exp.description.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
          </ul>` : ''}
        </div>`).join('')}
      </section>` : ''}

      ${data.projects.length > 0 ? `
      <section class="section">
        <div class="section-label">Projects</div>
        ${data.projects.map(p => `
        <div class="project-item">
          <div class="project-name">${escapeHtml(p.name)}${p.url ? ` <a href="${escapeHtml(p.url)}" target="_blank" style="font-size:11px;color:#00d4ff;font-weight:400;">↗</a>` : ''}</div>
          <div class="project-desc">${escapeHtml(p.description)}</div>
          ${p.technologies.length > 0 ? `
          <div class="tech-tags">
            ${p.technologies.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
          </div>` : ''}
        </div>`).join('')}
      </section>` : ''}
    </main>

    <!-- Sidebar -->
    <aside class="sidebar">
      ${skills.length > 0 ? `
      <section class="section">
        <div class="section-label">Skills</div>
        <div class="skills-cloud">
          ${skills.map(s => `<span class="skill-pill">${escapeHtml(s)}</span>`).join('')}
        </div>
      </section>` : ''}

      ${data.education.length > 0 ? `
      <section class="section">
        <div class="section-label">Education</div>
        ${data.education.map(ed => `
        <div class="edu-item">
          <div class="edu-school">${escapeHtml(ed.institution)}</div>
          <div class="edu-degree">${escapeHtml(ed.degree)}${ed.field ? ` in ${escapeHtml(ed.field)}` : ''}</div>
          <div class="edu-dates">${escapeHtml(ed.startDate)} – ${escapeHtml(ed.endDate)}</div>
          ${ed.gpa ? `<div class="edu-dates">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
        </div>`).join('')}
      </section>` : ''}

      ${data.certifications && data.certifications.length > 0 ? `
      <section class="section">
        <div class="section-label">Certifications</div>
        ${data.certifications.map(c => `<div class="cert-item">${escapeHtml(c)}</div>`).join('')}
      </section>` : ''}

      ${data.languages && data.languages.length > 0 ? `
      <section class="section">
        <div class="section-label">Languages</div>
        ${data.languages.map(l => `<div class="info-row">${escapeHtml(l)}</div>`).join('')}
      </section>` : ''}
    </aside>
  </div>

  <footer class="footer">Generated with Resume-to-Visual · ${new Date().getFullYear()}</footer>
</div>
</body>
</html>`
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

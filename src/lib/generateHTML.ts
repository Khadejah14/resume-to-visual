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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0f14;
    --surface: #18181f;
    --surface-elevated: #1e1e28;
    --border: #2a2a3a;
    --border-light: #3a3a4a;
    --text: #f0f0f5;
    --text-secondary: #b0b0c0;
    --text-muted: #707088;
    --accent: #e06c75;
    --accent-light: #ff8a94;
    --accent2: #61afef;
    --accent3: #c678dd;
    --accent4: #98c379;
    --gradient-accent: linear-gradient(135deg, #e06c75 0%, #c678dd 50%, #61afef 100%);
    --gradient-surface: linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface) 100%);
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 400;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .page {
    max-width: 850px;
    margin: 0 auto;
    padding: 56px 48px;
  }
  /* Decorative background */
  .bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  }
  .bg-decoration::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(224,108,117,0.08) 0%, transparent 60%);
  }
  .bg-decoration::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(97,175,239,0.06) 0%, transparent 60%);
  }
  /* Header */
  .header {
    position: relative;
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--border);
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px;
    height: 2px;
    background: var(--gradient-accent);
  }
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
  }
  .name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(38px, 5vw, 52px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #f8f8fc 0%, #e8e8f0 60%, #d0d0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 12px;
  }
  .contact-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: right;
    padding-top: 8px;
  }
  .contact-grid a, .contact-item {
    font-size: 13px;
    color: var(--text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    transition: color 0.2s ease;
  }
  .contact-grid a:hover { color: var(--accent2); }
  .contact-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
    border-radius: 4px;
    font-size: 10px;
    color: var(--text-secondary);
  }
  /* Summary */
  .summary {
    background: linear-gradient(135deg, rgba(224,108,117,0.08) 0%, rgba(198,120,221,0.06) 100%);
    border: 1px solid rgba(224,108,117,0.2);
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 44px;
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.8;
    position: relative;
    overflow: hidden;
  }
  .summary::before {
    content: '"';
    position: absolute;
    top: 8px;
    left: 20px;
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    color: rgba(224,108,117,0.1);
    line-height: 1;
  }
  /* Two column layout */
  .layout {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: 56px;
  }
  /* Section */
  .section { margin-bottom: 36px; }
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(224,108,117,0.4), transparent);
  }
  /* Experience */
  .exp-item {
    margin-bottom: 28px;
    padding: 24px;
    background: var(--gradient-surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .exp-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    border-color: var(--border-light);
  }
  .exp-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--gradient-accent);
    border-radius: 14px 0 0 14px;
  }
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;
  }
  .exp-role {
    font-size: 17px;
    font-weight: 600;
    color: var(--text);
  }
  .exp-dates {
    font-size: 12px;
    color: var(--text-muted);
    font-family: 'Source Sans 3', sans-serif;
    background: var(--surface);
    padding: 4px 10px;
    border-radius: 6px;
  }
  .exp-company {
    font-size: 14px;
    color: var(--accent2);
    font-weight: 500;
    margin-bottom: 14px;
  }
  .exp-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .exp-bullets li {
    font-size: 14px;
    color: var(--text-secondary);
    padding-left: 20px;
    position: relative;
    line-height: 1.6;
  }
  .exp-bullets li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent3);
    font-size: 12px;
    font-weight: 600;
  }
  /* Education */
  .edu-item {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    position: relative;
  }
  .edu-school { 
    font-size: 15px; 
    font-weight: 600; 
    color: var(--text); 
    margin-bottom: 4px;
  }
  .edu-degree { 
    font-size: 14px; 
    color: var(--text-secondary); 
    margin-bottom: 6px;
  }
  .edu-dates { 
    font-size: 12px; 
    color: var(--text-muted);
    font-family: 'Source Sans 3', sans-serif;
  }
  /* Projects */
  .project-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }
  .project-item::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle at top right, rgba(97,175,239,0.08) 0%, transparent 70%);
  }
  .project-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .project-name a {
    color: var(--accent2);
    text-decoration: none;
    font-weight: 400;
  }
  .project-desc {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tech-tag {
    font-size: 11px;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(198,120,221,0.12);
    color: var(--accent3);
    border: 1px solid rgba(198,120,221,0.2);
  }
  /* Skills sidebar */
  .skills-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .skill-pill {
    font-size: 12px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(224,108,117,0.1);
    color: var(--accent-light);
    border: 1px solid rgba(224,108,117,0.25);
    font-weight: 500;
    transition: all 0.2s ease;
  }
  .skill-pill:hover {
    background: rgba(224,108,117,0.18);
    transform: translateY(-1px);
  }
  /* Sidebar sections */
  .sidebar .section-label::after { display: none; }
  .sidebar .section-label {
    color: var(--accent3);
  }
  .info-row {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
    padding: 8px 12px;
    background: var(--surface);
    border-radius: 8px;
    border-left: 3px solid var(--accent4);
  }
  .cert-item {
    font-size: 13px;
    color: var(--text-secondary);
    padding: 10px 14px;
    background: var(--surface);
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 3px solid var(--accent3);
  }
  /* Footer */
  .footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 12px;
    color: #4a4a5a;
    letter-spacing: 0.08em;
  }
  @media print {
    body { background: #fff !important; color: #1a1a1a !important; }
    .page { padding: 24px; }
    .bg-decoration, .exp-item:hover, .skill-pill:hover { display: none; }
    .exp-item, .project-item, .edu-item { 
      box-shadow: none; 
      border-color: #ddd;
    }
    .name { -webkit-text-fill-color: #1a1a1a; }
  }
</style>
</head>
<body>
<div class="bg-decoration"></div>
<div class="page">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <div>
        <div class="name">${escapeHtml(data.name)}</div>
        <div class="title">${escapeHtml(data.title)}</div>
      </div>
      <div class="contact-grid">
        ${data.email ? `<a href="mailto:${escapeHtml(data.email)}"><span class="contact-icon">✉</span> ${escapeHtml(data.email)}</a>` : ''}
        ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}"><span class="contact-icon">☎</span> ${escapeHtml(data.phone)}</a>` : ''}
        ${data.location ? `<span class="contact-item"><span class="contact-icon">⌖</span> ${escapeHtml(data.location)}</span>` : ''}
        ${data.linkedin ? `<a href="${escapeHtml(data.linkedin)}" target="_blank"><span class="contact-icon">in</span> LinkedIn</a>` : ''}
        ${data.github ? `<a href="${escapeHtml(data.github)}" target="_blank"><span class="contact-icon">⌥</span> GitHub</a>` : ''}
        ${data.website ? `<a href="${escapeHtml(data.website)}" target="_blank"><span class="contact-icon">↗</span> Portfolio</a>` : ''}
      </div>
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
            <span class="exp-dates">${escapeHtml(exp.startDate)} — ${escapeHtml(exp.endDate)}</span>
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
          <div class="project-name">${escapeHtml(p.name)}${p.url ? ` <a href="${escapeHtml(p.url)}" target="_blank">↗</a>` : ''}</div>
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
          <div class="edu-dates">${escapeHtml(ed.startDate)} — ${escapeHtml(ed.endDate)}</div>
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

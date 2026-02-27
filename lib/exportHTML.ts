import React from "react";

interface ResumeData {
  name: string;
  headline: string;
  email: string;
  phone: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  links: Array<{
    name: string;
    url: string;
  }>;
}

interface ExportProps {
  data: ResumeData;
  theme: string;
}

export function generateHTML(data: ResumeData, theme: string): string {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Visual Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #1e293b via-slate-800 to-slate-900);
      color: white;
      line-height: 1.6;
    }

    .container {
      min-height: 100vh;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 3rem;
      animation: fadeIn 0.8s ease-in;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .headline {
      font-size: 1.5rem;
      color: #9ca3af;
      margin-bottom: 1rem;
    }

    .contact-info {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      flex-wrap: wrap;
    }

    .contact-info a {
      color: #60a5fa;
      text-decoration: none;
    }

    .contact-info a:hover {
      text-decoration: underline;
    }

    section {
      margin-bottom: 3rem;
      animation: slideUp 0.8s ease-in;
    }

    h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 0.5rem;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .skill-card {
      background: rgba(51, 65, 85, 0.5);
      padding: 1.5rem;
      border-radius: 0.5rem;
      border-left: 4px solid #3b82f6;
    }

    .skill-category {
      font-size: 1.1rem;
      font-weight: 600;
      color: #60a5fa;
      margin-bottom: 0.75rem;
    }

    .skill-list {
      list-style: none;
    }

    .skill-list li {
      padding: 0.25rem 0;
      color: #d1d5db;
      font-size: 0.95rem;
    }

    .experience-item,
    .education-item,
    .project-item {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
      border-left: 3px solid #3b82f6;
    }

    .experience-item h3,
    .project-item h3 {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .company,
    .school {
      color: #60a5fa;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.9rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
    }

    .description {
      color: #d1d5db;
      margin-top: 0.5rem;
    }

    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .education-card {
      background: rgba(51, 65, 85, 0.5);
      padding: 1.5rem;
      border-radius: 0.5rem;
      border-top: 3px solid #3b82f6;
    }

    .education-card h3 {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      background: rgba(51, 65, 85, 0.5);
      padding: 1.5rem;
      border-radius: 0.5rem;
      border-bottom: 3px solid #3b82f6;
    }

    .project-card h3 {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .project-link {
      display: inline-block;
      margin-top: 1rem;
      color: #60a5fa;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .social-btn {
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background 0.3s;
    }

    .social-btn:hover {
      background: #2563eb;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      .container {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${data.name}</h1>
      <p class="headline">${data.headline}</p>
      <div class="contact-info">
        <a href="mailto:${data.email}">${data.email}</a>
        <span>|</span>
        <span>${data.phone}</span>
      </div>
    </header>

    ${
      data.skills.length > 0
        ? `
    <section>
      <h2>Skills</h2>
      <div class="skills-grid">
        ${data.skills
          .map(
            (skillGroup) => `
        <div class="skill-card">
          <div class="skill-category">${skillGroup.category}</div>
          <ul class="skill-list">
            ${skillGroup.items.map((skill) => `<li>• ${skill}</li>`).join("")}
          </ul>
        </div>
        `
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }

    ${
      data.experience.length > 0
        ? `
    <section>
      <h2>Experience</h2>
      ${data.experience
        .map(
          (job) => `
      <div class="experience-item">
        <h3>${job.title}</h3>
        <div class="company">${job.company}</div>
        <div class="date">${job.startDate} - ${job.endDate}</div>
        <div class="description">${job.description}</div>
      </div>
      `
        )
        .join("")}
    </section>
    `
        : ""
    }

    ${
      data.education.length > 0
        ? `
    <section>
      <h2>Education</h2>
      <div class="education-grid">
        ${data.education
          .map(
            (edu) => `
        <div class="education-card">
          <h3>${edu.degree}</h3>
          <div class="school">${edu.school}</div>
          <div class="date">${edu.year}</div>
        </div>
        `
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }

    ${
      data.projects.length > 0
        ? `
    <section>
      <h2>Projects</h2>
      <div class="projects-grid">
        ${data.projects
          .map(
            (project) => `
        <div class="project-card">
          <h3>${project.title}</h3>
          <p class="description">${project.description}</p>
          ${
            project.link
              ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>`
              : ""
          }
        </div>
        `
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }

    ${
      data.links.length > 0
        ? `
    <section>
      <h2>Connect</h2>
      <div class="social-links">
        ${data.links
          .map(
            (link) => `
        <a href="${link.url}" class="social-btn" target="_blank">${link.name}</a>
        `
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }
  </div>
</body>
</html>
  `;

  return html;
}

export function downloadHTML(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

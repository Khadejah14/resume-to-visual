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

interface DashboardThemeProps {
  data: ResumeData;
}

export default function DashboardTheme({ data }: DashboardThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* Hero Section */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-2">{data.name}</h1>
        <p className="text-2xl text-gray-400 mb-4">{data.headline}</p>
        <div className="flex gap-6 text-sm">
          <a href={`mailto:${data.email}`} className="text-blue-400 hover:underline">
            {data.email}
          </a>
          <span>|</span>
          <span className="text-gray-300">{data.phone}</span>
        </div>
      </header>

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx} className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">{skillGroup.category}</h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((job, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-blue-300">{job.company}</p>
                <p className="text-sm text-gray-400">
                  {job.startDate} - {job.endDate}
                </p>
                <p className="mt-2 text-gray-300">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={idx} className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-blue-300">{edu.school}</p>
                <p className="text-sm text-gray-400">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Projects</h2>
          <div className="grid gap-6">
            {data.projects.map((project, idx) => (
              <div key={idx} className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-3">{project.description}</p>
                {project.link && (
                  <a href={project.link} className="text-blue-400 hover:underline text-sm">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      {data.links.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Connect</h2>
          <div className="flex gap-4 flex-wrap">
            {data.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

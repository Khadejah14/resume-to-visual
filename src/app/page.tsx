'use client';

import React, { ChangeEvent, useState } from 'react';

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
  skills: Array<{ category: string; items: string[] }>;
  education: Array<{ school: string; degree: string; year: string }>;
  projects: Array<{ title: string; description: string; link: string }>;
  links: Array<{ name: string; url: string }>;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setResumeData(data);
        setShowPreview(true);
      } else {
        alert(data.error || 'Failed to parse');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const generateHTML = (data: ResumeData): string => {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${data.name}</title></head><body><h1>${data.name}</h1><p>${data.headline}</p></body></html>`;
  };

  const downloadHTML = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      {isLoading && <p>Loading...</p>}

      {!showPreview && (
        <div>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
      )}

      {showPreview && resumeData && (
        <div>
          <h1 className="text-3xl font-bold">{resumeData.name}</h1>
          <p className="mb-4">{resumeData.headline}</p>
          <button
            onClick={() => {
              const html = generateHTML(resumeData);
              downloadHTML(html, `${resumeData.name.replace(/\s+/g, '-')}.html`);
            }}
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download HTML
          </button>
          <button
            onClick={() => setShowPreview(false)}
            className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setResumeData(null);
              setShowPreview(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

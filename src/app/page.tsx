'use client';

import React, { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import DashboardTheme from '@/components/DashboardTheme';
import { generateHTML, downloadHTML } from '@/lib/exportHTML';

interface ResumeData {
  name: string;
  headline: string;
  email: string;
  phone: string;
  experience: Array<{ title: string; company: string; startDate: string; endDate: string; description: string }>;
  skills: Array<{ category: string; items: string[] }>;
  education: Array<{ school: string; degree: string; year: string }>;
  projects: Array<{ title: string; description: string; link: string }>;
  links: Array<{ name: string; url: string }>;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme] = useState('dashboard');
  const [showPreview, setShowPreview] = useState(false);

  const handleDataParsed = (data: ResumeData) => {
    setResumeData(data);
    setShowPreview(true);
  };

  const handleDownload = () => {
    if (!resumeData) return;
    const html = generateHTML(resumeData, theme);
    const filename = `${resumeData.name.replace(/\s+/g, '-').toLowerCase()}-resume.html`;
    downloadHTML(html, filename);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  const handleReset = () => {
    setResumeData(null);
    setShowPreview(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg">Parsing your resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Resume to Visual</h1>
            <p className="text-lg text-slate-600">
              Transform your resume into a stunning visual experience
            </p>
          </div>
          <ResumeUpload onDataParsed={handleDataParsed} onLoading={setIsLoading} />
        </div>
      </main>
    );
  }

  if (showPreview) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-slate-900 text-white p-4 flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold">{resumeData.name}</h2>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition"
            >
              Edit Data
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              📥 Download HTML
            </button>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Reset
            </button>
          </div>
        </div>
        <DashboardTheme data={resumeData} />
      </div>
    );
  }

  return null;
}
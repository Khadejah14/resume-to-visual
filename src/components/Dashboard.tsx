'use client'

import { useState } from 'react'
import { Download, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp, Edit3, Check } from 'lucide-react'
import { ResumeData, WorkExperience, Education, Project } from '@/types/resume'
import { generateResumeHTML } from '@/lib/generateHTML'

interface DashboardProps {
  data: ResumeData
  onReset: () => void
}

function EditableText({
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = '',
}: {
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)

  const commit = () => { onChange(local); setEditing(false) }

  if (editing) {
    const props = {
      value: local,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLocal(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => { if (!multiline && e.key === 'Enter') commit() },
      autoFocus: true,
      className: `bg-slate-800 text-white rounded px-2 py-1 text-sm w-full outline-none ring-1 ring-rose-500/50 ${className}`,
      placeholder,
    }
    return multiline ? (
      <textarea {...props} rows={3} className={`${props.className} resize-none`} />
    ) : (
      <input {...props} />
    )
  }

  return (
    <span
      onClick={() => { setLocal(value); setEditing(true) }}
      className={`cursor-text hover:bg-white/5 rounded px-1 -mx-1 transition-colors group relative ${className}`}
      title="Click to edit"
    >
      {value || <span className="text-slate-600 italic">{placeholder || 'Click to edit'}</span>}
      <Edit3 className="inline w-3 h-3 text-slate-600 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  )
}

function SectionCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-xs font-mono tracking-widest uppercase text-rose-400">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function Dashboard({ data: initialData, onReset }: DashboardProps) {
  const [data, setData] = useState<ResumeData>(initialData)
  const [downloaded, setDownloaded] = useState(false)

  const patch = (partial: Partial<ResumeData>) => setData(d => ({ ...d, ...partial }))

  const handleDownload = () => {
    const html = generateResumeHTML(data)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.name.replace(/\s+/g, '_')}_resume.html`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  // Experience helpers
  const updateExp = (i: number, partial: Partial<WorkExperience>) =>
    patch({ experience: data.experience.map((e, idx) => idx === i ? { ...e, ...partial } : e) })
  const removeExp = (i: number) => patch({ experience: data.experience.filter((_, idx) => idx !== i) })
  const addExp = () => patch({
    experience: [...data.experience, { company: '', role: '', startDate: '', endDate: 'Present', description: [], location: '' }]
  })

  // Education helpers
  const updateEdu = (i: number, partial: Partial<Education>) =>
    patch({ education: data.education.map((e, idx) => idx === i ? { ...e, ...partial } : e) })
  const removeEdu = (i: number) => patch({ education: data.education.filter((_, idx) => idx !== i) })

  // Project helpers
  const updateProject = (i: number, partial: Partial<Project>) =>
    patch({ projects: data.projects.map((p, idx) => idx === i ? { ...p, ...partial } : p) })
  const removeProject = (i: number) => patch({ projects: data.projects.filter((_, idx) => idx !== i) })
  const addProject = () => patch({
    projects: [...data.projects, { name: '', description: '', technologies: [] }]
  })

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0f0f14]/90 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest uppercase text-rose-400">Resume-to-Visual</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 text-sm truncate max-w-[200px]">{data.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              New
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 hover:opacity-90 text-white font-semibold text-sm transition-opacity"
            >
              {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {downloaded ? 'Downloaded!' : 'Download HTML'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hero card */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-violet-500/5" />
              <div className="relative">
                <div className="text-4xl font-serif text-white leading-tight mb-1">
                  <EditableText value={data.name} onChange={v => patch({ name: v })} className="text-4xl font-serif" placeholder="Your Name" />
                </div>
                <div className="text-rose-400 font-medium mb-4">
                  <EditableText value={data.title} onChange={v => patch({ title: v })} placeholder="Job Title" />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {[
                    { key: 'email', icon: '✉', label: 'Email' },
                    { key: 'phone', icon: '☎', label: 'Phone' },
                    { key: 'location', icon: '⌖', label: 'Location' },
                  ].map(({ key, icon, label }) => (
                    <span key={key} className="flex items-center gap-1">
                      <span>{icon}</span>
                      <EditableText
                        value={(data as unknown as Record<string, string>)[key]}
                        onChange={v => patch({ [key]: v } as Partial<ResumeData>)}
                        placeholder={label}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  {(['linkedin', 'github', 'website'] as const).map(k => (
                    <span key={k} className="flex items-center gap-1 text-violet-400">
                      <span>{k === 'linkedin' ? 'in' : k === 'github' ? '⌥' : '↗'}</span>
                      <EditableText value={data[k] || ''} onChange={v => patch({ [k]: v })} placeholder={k} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <SectionCard title="Summary">
              <EditableText
                value={data.summary}
                onChange={v => patch({ summary: v })}
                multiline
                className="text-slate-300 text-sm leading-relaxed w-full"
                placeholder="Professional summary…"
              />
            </SectionCard>

            {/* Experience */}
            <SectionCard title={`Experience (${data.experience.length})`}>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative bg-slate-800/50 rounded-xl p-4 group">
                    <button
                      onClick={() => removeExp(i)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Role</div>
                        <EditableText value={exp.role} onChange={v => updateExp(i, { role: v })} className="text-white font-semibold" placeholder="Job Title" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Company</div>
                        <EditableText value={exp.company} onChange={v => updateExp(i, { company: v })} className="text-rose-400" placeholder="Company" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Start</div>
                        <EditableText value={exp.startDate} onChange={v => updateExp(i, { startDate: v })} className="text-slate-400 text-sm" placeholder="Jan 2020" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">End</div>
                        <EditableText value={exp.endDate} onChange={v => updateExp(i, { endDate: v })} className="text-slate-400 text-sm" placeholder="Present" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Bullets (one per line)</div>
                      <EditableText
                        value={exp.description.join('\n')}
                        onChange={v => updateExp(i, { description: v.split('\n').filter(Boolean) })}
                        multiline
                        className="text-slate-300 text-sm w-full"
                        placeholder="Add bullet points…"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExp}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            </SectionCard>

            {/* Projects */}
            <SectionCard title={`Projects (${data.projects.length})`} defaultOpen={false}>
              <div className="space-y-3">
                {data.projects.map((p, i) => (
                  <div key={i} className="relative bg-slate-800/50 rounded-xl p-4 group">
                    <button
                      onClick={() => removeProject(i)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="mb-2">
                      <div className="text-xs text-slate-500 mb-0.5">Name</div>
                      <EditableText value={p.name} onChange={v => updateProject(i, { name: v })} className="text-white font-semibold" placeholder="Project Name" />
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-slate-500 mb-0.5">Description</div>
                      <EditableText value={p.description} onChange={v => updateProject(i, { description: v })} multiline className="text-slate-300 text-sm w-full" placeholder="What did it do?" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Tech (comma separated)</div>
                      <EditableText
                        value={p.technologies.join(', ')}
                        onChange={v => updateProject(i, { technologies: v.split(',').map(t => t.trim()).filter(Boolean) })}
                        className="text-violet-400 text-sm"
                        placeholder="React, TypeScript…"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Skills */}
            <SectionCard title="Skills">
              <div className="mb-2 text-xs text-slate-500">Edit comma-separated list</div>
              <textarea
                value={data.skills.join(', ')}
                onChange={e => patch({ skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                rows={4}
                className="w-full bg-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-rose-500/50 resize-none"
                placeholder="React, TypeScript, Node.js…"
              />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {data.skills.slice(0, 20).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Education */}
            <SectionCard title={`Education (${data.education.length})`}>
              <div className="space-y-3">
                {data.education.map((ed, i) => (
                  <div key={i} className="relative bg-slate-800/50 rounded-xl p-4 group">
                    <button
                      onClick={() => removeEdu(i)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Institution</div>
                        <EditableText value={ed.institution} onChange={v => updateEdu(i, { institution: v })} className="text-white font-semibold" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Degree & Field</div>
                        <EditableText value={`${ed.degree} ${ed.field}`} onChange={v => { const p = v.split(' '); updateEdu(i, { degree: p[0], field: p.slice(1).join(' ') }) }} className="text-slate-300 text-sm" />
                      </div>
                      <div className="flex gap-2 text-xs text-slate-500">
                        <EditableText value={ed.startDate} onChange={v => updateEdu(i, { startDate: v })} placeholder="Start" />
                        <span>–</span>
                        <EditableText value={ed.endDate} onChange={v => updateEdu(i, { endDate: v })} placeholder="End" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Certifications */}
            {(data.certifications?.length ?? 0) > 0 && (
              <SectionCard title="Certifications" defaultOpen={false}>
                <textarea
                  value={(data.certifications || []).join('\n')}
                  onChange={e => patch({ certifications: e.target.value.split('\n').filter(Boolean) })}
                  rows={3}
                  className="w-full bg-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-rose-500/50 resize-none"
                />
              </SectionCard>
            )}

            {/* Export info */}
            <div className="bg-gradient-to-br from-rose-900/20 to-violet-900/20 border border-rose-500/20 rounded-xl p-4">
              <div className="text-xs font-mono tracking-wider uppercase text-rose-400 mb-2">Export Ready</div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Your HTML resume is self-contained — all styles are inlined, no CDN needed.
              </p>
              <button
                onClick={handleDownload}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

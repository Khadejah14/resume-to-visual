'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { ParseStatus } from '@/types/resume'

interface UploadZoneProps {
  onParsed: (data: unknown) => void
  status: ParseStatus
  setStatus: (s: ParseStatus) => void
}

export default function UploadZone({ onParsed, status, setStatus }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.')
        return
      }
      setFileName(file.name)
      setError('')
      setStatus('uploading')

      const formData = new FormData()
      formData.append('resume', file)

      try {
        setStatus('parsing')
        const res = await fetch('/api/parse-resume', { method: 'POST', body: formData })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Parse failed')
        setStatus('done')
        onParsed(json.data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setStatus('error')
      }
    },
    [onParsed, setStatus]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const isLoading = status === 'uploading' || status === 'parsing'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6">
          Resume → Visual
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-tight text-white leading-none mb-4">
          Transform your<br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            résumé
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Upload a PDF, watch AI extract every detail, then download a stunning visual resume.
        </p>
      </div>

      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`
          relative w-full max-w-lg cursor-pointer rounded-2xl border-2 border-dashed p-12
          flex flex-col items-center gap-4 transition-all duration-300
          ${dragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]'
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50'
          }
          ${isLoading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={onInputChange}
          disabled={isLoading}
        />

        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
          ${dragOver ? 'bg-cyan-500/20 rotate-3' : 'bg-slate-800'}
        `}>
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="text-white font-medium mb-1">
              {status === 'uploading' ? 'Uploading…' : 'Parsing with AI…'}
            </div>
            <div className="text-slate-500 text-sm">{fileName}</div>
            <div className="mt-4 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full animate-shimmer" style={{ width: '60%' }} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-white font-medium mb-1">Drop your PDF here</div>
            <div className="text-slate-500 text-sm">or click to browse</div>
          </div>
        )}

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40 rounded-tl" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/40 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/40 rounded-br" />
      </label>

      {error && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-400 text-sm max-w-lg w-full">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Features */}
      <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg w-full">
        {[
          { icon: FileText, label: 'PDF Parsing', desc: 'Extracts all text' },
          { icon: Upload, label: 'AI Structured', desc: 'Claude or GPT-4o' },
          { icon: FileText, label: 'Export HTML', desc: 'Offline-ready' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-2">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-white text-sm font-medium">{label}</div>
            <div className="text-slate-600 text-xs">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

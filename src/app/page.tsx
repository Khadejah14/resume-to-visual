'use client'

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import Dashboard from '@/components/Dashboard'
import { ResumeData, ParseStatus } from '@/types/resume'

export default function Home() {
  const [status, setStatus] = useState<ParseStatus>('idle')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  const handleParsed = (data: unknown) => {
    setResumeData(data as ResumeData)
  }

  const handleReset = () => {
    setResumeData(null)
    setStatus('idle')
  }

  if (resumeData) {
    return <Dashboard data={resumeData} onReset={handleReset} />
  }

  return (
    <main>
      <UploadZone onParsed={handleParsed} status={status} setStatus={setStatus} />
    </main>
  )
}

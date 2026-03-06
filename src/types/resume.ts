export interface WorkExperience {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string[]
  location?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
}

export interface ResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  linkedin?: string
  github?: string
  website?: string
  skills: string[]
  experience: WorkExperience[]
  education: Education[]
  projects: Project[]
  certifications?: string[]
  languages?: string[]
  customPrompt?: {
    jobPosition: string
    visualStyle: string
    theme: string
  }
}

export type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'done' | 'error'

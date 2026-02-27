import React, { ChangeEvent, FormEvent, useState } from "react";

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

interface UploadProps {
  onDataParsed: (data: ResumeData) => void;
  onLoading: (loading: boolean) => void;
}

export default function ResumeUpload({ onDataParsed, onLoading }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    onLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse resume");
      }

      const data = await response.json();
      onDataParsed(data);
    } catch (err) {
      setError("Error parsing resume. Please try again.");
      console.error(err);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border border-dashed border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {file && <p className="text-sm text-green-600 mb-4">Selected: {file.name}</p>}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload & Parse
        </button>
      </form>
    </div>
  );
}

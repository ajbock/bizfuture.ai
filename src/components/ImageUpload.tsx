"use client"

import { useState } from "react"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages = [...images]

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        if (data.url) newImages.push(data.url)
      } catch {
        console.error("Upload failed")
      }
    }

    onChange(newImages)
    setUploading(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt={"Image " + (i + 1)} className="w-full h-24 object-cover rounded-xl border border-[#1e2d45]" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <label className={"flex items-center justify-center gap-2 border-2 border-dashed border-[#1e2d45] rounded-xl px-4 py-6 cursor-pointer hover:border-cyan-400 transition " + (uploading ? "opacity-50 cursor-not-allowed" : "")}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <span className="text-slate-400 text-sm">
          {uploading ? "Uploading..." : "Click to upload photos (up to 10)"}
        </span>
      </label>

      {images.length > 0 && (
        <p className="text-slate-500 text-xs mt-2">{images.length} photo{images.length !== 1 ? "s" : ""} uploaded</p>
      )}
    </div>
  )
}

"use client"

import { useCallback, useState } from "react"
import { Upload, X, FileVideo, MapPin, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept: string
  label: string
  description: string
  icon: "video" | "gpx"
  onFileSelect: (file: File | null) => void
  file: File | null
}

export function FileUpload({
  accept,
  label,
  description,
  icon,
  onFileSelect,
  file,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFileSelect(selectedFile)
      }
    },
    [onFileSelect]
  )

  const handleRemove = useCallback(() => {
    onFileSelect(null)
  }, [onFileSelect])

  const Icon = icon === "video" ? FileVideo : MapPin

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : file
            ? "border-green-500 bg-green-500/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary">
            <Upload className="h-4 w-4" />
            <span>Click to browse or drag and drop</span>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      )}
    </div>
  )
}

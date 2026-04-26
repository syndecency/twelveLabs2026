"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Video, Route, BarChart3, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"

const steps = [
  {
    number: 1,
    title: "Upload the video",
    description:
      "Street-level footage captured along your target corridor. We support MP4, MOV, and AVI formats.",
    icon: Video,
  },
  {
    number: 2,
    title: "Upload the GPX data",
    description:
      "GPS track file that maps timestamps to coordinates so we can geolocate each frame.",
    icon: Route,
  },
  {
    number: 3,
    title: "Compare against Overture",
    description:
      "We cross-reference detected businesses with Overture's registry to surface what's changed.",
    icon: BarChart3,
  },
]

export default function InputPage() {
  const router = useRouter()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [gpxFile, setGpxFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const canProceed = videoFile && gpxFile

  const handleAnalyze = () => {
    setIsGenerating(true)
    // Simulate processing time (15 seconds)
    setTimeout(() => {
      router.push("/output")
    }, 15000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              BlockSight
            </h1>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">New analysis</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            Analyze a corridor
          </h2>
          <p className="mt-3 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Pick a stretch of street, attach video, and we&apos;ll generate a momentum report.
          </p>
        </div>

        {/* Steps overview */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {step.number}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload your data</CardTitle>
            <CardDescription>
              Both files are required to generate your corridor analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FileUpload
                accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
                label="Corridor video"
                description="MP4, MOV, or AVI up to 2GB"
                icon="video"
                file={videoFile}
                onFileSelect={setVideoFile}
              />
              <FileUpload
                accept=".gpx,application/gpx+xml"
                label="GPX track file"
                description="GPS exchange format"
                icon="gpx"
                file={gpxFile}
                onFileSelect={setGpxFile}
              />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4 border-t">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!canProceed || isGenerating}
                className="w-full md:w-auto !bg-black !text-white hover:!bg-black/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating corridor change summary
                  </>
                ) : (
                  <>
                    Generate momentum report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {!canProceed && (
                <p className="text-sm text-muted-foreground">
                  Upload both files to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Elevator pitch */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <span className="text-foreground font-medium">BlockSight </span>  surfaces real-time signals of commercial district change so you can
            see where a neighborhood is going before the data says it&apos;s already there.
          </p>
        </div>
      </main>
    </div>
  )
}

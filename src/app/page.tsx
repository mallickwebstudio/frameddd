"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, ArrowRight, Sparkles } from "lucide-react"
import { HomeNavbar } from "@/components/shared/home-navbar"
import { HomeFooter } from "@/components/shared/home-footer"
import { Button } from "@/components/ui/button"
import { ArtworkConfig, FrameStyle } from "@/types"
import { SAMPLE_ARTWORKS } from "@/db/sample-artworks"
import { FRAME_CATALOG } from "@/db/frames"

const FEATURED_FRAMES: FrameStyle[] = [
  FRAME_CATALOG.find((f) => f.id === "gold-1-1") ?? FRAME_CATALOG[0],
  FRAME_CATALOG.find((f) => f.id === "cyan-16-9") ?? FRAME_CATALOG[1],
  FRAME_CATALOG.find((f) => f.id === "purple-1-1") ?? FRAME_CATALOG[2],
  FRAME_CATALOG.find((f) => f.id === "gold-16-9") ?? FRAME_CATALOG[3],
]

export default function HomePage(): React.JSX.Element {
  const router = useRouter()
  const defaultFileInputRef = React.useRef<HTMLInputElement>(null)

  // Process uploaded image file and route to /studio
  const processUploadedFile = (file: File): void => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP).")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (!result) return

      const img = new Image()
      img.onload = () => {
        const ratio = img.width / img.height
        let w = 24
        let h = Math.round((w / ratio) * 10) / 10
        if (h > 36) {
          h = 30
          w = Math.round(h * ratio * 10) / 10
        }

        const artworkConfig: ArtworkConfig = {
          id: `custom-upload-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          src: result,
          aspectRatio: ratio,
          originalWidthInches: w,
          originalHeightInches: h,
          rotation: 0,
        }

        try {
          sessionStorage.setItem("framed_artwork", JSON.stringify(artworkConfig))
        } catch (err: unknown) {
          console.warn("Storage quota or error:", err)
        }

        router.push("/studio")
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  // Handle file drop on default screen
  const handleDefaultDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }

  // Select sample artwork and route to /studio
  const handleSelectSample = (sample: ArtworkConfig): void => {
    try {
      sessionStorage.setItem("framed_artwork", JSON.stringify(sample))
    } catch (err: unknown) {
      console.warn("Storage quota or error:", err)
    }
    router.push("/studio")
  }

  // Select signature frame and route to /studio
  const handleSelectFrame = (selectedFrame: FrameStyle): void => {
    try {
      sessionStorage.setItem("framed_frame", JSON.stringify(selectedFrame))
    } catch (err: unknown) {
      console.warn("Storage quota or error:", err)
    }
    router.push("/studio")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Minimal Navbar */}
      <HomeNavbar
        onOpenStudio={() => router.push("/studio")}
        onUploadClick={() => defaultFileInputRef.current?.click()}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-8 justify-center items-center">
        {/* Whole Screen Cover styled inside an Input File Dashed Border */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDefaultDrop}
          className="w-full max-w-5xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-card/60 backdrop-blur-md rounded-3xl p-6 sm:p-12 flex flex-col items-center justify-between text-center relative shadow-2xl transition-all"
        >
          {/* Hidden File Input */}
          <input
            ref={defaultFileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                processUploadedFile(e.target.files[0])
              }
            }}
          />

          {/* Top Brand Header */}
          <div className="space-y-2 max-w-xl">
            <h1 className="font-heading text-4xl sm:text-6xl text-foreground font-medium tracking-tight">
              ART FRAME
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Design, customize, and preview your artwork on realistic 16:9 walls with artisan handcrafted mouldings.
            </p>
          </div>

          {/* Primary Action Target within the File Border */}
          <div className="mt-8 space-y-4 w-full max-w-xl">
            <Button
              size="lg"
              onClick={() => defaultFileInputRef.current?.click()}
              className="w-full py-6 text-sm font-semibold gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Your Picture (or Drag &amp; Drop Here)
            </Button>

            {/* Quick Start Triggers: Sample Artworks OR Signature Frames */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Or start immediately with sample artwork or frame:</span>
                <span className="text-[10px] font-mono text-muted-foreground/80">Click any art or frame</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-card/90 border border-border/80 shadow-xs">
                {/* 1. Sample Artworks */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[11px] font-semibold text-foreground/80 block">
                    Sample Artwork:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SAMPLE_ARTWORKS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-muted/30 cursor-pointer shadow-2xs"
                        title={sample.title}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sample.src}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Signature Frames */}
                <div className="space-y-1.5 text-left border-t sm:border-t-0 sm:border-l border-border/80 pt-2.5 sm:pt-0 sm:pl-3">
                  <span className="text-[11px] font-semibold text-foreground/80 block">
                    Signature Frame:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {FEATURED_FRAMES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleSelectFrame(f)}
                        className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-muted/30 p-1 flex items-center justify-center cursor-pointer shadow-2xs"
                        title={`${f.name} (${f.ratio})`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.imageUrl}
                          alt={f.name}
                          className={`w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-110 transition-transform ${
                            f.rotation === 90 ? "rotate-90 scale-85" : ""
                          }`}
                        />
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono px-0.5 rounded bg-background/80 text-muted-foreground scale-90">
                          {f.ratio}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/studio"
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 inline-flex items-center gap-1"
              >
                <span>Skip straight to 16:9 Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Prominent 3-Step Guide */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md text-sm">
                1
              </div>
              <h3 className="font-semibold text-sm text-foreground">Upload Image</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your high-res photo, artwork, or select from curated fine art samples.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md text-sm">
                2
              </div>
              <h3 className="font-semibold text-sm text-foreground">Select Frame &amp; View on Wall</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose handcrafted wood or metal mouldings and visualize in 16:9 room settings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md text-sm">
                3
              </div>
              <h3 className="font-semibold text-sm text-foreground">Ask for Quote</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive instant itemized fabrication pricing with museum conservation materials.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <HomeFooter />
    </div>
  )
}

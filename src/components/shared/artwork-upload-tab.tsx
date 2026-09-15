"use client"

import * as React from "react"
import { Upload, RotateCw, Image as ImageIcon, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArtworkConfig } from "@/types"
import { SAMPLE_ARTWORKS } from "@/db/sample-artworks"

interface ArtworkUploadTabProps {
  artwork: ArtworkConfig
  onSelectArtwork: (artwork: ArtworkConfig) => void
  onRotateArtwork: () => void
  onDimensionsChange: (width: number, height: number) => void
}

export function ArtworkUploadTab({
  artwork,
  onSelectArtwork,
  onRotateArtwork,
  onDimensionsChange,
}: ArtworkUploadTabProps): React.JSX.Element {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState<boolean>(false)

  const handleFileUpload = (file: File): void => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (!result) return

      // Pre-calculate image aspect ratio from real dimensions
      const img = new Image()
      img.onload = () => {
        const ratio = img.width / img.height
        // Standardize sizing between 16" and 30"
        let w = 24
        let h = Math.round((w / ratio) * 10) / 10
        if (h > 36) {
          h = 30
          w = Math.round(h * ratio * 10) / 10
        }

        onSelectArtwork({
          id: `custom-upload-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          src: result,
          aspectRatio: ratio,
          originalWidthInches: w,
          originalHeightInches: h,
          rotation: 0,
        })
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (): void => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Upload Zone */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Upload Your Photo / Artwork
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 hover:bg-muted/40 bg-card"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Click or drag &amp; drop your image
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Supports high-res PNG, JPG, or WEBP up to 50MB
            </p>
          </div>
        </div>
      </div>

      {/* Active Artwork Controls */}
      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <ImageIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold truncate text-foreground">
              {artwork.title}
            </span>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={onRotateArtwork}
            className="text-xs gap-1 h-7"
            title="Rotate 90 degrees"
          >
            <RotateCw className="w-3 h-3" />
            Rotate 90°
          </Button>
        </div>

        {/* Artwork Print Dimensions */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Artwork Print Size:</span>
            <span className="font-semibold text-foreground font-mono">
              {artwork.originalWidthInches}&quot; &times; {artwork.originalHeightInches}&quot;
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: '8" × 10"', w: 8, h: 10 },
              { label: '12" × 16"', w: 12, h: 16 },
              { label: '18" × 24"', w: 18, h: 24 },
              { label: '24" × 36"', w: 24, h: 36 },
            ].map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => onDimensionsChange(size.w, size.h)}
                className={`py-1.5 px-2 text-[11px] font-mono rounded-md border transition-all ${
                  artwork.originalWidthInches === size.w && artwork.originalHeightInches === size.h
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Library */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Or Try Sample Artworks
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Instant 1-Click Preview</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SAMPLE_ARTWORKS.map((sample) => {
            const isSelected = artwork.id === sample.id
            return (
              <div
                key={sample.id}
                onClick={() => onSelectArtwork(sample)}
                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/50 hover:shadow-xs"
                }`}
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.src}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground p-1 rounded-full shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="p-2 bg-card">
                  <p className="text-xs font-medium text-foreground truncate">{sample.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {sample.originalWidthInches}&quot; &times; {sample.originalHeightInches}&quot;
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

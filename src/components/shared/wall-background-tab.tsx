"use client"

import * as React from "react"
import {
  Palette,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WallBackground } from "@/types"
import { WALL_COLOR_SWATCHES, WALL_PRESETS } from "@/db/presets"
import { LiveCameraModal } from "@/components/shared/live-camera-modal"
import { ScrollFadeContainer } from "@/components/shared/scroll-fade-container"

interface WallBackgroundTabProps {
  wall: WallBackground
  onWallChange: (wall: WallBackground) => void
}

export function WallBackgroundTab({
  wall,
  onWallChange,
}: WallBackgroundTabProps): React.JSX.Element {
  const [customColor, setCustomColor] = React.useState<string>(
    wall.type === "color" ? wall.value : "#f3efe6"
  )
  const [isCameraOpen, setIsCameraOpen] = React.useState<boolean>(false)
  const wallUploadRef = React.useRef<HTMLInputElement>(null)

  const handleCustomColorChange = (hex: string): void => {
    setCustomColor(hex)
    onWallChange({
      type: "color",
      value: hex,
      name: `Custom Paint (${hex.toUpperCase()})`,
      brightness: wall.brightness ?? 1.0,
    })
  }

  const handleCustomFileUpload = (file: File): void => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (!result) return
      onWallChange({
        type: "upload",
        value: result,
        name: "My Custom Wall Photo",
        brightness: 1.0,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (imageDataUrl: string): void => {
    onWallChange({
      type: "camera",
      value: imageDataUrl,
      name: "Camera Wall Snapshot",
      brightness: 1.0,
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Stacked Section: Wall Paint */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
              Wall Paint
            </label>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border px-2 py-1 rounded-md">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Pick custom paint color"
            />
            <span className="text-[10px] font-mono font-medium text-foreground">
              {customColor.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Horizontal Scroll for Wall Paint Swatches with Natural Blend Fade */}
        <ScrollFadeContainer contentClassName="items-center">
          {WALL_COLOR_SWATCHES.map((swatch) => {
            const isSelected =
              wall.type === "color" &&
              wall.value.toLowerCase() === swatch.hex.toLowerCase()
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => {
                  setCustomColor(swatch.hex)
                  onWallChange({
                    type: "color",
                    value: swatch.hex,
                    name: swatch.name,
                    brightness: wall.brightness ?? 1.0,
                  })
                }}
                className={`p-2 rounded-xl border shrink-0 w-24 text-center transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-muted/60 shadow-xs"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border border-black/10 shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        ["down-pipe", "studio-slate", "deep-navy", "emerald-reserve"].includes(
                          swatch.id
                        )
                          ? "text-white"
                          : "text-black"
                      }`}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium text-foreground truncate w-full">
                  {swatch.name}
                </span>
              </button>
            )
          })}
        </ScrollFadeContainer>
      </div>

      {/* 2. Stacked Section: Room Preset */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
              Room Preset
            </label>
          </div>
          <span className="text-[10px] text-muted-foreground">Scroll to view rooms</span>
        </div>

        {/* Horizontal Scroll for Room Preset Cards with Natural Blend Fade */}
        <ScrollFadeContainer>
          {WALL_PRESETS.map((preset) => {
            const isSelected = wall.type === "preset" && wall.value === preset.value
            return (
              <div
                key={preset.name}
                onClick={() => onWallChange(preset)}
                className={`group relative w-44 shrink-0 rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/50 hover:shadow-xs"
                }`}
              >
                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.value}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground p-1 rounded-full shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="p-2 bg-card">
                  <p className="text-xs font-medium text-foreground truncate">{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground">{preset.category}</p>
                </div>
              </div>
            )
          })}
        </ScrollFadeContainer>
      </div>

      {/* 3. Stacked Section: Your Wall */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
            Your Wall
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Action 1: Upload from Device */}
          <div
            onClick={() => wallUploadRef.current?.click()}
            className="p-4 border-2 border-dashed border-border hover:border-primary/50 bg-card hover:bg-muted/30 rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-2 transition-all"
          >
            <input
              ref={wallUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleCustomFileUpload(e.target.files[0])
                }
              }}
            />
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Upload Room Photo</p>
              <p className="text-[10px] text-muted-foreground">From computer or phone</p>
            </div>
          </div>

          {/* Action 2: Live Camera Snapshot */}
          <div
            onClick={() => setIsCameraOpen(true)}
            className="p-4 border border-border hover:border-primary/50 bg-card hover:bg-muted/30 rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-2 transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Snap Wall with Camera</p>
              <p className="text-[10px] text-muted-foreground">Use live device camera</p>
            </div>
          </div>
        </div>

        {/* Active Custom Background Indicator */}
        {(wall.type === "upload" || wall.type === "camera") && (
          <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wall.value} alt="Custom Wall" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{wall.name}</p>
                <p className="text-[10px] text-muted-foreground">Active On-Wall Background</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onWallChange(WALL_PRESETS[0])}
              className="text-[11px] h-7"
            >
              Reset to Preset
            </Button>
          </div>
        )}
      </div>



      {/* Camera Capture Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}

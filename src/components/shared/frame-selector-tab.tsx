"use client"

import * as React from "react"
import { Check, Sparkles, Square, RectangleVertical, RectangleHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FrameStyle } from "@/types"
import { FRAME_CATALOG } from "@/db/frames"
import { ScrollFadeContainer } from "@/components/shared/scroll-fade-container"

export type FrameOrientation = "all" | "square" | "portrait" | "landscape"

interface FrameSelectorTabProps {
  selectedFrame: FrameStyle
  onSelectFrame: (frame: FrameStyle) => void
  artworkAspectRatio?: number
  mouldingWidthInches?: number
  onMouldingWidthChange?: (width: number) => void
}

export function FrameSelectorTab({
  selectedFrame,
  onSelectFrame,
  artworkAspectRatio,
}: FrameSelectorTabProps): React.JSX.Element {
  const [suggestOnly, setSuggestOnly] = React.useState<boolean>(false)
  const [orientationFilter, setOrientationFilter] = React.useState<FrameOrientation>("all")

  // Filter frames by orientation and optional aspect ratio suggestion
  const displayedFrames = React.useMemo(() => {
    let pool = FRAME_CATALOG

    if (orientationFilter === "square") {
      pool = pool.filter((f) => f.ratio === "1:1")
    } else if (orientationFilter === "portrait") {
      pool = pool.filter((f) => f.ratio === "3:4" || f.ratio === "9:16")
    } else if (orientationFilter === "landscape") {
      pool = pool.filter((f) => f.ratio === "16:9" || f.ratio === "4:3")
    }

    if (!suggestOnly) return pool

    const targetRatio = artworkAspectRatio ?? 1
    // Matches within ±0.35 aspect ratio tolerance
    const matches = pool.filter(
      (f) => Math.abs(f.aspectRatio - targetRatio) <= 0.35
    )

    if (matches.length > 0) {
      return matches
    }

    // Fallback to 3 closest frames by ratio distance within orientation pool
    return [...pool]
      .sort(
        (a, b) =>
          Math.abs(a.aspectRatio - targetRatio) - Math.abs(b.aspectRatio - targetRatio)
      )
      .slice(0, 3)
  }, [suggestOnly, orientationFilter, artworkAspectRatio])

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Frame Selection Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
              Frame Collection
            </label>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({displayedFrames.length} {displayedFrames.length === 1 ? "frame" : "frames"})
            </span>
          </div>

          {/* Suggest Frame / Show All Button */}
          <Button
            type="button"
            variant={suggestOnly ? "default" : "outline"}
            size="xs"
            onClick={() => setSuggestOnly((prev) => !prev)}
            className="text-[11px] h-6 px-2.5 gap-1.5 cursor-pointer shadow-xs"
            title={
              suggestOnly
                ? "Show all frames within selected orientation"
                : "Suggest frames matching your artwork's aspect ratio"
            }
          >
            <Sparkles className="w-3 h-3" />
            {suggestOnly ? "Show All" : "Suggest Frame"}
          </Button>
        </div>

        {/* Orientation Filter Tabs: All, Square, Portrait, Landscape */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg border border-border/60 text-[11px]">
          <button
            type="button"
            onClick={() => setOrientationFilter("all")}
            className={`flex-1 py-1 px-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
              orientationFilter === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setOrientationFilter("square")}
            className={`flex-1 py-1 px-1.5 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
              orientationFilter === "square"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Square className="w-3 h-3" />
            Square
          </button>
          <button
            type="button"
            onClick={() => setOrientationFilter("portrait")}
            className={`flex-1 py-1 px-1.5 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
              orientationFilter === "portrait"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RectangleVertical className="w-3 h-3" />
            Portrait
          </button>
          <button
            type="button"
            onClick={() => setOrientationFilter("landscape")}
            className={`flex-1 py-1 px-1.5 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
              orientationFilter === "landscape"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RectangleHorizontal className="w-3 h-3" />
            Landscape
          </button>
        </div>

        {/* Horizontal Scroll for Frame Cards with Natural Blend Fade */}
        <ScrollFadeContainer>
          {displayedFrames.map((frame) => {
            const isSelected = selectedFrame.id === frame.id
            return (
              <div
                key={frame.id}
                onClick={() => onSelectFrame(frame)}
                className={`group relative w-36 shrink-0 rounded-xl border p-2.5 cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-muted/50 shadow-md"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-xs"
                }`}
              >
                {/* Visual: Real Frame PNG Image */}
                <div className="relative h-16 rounded-lg overflow-hidden bg-muted/20 border border-border/50 flex items-center justify-center p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.imageUrl}
                    alt={frame.name}
                    className={`w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ${
                      frame.rotation === 90 ? "rotate-90 scale-85" : ""
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-0.5 rounded-full shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Name & Ratio Badge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-foreground truncate leading-tight">
                      {frame.name}
                    </h4>
                    <span className="text-[9px] font-mono font-medium px-1 py-0.2 bg-muted rounded text-muted-foreground shrink-0">
                      {frame.ratio}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{frame.finish}</p>
                </div>

                {/* Price in (₹) */}
                <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-foreground">₹{frame.price}</span>
                  <span className="text-[10px] text-muted-foreground">Fixed</span>
                </div>
              </div>
            )
          })}
        </ScrollFadeContainer>
      </div>
    </div>
  )
}

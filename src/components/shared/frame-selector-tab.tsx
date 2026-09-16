"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { FrameStyle } from "@/types"
import { FRAME_CATALOG } from "@/db/frames"
import { ScrollFadeContainer } from "@/components/shared/scroll-fade-container"

interface FrameSelectorTabProps {
  selectedFrame: FrameStyle
  onSelectFrame: (frame: FrameStyle) => void
  mouldingWidthInches?: number
  onMouldingWidthChange?: (width: number) => void
}

export function FrameSelectorTab({
  selectedFrame,
  onSelectFrame,
}: FrameSelectorTabProps): React.JSX.Element {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Frame Selection Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
            Frame Collection
          </label>
          <span className="text-[10px] text-muted-foreground">Scroll to view frames</span>
        </div>

        {/* Horizontal Scroll for Frame Cards with Natural Blend Fade */}
        <ScrollFadeContainer>
          {FRAME_CATALOG.map((frame) => {
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
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
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

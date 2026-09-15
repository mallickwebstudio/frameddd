"use client"

import * as React from "react"
import { Check, Sliders } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { FrameStyle } from "@/types"
import { FRAME_CATALOG } from "@/db/frames"

interface FrameSelectorTabProps {
  selectedFrame: FrameStyle
  mouldingWidthInches: number
  onSelectFrame: (frame: FrameStyle) => void
  onMouldingWidthChange: (width: number) => void
}

export function FrameSelectorTab({
  selectedFrame,
  mouldingWidthInches,
  onSelectFrame,
  onMouldingWidthChange,
}: FrameSelectorTabProps): React.JSX.Element {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Frame Selection Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
            Frame
          </label>
          <span className="text-[10px] text-muted-foreground">Scroll to view</span>
        </div>

        {/* Horizontal Scroll for Frame Cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
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
                {/* Visual */}
                <div className="relative h-10 rounded-lg overflow-hidden border border-black/10 shadow-inner flex items-center">
                  <div
                    className="w-full h-full"
                    style={{
                      background: frame.textureGradient || frame.color,
                      boxShadow: frame.innerLipCss,
                    }}
                  />
                  {isSelected && (
                    <div className="absolute right-1.5 bg-primary text-primary-foreground p-0.5 rounded-full shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h4 className="text-xs font-semibold text-foreground truncate leading-tight">
                  {frame.name}
                </h4>

                {/* Price in (₹) */}
                <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-foreground">₹{frame.pricePerFoot}/ft</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Moulding Width Slider */}
      <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Moulding Width
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-foreground bg-card border border-border px-1.5 py-0.5 rounded">
            {mouldingWidthInches}&quot;
          </span>
        </div>

        <Slider
          value={[mouldingWidthInches]}
          min={selectedFrame.mouldingWidthRange[0]}
          max={selectedFrame.mouldingWidthRange[1]}
          onValueChange={(val) => {
            const nextVal = Array.isArray(val) ? val[0] : val
            if (typeof nextVal === "number") {
              onMouldingWidthChange(nextVal)
            }
          }}
        />

        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>Min: {selectedFrame.mouldingWidthRange[0]}&quot;</span>
          <span>Max: {selectedFrame.mouldingWidthRange[1]}&quot;</span>
        </div>
      </div>
    </div>
  )
}

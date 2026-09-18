"use client"

import * as React from "react"
import { Check, X, Box, Image as ImageIcon } from "lucide-react"
import { FrameStyle, FrameCategoryType, StandardFrameSize } from "@/types"
import { FRAME_CATALOG, STANDARD_FRAME_SIZES } from "@/db/frames"
import { ScrollFadeContainer } from "@/components/shared/scroll-fade-container"
import { Slider } from "@/components/ui/slider"

export type FrameOrientation = "all" | "square" | "portrait" | "landscape"

interface FrameSelectorTabProps {
  selectedFrame: FrameStyle
  onSelectFrame: (frame: FrameStyle) => void
  selectedSize?: StandardFrameSize | null
  onSelectSize?: (size: StandardFrameSize | null) => void
  matWidthInches?: number
  onMatWidthChange?: (width: number) => void
  artworkAspectRatio?: number
  mouldingWidthInches?: number
  onMouldingWidthChange?: (width: number) => void
}

export function FrameSelectorTab({
  selectedFrame,
  onSelectFrame,
  selectedSize = null,
  onSelectSize,
  matWidthInches = 2.5,
  onMatWidthChange,
}: FrameSelectorTabProps): React.JSX.Element {
  const [categoryFilter, setCategoryFilter] = React.useState<FrameCategoryType>(
    selectedFrame.category ?? "all"
  )

  // Keep category filter in sync if selectedFrame's category changes (e.g. from routing or external selection)
  React.useEffect(() => {
    if (selectedFrame.category) {
      setCategoryFilter(selectedFrame.category)
    }
  }, [selectedFrame.category, selectedFrame.id])

  // Filter frames by category
  const displayedFrames = React.useMemo(() => {
    if (categoryFilter === "all") return FRAME_CATALOG
    return FRAME_CATALOG.filter((f) => f.category === categoryFilter)
  }, [categoryFilter])

  return (
    <div className="space-y-2.5 animate-in fade-in duration-200">
      {/* Type & Size Horizontal Scroll Filter Rows */}
      <div className="space-y-1.5 pb-0.5">
        {/* Row 1: Type */}
        <div className="flex items-center gap-2">
          <span className="w-10 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            Type
          </span>
          <ScrollFadeContainer
            className="flex-1 min-w-0"
            contentClassName="gap-1.5 py-0.5 px-0.5 items-center"
            fadeWidth={16}
          >
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                categoryFilter === "all"
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold shadow-2xs"
                  : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("standard")}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                categoryFilter === "standard"
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold shadow-2xs"
                  : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("vintage-ornate")}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                categoryFilter === "vintage-ornate"
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold shadow-2xs"
                  : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              Vintage
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("shadow-box")}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                categoryFilter === "shadow-box"
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold shadow-2xs"
                  : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              Shadow Box
            </button>
          </ScrollFadeContainer>
        </div>

        {/* Row 2: Size */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Size:
            </span>
            {selectedSize && (
              <button
                type="button"
                onClick={() => onSelectSize?.(null)}
                className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded cursor-pointer"
                title="Remove size filter (return to Auto)"
                aria-label="Remove size filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <ScrollFadeContainer
            className="flex-1 min-w-0"
            contentClassName="gap-1.5 py-0.5 px-0.5 items-center"
            fadeWidth={16}
          >
            {/* Auto (Fit Image) option */}
            <button
              type="button"
              onClick={() => onSelectSize?.(null)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                selectedSize === null
                  ? "bg-primary/10 text-primary border-primary/30 font-bold shadow-2xs ring-1 ring-primary/20"
                  : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
              }`}
              title="Auto: naturally fit the artwork aspect ratio without cropping"
            >
              Auto
            </button>

            {STANDARD_FRAME_SIZES.map((size) => {
              const isSizeSelected = selectedSize?.id === size.id
              const compactName = size.name.replace(/\s+/g, "")

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => {
                    if (isSizeSelected) {
                      onSelectSize?.(null)
                    } else {
                      onSelectSize?.(size)
                    }
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    isSizeSelected
                      ? "bg-primary/10 text-primary border-primary/30 font-bold shadow-2xs ring-1 ring-primary/20"
                      : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent"
                  }`}
                  title={`${size.name}" (${size.dimensions}) - ${size.recommendedUse}. Click again to remove filter.`}
                >
                  {compactName}&quot;
                </button>
              )
            })}
          </ScrollFadeContainer>
        </div>

        {/* Row 3: Mat Size Slider (placed between label and display number) */}
        <div className="flex items-center gap-2.5 pt-1 border-t border-border/40">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            Mat Size:
          </span>
          <div className="flex-1 min-w-0 px-1">
            <Slider
              value={[matWidthInches]}
              min={0.5}
              max={5.0}
              step={0.5}
              onValueChange={(val) => {
                const nextVal = Array.isArray(val) ? val[0] : val
                if (typeof nextVal === "number") {
                  onMatWidthChange?.(nextVal)
                }
              }}
            />
          </div>
          <span className="font-mono font-bold text-foreground bg-muted/60 border border-border/50 px-2 py-0.5 rounded text-[11px] min-w-[38px] text-center shrink-0">
            {matWidthInches}&quot;
          </span>
        </div>
      </div>

      {/* 3. Frame Mouldings Section (Orientation filter & Suggest button removed) */}
      <div className="space-y-2 pt-1 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              Moulding Catalog
            </label>
            <span className="text-[9.5px] font-mono text-muted-foreground font-semibold px-1.5 py-0.2 rounded-full bg-muted">
              {displayedFrames.length} {displayedFrames.length === 1 ? "style" : "styles"}
            </span>
          </div>
        </div>

        {/* Horizontal Scroll for Frame Cards with Natural Blend Fade */}
        {displayedFrames.length > 0 ? (
          <ScrollFadeContainer>
            {displayedFrames.map((frame) => {
              const isSelected = selectedFrame.id === frame.id
              // Clean name: strip redundant aspect ratio string like "(1:1)" or "(16:9)"
              const cleanName = frame.name.replace(/\s*\([^)]*\)/g, "").trim()
              const dimLabel = selectedSize
                ? `${selectedSize.name.replace(/\s+/g, "")}"`
                : "Auto"

              return (
                <div
                  key={frame.id}
                  onClick={() => onSelectFrame(frame)}
                  className={`group relative w-32 shrink-0 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/25 bg-primary/[0.04] shadow-md"
                      : "border-border/80 bg-card hover:border-primary/50 hover:shadow-2xs"
                  }`}
                >
                  {/* Visual: Frame Cover Image 1:1 Aspect Ratio (Square) */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900/60 border border-border/40 flex items-center justify-center p-2">
                    {frame.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={frame.imageUrl}
                        alt={frame.name}
                        className={`w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200 ${
                          frame.rotation === 90 ? "rotate-90 scale-85" : ""
                        }`}
                      />
                    ) : (
                      /* Artisanal 3D Premium Moulding Layout Preview */
                      <div
                        className="relative w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-[1.03] flex items-center justify-center"
                        style={{
                          background: frame.textureGradient || frame.color,
                          padding: "8px",
                          boxShadow: frame.boxShadowCss || "0 4px 12px rgba(0,0,0,0.25)",
                        }}
                      >
                        {/* 45deg corner bevel accent */}
                        <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/20" />
                        {/* Inner Rabbet Lip & Mat Window */}
                        <div className="w-full h-full rounded-xs bg-[#fbfaf8] dark:bg-[#1f1e1d] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.45)]">
                          <div className="w-4 h-4 rounded-full bg-stone-300/60 dark:bg-stone-700/60 flex items-center justify-center text-muted-foreground/50">
                            <ImageIcon className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground p-0.5 rounded-full shadow-xs z-10">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Name & Dimensions in Inches (e.g. 12x12", 16x9") */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0 border border-black/20 dark:border-white/20"
                          style={{ backgroundColor: frame.color }}
                          title={frame.finish}
                        />
                        <h4 className="text-[11px] font-bold text-foreground truncate leading-tight">
                          {cleanName}
                        </h4>
                      </div>
                      <span className="text-[9.5px] font-mono font-semibold px-1.5 py-0.5 bg-muted rounded text-muted-foreground shrink-0">
                        {dimLabel}
                      </span>
                    </div>
                    {frame.badge && (
                      <p className="text-[9px] text-muted-foreground truncate font-medium">
                        {frame.badge}
                      </p>
                    )}
                  </div>

                  {/* Price & Fixed Rate */}
                  <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="font-bold text-foreground">₹{frame.price}</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase">Fixed</span>
                  </div>
                </div>
              )
            })}
          </ScrollFadeContainer>
        ) : categoryFilter === "shadow-box" ? (
          <div className="py-7 px-4 text-center rounded-2xl border border-dashed border-border/70 bg-card/40 flex flex-col items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Box className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5 max-w-xs">
              <h5 className="text-xs font-bold text-foreground">Shadow Box Mouldings in Fabrication</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Deep-profile shadow boxes (1.75&quot; - 3.0&quot; depth) are currently being handcrafted. Explore our curated Standard or Vintage mouldings.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCategoryFilter("standard")}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                View Standard
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("vintage-ornate")}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                View Vintage
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
            <p>No frames match this category.</p>
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className="mt-2 text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              Show all frames
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { ZoomIn, ZoomOut, Maximize2, Sun, Eye, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ArtworkConfig,
  FabricationQuote,
  FrameStyle,
  GlazingType,
  MatConfig,
  WallBackground,
} from "@/types"
import { GLAZING_OPTIONS } from "@/db/frames"

interface FrameVisualizerProps {
  artwork: ArtworkConfig
  frame: FrameStyle
  mouldingWidthInches: number
  mat: MatConfig
  wall: WallBackground
  glazing: GlazingType
  showGlassGlare: boolean
  showScaleReference: boolean
  zoomLevel: number
  quote: FabricationQuote
  onToggleGlassGlare: () => void
  onToggleScaleReference: () => void
  onZoomChange: (zoom: number) => void
  visualizerRef?: React.RefObject<HTMLDivElement | null>
}

export function FrameVisualizer({
  artwork,
  frame,
  mouldingWidthInches,
  mat,
  wall,
  glazing,
  showGlassGlare,
  showScaleReference,
  zoomLevel,
  quote,
  onToggleGlassGlare,
  onToggleScaleReference,
  onZoomChange,
  visualizerRef,
}: FrameVisualizerProps): React.JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [canvasDimensions, setCanvasDimensions] = React.useState<{ width: number; height: number }>({
    width: 800,
    height: 450,
  })

  // Measure actual rendered canvas container to scale frame proportionally
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = (): void => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setCanvasDimensions({ width: rect.width, height: rect.height })
      }
    }

    measure()

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setCanvasDimensions({ width, height })
        }
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Calculate total physical inches of framed piece
  const totalFrameInchesW =
    artwork.originalWidthInches +
    2 * (mat.enabled ? mat.widthInches : 0) +
    2 * (mat.enabled && mat.isDoubleMat ? (mat.accentWidthInches ?? 0.25) : 0) +
    2 * mouldingWidthInches

  const totalFrameInchesH =
    artwork.originalHeightInches +
    2 * (mat.enabled ? mat.widthInches : 0) +
    2 * (mat.enabled && mat.isDoubleMat ? (mat.accentWidthInches ?? 0.25) : 0) +
    2 * mouldingWidthInches

  // Target frame to fit within 68% of the 16:9 canvas width & height (leaves room for wall, credenza & controls)
  const availableCanvasW = canvasDimensions.width * 0.68
  const availableCanvasH = canvasDimensions.height * 0.68

  const responsiveBaseScale = Math.min(
    availableCanvasW / Math.max(1, totalFrameInchesW),
    availableCanvasH / Math.max(1, totalFrameInchesH)
  )

  // Combined scale factor with user zoom control
  const pxPerInch = Math.max(2, responsiveBaseScale * zoomLevel)

  const mouldingPx = Math.max(3, Math.round(mouldingWidthInches * pxPerInch))
  const matBorderPx = mat.enabled ? Math.max(2, Math.round(mat.widthInches * pxPerInch)) : 0
  const accentMatPx =
    mat.enabled && mat.isDoubleMat
      ? Math.max(1, Math.round((mat.accentWidthInches ?? 0.25) * pxPerInch))
      : 0

  const artWidthPx = Math.round(artwork.originalWidthInches * pxPerInch)
  const artHeightPx = Math.round(artwork.originalHeightInches * pxPerInch)

  const selectedGlazing = GLAZING_OPTIONS.find((g) => g.id === glazing) ?? GLAZING_OPTIONS[0]

  // Merge forwarded visualizerRef and local containerRef
  const setContainerRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (visualizerRef) {
        (visualizerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [visualizerRef]
  )

  return (
    <section className="relative w-full h-full p-3 sm:p-5 flex items-center justify-center overflow-hidden bg-neutral-950 select-none">
      {/* 16:9 (Horizontal Video) Canvas Container */}
      <div
        ref={setContainerRefs}
        className="w-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: wall.type === "color" ? wall.value : undefined,
          backgroundImage:
            wall.type !== "color" ? `url(${wall.value})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `brightness(${wall.brightness ?? 1.0})`,
        }}
      >
        {/* Subtle realistic lighting gradient overlay for room ambiance */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              wall.type === "color"
                ? "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.25) 100%)"
                : "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* 16:9 Canvas Badge */}
        <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-white/60 tracking-wider">
          16:9 Wall View
        </div>

        {/* Framing Assembly Container */}
        <div
          className="relative transition-transform duration-300 ease-out z-10 flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* Outer Frame Moulding with 3D Depth & Corner Miter Simulation */}
          <div
            className="relative transition-all duration-200"
            style={{
              padding: `${mouldingPx}px`,
              background: frame.textureGradient || frame.color,
              boxShadow: `${frame.boxShadowCss}, 0 0 0 1px ${frame.borderCss}`,
              borderRadius: "2px",
            }}
          >
            {/* Beveled Mitered Highlight simulation around frame corners */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[1px]"
              style={{
                boxShadow: frame.innerLipCss || "inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 3px rgba(0,0,0,0.5)",
              }}
            />

            {/* Inner Frame Rabbet Lip */}
            <div
              className="relative overflow-hidden transition-all duration-200"
              style={{
                boxShadow: "inset 0 3px 6px rgba(0, 0, 0, 0.45)",
                backgroundColor: mat.enabled ? mat.color.hex : "#000",
              }}
            >
              {/* Outer Matboard Layer */}
              <div
                className="relative transition-all duration-200 flex items-center justify-center"
                style={{
                  padding: mat.enabled ? `${matBorderPx}px` : "0px",
                  backgroundColor: mat.enabled ? mat.color.hex : "transparent",
                }}
              >
                {/* Secondary Accent Mat (if Double Mat is enabled) */}
                {mat.enabled && mat.isDoubleMat && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      margin: `${matBorderPx - accentMatPx}px`,
                      border: `${accentMatPx}px solid ${mat.accentColor?.hex ?? "#222"}`,
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  />
                )}

                {/* 45-Degree Beveled Core Cut Window Shadow for the Artwork */}
                <div
                  className="relative overflow-hidden bg-black flex items-center justify-center"
                  style={{
                    boxShadow: mat.enabled
                      ? `0 0 0 1.5px ${mat.color.coreColor}, inset 0 2px 4px rgba(0, 0, 0, 0.5)`
                      : "none",
                  }}
                >
                  {/* Artwork Image */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${artWidthPx}px`,
                      height: `${artHeightPx}px`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artwork.src}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{
                        transform: `rotate(${artwork.rotation}deg)`,
                      }}
                    />

                    {/* Glazing & Glass Reflection Simulation */}
                    {showGlassGlare && selectedGlazing.reflectionGlareOpacity > 0 && (
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300"
                        style={{
                          opacity: selectedGlazing.reflectionGlareOpacity,
                          background:
                            "linear-gradient(125deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 28%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.35) 75%, rgba(255,255,255,0) 100%)",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Realistic Furniture/Room Scale Reference */}
        {showScaleReference && (
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 md:h-44 flex items-end justify-center opacity-85 z-20">
            {/* Architectural Console Credenza silhouette */}
            <div className="w-[85%] max-w-4xl h-16 md:h-24 bg-gradient-to-t from-neutral-950 via-neutral-900 to-neutral-800 rounded-t-lg shadow-2xl border-t border-white/10 flex items-center justify-between px-12 relative">
              <div className="absolute -top-7 left-12 w-6 h-8 bg-neutral-800 rounded-sm border-t border-white/20 shadow-md" />
              <div className="absolute -top-12 right-16 w-8 h-14 bg-neutral-800/90 rounded-full border-t border-white/20 shadow-md flex items-center justify-center">
                <div className="w-1 h-6 bg-amber-200/40 rounded-full" />
              </div>
              <span className="text-[11px] font-mono tracking-wider text-neutral-400/80 mx-auto">
                Living Room Credenza Reference (34&quot; Floor Height)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Quick Controls (Bottom Center) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-full px-3 py-1.5 shadow-xl">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onZoomChange(Math.max(0.7, zoomLevel - 0.1))}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[11px] font-mono font-medium px-1 text-muted-foreground">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onZoomChange(Math.min(1.4, zoomLevel + 0.1))}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant={showGlassGlare ? "secondary" : "ghost"}
          size="xs"
          onClick={onToggleGlassGlare}
          className="text-[11px] gap-1 px-2"
          title="Toggle Glazing Reflection"
        >
          <Sun className="w-3 h-3" />
          <span className="hidden sm:inline">Glass Glare</span>
        </Button>

        <Button
          variant={showScaleReference ? "secondary" : "ghost"}
          size="xs"
          onClick={onToggleScaleReference}
          className="text-[11px] gap-1 px-2"
          title="Toggle Scale Guide"
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">Scale Reference</span>
        </Button>
      </div>

      {/* Floating Frame Tag (Top Left of Canvas) */}
      <div className="absolute top-4 left-4 z-30 bg-card/85 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg shadow-md hidden sm:block">
        <p className="text-xs font-semibold text-foreground">{frame.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {mouldingWidthInches}&quot; Moulding • {mat.enabled ? `${mat.widthInches}" ${mat.color.name}` : "No Mat"}
        </p>
      </div>
    </section>
  )
}

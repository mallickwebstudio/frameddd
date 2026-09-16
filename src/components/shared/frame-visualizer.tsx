"use client"

import * as React from "react"
import {
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react"
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
  framePosition?: { x: number; y: number }
  onFramePositionChange?: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  onCanvasDimensionsChange?: (dims: { width: number; height: number }) => void
  visualizerRef?: React.RefObject<HTMLDivElement | null>
}

const PAN_STEP = 24 // pixels moved per arrow press

export function FrameVisualizer({
  artwork,
  frame,
  mat,
  wall,
  glazing,
  showGlassGlare,
  zoomLevel,
  onZoomChange,
  framePosition,
  onFramePositionChange,
  onCanvasDimensionsChange,
  visualizerRef,
}: FrameVisualizerProps): React.JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [internalPosition, setInternalPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const position = framePosition ?? internalPosition
  const setPosition = onFramePositionChange ?? setInternalPosition

  const [canvasDimensions, setCanvasDimensions] = React.useState<{ width: number; height: number }>({
    width: 800,
    height: 450,
  })

  // Listen to physical arrow keys for positioning frame on display
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setPosition((prev) => ({ ...prev, x: prev.x - PAN_STEP }))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setPosition((prev) => ({ ...prev, x: prev.x + PAN_STEP }))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setPosition((prev) => ({ ...prev, y: prev.y - PAN_STEP }))
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setPosition((prev) => ({ ...prev, y: prev.y + PAN_STEP }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setPosition])

  // Measure actual rendered canvas container to scale frame proportionally
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = (): void => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setCanvasDimensions({ width: rect.width, height: rect.height })
        onCanvasDimensionsChange?.({ width: rect.width, height: rect.height })
      }
    }

    measure()

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setCanvasDimensions({ width, height })
          onCanvasDimensionsChange?.({ width, height })
        }
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [onCanvasDimensionsChange])

  // Frame sizing and aspect ratio based on selected frame PNG
  const frameRatio = frame.aspectRatio || 1
  const maxW = canvasDimensions.width * 0.72
  const maxH = canvasDimensions.height * 0.72

  let frameDisplayW = maxW
  let frameDisplayH = maxW / frameRatio
  if (frameDisplayH > maxH) {
    frameDisplayH = maxH
    frameDisplayW = maxH * frameRatio
  }

  const insets = frame.innerInset || { top: 15, right: 15, bottom: 15, left: 15 }

  const selectedGlazing = GLAZING_OPTIONS.find((g) => g.id === glazing) ?? GLAZING_OPTIONS[0]

  // Merge forwarded visualizerRef and local containerRef
  const setContainerRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (visualizerRef) {
        ;(visualizerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [visualizerRef]
  )

  return (
    <section className="relative w-full h-full p-3 sm:p-5 flex flex-col gap-4 items-center justify-center overflow-hidden bg-neutral-950 select-none">
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

        {/* Framing Assembly Container scaled to frame aspect ratio & positioned via arrow controls */}
        <div
          className="relative transition-transform duration-150 ease-out z-10 flex items-center justify-center"
          style={{
            width: `${Math.round(frameDisplayW)}px`,
            height: `${Math.round(frameDisplayH)}px`,
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Inner Artwork Window (positioned precisely dead-center inside the frame moulding) */}
          <div
            className="absolute overflow-hidden flex items-center justify-center z-10"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${Math.max(10, 100 - (insets.left + insets.right))}%`,
              height: `${Math.max(10, 100 - (insets.top + insets.bottom))}%`,
            }}
          >
            {/* Matboard layer if enabled */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: mat.enabled ? mat.color.hex : "#000",
                padding: mat.enabled ? `${Math.max(4, Math.round(mat.widthInches * 4))}px` : "0px",
              }}
            >
              {/* Artwork Container */}
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                {/* Artwork Image */}
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
                        "linear-gradient(125deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 28%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Selected Frame Moulding PNG Overlay */}
          {frame.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={frame.imageUrl}
              alt={frame.name}
              className="pointer-events-none z-20 select-none filter drop-shadow-[0_22px_32px_rgba(0,0,0,0.65)]"
              style={
                frame.rotation === 90
                  ? {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: `${Math.round(frameDisplayH)}px`,
                      height: `${Math.round(frameDisplayW)}px`,
                      transform: "translate(-50%, -50%) rotate(90deg)",
                      transformOrigin: "center center",
                      objectFit: "fill",
                    }
                  : {
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    }
              }
            />
          ) : (
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                border: `12px solid ${frame.color}`,
                boxShadow: frame.boxShadowCss,
              }}
            />
          )}
        </div>
      </div>

      {/* Floating Canvas Quick Controls (Bottom Center) with Size (+ / -) & Position Arrow Keys */}
      <div className="relative flex items-center gap-1.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-full px-3 py-1.5 shadow-xl">
        {/* Size / Zoom Controls (- / +) from 5% (0.05) to 200% (2.0) */}
        <div className="flex items-center gap-1">
          <Button
            className="h-6 w-6"
            variant="secondary"
            size="icon-xs"
            onClick={() => onZoomChange(Math.max(0.05, Math.round((zoomLevel - 0.05) * 100) / 100))}
            title="Size Down / Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-mono font-medium px-1 text-muted-foreground min-w-[38px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            className="h-6 w-6"
            variant="secondary"
            size="icon-xs"
            onClick={() => onZoomChange(Math.min(2.0, Math.round((zoomLevel + 0.05) * 100) / 100))}
            title="Size Up / Zoom In (+)"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-border/80 mx-0.5" />

        {/* Position Arrow Keys */}
        <div className="flex items-center gap-0.5">
          <Button
            className="h-6 w-6"
            variant="ghost"
            size="icon-xs"
            onClick={() => setPosition((prev) => ({ ...prev, x: prev.x - PAN_STEP }))}
            title="Move Frame Left (←)"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
          <Button
            className="h-6 w-6"
            variant="ghost"
            size="icon-xs"
            onClick={() => setPosition((prev) => ({ ...prev, y: prev.y - PAN_STEP }))}
            title="Move Frame Up (↑)"
            aria-label="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            className="h-6 w-6"
            variant="ghost"
            size="icon-xs"
            onClick={() => setPosition((prev) => ({ ...prev, y: prev.y + PAN_STEP }))}
            title="Move Frame Down (↓)"
            aria-label="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
          <Button
            className="h-6 w-6"
            variant="ghost"
            size="icon-xs"
            onClick={() => setPosition((prev) => ({ ...prev, x: prev.x + PAN_STEP }))}
            title="Move Frame Right (→)"
            aria-label="Move Right"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          {/* Reset Position Dot Button (when shifted) */}
          {(position.x !== 0 || position.y !== 0) && (
            <Button
              className="h-6 w-6 text-muted-foreground hover:text-foreground ml-0.5"
              variant="ghost"
              size="icon-xs"
              onClick={() => setPosition({ x: 0, y: 0 })}
              title="Reset Frame Position to Center"
              aria-label="Reset Position"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

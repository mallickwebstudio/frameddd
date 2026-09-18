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
  StandardFrameSize,
  WallBackground,
} from "@/types"
import { GLAZING_OPTIONS } from "@/db/frames"

interface FrameVisualizerProps {
  artwork: ArtworkConfig
  frame: FrameStyle
  selectedSize?: StandardFrameSize | null
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
  selectedSize = null,
  mouldingWidthInches = 1.25,
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

  // Mouse & Touch Drag State
  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const dragStartRef = React.useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
  })

  // Touch Pinch-to-Zoom Ref
  const touchDistanceRef = React.useRef<number | null>(null)
  const initialZoomRef = React.useRef<number>(zoomLevel)

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

  // Pointer event handlers for fluid mouse and touch dragging
  const handleFramePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return
      ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    }
  }

  const handleFramePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    let targetX = dragStartRef.current.posX + dx
    let targetY = dragStartRef.current.posY + dy

    // Magnetic center snapping (threshold: 8px)
    if (Math.abs(targetX) <= 8) targetX = 0
    if (Math.abs(targetY) <= 8) targetY = 0

    setPosition({ x: targetX, y: targetY })
  }

  const handleFramePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (isDragging) {
      try {
        ; (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
      } catch { }
      setIsDragging(false)
    }
  }

  // Ensure dragging flag is always reset if user releases pointer anywhere
  React.useEffect(() => {
    const handleGlobalPointerUp = (): void => {
      if (isDragging) setIsDragging(false)
    }
    window.addEventListener("pointerup", handleGlobalPointerUp)
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp)
  }, [isDragging])

  // Mouse wheel zoom handler (smooth step: 0.05)
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>): void => {
    e.preventDefault()
    const zoomStep = e.deltaY < 0 ? 0.05 : -0.05
    const newZoom = Math.max(0.05, Math.min(2.0, Math.round((zoomLevel + zoomStep) * 100) / 100))
    onZoomChange(newZoom)
  }

  // Touch handlers for mobile pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
      touchDistanceRef.current = distance
      initialZoomRef.current = zoomLevel
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const scaleDelta = currentDistance / touchDistanceRef.current
      const targetZoom = Math.max(
        0.05,
        Math.min(2.0, Math.round(initialZoomRef.current * scaleDelta * 100) / 100)
      )
      onZoomChange(targetZoom)
    }
  }

  const handleTouchEnd = (): void => {
    touchDistanceRef.current = null
  }

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

  // Calculate effective aspect ratio based on uploaded artwork (or artwork dimensions)
  const effectiveArtRatio = React.useMemo(() => {
    let ratio = artwork.aspectRatio
    if (!ratio || ratio <= 0) {
      ratio =
        artwork.originalWidthInches && artwork.originalHeightInches
          ? artwork.originalWidthInches / artwork.originalHeightInches
          : frame.aspectRatio || 1
    }
    if (artwork.rotation === 90 || artwork.rotation === 270) {
      ratio = 1 / ratio
    }
    return ratio
  }, [artwork.aspectRatio, artwork.originalWidthInches, artwork.originalHeightInches, artwork.rotation, frame.aspectRatio])

  // Frame sizing and aspect ratio:
  // If selectedSize is active, lock frame to standard size aspect ratio.
  // Otherwise auto-adjust to artwork aspect ratio when 9-slice is enabled.
  const frameRatio = selectedSize
    ? selectedSize.widthInches / selectedSize.heightInches
    : frame.useNineSlice || !frame.imageUrl
    ? effectiveArtRatio
    : frame.aspectRatio || 1
  const maxW = canvasDimensions.width * 0.72
  const maxH = canvasDimensions.height * 0.72

  let frameDisplayW = maxW
  let frameDisplayH = maxW / frameRatio
  if (frameDisplayH > maxH) {
    frameDisplayH = maxH
    frameDisplayW = maxH * frameRatio
  }

  // Calculated moulding border in pixels for 9-slice rendering (scales with user moulding width slider)
  const mouldingPx = Math.max(
    14,
    Math.round(
      Math.min(frameDisplayW, frameDisplayH) *
        0.09 *
        (mouldingWidthInches / (frame.defaultWidth || 1.25))
    )
  )

  const insets = frame.innerInset || { top: 15, right: 15, bottom: 15, left: 15 }
  const selectedGlazing = GLAZING_OPTIONS.find((g) => g.id === glazing) ?? GLAZING_OPTIONS[0]

  // Centering alignment flags for red crosshair guides (strictly only shown during active drag)
  const isHorizontallyCentered = isDragging && Math.abs(position.x) < 2
  const isVerticallyCentered = isDragging && Math.abs(position.y) < 2

  // Merge forwarded visualizerRef and local containerRef
  const setContainerRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (visualizerRef) {
        ; (visualizerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [visualizerRef]
  )

  return (
    <section className="p-2 sm:p-4 relative w-full h-full flex flex-col gap-4 items-center justify-center overflow-hidden bg-[#10231f] select-none">
      {/* 16:9 (Horizontal Video) Canvas Container */}
      <div
        ref={setContainerRefs}
        onWheel={handleWheelZoom}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300 touch-none"
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

        {/* Central Red Crosshair Alignment Guides */}
        {/* 1. Vertical Red Center Line (active when horizontal position is centered) */}
        {isHorizontallyCentered && (
          <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] z-30 animate-in fade-in duration-150" />
        )}

        {/* 2. Horizontal Red Center Line (active when vertical position is centered) */}
        {isVerticallyCentered && (
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] z-30 animate-in fade-in duration-150" />
        )}

        {/* 3. Dead Center Glowing Intersection Target */}
        {isHorizontallyCentered && isVerticallyCentered && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-red-500 bg-red-500/20 shadow-[0_0_14px_rgba(239,68,68,1)] z-30 flex items-center justify-center animate-in zoom-in-75 duration-150">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </div>
        )}

        {/* 4. Crosshair HUD Status Pill */}
        {(isHorizontallyCentered || isVerticallyCentered) && (
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-red-400/40 z-30 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {isHorizontallyCentered && isVerticallyCentered
              ? "SNAPPED TO CENTER"
              : isHorizontallyCentered
                ? "HORIZONTAL CENTER"
                : "VERTICAL CENTER"}
          </div>
        )}

        {/* Framing Assembly Container: Draggable via mouse/finger drag, with cursor feedback */}
        <div
          onPointerDown={handleFramePointerDown}
          onPointerMove={handleFramePointerMove}
          onPointerUp={handleFramePointerUp}
          onPointerCancel={handleFramePointerUp}
          className={`relative transition-transform duration-100 ease-out z-10 flex items-center justify-center select-none touch-none ${isDragging ? "cursor-grabbing scale-[1.002]" : "cursor-grab hover:scale-[1.001]"
            }`}
          style={{
            width: `${Math.round(frameDisplayW)}px`,
            height: `${Math.round(frameDisplayH)}px`,
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          }}
          title="Click and drag to move frame anywhere on wall"
        >
          {/* Inner Artwork Window (positioned flush inside the frame moulding with 1px overlap) */}
          <div
            className="absolute overflow-hidden flex items-center justify-center z-10 pointer-events-none"
            style={
              frame.useNineSlice || !frame.imageUrl
                ? {
                    top: `${Math.max(0, mouldingPx - 1)}px`,
                    left: `${Math.max(0, mouldingPx - 1)}px`,
                    right: `${Math.max(0, mouldingPx - 1)}px`,
                    bottom: `${Math.max(0, mouldingPx - 1)}px`,
                  }
                : {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${Math.max(10, 100 - (insets.left + insets.right))}%`,
                    height: `${Math.max(10, 100 - (insets.top + insets.bottom))}%`,
                  }
            }
          >
            {/* Matboard layer if enabled */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: mat.enabled ? mat.color.hex : "#000",
                padding: mat.enabled
                  ? `${Math.max(6, Math.round(mat.widthInches * (Math.min(frameDisplayW, frameDisplayH) / 28)))}px`
                  : "0px",
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

          {/* Selected Frame Moulding: 9-Slice CSS Border-Image or Legacy Overlay */}
          {frame.useNineSlice && frame.imageUrl ? (
            <div
              className="absolute inset-0 pointer-events-none z-20 filter drop-shadow-[0_22px_32px_rgba(0,0,0,0.65)]"
              style={{
                borderStyle: "solid",
                borderWidth: `${mouldingPx}px`,
                borderImageSource: `url(${frame.imageUrl})`,
                borderImageSlice:
                  typeof frame.sliceBorder === "number"
                    ? `${frame.sliceBorder}`
                    : frame.sliceBorder || "15%",
                borderImageRepeat: frame.sliceRepeat || "round",
              }}
            />
          ) : frame.imageUrl ? (
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
                boxShadow:
                  frame.boxShadowCss ||
                  "0 24px 44px -8px rgba(0,0,0,0.65), 0 10px 20px -5px rgba(0,0,0,0.4)",
              }}
            >
              {/* 3D Moulding Profile with Mitered Corners and Ambient Highlight */}
              <div
                className="absolute inset-0"
                style={{
                  borderStyle: "solid",
                  borderWidth: `${mouldingPx}px`,
                  borderColor: frame.color,
                  borderTopColor: `color-mix(in srgb, ${frame.color} 82%, white)`,
                  borderLeftColor: `color-mix(in srgb, ${frame.color} 90%, white)`,
                  borderBottomColor: `color-mix(in srgb, ${frame.color} 75%, black)`,
                  borderRightColor: `color-mix(in srgb, ${frame.color} 85%, black)`,
                }}
              />
              {/* Inner Rabbet Lip Shadow falling onto the mat/artwork */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  margin: `${mouldingPx}px`,
                  boxShadow: "inset 0 3px 10px rgba(0,0,0,0.65), inset 0 0 1px rgba(0,0,0,0.8)",
                }}
              />
              {/* Outer Edge Subtle Sheen */}
              <div className="absolute inset-0 pointer-events-none border border-white/10" />
            </div>
          )}
        </div>
      </div>

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

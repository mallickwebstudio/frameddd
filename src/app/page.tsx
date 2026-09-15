"use client"

import * as React from "react"
import {
  Image as ImageIcon,
  Frame as FrameIcon,
  Palette,
  Upload,
  ArrowRight,
  Sparkles,
  Calculator,
  Check,
} from "lucide-react"
import { StudioHeader } from "@/components/shared/studio-header"
import { FrameVisualizer } from "@/components/shared/frame-visualizer"
import { ArtworkUploadTab } from "@/components/shared/artwork-upload-tab"
import { FrameSelectorTab } from "@/components/shared/frame-selector-tab"
import { WallBackgroundTab } from "@/components/shared/wall-background-tab"
import { Button } from "@/components/ui/button"
import {
  ArtworkConfig,
  FrameStyle,
  GlazingType,
  HangingHardware,
  MatConfig,
  WallBackground,
} from "@/types"
import { FRAME_CATALOG } from "@/db/frames"
import { MAT_COLORS, WALL_PRESETS } from "@/db/presets"
import { SAMPLE_ARTWORKS } from "@/db/sample-artworks"
import { calculateFabricationQuote } from "@/lib/fabrication-calculator"

type TabType = "picture" | "frame" | "background"

export default function FrameStudioPage(): React.JSX.Element {
  // Screen state: Default shows whole screen cover 3-step guide inside input file border
  const [hasStarted, setHasStarted] = React.useState<boolean>(false)

  // Studio State
  const [artwork, setArtwork] = React.useState<ArtworkConfig>(SAMPLE_ARTWORKS[0])
  const [frame, setFrame] = React.useState<FrameStyle>(FRAME_CATALOG[0])
  const [mouldingWidthInches, setMouldingWidthInches] = React.useState<number>(
    FRAME_CATALOG[0].defaultWidth
  )
  const [mat, setMat] = React.useState<MatConfig>({
    enabled: true,
    color: MAT_COLORS[0],
    widthInches: 2.5,
    isDoubleMat: false,
    accentColor: MAT_COLORS[3],
    accentWidthInches: 0.25,
  })
  const [wall, setWall] = React.useState<WallBackground>(WALL_PRESETS[0])
  const [glazing, setGlazing] = React.useState<GlazingType>("standard-acrylic")
  const [hardware, setHardware] = React.useState<HangingHardware>("wire-hanger")

  // Visualizer Display Toggles
  const [showGlassGlare, setShowGlassGlare] = React.useState<boolean>(true)
  const [showScaleReference, setShowScaleReference] = React.useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = React.useState<number>(1.0)
  const [activeTab, setActiveTab] = React.useState<TabType>("picture")
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState<boolean>(false)

  const defaultFileInputRef = React.useRef<HTMLInputElement>(null)
  const visualizerRef = React.useRef<HTMLDivElement>(null)

  // Fabrication Quote calculation
  const quote = React.useMemo(() => {
    return calculateFabricationQuote(
      artwork,
      frame,
      mouldingWidthInches,
      mat,
      glazing,
      hardware
    )
  }, [artwork, frame, mouldingWidthInches, mat, glazing, hardware])

  // Process uploaded image file
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

        setArtwork({
          id: `custom-upload-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          src: result,
          aspectRatio: ratio,
          originalWidthInches: w,
          originalHeightInches: h,
          rotation: 0,
        })
        setHasStarted(true)
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

  // Frame selection handler
  const handleSelectFrame = (newFrame: FrameStyle): void => {
    setFrame(newFrame)
    setMouldingWidthInches(newFrame.defaultWidth)
  }

  // Artwork rotation handler
  const handleRotateArtwork = (): void => {
    setArtwork((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }))
  }

  // Artwork dimension resizing handler
  const handleDimensionsChange = (width: number, height: number): void => {
    setArtwork((prev) => ({
      ...prev,
      originalWidthInches: width,
      originalHeightInches: height,
    }))
  }

  // Export Mockup Action
  const handleExportMockup = (): void => {
    const canvas = document.createElement("canvas")
    canvas.width = 1600
    canvas.height = 900 // 16:9 export
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = wall.type === "color" ? wall.value : "#1e1e24"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const frameX = 400
      const frameY = 150
      const frameW = 800
      const frameH = 600

      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 15

      ctx.fillStyle = frame.color
      ctx.fillRect(frameX, frameY, frameW, frameH)

      ctx.shadowColor = "transparent"
      const matPad = mat.enabled ? 50 : 0
      ctx.fillStyle = mat.enabled ? mat.color.hex : "#000"
      ctx.fillRect(frameX + 30, frameY + 30, frameW - 60, frameH - 60)

      ctx.drawImage(
        img,
        frameX + 30 + matPad,
        frameY + 30 + matPad,
        frameW - 60 - 2 * matPad,
        frameH - 60 - 2 * matPad
      )

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "bold 24px serif"
      ctx.fillText("ATELIER FRAME & CO.", 50, canvas.height - 60)
      ctx.font = "16px sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillText(
        `${frame.name} (${mouldingWidthInches}") • ${quote.totalWidthInches}" × ${quote.totalHeightInches}" Overall`,
        50,
        canvas.height - 35
      )

      const link = document.createElement("a")
      link.download = `atelier-frame-${frame.id}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    img.src = artwork.src
  }

  // -------------------------------------------------------------
  // DEFAULT SCREEN: WHOLE SCREEN COVER 3-STEP GUIDE INSIDE INPUT FILE BORDER
  // -------------------------------------------------------------
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-8 justify-center items-center">
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
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full inline-block">
              Custom Fine Art Picture Framing Studio
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-foreground font-medium tracking-tight">
              ATELIER FRAME &amp; CO.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Design, customize, and preview your artwork on realistic 16:9 walls with artisan handcrafted mouldings.
            </p>
          </div>

          {/* Prominent 3-Step Guide */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
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

          {/* Primary Action Target within the File Border */}
          <div className="space-y-4 w-full max-w-md">
            <Button
              size="lg"
              onClick={() => defaultFileInputRef.current?.click()}
              className="w-full py-6 text-sm font-semibold gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <Upload className="w-4 h-4" />
              Upload Your Picture (or Drag &amp; Drop Here)
            </Button>

            {/* Quick Sample Artworks Trigger */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground">Or start immediately with sample artwork:</p>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_ARTWORKS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setArtwork(sample)
                      setHasStarted(true)
                    }}
                    className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary transition-all"
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Skip straight to 16:9 Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STUDIO WORKSPACE: 16:9 CANVAS + 3 TABS (Picture, Frame, Background)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header Navigation */}
      <StudioHeader
        quote={quote}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onExportMockup={handleExportMockup}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center: Default 16:9 Canvas On-Wall Visualizer */}
        <div className="flex-1 relative flex flex-col h-[46vh] sm:h-[50vh] lg:h-[calc(100vh-61px)] min-h-[260px] sm:min-h-[350px] lg:min-h-[480px] bg-neutral-950 border-r border-border items-center justify-center p-2 sm:p-4 overflow-hidden">
          <FrameVisualizer
            artwork={artwork}
            frame={frame}
            mouldingWidthInches={mouldingWidthInches}
            mat={mat}
            wall={wall}
            glazing={glazing}
            showGlassGlare={showGlassGlare}
            showScaleReference={showScaleReference}
            zoomLevel={zoomLevel}
            quote={quote}
            onToggleGlassGlare={() => setShowGlassGlare((prev) => !prev)}
            onToggleScaleReference={() => setShowScaleReference((prev) => !prev)}
            onZoomChange={setZoomLevel}
            visualizerRef={visualizerRef}
          />
        </div>

        {/* Right: Customization Sidebar with ONLY 3 TABS (Picture, Frame, Background) - 288px width */}
        <div className="w-full lg:w-[288px] xl:w-[288px] shrink-0 flex flex-col h-[54vh] lg:h-[calc(100vh-61px)] bg-card border-t lg:border-t-0 shadow-lg">
          {/* Navigation Tabs (Picture, Frame, Background) */}
          <div className="grid grid-cols-3 border-b border-border bg-muted/40 p-1.5 gap-1 shrink-0">
            {[
              { id: "picture" as const, label: "Picture", icon: ImageIcon },
              { id: "frame" as const, label: "Frame", icon: FrameIcon },
              { id: "background" as const, label: "Background", icon: Palette },
            ].map((t) => {
              const Icon = t.icon
              const isActive = activeTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                    isActive
                      ? "bg-card text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-4">
            {/* Tab 1: Picture */}
            {activeTab === "picture" && (
              <ArtworkUploadTab
                artwork={artwork}
                onSelectArtwork={setArtwork}
                onRotateArtwork={handleRotateArtwork}
                onDimensionsChange={handleDimensionsChange}
              />
            )}

            {/* Tab 2: Frame (No filter, horizontal scroll, visual, name, price ₹) */}
            {activeTab === "frame" && (
              <FrameSelectorTab
                selectedFrame={frame}
                mouldingWidthInches={mouldingWidthInches}
                onSelectFrame={handleSelectFrame}
                onMouldingWidthChange={setMouldingWidthInches}
              />
            )}

            {/* Tab 3: Background (Stacked with horizontal scroll for options) */}
            {activeTab === "background" && (
              <WallBackgroundTab wall={wall} onWallChange={setWall} />
            )}
          </div>

          {/* Sticky Bottom Bar with Current Total & Ask for Quote Trigger */}
          <div className="p-2.5 px-3.5 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                Estimated Price
              </span>
              <span className="text-base font-bold font-mono text-foreground">
                ₹{quote.total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsQuoteModalOpen(true)}
                className="text-xs font-semibold gap-1.5 shadow-md h-8 px-3"
              >
                <Calculator className="w-3.5 h-3.5" />
                Ask for Quote
              </Button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

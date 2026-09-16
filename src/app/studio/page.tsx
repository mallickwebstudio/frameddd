"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Image as ImageIcon,
  Frame as FrameIcon,
  Palette,
  Calculator,
  Sparkles,
} from "lucide-react"
import { StudioHeader } from "@/components/shared/studio-header"
import { FrameVisualizer } from "@/components/shared/frame-visualizer"
import { ArtworkUploadTab } from "@/components/shared/artwork-upload-tab"
import { FrameSelectorTab } from "@/components/shared/frame-selector-tab"
import { WallBackgroundTab } from "@/components/shared/wall-background-tab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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


export default function StudioEditorPage(): React.JSX.Element {
  const router = useRouter()

  // Studio State
  const [artwork, setArtwork] = React.useState<ArtworkConfig>(SAMPLE_ARTWORKS[0])
  const [frame, setFrame] = React.useState<FrameStyle>(FRAME_CATALOG[0])
  const [mouldingWidthInches, setMouldingWidthInches] = React.useState<number>(
    FRAME_CATALOG[0].defaultWidth ?? 1.25
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
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState<boolean>(false)

  const visualizerRef = React.useRef<HTMLDivElement>(null)

  // Load custom artwork from session storage if uploaded on homepage
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("framed_artwork")
      if (stored) {
        const parsed = JSON.parse(stored) as ArtworkConfig
        if (parsed && parsed.src) {
          setArtwork(parsed)
        }
      }
    } catch (err: unknown) {
      console.warn("Failed to retrieve stored artwork:", err)
    }
  }, [])

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

  // Frame selection handler
  const handleSelectFrame = (newFrame: FrameStyle): void => {
    setFrame(newFrame)
    setMouldingWidthInches(newFrame.defaultWidth ?? 1.25)
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
      ctx.fillText("ART FRAME", 50, canvas.height - 60)
      ctx.font = "16px sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillText(
        `${frame.name} • ${quote.totalWidthInches}" × ${quote.totalHeightInches}" Overall`,
        50,
        canvas.height - 35
      )

      const link = document.createElement("a")
      link.download = `framed-${frame.id}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    img.src = artwork.src
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header Navigation */}
      <StudioHeader
        quote={quote}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onExportMockup={handleExportMockup}
        onBackHome={() => router.push("/")}
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

        {/* Right: Customization Sidebar - Stacked Section-Wise (350px width) */}
        <div className="w-full lg:w-[350px] xl:w-[350px] shrink-0 flex flex-col h-[54vh] lg:h-[calc(100vh-61px)] bg-card border-t lg:border-t-0 shadow-lg">
          {/* Stacked Sections Panel with Distinct Section Backgrounds */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-3.5">
            {/* Section 1: Picture / Artwork (Sky Blue Theme) */}
            <section className="bg-sky-500/[0.04] dark:bg-sky-500/[0.08] border border-sky-500/20 rounded-2xl p-3 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-sky-500/15 text-sky-600 dark:text-sky-400">
                <div className="w-5 h-5 rounded-md bg-sky-500/15 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  1. Photo &amp; Artwork
                </span>
              </div>
              <ArtworkUploadTab
                artwork={artwork}
                onSelectArtwork={setArtwork}
                onRotateArtwork={handleRotateArtwork}
                onDimensionsChange={handleDimensionsChange}
              />
            </section>

            {/* Section 2: Frame Selection (Amber Gold Theme) */}
            <section className="bg-amber-500/[0.04] dark:bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-3 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-500/15 text-amber-600 dark:text-amber-400">
                <div className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center shrink-0">
                  <FrameIcon className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  2. Frame Selection
                </span>
              </div>
              <FrameSelectorTab
                selectedFrame={frame}
                onSelectFrame={handleSelectFrame}
              />
            </section>

            {/* Section 3: Wall Background (Emerald Green Theme) */}
            <section className="bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl p-3 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Palette className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  3. Wall Background
                </span>
              </div>
              <WallBackgroundTab wall={wall} onWallChange={setWall} />
            </section>
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

      {/* Quote Dialog Modal */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Custom Fabrication Quote</DialogTitle>
            <DialogDescription className="text-xs">
              Handcrafted in our atelier with archival materials.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moulding:</span>
                <span className="font-semibold text-foreground">{frame.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Artwork Size:</span>
                <span className="font-mono">{quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overall Frame Size:</span>
                <span className="font-mono">{quote.totalWidthInches}&quot; &times; {quote.totalHeightInches}&quot;</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-border">
                <span className="text-muted-foreground font-medium">Estimated Total:</span>
                <span className="font-bold text-primary font-mono text-sm">₹{quote.total}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Includes precision conservation fitting, dust seal backing, and hanging hardware.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsQuoteModalOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  alert(`Thank you! Your quote inquiry for ₹${quote.total} has been received.`);
                  setIsQuoteModalOpen(false);
                }}
              >
                Inquire via Atelier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

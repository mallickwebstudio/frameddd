"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Image as ImageIcon,
  Frame as FrameIcon,
  Palette,
  Calculator,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Send,
} from "lucide-react"
import { StudioHeader } from "@/components/shared/studio-header"
import { FrameVisualizer } from "@/components/shared/frame-visualizer"
import { ArtworkUploadTab } from "@/components/shared/artwork-upload-tab"
import { FrameSelectorTab } from "@/components/shared/frame-selector-tab"
import { WallBackgroundTab } from "@/components/shared/wall-background-tab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

  // Visualizer Display Toggles & Canvas Geometry
  const [showGlassGlare, setShowGlassGlare] = React.useState<boolean>(true)
  const [showScaleReference, setShowScaleReference] = React.useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = React.useState<number>(1.0)
  const [framePosition, setFramePosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [canvasDimensions, setCanvasDimensions] = React.useState<{ width: number; height: number }>({
    width: 800,
    height: 450,
  })
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState<boolean>(false)

  // Customer Quote Inquiry Form State
  const [customerName, setCustomerName] = React.useState<string>("")
  const [customerPhone, setCustomerPhone] = React.useState<string>("")
  const [customerMessage, setCustomerMessage] = React.useState<string>("")
  const [isQuoteSubmitted, setIsQuoteSubmitted] = React.useState<boolean>(false)

  const visualizerRef = React.useRef<HTMLDivElement>(null)

  // Load custom artwork or selected frame from session storage if selected on homepage
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("framed_artwork")
      if (stored) {
        const parsed = JSON.parse(stored) as ArtworkConfig
        if (parsed && parsed.src) {
          setArtwork(parsed)
        }
      }
      const storedFrame = sessionStorage.getItem("framed_frame")
      if (storedFrame) {
        const parsedFrame = JSON.parse(storedFrame) as FrameStyle
        if (parsedFrame && parsedFrame.id) {
          const match = FRAME_CATALOG.find((f) => f.id === parsedFrame.id) ?? parsedFrame
          setFrame(match)
          setMouldingWidthInches(match.defaultWidth ?? 1.25)
        }
      }
    } catch (err: unknown) {
      console.warn("Failed to retrieve stored studio assets:", err)
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

  // Export Mockup Action (Includes active wall background, accurate adjusted position and zoomLevel)
  const handleExportMockup = async (): Promise<void> => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1600
      canvas.height = 900 // 16:9 high-res canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // 1. Draw Active Wall Background
      if (wall.type === "color") {
        ctx.fillStyle = wall.value
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        try {
          const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error("Background load error"))
            img.src = wall.value
          })
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        } catch {
          ctx.fillStyle = "#1e1e24"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }

      // 2. Room Ambiance & Lighting Gradient
      const ambianceGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.35,
        120,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.75
      )
      ambianceGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)")
      ambianceGradient.addColorStop(1, "rgba(0, 0, 0, 0.30)")
      ctx.fillStyle = ambianceGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 3. Compute Frame Assembly Dimensions accurately scaled by zoomLevel and adjusted by framePosition
      const frameRatio = frame.aspectRatio || 1
      const baseMaxW = canvas.width * 0.72
      const baseMaxH = canvas.height * 0.72

      let baseFrameW = baseMaxW
      let baseFrameH = baseMaxW / frameRatio
      if (baseFrameH > baseMaxH) {
        baseFrameH = baseMaxH
        baseFrameW = baseMaxH * frameRatio
      }

      // Multiply by active user zoomLevel
      const frameW = baseFrameW * zoomLevel
      const frameH = baseFrameH * zoomLevel

      // Translate by active user framePosition (scaled from visualizer DOM dimensions to 1600x900 canvas)
      const vWidth = canvasDimensions.width > 0 ? canvasDimensions.width : 800
      const vHeight = canvasDimensions.height > 0 ? canvasDimensions.height : 450
      const shiftX = (framePosition.x / vWidth) * canvas.width
      const shiftY = (framePosition.y / vHeight) * canvas.height

      const centerX = canvas.width / 2 + shiftX
      const centerY = canvas.height / 2 + shiftY

      const frameX = centerX - frameW / 2
      const frameY = centerY - frameH / 2
      const insets = frame.innerInset || { top: 15, right: 15, bottom: 15, left: 15 }

      // 4. Drop Shadow behind frame assembly
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)"
      ctx.shadowBlur = Math.round(45 * Math.min(zoomLevel, 1.5))
      ctx.shadowOffsetY = Math.round(24 * Math.min(zoomLevel, 1.5))
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)"
      ctx.fillRect(frameX, frameY, frameW, frameH)
      ctx.restore()

      // 5. Inner Artwork & Mat Window
      const artWindowW = frameW * (Math.max(10, 100 - insets.left - insets.right) / 100)
      const artWindowH = frameH * (Math.max(10, 100 - insets.top - insets.bottom) / 100)
      const artWindowX = frameX + (frameW - artWindowW) / 2
      const artWindowY = frameY + (frameH - artWindowH) / 2

      // Matboard
      if (mat.enabled) {
        ctx.fillStyle = mat.color.hex
        ctx.fillRect(artWindowX, artWindowY, artWindowW, artWindowH)
      }

      const matPad = mat.enabled ? Math.max(8, Math.round(mat.widthInches * 10)) : 0
      const artX = artWindowX + matPad
      const artY = artWindowY + matPad
      const artW = artWindowW - 2 * matPad
      const artH = artWindowH - 2 * matPad

      // Draw centered artwork image
      try {
        const artImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error("Art load error"))
          img.src = artwork.src
        })

        ctx.save()
        ctx.beginPath()
        ctx.rect(artX, artY, artW, artH)
        ctx.clip()

        if (artwork.rotation) {
          ctx.translate(artX + artW / 2, artY + artH / 2)
          ctx.rotate((artwork.rotation * Math.PI) / 180)
          ctx.drawImage(artImg, -artW / 2, -artH / 2, artW, artH)
        } else {
          ctx.drawImage(artImg, artX, artY, artW, artH)
        }
        ctx.restore()
      } catch {
        ctx.fillStyle = "#111"
        ctx.fillRect(artX, artY, artW, artH)
      }

      // 6. Draw Frame Moulding PNG (with 90deg rotation if applicable)
      if (frame.imageUrl) {
        try {
          const frameImg = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error("Frame PNG load error"))
            img.src = frame.imageUrl
          })

          ctx.save()
          if (frame.rotation === 90) {
            ctx.translate(frameX + frameW / 2, frameY + frameH / 2)
            ctx.rotate((90 * Math.PI) / 180)
            ctx.drawImage(frameImg, -frameH / 2, -frameW / 2, frameH, frameW)
          } else {
            ctx.drawImage(frameImg, frameX, frameY, frameW, frameH)
          }
          ctx.restore()
        } catch {
          ctx.strokeStyle = frame.color
          ctx.lineWidth = 16
          ctx.strokeRect(frameX, frameY, frameW, frameH)
        }
      }

      // 7. Watermark & Atelier Brand Footer
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)"
      ctx.fillRect(0, canvas.height - 75, canvas.width, 75)

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      ctx.font = "bold 22px serif"
      ctx.fillText("ART FRAME", 50, canvas.height - 42)

      ctx.font = "14px sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
      ctx.fillText(
        `${frame.name} (${frame.ratio}) • ${quote.artWidthInches}" × ${quote.artHeightInches}" Art • Total: ₹${quote.total}`,
        50,
        canvas.height - 20
      )

      ctx.font = "12px sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.textAlign = "right"
      ctx.fillText("Created with ART FRAME Studio", canvas.width - 50, canvas.height - 30)

      // Trigger automatic download
      const link = document.createElement("a")
      link.download = `art-frame-${frame.id}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err: unknown) {
      console.error("Export mockup error:", err)
    }
  }

  // Send WhatsApp Inquiry
  const handleSendWhatsApp = (): void => {
    const lines = [
      "*ART FRAME — Custom Fabrication Inquiry*",
      "",
      `*Customer:* ${customerName.trim() || "Art Collector"}`,
      `*Phone:* ${customerPhone.trim() || "Not provided"}`,
      "",
      `*Frame Style:* ${frame.name} (${frame.ratio})`,
      `*Moulding Price:* ₹${frame.price}`,
      `*Artwork Size:* ${quote.artWidthInches}" × ${quote.artHeightInches}"`,
      `*Finished Size:* ${quote.totalWidthInches}" × ${quote.totalHeightInches}"`,
      `*Matboard:* ${mat.enabled ? `${mat.color.name} (${mat.widthInches}")` : "None"}`,
      `*Glazing:* ${glazing}`,
      `*Estimated Total:* ₹${quote.total}`,
    ]

    if (customerMessage.trim()) {
      lines.push("", `*Instructions:* ${customerMessage.trim()}`)
    }

    lines.push("", "Inquiry generated via ART FRAME Studio")

    const encoded = encodeURIComponent(lines.join("\n"))
    window.open(`https://wa.me/?text=${encoded}`, "_blank")
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
            framePosition={framePosition}
            onFramePositionChange={setFramePosition}
            onCanvasDimensionsChange={setCanvasDimensions}
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
                artworkAspectRatio={artwork.aspectRatio}
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
                className="text-xs font-semibold gap-1.5 shadow-md h-8 px-3 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                Ask for Quote
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Functional Ask for Quote Dialog Modal */}
      <Dialog
        open={isQuoteModalOpen}
        onOpenChange={(open) => {
          setIsQuoteModalOpen(open)
          if (!open) {
            setIsQuoteSubmitted(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Custom Fabrication Quote
            </DialogTitle>
            <DialogDescription className="text-xs">
              Handcrafted in our atelier with archival materials. Submit an inquiry or chat directly on WhatsApp.
            </DialogDescription>
          </DialogHeader>

          {isQuoteSubmitted ? (
            <div className="py-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Quote Inquiry Submitted!</h3>
                <p className="text-xs text-muted-foreground">
                  Thank you {customerName ? customerName : ""}. Our atelier framing master will reach out to you shortly.
                </p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs text-left font-mono space-y-1">
                <div>
                  <span className="text-muted-foreground">Ref No: </span>
                  <span className="font-semibold text-foreground">#AF-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Selected Frame: </span>
                  <span className="text-foreground">{frame.name} ({frame.ratio})</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Artwork Size: </span>
                  <span className="text-foreground">{quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Estimated Total: </span>
                  <span className="font-bold text-primary">₹{quote.total}</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsQuoteModalOpen(false)}
                className="w-full text-xs"
              >
                Back to Studio
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Auto-set Selected Frame Details */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                    Auto-Configured Specifications
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-semibold">
                    Fixed ₹{frame.price} Moulding
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame:</span>
                    <span className="font-medium text-foreground truncate">{frame.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ratio:</span>
                    <span className="font-mono text-foreground">{frame.ratio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="text-foreground truncate">{frame.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame Price:</span>
                    <span className="font-mono font-semibold text-foreground">₹{frame.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artwork Size:</span>
                    <span className="font-mono text-foreground">
                      {quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overall Size:</span>
                    <span className="font-mono text-foreground">
                      {quote.totalWidthInches}&quot; &times; {quote.totalHeightInches}&quot;
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matboard:</span>
                    <span className="text-foreground truncate">
                      {mat.enabled ? `${mat.color.name} (${mat.widthInches}")` : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Glazing:</span>
                    <span className="text-foreground capitalize truncate">
                      {glazing.replace("-", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/80">
                  <span className="font-medium text-foreground text-xs">Calculated Total Estimate:</span>
                  <span className="font-bold text-primary font-mono text-base">₹{quote.total}</span>
                </div>
              </div>

              {/* Customer Input Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="quote-customer-name" className="text-xs">
                    Full Name
                  </Label>
                  <Input
                    id="quote-customer-name"
                    placeholder="e.g. Salman Khan"
                    value={customerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quote-customer-phone" className="text-xs">
                    Phone No. (WhatsApp Preferred)
                  </Label>
                  <Input
                    id="quote-customer-phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quote-customer-message" className="text-xs">
                    Message / Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="quote-customer-message"
                    placeholder="e.g. Delivery timeline or custom hanging preference..."
                    value={customerMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomerMessage(e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Guarantee badge */}
              <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Includes conservation mounting, acid-free backing, archival dust seal, and mounting hardware.
                </p>
              </div>

              {/* Dialog Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>

                {/* Direct WhatsApp Action */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSendWhatsApp}
                  className="text-xs gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Inquiry
                </Button>

                {/* Submit to Atelier */}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setIsQuoteSubmitted(true)}
                  className="text-xs gap-1.5 font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Inquiry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

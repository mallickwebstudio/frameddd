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
  Plus,
  Minus,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { HomeNavbar } from "@/components/shared/home-navbar"
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
  StandardFrameSize,
  WallBackground,
  QuoteRequestBody,
  QuoteApiResponse,
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
  const [selectedSize, setSelectedSize] = React.useState<StandardFrameSize | null>(null)
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

  // Order Quantity State (supports 1, 2, 5, 10, etc.)
  const [quantity, setQuantity] = React.useState<number>(1)

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
  const [isSubmittingQuote, setIsSubmittingQuote] = React.useState<boolean>(false)
  const [quoteRefId, setQuoteRefId] = React.useState<string>("")

  // Collapsible Accordion Sections State
  const [openSections, setOpenSections] = React.useState<{
    photo: boolean
    frame: boolean
    wall: boolean
  }>({
    photo: true,
    frame: true,
    wall: true,
  })

  const toggleSection = (key: "photo" | "frame" | "wall"): void => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const allSectionsOpen = openSections.photo && openSections.frame && openSections.wall
  const toggleAllSections = (): void => {
    const nextState = !allSectionsOpen
    setOpenSections({
      photo: nextState,
      frame: nextState,
      wall: nextState,
    })
  }

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
          const match =
            FRAME_CATALOG.find(
              (f) =>
                f.id === parsedFrame.id ||
                (parsedFrame.id === "gold-1-1" && f.id === "vintage-gold-01") ||
                (parsedFrame.id === "cyan-1-1" && f.id === "vintage-cyan-01") ||
                (parsedFrame.id === "purple-1-1" && f.id === "vintage-purple-01")
            ) ?? FRAME_CATALOG[0]
          setFrame(match)
          setMouldingWidthInches(match.defaultWidth ?? 1.25)
        }
      }
    } catch (err: unknown) {
      console.warn("Failed to retrieve stored studio assets:", err)
    }
  }, [])

  // Fabrication Quote calculation with quantity and active size
  const quote = React.useMemo(() => {
    const artW = selectedSize ? selectedSize.widthInches : artwork.originalWidthInches
    const artH = selectedSize ? selectedSize.heightInches : artwork.originalHeightInches
    const effectiveArtwork = selectedSize
      ? { ...artwork, originalWidthInches: artW, originalHeightInches: artH }
      : artwork

    return calculateFabricationQuote(
      effectiveArtwork,
      frame,
      mouldingWidthInches,
      mat,
      glazing,
      hardware,
      quantity
    )
  }, [artwork, selectedSize, frame, mouldingWidthInches, mat, glazing, hardware, quantity])

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
      let effectiveArtRatio = artwork.aspectRatio
      if (!effectiveArtRatio || effectiveArtRatio <= 0) {
        effectiveArtRatio =
          artwork.originalWidthInches && artwork.originalHeightInches
            ? artwork.originalWidthInches / artwork.originalHeightInches
            : frame.aspectRatio || 1
      }
      if (artwork.rotation === 90 || artwork.rotation === 270) {
        effectiveArtRatio = 1 / effectiveArtRatio
      }

      const frameRatio = selectedSize
        ? selectedSize.widthInches / selectedSize.heightInches
        : frame.useNineSlice || !frame.imageUrl
        ? effectiveArtRatio
        : frame.aspectRatio || 1
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

      // Moulding border thickness for export canvas
      const canvasMoulding = Math.max(
        16,
        Math.round(
          Math.min(frameW, frameH) *
            0.09 *
            (mouldingWidthInches / (frame.defaultWidth || 1.25))
        )
      )

      // 4. Drop Shadow behind frame assembly
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)"
      ctx.shadowBlur = Math.round(45 * Math.min(zoomLevel, 1.5))
      ctx.shadowOffsetY = Math.round(24 * Math.min(zoomLevel, 1.5))
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)"
      ctx.fillRect(frameX, frameY, frameW, frameH)
      ctx.restore()

      // 5. Inner Artwork & Mat Window
      let artWindowX: number
      let artWindowY: number
      let artWindowW: number
      let artWindowH: number

      if (frame.useNineSlice || !frame.imageUrl) {
        artWindowX = frameX + canvasMoulding - 1
        artWindowY = frameY + canvasMoulding - 1
        artWindowW = Math.max(0, frameW - 2 * (canvasMoulding - 1))
        artWindowH = Math.max(0, frameH - 2 * (canvasMoulding - 1))
      } else {
        artWindowW = frameW * (Math.max(10, 100 - insets.left - insets.right) / 100)
        artWindowH = frameH * (Math.max(10, 100 - insets.top - insets.bottom) / 100)
        artWindowX = frameX + (frameW - artWindowW) / 2
        artWindowY = frameY + (frameH - artWindowH) / 2
      }

      // Matboard
      if (mat.enabled) {
        ctx.fillStyle = mat.color.hex
        ctx.fillRect(artWindowX, artWindowY, artWindowW, artWindowH)
      }

      const matPad = mat.enabled ? Math.max(8, Math.round(mat.widthInches * 10)) : 0
      const artX = artWindowX + matPad
      const artY = artWindowY + matPad
      const artW = Math.max(0, artWindowW - 2 * matPad)
      const artH = Math.max(0, artWindowH - 2 * matPad)

      // Draw centered artwork image with aspect-ratio-aware cropping (object-fit: cover)
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

        // Calculate source rectangle for centered object-cover crop
        const imgW = artImg.naturalWidth || artImg.width
        const imgH = artImg.naturalHeight || artImg.height
        const imgAspect = imgW / imgH
        const targetAspect = artW / artH

        let sx = 0
        let sy = 0
        let sw = imgW
        let sh = imgH

        if (imgAspect > targetAspect) {
          // Source image wider than target container: crop left and right
          sw = Math.round(imgH * targetAspect)
          sx = Math.round((imgW - sw) / 2)
        } else {
          // Source image taller than target container: crop top and bottom
          sh = Math.round(imgW / targetAspect)
          sy = Math.round((imgH - sh) / 2)
        }

        if (artwork.rotation) {
          ctx.translate(artX + artW / 2, artY + artH / 2)
          ctx.rotate((artwork.rotation * Math.PI) / 180)
          ctx.drawImage(artImg, sx, sy, sw, sh, -artW / 2, -artH / 2, artW, artH)
        } else {
          ctx.drawImage(artImg, sx, sy, sw, sh, artX, artY, artW, artH)
        }
        ctx.restore()
      } catch {
        ctx.fillStyle = "#111"
        ctx.fillRect(artX, artY, artW, artH)
      }

      // 6. Draw Frame Moulding (9-Slice, Legacy Overlay, or Procedural 3D Standard Moulding)
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
          if (frame.useNineSlice) {
            let sliceRatio = 0.15
            if (typeof frame.sliceBorder === "number") {
              sliceRatio = frame.sliceBorder > 1 ? frame.sliceBorder / 100 : frame.sliceBorder
            } else if (typeof frame.sliceBorder === "string") {
              sliceRatio = parseFloat(frame.sliceBorder) / 100 || 0.15
            }

            const sw = frameImg.naturalWidth || frameImg.width
            const sh = frameImg.naturalHeight || frameImg.height
            const sTop = Math.round(sh * sliceRatio)
            const sRight = Math.round(sw * sliceRatio)
            const sBottom = Math.round(sh * sliceRatio)
            const sLeft = Math.round(sw * sliceRatio)
            const sMidW = Math.max(1, sw - sLeft - sRight)
            const sMidH = Math.max(1, sh - sTop - sBottom)

            const bTop = canvasMoulding
            const bRight = canvasMoulding
            const bBottom = canvasMoulding
            const bLeft = canvasMoulding
            const dMidW = Math.max(0, frameW - bLeft - bRight)
            const dMidH = Math.max(0, frameH - bTop - bBottom)

            // 4 Corners
            ctx.drawImage(frameImg, 0, 0, sLeft, sTop, frameX, frameY, bLeft, bTop)
            ctx.drawImage(frameImg, sw - sRight, 0, sRight, sTop, frameX + frameW - bRight, frameY, bRight, bTop)
            ctx.drawImage(frameImg, 0, sh - sBottom, sLeft, sBottom, frameX, frameY + frameH - bBottom, bLeft, bBottom)
            ctx.drawImage(frameImg, sw - sRight, sh - sBottom, sRight, sBottom, frameX + frameW - bRight, frameY + frameH - bBottom, bRight, bBottom)

            // 4 Edges
            if (dMidW > 0) {
              ctx.drawImage(frameImg, sLeft, 0, sMidW, sTop, frameX + bLeft, frameY, dMidW, bTop)
              ctx.drawImage(frameImg, sLeft, sh - sBottom, sMidW, sBottom, frameX + bLeft, frameY + frameH - bBottom, dMidW, bBottom)
            }
            if (dMidH > 0) {
              ctx.drawImage(frameImg, 0, sTop, sLeft, sMidH, frameX, frameY + bTop, bLeft, dMidH)
              ctx.drawImage(frameImg, sw - sRight, sTop, sRight, sMidH, frameX + frameW - bRight, frameY + bTop, bRight, dMidH)
            }
          } else if (frame.rotation === 90) {
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
      } else {
        // Procedural 3D Moulding for Standard Frames (Realistic 45° Miter Joinery & Shading)
        ctx.save()

        // 1. Top Bevel Moulding (Highlighted from top ambient light)
        ctx.beginPath()
        ctx.moveTo(frameX, frameY)
        ctx.lineTo(frameX + frameW, frameY)
        ctx.lineTo(frameX + frameW - canvasMoulding, frameY + canvasMoulding)
        ctx.lineTo(frameX + canvasMoulding, frameY + canvasMoulding)
        ctx.closePath()
        ctx.fillStyle = frame.color
        ctx.fill()
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
        ctx.fill()

        // 2. Left Bevel Moulding (Soft light wash)
        ctx.beginPath()
        ctx.moveTo(frameX, frameY)
        ctx.lineTo(frameX + canvasMoulding, frameY + canvasMoulding)
        ctx.lineTo(frameX + canvasMoulding, frameY + frameH - canvasMoulding)
        ctx.lineTo(frameX, frameY + frameH)
        ctx.closePath()
        ctx.fillStyle = frame.color
        ctx.fill()
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
        ctx.fill()

        // 3. Right Bevel Moulding (Side ambient drop)
        ctx.beginPath()
        ctx.moveTo(frameX + frameW, frameY)
        ctx.lineTo(frameX + frameW, frameY + frameH)
        ctx.lineTo(frameX + frameW - canvasMoulding, frameY + frameH - canvasMoulding)
        ctx.lineTo(frameX + frameW - canvasMoulding, frameY + canvasMoulding)
        ctx.closePath()
        ctx.fillStyle = frame.color
        ctx.fill()
        ctx.fillStyle = "rgba(0, 0, 0, 0.14)"
        ctx.fill()

        // 4. Bottom Bevel Moulding (Under shadow)
        ctx.beginPath()
        ctx.moveTo(frameX, frameY + frameH)
        ctx.lineTo(frameX + canvasMoulding, frameY + frameH - canvasMoulding)
        ctx.lineTo(frameX + frameW - canvasMoulding, frameY + frameH - canvasMoulding)
        ctx.lineTo(frameX + frameW, frameY + frameH)
        ctx.closePath()
        ctx.fillStyle = frame.color
        ctx.fill()
        ctx.fillStyle = "rgba(0, 0, 0, 0.26)"
        ctx.fill()

        // 5. Inner Rabbet Lip Shadow
        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)"
        ctx.lineWidth = 3
        ctx.strokeRect(
          frameX + canvasMoulding,
          frameY + canvasMoulding,
          frameW - 2 * canvasMoulding,
          frameH - 2 * canvasMoulding
        )

        // 6. Outer Clean Rim Line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
        ctx.lineWidth = 1
        ctx.strokeRect(frameX, frameY, frameW, frameH)

        ctx.restore()
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
        `${frame.name} (${frame.ratio}) • ${quote.artWidthInches}" × ${quote.artHeightInches}" Art • Total (${quote.quantity}x): ₹${quote.total}`,
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
      `*Unit Price:* ₹${quote.unitPrice}`,
      `*Order Quantity:* ${quote.quantity} piece${quote.quantity > 1 ? "s" : ""}`,
      `*Artwork Size:* ${quote.artWidthInches}" × ${quote.artHeightInches}"`,
      `*Finished Size:* ${quote.totalWidthInches}" × ${quote.totalHeightInches}"`,
      `*Matboard:* ${mat.enabled ? `${mat.color.name} (${mat.widthInches}")` : "None"}`,
      `*Glazing:* ${glazing}`,
      `*Total to Pay:* ₹${quote.total} (₹${quote.unitPrice} × ${quote.quantity})`,
    ]

    if (customerMessage.trim()) {
      lines.push("", `*Instructions:* ${customerMessage.trim()}`)
    }

    lines.push("", "Inquiry generated via ART FRAME Studio")

    const encoded = encodeURIComponent(lines.join("\n"))
    window.open(`https://wa.me/?text=${encoded}`, "_blank")
  }

  // Submit Quote Inquiry to Google Form via Next.js API Route
  const handleSubmitQuote = async (): Promise<void> => {
    const name = customerName.trim()
    const phone = customerPhone.trim()

    if (!name) {
      toast.error("Please enter your name")
      return
    }

    if (!phone || phone.replace(/\D/g, "").length < 7) {
      toast.error("Please enter a valid phone number")
      return
    }

    setIsSubmittingQuote(true)
    try {
      const orientationLabel =
        frame.aspectRatio === 1
          ? "Square (1:1)"
          : (frame.aspectRatio || 1) > 1
            ? `Landscape (${frame.ratio})`
            : `Portrait (${frame.ratio})`

      const payload: QuoteRequestBody = {
        name,
        phone,
        msg: customerMessage.trim() || undefined,
        selectedFrameName: frame.name,
        frameAspectRatio: `${frame.ratio} • ${orientationLabel}`,
        orderQuantity: `${quantity} ${quantity === 1 ? "frame" : "frames"}`,
        artWorkSize: `${quote.artWidthInches}" × ${quote.artHeightInches}"`,
        estimatedTotalPrice: `₹${quote.total} (₹${quote.unitPrice} × ${quantity})`,
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as QuoteApiResponse

      if (res.ok && data.success) {
        if (data.refId) setQuoteRefId(data.refId)
        toast.success("Quote inquiry submitted successfully!", {
          description: "Our atelier framing master will reach out to you shortly.",
        })
        setIsQuoteSubmitted(true)
      } else {
        toast.error(data.error || "Failed to submit quote request. Please try again.")
      }
    } catch (err: unknown) {
      console.error("Submit quote error:", err)
      toast.error("Network error submitting quote. Please try WhatsApp.")
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header Navigation */}
      <HomeNavbar
        page="studio"
        onExportMockup={handleExportMockup}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center: Default 16:9 Canvas On-Wall Visualizer */}
        <div className="flex-1 relative flex flex-col h-[46vh] sm:h-[50vh] lg:h-[calc(100vh-61px)] min-h-[260px] sm:min-h-[350px] lg:min-h-[480px] bg-neutral-950 border-r border-border items-center justify-center overflow-hidden">
          <FrameVisualizer
            artwork={artwork}
            frame={frame}
            selectedSize={selectedSize}
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
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5">
            {/* Accordion Quick Control */}
            <div className="flex items-center justify-between px-1 pb-0.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Customization Studio
              </span>
              <button
                type="button"
                onClick={toggleAllSections}
                className="text-[11px] font-medium text-primary hover:underline cursor-pointer transition-colors"
              >
                {allSectionsOpen ? "Collapse all" : "Expand all"}
              </button>
            </div>

            {/* Section 1: Picture / Artwork (Sky Blue Theme) */}
            <section className="bg-sky-500/[0.04] dark:bg-sky-500/[0.08] border border-sky-500/20 rounded-2xl p-3 shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection("photo")}
                className={`w-full flex items-center justify-between gap-2 text-sky-600 dark:text-sky-400 cursor-pointer text-left group ${openSections.photo ? "pb-2" : ""
                  }`}
                aria-expanded={openSections.photo}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-sky-500/15 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider group-hover:underline">
                    1. Photo &amp; Artwork
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-sky-600/70 dark:text-sky-400/70 transition-transform duration-200 ${openSections.photo ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openSections.photo && (
                <div className="pt-2 border-t border-sky-500/15 animate-in fade-in duration-150">
                  <ArtworkUploadTab
                    artwork={artwork}
                    onSelectArtwork={setArtwork}
                    onRotateArtwork={handleRotateArtwork}
                    onDimensionsChange={handleDimensionsChange}
                  />
                </div>
              )}
            </section>

            {/* Section 2: Frame Selection (Amber Gold Theme) */}
            <section className="bg-amber-500/[0.04] dark:bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-3 shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection("frame")}
                className={`w-full flex items-center justify-between gap-2 text-amber-600 dark:text-amber-400 cursor-pointer text-left group ${openSections.frame ? "pb-2" : ""
                  }`}
                aria-expanded={openSections.frame}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center shrink-0">
                    <FrameIcon className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider group-hover:underline">
                    2. Frame Selection
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-amber-600/70 dark:text-amber-400/70 transition-transform duration-200 ${openSections.frame ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openSections.frame && (
                <div className="pt-2 border-t border-amber-500/15 animate-in fade-in duration-150">
                  <FrameSelectorTab
                    selectedFrame={frame}
                    onSelectFrame={handleSelectFrame}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    matWidthInches={mat.widthInches}
                    onMatWidthChange={(w) =>
                      setMat((prev) => ({
                        ...prev,
                        widthInches: w,
                        enabled: true,
                      }))
                    }
                    artworkAspectRatio={artwork.aspectRatio}
                  />
                </div>
              )}
            </section>

            {/* Section 3: Wall Background (Emerald Green Theme) */}
            <section className="bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl p-3 shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection("wall")}
                className={`w-full flex items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400 cursor-pointer text-left group ${openSections.wall ? "pb-2" : ""
                  }`}
                aria-expanded={openSections.wall}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Palette className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider group-hover:underline">
                    3. Wall Background
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-600/70 dark:text-emerald-400/70 transition-transform duration-200 ${openSections.wall ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openSections.wall && (
                <div className="pt-2 border-t border-emerald-500/15 animate-in fade-in duration-150">
                  <WallBackgroundTab wall={wall} onWallChange={setWall} />
                </div>
              )}
            </section>
          </div>

          {/* Sticky Bottom Bar with Quantity Selector, Current Total & Ask for Quote Trigger */}
          <div className="p-2.5 px-3 border-t border-border bg-card/95 backdrop-blur-md space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Qty:</span>
                <div className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-mono font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(100, prev + 1))}
                    aria-label="Increase quantity"
                    className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Quick Presets: 1, 2, 5, 10 */}
                <div className="flex items-center gap-1">
                  {[1, 2, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(preset)}
                      className={`px-1.5 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all border ${quantity === preset
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                        }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block leading-tight">
                  Total ({quantity}x)
                </span>
                <span className="text-base font-bold font-mono text-primary leading-tight">
                  ₹{quote.total}
                </span>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full text-xs font-semibold gap-1.5 shadow-md h-8 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              Ask for Quote ({quantity} {quantity === 1 ? "Frame" : "Frames"} • ₹{quote.total})
            </Button>
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
              Handcrafted in our atelier with archival materials. Transparent flat pricing — submit an inquiry or chat directly on WhatsApp.
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
                  <span className="font-semibold text-foreground">{quoteRefId || "#AF-582910"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Selected Frame: </span>
                  <span className="text-foreground">{frame.name} ({frame.ratio})</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity: </span>
                  <span className="text-foreground font-semibold">{quote.quantity} frame{quote.quantity > 1 ? "s" : ""}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Artwork Size: </span>
                  <span className="text-foreground">{quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Calculation: </span>
                  <span className="text-foreground">₹{quote.unitPrice} &times; {quote.quantity}</span>
                </div>
                <div className="pt-1 border-t border-border">
                  <span className="text-muted-foreground">Total to Pay: </span>
                  <span className="font-bold text-primary text-sm">₹{quote.total}</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsQuoteModalOpen(false)}
                className="w-full text-xs cursor-pointer"
              >
                Back to Studio
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Order Quantity Selector */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Order Quantity</span>
                  <span className="text-[10px] text-muted-foreground">Order multiple identical copies of this bespoke frame</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className={`px-2 py-0.5 text-xs font-mono rounded-md cursor-pointer transition-all border ${quantity === preset
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                          : "bg-background hover:bg-muted text-foreground border-border"
                          }`}
                      >
                        {preset}x
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-mono font-bold text-foreground">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(100, prev + 1))}
                      aria-label="Increase quantity"
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto-set Selected Frame Details */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                    Auto-Configured Specifications
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-semibold">
                    Fixed ₹{quote.unitPrice} / Frame
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
                    <span className="text-muted-foreground">Unit Price:</span>
                    <span className="font-mono font-semibold text-foreground">₹{quote.unitPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-mono font-semibold text-foreground">{quote.quantity} frame{quote.quantity > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artwork Size:</span>
                    <span className="font-mono text-foreground">
                      {quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;
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
                  <div>
                    <span className="font-medium text-foreground text-xs block">Total Amount to Pay:</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      (₹{quote.unitPrice} &times; {quote.quantity} {quote.quantity === 1 ? "frame" : "frames"})
                    </span>
                  </div>
                  <span className="font-bold text-primary font-mono text-lg">₹{quote.total}</span>
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
                    placeholder="e.g. Vivek Mishra"
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
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>

                {/* Direct WhatsApp Action */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSendWhatsApp}
                  className="text-xs gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Inquiry
                </Button>

                {/* Submit to Atelier & Google Form */}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={isSubmittingQuote}
                  onClick={handleSubmitQuote}
                  className="text-xs gap-1.5 font-semibold cursor-pointer min-w-[125px]"
                >
                  {isSubmittingQuote ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

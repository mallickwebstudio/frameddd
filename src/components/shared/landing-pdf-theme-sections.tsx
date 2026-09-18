"use client"

import * as React from "react"
import {
  ArrowRight,
  Sparkles,
  Upload,
  Check,
  Gift,
  Box,
  Layers,
  ShieldCheck,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArtworkConfig, FrameStyle } from "@/types"
import { FRAME_CATALOG } from "@/db/frames"

interface LandingPdfSectionsProps {
  onOpenStudio: () => void
  onUploadClick: () => void
  onSelectFrame?: (frame: FrameStyle) => void
  featuredFramesSlot?: React.ReactNode
}

const MILESTONE_TAGS = [
  "Weddings",
  "Family Portraits",
  "Newborns",
  "Beloved Pets",
  "Anniversaries",
  "Graduations",
  "Travel Photography",
  "Fine Art Prints",
  "Meaningful Gifts",
]

const MILESTONES = [
  {
    title: "Weddings & Vows",
    tag: "Romance",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    frameId: "std-natural-oak",
  },
  {
    title: "Family Milestones",
    tag: "Heritage",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
    frameId: "std-smoked-walnut",
  },
  {
    title: "Newborns & Little Ones",
    tag: "Early Days",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
    frameId: "std-studio-white",
  },
  {
    title: "Beloved Pets",
    tag: "Unconditional",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    frameId: "std-matte-black",
  },
  {
    title: "Lifelong Friendships",
    tag: "Celebrations",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    frameId: "std-brushed-brass",
  },
  {
    title: "Travel & Adventures",
    tag: "Exploration",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    frameId: "std-heritage-pine",
  },
]

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Upload Your Photo",
    desc: "Select high-res photos directly from your phone camera roll, tablet, or desktop.",
    isHighlight: false,
  },
  {
    num: "02",
    title: "Tailor Your Size",
    desc: "Choose from classic 4×6\" tabletop prints to statement 24×36\" wall galleries.",
    isHighlight: false,
  },
  {
    num: "03",
    title: "Choose Frame & Mat",
    desc: "Select solid hardwood, architectural brass, and acid-free 4-ply archival mats.",
    isHighlight: false,
  },
  {
    num: "04",
    title: "Preview In Your Room",
    desc: "Inspect optical scale, ambient lighting, and corner mitres on 16:9 designer walls.",
    isHighlight: false,
  },
  {
    num: "05",
    title: "Delivered Ready to Hang",
    desc: "Hand-assembled with pre-installed hanging wire and delivered safely to your door.",
    isHighlight: true,
  },
]

const CURATED_COLLECTIONS = [
  {
    title: "Signature Hardwoods",
    desc: "Kiln-dried Scandinavian natural oak and roasted smoked walnut with organic linear grain.",
    icon: Layers,
  },
  {
    title: "Architectural Metals",
    desc: "Sleek brushed champagne brass with satin lustre for modern, minimalist interiors.",
    icon: Palette,
  },
  {
    title: "Vintage Gilded Baroque",
    desc: "Opulent handcrafted period mouldings with burnished gold leaf and antiqued patina.",
    icon: Sparkles,
  },
  {
    title: "Gallery Wall Sets",
    desc: "Harmonious multi-piece layouts with hanging templates and hardware included.",
    icon: Box,
  },
  {
    title: "Heirloom Gift Boxes",
    desc: "Thoughtfully hand-packaged framing gifts for weddings, anniversaries, and holidays.",
    icon: Gift,
  },
]

export function LandingPdfThemeSections({
  onOpenStudio,
  onUploadClick,
  onSelectFrame,
  featuredFramesSlot,
}: LandingPdfSectionsProps): React.JSX.Element {
  // Handle click on milestone frame example: set active frame & artwork, then open Studio
  const handleMilestoneFrameClick = (milestone: (typeof MILESTONES)[number]): void => {
    const targetFrame =
      FRAME_CATALOG.find((f) => f.id === milestone.frameId) ?? FRAME_CATALOG[0]

    // Pre-populate sample milestone photo as artwork so studio visualizer immediately previews it
    const sampleArtwork: ArtworkConfig = {
      id: `sample-milestone-${milestone.frameId}`,
      title: milestone.title,
      src: milestone.image,
      aspectRatio: 4 / 3,
      originalWidthInches: 24,
      originalHeightInches: 18,
      rotation: 0,
    }

    try {
      sessionStorage.setItem("framed_artwork", JSON.stringify(sampleArtwork))
      sessionStorage.setItem("framed_frame", JSON.stringify(targetFrame))
    } catch (err: unknown) {
      console.warn("Storage quota or error:", err)
    }

    if (onSelectFrame) {
      onSelectFrame(targetFrame)
    } else {
      onOpenStudio()
    }
  }

  return (
    <div className="w-full space-y-0">
      {/* ========================================================================= */}
      {/* SECTION 1: THE INSIGHT - Warm Linen Cream                                 */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#FAF7F2] text-[#0B2118] border-t border-[#0B2118]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual of framed photo holding moment */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-2xl bg-stone-200 border border-stone-300/80 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85"
                alt="Framed Family Memory"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay simulated frame moulding border */}
              <div className="absolute inset-4 sm:inset-6 rounded-lg border-8 sm:border-12 border-[#422e23] shadow-[0_12px_32px_rgba(0,0,0,0.4)] pointer-events-none flex items-center justify-center">
                <div className="absolute inset-2 sm:inset-3 border-4 border-[#FAF7F2] opacity-90 shadow-inner" />
              </div>
              <div className="absolute bottom-4 left-4 sm:left-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[11px] font-mono">
                Handcrafted Smoked Walnut • 16 × 20&quot;
              </div>
            </div>
            {/* Subtle decorative accent pill */}
            <div className="absolute -bottom-5 -right-2 sm:right-4 bg-[#FA6446] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              Proof that a moment mattered
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#0B2118]/15 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FA6446] font-mono">
                Artisan Picture Framing
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight leading-[1.15] text-[#0B2118]">
                A photo is more than an image.
              </h2>
              <p className="text-xl sm:text-2xl text-[#FA6446] font-heading italic">
                It is proof that a moment mattered.
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#0B2118]/75 leading-relaxed">
              <p>
                Your most cherished memories deserve more than staying forgotten on a phone screen.
                Whether it is a wedding portrait, a childhood milestone, or fine photography, we craft
                museum-grade physical displays that bring warmth and character into your home.
              </p>
              <p>
                Say goodbye to confusing custom framing shops, hidden consultation fees, and guesswork.
                At ART FRAME, we combine traditional atelier joinery with real-time 16:9 room visualization,
                so you know exactly how your framed piece will look on your wall before it is built.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Button
                onClick={onUploadClick}
                className="bg-[#0B2118] text-[#FAF7F2] hover:bg-[#123628] rounded-xl px-6 py-5 text-sm font-semibold shadow-md cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2 text-[#FA6446]" />
                Frame Your Picture
              </Button>
              <button
                type="button"
                onClick={onOpenStudio}
                className="text-xs font-semibold uppercase tracking-wider text-[#0B2118] hover:text-[#FA6446] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Explore 16:9 Studio →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: LIFE'S PEOPLE & MILESTONES - Deep Luxury Forest Green           */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0B2118] text-[#FAF7F2] border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A5D6B6] font-mono">
                Preserve Every Memory
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#FAF7F2]">
                Crafted for life’s people &amp; milestones.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-sm text-left md:text-right">
              From wedding vows and newborn portraits to beloved companions and travel adventures.
            </p>
          </div>

          {/* Milestone Tags Infinite Marquee */}
          <div className="relative w-full overflow-hidden py-1">
            {/* Left & Right ambient fade masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0B2118] via-[#0B2118]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0B2118] via-[#0B2118]/80 to-transparent z-10" />

            <div className="animate-marquee flex items-center gap-3">
              {[...MILESTONE_TAGS, ...MILESTONE_TAGS].map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-[#123628] text-[#A5D6B6] border border-[#1b4e3a] whitespace-nowrap shadow-xs hover:border-[#A5D6B6]/60 transition-colors shrink-0"
                >
                  • {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 6-Card Milestone Collage: Real Standard Frames from /studio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MILESTONES.map((item) => {
              const frame =
                FRAME_CATALOG.find((f) => f.id === item.frameId) ?? FRAME_CATALOG[0]

              return (
                <div
                  key={item.title}
                  onClick={() => handleMilestoneFrameClick(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#123628] border border-white/10 shadow-xl transition-all duration-300 hover:border-[#A5D6B6]/60 hover:-translate-y-1.5 flex flex-col cursor-pointer"
                  title={`Customize ${item.title} with ${frame.name} in Studio`}
                >
                  {/* Photo container styled with real standard frame moulding from /studio */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-black/40 p-4 flex items-center justify-center">
                    {/* 3D Standard Frame Moulding with authentic texture gradient, bevel & shadow */}
                    <div
                      className="relative w-full h-full rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: frame.textureGradient || frame.color,
                        padding: "10px",
                        boxShadow: frame.boxShadowCss || "0 12px 28px rgba(0,0,0,0.65)",
                        border: frame.borderCss || "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {/* Corner 45-deg bevel mitre highlight */}
                      <div className="absolute inset-0 pointer-events-none rounded-lg border border-white/20" />

                      {/* Archival Matboard with inner shadow */}
                      <div className="relative w-full h-full rounded-xs bg-[#FAF7F2] p-2 flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] overflow-hidden">
                        {/* High-res Photo */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Occasion Tag */}
                    <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-sm z-10">
                      {item.tag}
                    </span>

                    {/* Open in Studio Hover Hint */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-[#A5D6B6] text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                      <span>Customize in Studio</span>
                      <ArrowRight className="w-3 h-3 text-[#FA6446]" />
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="p-4 flex items-center justify-between border-t border-white/10 bg-[#0e2c20]">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold text-[#FAF7F2] group-hover:text-[#A5D6B6] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#A5D6B6] font-mono flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: frame.color }}
                        />
                        <span>Moulding: {frame.name}</span>
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-[#1b4e3a] text-[#A5D6B6] flex items-center justify-center group-hover:bg-[#FA6446] group-hover:text-white transition-colors shrink-0 ml-2"
                      title={`Customize with ${frame.name}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE 16:9 ATELIER EXPERIENCE - Warm Linen                       */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#FAF7F2] text-[#0B2118] border-t border-[#0B2118]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Top Headline */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#0B2118]/15 pb-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FA6446] font-mono">
                The Atelier Experience
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#0B2118]">
                From camera roll to premium décor.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Key Pillars */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading text-2xl sm:text-3xl font-medium text-[#0B2118]">
                  Confidence before checkout.
                </h3>
                <p className="text-sm text-[#0B2118]/70 leading-relaxed">
                  Eliminate framing guesswork. See your picture true-to-scale on curated designer walls with real-time moulding mitres, bevelled mats, and authentic ambient reflections before you order.
                </p>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3">
                {[
                  {
                    step: "SIMPLE UPLOAD",
                    detail: "Upload high-resolution camera roll, drone, or professional portrait files.",
                  },
                  {
                    step: "AUTOMATIC SCALE & FIT",
                    detail: "Auto-adjusts aspect ratios and centers composition with custom mat borders.",
                  },
                  {
                    step: "CURATED MATERIALS",
                    detail: "Solid oak, smoked walnut, architectural brass, or gilded vintage baroque.",
                  },
                  {
                    step: "PREVIEW ON YOUR WALL",
                    detail: "Drag anywhere across 16:9 room settings with red crosshair guides.",
                  },
                  {
                    step: "TURNKEY HOME ARRIVAL",
                    detail: "Flat rate of ₹240 with pre-installed wire and heavy-duty cleat brackets.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-3.5 rounded-xl border border-[#0B2118]/10 bg-white/70 shadow-2xs flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#FA6446] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2118] font-mono">
                        {item.step}
                      </h4>
                      <p className="text-xs text-[#0B2118]/70 mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  onClick={onOpenStudio}
                  size="lg"
                  className="w-full sm:w-auto bg-[#0B2118] text-[#FAF7F2] hover:bg-[#123628] rounded-xl px-7 py-5 text-sm font-semibold shadow-md cursor-pointer"
                >
                  Launch 16:9 Wall Simulator
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Column: High-fidelity Device Studio Mockup */}
            <div className="lg:col-span-7 relative">
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0B2118] text-[#FAF7F2] shadow-2xl border border-white/10 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FA6446]" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#A5D6B6]" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-stone-500" />
                    <span className="text-[11px] sm:text-xs font-mono font-bold ml-1.5 sm:ml-2 text-white/80">
                      ART FRAME STUDIO 16:9
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#A5D6B6]">
                    LIVE ENGINE
                  </span>
                </div>

                {/* Simulated Wall Canvas View */}
                <div className="relative aspect-16/9 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 border border-white/10 flex items-center justify-center shadow-inner group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85"
                    alt="Living Room Simulator Wall"
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-500"
                  />
                  {/* Floating Frame: Uses proportional h-[72%] aspect-square so it never clips on phone screens */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[72%] aspect-square rounded-md sm:rounded-lg shadow-[0_14px_34px_rgba(0,0,0,0.8)] border-4 sm:border-8 border-[#c89d6b] bg-[#FAF7F2] p-1.5 sm:p-2.5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=85"
                      alt="Centered Artwork"
                      className="w-full h-full object-cover shadow-inner rounded-2xs"
                    />
                  </div>
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20">
                    Natural Oak • 2.5&quot; Mat
                  </div>
                </div>

                {/* Bottom Mock Controls */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[9px] sm:text-[10px] font-mono text-white/50 block">Moulding</span>
                    <span className="text-[11px] sm:text-xs font-bold text-[#A5D6B6] truncate block">Solid Oak</span>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[9px] sm:text-[10px] font-mono text-white/50 block">Price</span>
                    <span className="text-[11px] sm:text-xs font-bold text-[#FA6446] truncate block">₹240 Flat</span>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[9px] sm:text-[10px] font-mono text-white/50 block">Scale</span>
                    <span className="text-[11px] sm:text-xs font-bold text-white truncate block">16:9 Living Room</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: HOW IT WORKS - Deep Forest Green                               */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0B2118] text-[#FAF7F2] border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A5D6B6] font-mono">
                How It Works
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#FAF7F2]">
                Custom framing made remarkably simple.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60">
              Five effortless steps from camera roll to turnkey delivery.
            </p>
          </div>

          {/* 5 Sequential Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${step.isHighlight
                    ? "bg-[#FA6446] text-white border-[#FA6446] shadow-xl hover:bg-[#e85336]"
                    : "bg-[#123628] text-[#FAF7F2] border-white/10 hover:border-[#A5D6B6]/50 shadow-md"
                  }`}
              >
                <div className="space-y-3">
                  <span
                    className={`font-mono text-2xl font-bold block ${step.isHighlight ? "text-white" : "text-[#A5D6B6]"
                      }`}
                  >
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-base leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p
                  className={`text-xs leading-relaxed ${step.isHighlight ? "text-white/90" : "text-white/70"
                    }`}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mouldings Slot */}
      {featuredFramesSlot}

      {/* ========================================================================= */}
      {/* SECTION 5: TRANSPARENT VALUE & PRICING - Warm Linen Cream                 */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-24 px-4 sm:px-8 bg-[#FAF7F2] text-[#0B2118] border-t border-[#0B2118]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#0B2118]/15 pb-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FA6446] font-mono">
                Transparent Value
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#0B2118]">
                Museum-grade quality. No retail markups.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#0B2118]/60 font-mono">
              Honest flat-rate pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-base text-[#0B2118]/80 leading-relaxed">
                Traditional framing shops charge excessive markups and hide pricing behind consultation counters.
                We craft every frame directly in our atelier with premium materials, passing all savings directly to you.
              </p>
              <div className="p-6 rounded-2xl bg-white border border-[#0B2118]/10 shadow-sm space-y-3">
                <span className="text-[11px] font-mono text-[#FA6446] uppercase font-bold tracking-wider">
                  The Honest Promise
                </span>
                <h3 className="font-heading text-3xl font-bold text-[#0B2118]">
                  ₹240 Flat Rate
                </h3>
                <p className="text-xs text-[#0B2118]/70">
                  Every signature hardwood or metal moulding, 4-ply acid-free archival matboard, optical UV glazing, and hanging hardware included.
                </p>
              </div>
            </div>

            {/* Economics Visual Card */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0B2118] text-[#FAF7F2] shadow-xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#A5D6B6] font-bold">
                    All-Inclusive Craftsmanship
                  </h4>
                  <span className="text-[11px] font-mono text-white/50">Zero Hidden Fees</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-mono text-white/60">Fixed Rate</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#FA6446] font-mono">₹240</div>
                    <span className="text-[10px] text-white/40 block">Any style</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-mono text-white/60">Materials</span>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">100%</div>
                    <span className="text-[10px] text-white/40 block">Solid wood &amp; metal</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-mono text-white/60">Hardware</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#A5D6B6] font-mono">Included</div>
                    <span className="text-[10px] text-white/40 block">Ready to hang</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Button
                    onClick={onUploadClick}
                    className="bg-[#FA6446] text-white hover:bg-[#e85336] rounded-xl px-6 py-5 text-sm font-semibold shadow-md cursor-pointer"
                  >
                    Start Your Custom Frame
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CURATED COLLECTIONS - Deep Forest Noir                         */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#071711] text-[#FAF7F2] border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FA6446] font-mono">
                Curated Collections
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#FAF7F2]">
                Thoughtfully crafted for every interior.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60">
              Timeless profiles designed to elevate any wall aesthetic.
            </p>
          </div>

          {/* 5 Expansion Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CURATED_COLLECTIONS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-[#0f281f] border border-white/10 hover:border-[#FA6446]/60 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1b4434] text-[#A5D6B6] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#FAF7F2] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: FINAL CALL TO ACTION - Deep Green & Coral Highlight            */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0B2118] text-[#FAF7F2] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FA6446] font-mono bg-[#FA6446]/10 px-4 py-1.5 rounded-full inline-block border border-[#FA6446]/20">
            Bring Your Walls To Life
          </span>

          <h2 className="font-heading text-3xl sm:text-6xl font-medium tracking-tight text-[#FAF7F2] leading-[1.15]">
            Preserve your memories <br /> beautifully.
          </h2>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Turn your digital camera roll into heirloom framed art. Preview on realistic room walls
            with accurate scale and ambient lighting, crafted with conservation hardwoods at a flat ₹240 rate.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onUploadClick}
              className="w-full sm:w-auto bg-[#FA6446] text-white hover:bg-[#e85336] rounded-xl px-8 py-6 text-sm font-semibold shadow-xl cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo &amp; Customize
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onOpenStudio}
              className="w-full sm:w-auto border-white/20 text-[#FAF7F2] hover:bg-white/10 rounded-xl px-8 py-6 text-sm font-semibold cursor-pointer"
            >
              Open 16:9 Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

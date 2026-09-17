"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    id: "visualizer",
    question: "How does the 16:9 on-wall visualizer work?",
    answer:
      "Our visualizer creates a photorealistic 16:9 room simulation in your browser. You can upload any image, test 15 handcrafted frame styles across square, portrait, and landscape ratios, experiment with 12+ wall paints, drag to position the frame with magnetic center crosshairs, and zoom between 5% and 200%.",
  },
  {
    id: "quantity",
    question: "Can I order multiple copies of the same bespoke frame?",
    answer:
      "Yes! Both the Studio bottom bar and the Quote inquiry form support quick quantity selection (1, 2, 5, 10, or custom). Our transparent pricing calculates dynamically at flat ₹240 per frame (e.g. 5 frames = ₹1,200, 10 frames = ₹2,400) with zero hidden labor markups.",
  },
  {
    id: "materials",
    question: "What conservation materials are used in fabrication?",
    answer:
      "Every frame is built to museum archival standards: solid kiln-dried timber mouldings with 45° mitres, 100% alpha-cellulose acid-free 4-ply matboards, optical-grade UV-filtering conservation acrylic glazing, acid-free backing board, and pre-installed stainless steel hanging hardware.",
  },
  {
    id: "quote-process",
    question: "How does the 'Ask for Quote' and WhatsApp submission work?",
    answer:
      "Once you finish customizing your frame in the studio, click 'Ask for Quote'. Your frame name, orientation, aspect ratio, artwork size, quantity, and total are pre-filled automatically. You can submit directly to our atelier (synced to our Google Form database) or send a formatted 1-click message directly via WhatsApp.",
  },
  {
    id: "delivery",
    question: "What is the turnaround time and packaging guarantee?",
    answer:
      "Custom fabrication takes 3 to 5 business days in our atelier. Every framed piece is wrapped in acid-free tissue, fitted with corner edge protectors, and secured inside double-walled corrugated shipping crates for safe, damage-free delivery anywhere in India.",
  },
]

export function LandingFaq(): React.JSX.Element {
  return (
    <section id="faq" className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-card/40">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about our handcrafted framing process, online simulation, and transparent pricing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="rounded-2xl border border-border/80 bg-card/90 p-4 sm:p-6 shadow-sm">
          <Accordion className="space-y-2">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/60 py-1">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary transition-colors py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

import {
  ArtworkConfig,
  FabricationQuote,
  FrameStyle,
  GlazingType,
  HangingHardware,
  MatConfig,
} from "@/types"
import { GLAZING_OPTIONS, HARDWARE_OPTIONS } from "@/db/frames"

export function calculateFabricationQuote(
  artwork: ArtworkConfig,
  frame: FrameStyle,
  mouldingWidthInches: number,
  mat: MatConfig,
  glazingId: GlazingType,
  hardwareId: HangingHardware,
  quantity: number = 1
): FabricationQuote {
  // Dimensions
  const artWidth = artwork.originalWidthInches
  const artHeight = artwork.originalHeightInches

  const matBorder = mat.enabled ? mat.widthInches : 0
  const doubleMatExtra = mat.enabled && mat.isDoubleMat ? (mat.accentWidthInches ?? 0.25) : 0
  const totalMatPerSide = matBorder + doubleMatExtra

  const insideFrameWidth = artWidth + 2 * totalMatPerSide
  const insideFrameHeight = artHeight + 2 * totalMatPerSide

  const totalWidth = insideFrameWidth + 2 * mouldingWidthInches
  const totalHeight = insideFrameHeight + 2 * mouldingWidthInches

  // Perimeter in feet
  const framePerimeterFeet = (2 * (totalWidth + totalHeight)) / 12

  // Transparent Pricing: matches the visible fixed price on website (₹240 per frame)
  const safeQuantity = Math.max(1, Math.floor(quantity || 1))
  const unitPrice = frame.price ?? 240
  const frameCost = unitPrice * safeQuantity

  // Mat, glazing, assembly, and hardware are all included in the ₹240 fixed artisan package
  const matCost = 0
  const glazingCost = 0
  const hardwareCost = 0
  const laborAndAssemblyCost = 0

  const subtotal = frameCost
  const tax = 0 // Inclusive of taxes
  const total = subtotal

  return {
    artWidthInches: artWidth,
    artHeightInches: artHeight,
    frameWidthInches: mouldingWidthInches,
    totalWidthInches: Math.round(totalWidth * 10) / 10,
    totalHeightInches: Math.round(totalHeight * 10) / 10,
    framePerimeterFeet: Math.round(framePerimeterFeet * 10) / 10,
    frameCost,
    matCost,
    glazingCost,
    hardwareCost,
    laborAndAssemblyCost,
    subtotal,
    tax,
    total,
    quantity: safeQuantity,
    unitPrice,
  }
}

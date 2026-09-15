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
  hardwareId: HangingHardware
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

  // Costs
  const frameCost = Math.round(framePerimeterFeet * frame.pricePerFoot)

  // Area in square feet for mat & glass
  const areaSquareFeet = (insideFrameWidth * insideFrameHeight) / 144

  let matCost = 0
  if (mat.enabled) {
    const baseMatRate = 250 // ₹ per sq ft
    matCost = Math.round(areaSquareFeet * baseMatRate * (mat.isDoubleMat ? 1.6 : 1.0))
  }

  const selectedGlazing = GLAZING_OPTIONS.find((g) => g.id === glazingId) ?? GLAZING_OPTIONS[0]
  const baseGlazingRate = 350 // ₹ per sq ft
  const glazingCost = Math.round(areaSquareFeet * baseGlazingRate * selectedGlazing.priceMultiplier)

  const selectedHardware = HARDWARE_OPTIONS.find((h) => h.id === hardwareId) ?? HARDWARE_OPTIONS[0]
  const hardwareCost = selectedHardware.price * 50

  const laborAndAssemblyCost = 650 // Professional conservation assembly & dust cover backing

  const subtotal = frameCost + matCost + glazingCost + hardwareCost + laborAndAssemblyCost
  const tax = Math.round(subtotal * 0.12)
  const total = subtotal + tax

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
  }
}

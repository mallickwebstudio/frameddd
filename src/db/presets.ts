import { MatColor, WallBackground } from "@/types"

export const MAT_COLORS: MatColor[] = [
  {
    id: "off-white",
    name: "Archival Off-White",
    hex: "#f7f6f2",
    coreColor: "#ffffff",
  },
  {
    id: "bright-white",
    name: "Crisp Pure White",
    hex: "#ffffff",
    coreColor: "#ffffff",
  },
  {
    id: "warm-cream",
    name: "Warm Gallery Ivory",
    hex: "#ede7dc",
    coreColor: "#fbf8f2",
  },
  {
    id: "charcoal-black",
    name: "Midnight Black Core",
    hex: "#222326",
    coreColor: "#ffffff",
  },
  {
    id: "sandstone",
    name: "Natural Sandstone",
    hex: "#d9d0c1",
    coreColor: "#ffffff",
  },
  {
    id: "sage-botanical",
    name: "Botanical Sage",
    hex: "#9aa394",
    coreColor: "#ffffff",
  },
  {
    id: "navy-indigo",
    name: "Deep Gallery Indigo",
    hex: "#263242",
    coreColor: "#ffffff",
  },
  {
    id: "linen-textured",
    name: "French Flax Linen",
    hex: "#dfd7cb",
    coreColor: "#f7f3ee",
  },
]

export interface WallColorSwatch {
  id: string
  name: string
  hex: string
  category: "neutral" | "warm" | "moody" | "bold"
}

export const WALL_COLOR_SWATCHES: WallColorSwatch[] = [
  { id: "chalk-white", name: "Chalk White", hex: "#f8f9fa", category: "neutral" },
  { id: "alabaster", name: "Warm Alabaster", hex: "#f3efe6", category: "neutral" },
  { id: "soft-greige", name: "Limewash Greige", hex: "#ded9d0", category: "neutral" },
  { id: "down-pipe", name: "Down Pipe Charcoal", hex: "#3f464b", category: "moody" },
  { id: "studio-slate", name: "Architectural Slate", hex: "#2b3036", category: "moody" },
  { id: "sage-olive", name: "Heritage Sage Olive", hex: "#7a8775", category: "warm" },
  { id: "terracotta-clay", name: "Tuscan Terracotta", hex: "#b4644a", category: "warm" },
  { id: "deep-navy", name: "Midnight Gallery Navy", hex: "#1c2636", category: "moody" },
  { id: "mustard-ochre", name: "Warm Amber Ochre", hex: "#b89052", category: "bold" },
  { id: "emerald-reserve", name: "Velvet Emerald", hex: "#1f3b30", category: "bold" },
]

export const WALL_PRESETS: WallBackground[] = [
  {
    type: "preset",
    name: "Modern Minimalist Living Room",
    category: "Living Spaces",
    value: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Curated Art Gallery Hall",
    category: "Exhibition",
    value: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2000&q=80",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Loft Exposed Brick Wall",
    category: "Industrial",
    value: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80",
    brightness: 0.95,
  },
  {
    type: "preset",
    name: "Warm Japandi Wood & Linen",
    category: "Bedroom & Studio",
    value: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80",
    brightness: 1.05,
  },
  {
    type: "preset",
    name: "Contemporary Studio Credenza",
    category: "Living Spaces",
    value: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=80",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Moody Dark Oak Accent Wall",
    category: "Atmospheric",
    value: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=80",
    brightness: 0.9,
  },
]

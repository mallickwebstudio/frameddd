import { ArtworkConfig } from "@/types"

export const SAMPLE_ARTWORKS: ArtworkConfig[] = [
  {
    id: "coastal-fog-minimalist",
    title: "Misty Pacific Coastline",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    aspectRatio: 1.5, // 3:2 landscape
    originalWidthInches: 24,
    originalHeightInches: 16,
    rotation: 0,
  },
  {
    id: "architectural-shadows",
    title: "Monochrome Bauhaus Geometry",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    aspectRatio: 0.8, // 4:5 portrait
    originalWidthInches: 16,
    originalHeightInches: 20,
    rotation: 0,
  },
  {
    id: "botanical-eucalyptus",
    title: "Botanical Olive & Eucalyptus",
    src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=85",
    aspectRatio: 0.75, // 3:4 portrait
    originalWidthInches: 18,
    originalHeightInches: 24,
    rotation: 0,
  },
  {
    id: "abstract-expressionist-ochre",
    title: "Terracotta & Ochre Abstraction",
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85",
    aspectRatio: 1.0, // 1:1 square
    originalWidthInches: 20,
    originalHeightInches: 20,
    rotation: 0,
  },
]

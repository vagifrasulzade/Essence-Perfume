// API Product Types (from backend)
export interface ApiProductImage {
  id: number;
  url: string;
  publicId?: string | null;
  sort: number;
}

export interface ApiProductVolume {
  id: number;
  size: number;
  price: number;
  stock: number;
}

export interface ApiProductNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ApiProduct {
  id: number;
  name: string;
  brand: string;
  description?: string;
  gender: "men" | "women" | "kid";
  reviews: number;
  rating: number;
  featured: boolean;
  images: ApiProductImage[];
  volumes: ApiProductVolume[];
  // Notes from API (top, heart, base as arrays)
  top?: string[];
  heart?: string[];
  base?: string[];
  // For backward compatibility, also support notes object
  notes?: ApiProductNotes;
}

// Local Product Type (for frontend-only usage)
export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price?: number;
  gender: string;
  reviews: number;
  rating: number;
  featured: boolean;
  images: string[];
  volumes: { size: number; price: number; stock: number }[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  }
}

// Helper function to convert ApiProduct to Product
export function convertApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    brand: apiProduct.brand,
    description: apiProduct.description || "",
    gender: apiProduct.gender,
    reviews: apiProduct.reviews,
    rating: apiProduct.rating,
    featured: apiProduct.featured,
    images: apiProduct.images.map(img => img.url),
    volumes: apiProduct.volumes.map(vol => ({
      size: vol.size,
      price: vol.price,
      stock: vol.stock,
    })),
    notes: {
      top: apiProduct.top || apiProduct.notes?.top || [],
      heart: apiProduct.heart || apiProduct.notes?.heart || [],
      base: apiProduct.base || apiProduct.notes?.base || [],
    },
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Rose Noir",
    brand: "Dior",
    description: "A dark and mysterious floral fragrance.",
    gender: "women",
    reviews: 520,
    rating: 4.5,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 45 , stock: 8},
      { size: 50, price: 65 , stock: 1},
      { size: 100, price: 110 , stock: 12},
      { size: 200, price: 190 , stock: 0},
    ],
    notes: {
      top: ["Turkish Rose", "Pink Pepper", "Bergamot"],
      heart: ["Bulgarian Rose Absolute", "Oud", "Amber"],
      base: ["Musk", "Madagascar Vanilla", "Sandalwood"]
    }
  },
  {
    id: "2",
    name: "Velvet Oud",
    brand: "Tom Ford",
    description: "A rich and warm oriental fragrance.",
    gender: "men",
    reviews: 320,
    rating: 4.2,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 55 , stock: 15},
      { size: 50, price: 78 , stock: 9},
      { size: 100, price: 130, stock: 6 },
      { size: 200, price: 225, stock: 3 },
    ],
    notes: {
      top: ["Turkish Rose", "Pink Pepper", "Bergamot"],
      heart: ["Bulgarian Rose Absolute", "Oud", "Amber"],
      base: ["Musk", "Madagascar Vanilla", "Sandalwood"]
    }
  },
  {
    id: "3",
    name: "Jasmine Dream",
    brand: "Chanel",
    description: "An elegant jasmine and vanilla blend for women.",
    gender: "women",
    reviews: 480,
    rating: 4.7,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 50 , stock: 5},
      { size: 50, price: 72 , stock: 0},
      { size: 100, price: 120 , stock: 7},
      { size: 200, price: 200 , stock: 0},
    ],
    notes: {
      top: ["Bergamot", "Lemon", "Pink Pepper"],
      heart: ["Jasmine Sambac", "Tuberose", "Violet"],
      base: ["Vanilla", "Sandalwood", "Musk"]
    }
  },
  {
    id: "4",
    name: "Ocean Breeze",
    brand: "Acqua di Parma",
    description: "Fresh and crisp cologne for men.",
    gender: "men",
    reviews: 410,
    rating: 4.6,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 52 , stock: 11},
      { size: 50, price: 75 , stock: 10},
      { size: 100, price: 125 , stock: 8},
      { size: 200, price: 210 , stock: 4},
    ],
    notes: {
      top: ["Lemon", "Orange", "Neroli"],
      heart: ["Lavender", "Rosemary", "Geranium"],
      base: ["Cedar", "Sandalwood", "Vetiver"]
    }
  },
  {
    id: "5",
    name: "Cherry Blossom",
    brand: "MAC",
    description: "Delicate cherry and almond for kids.",
    gender: "kid",
    reviews: 290,
    rating: 4.4,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 35, stock: 5 },
      { size: 50, price: 50, stock: 2 },
      { size: 100, price: 85, stock: 0 },
      { size: 200, price: 145, stock: 0 },
    ],
    notes: {
      top: ["Cherry", "Peach", "Raspberry"],
      heart: ["Almond", "Vanilla", "Rose"],
      base: ["Musk", "Sandalwood"]
    }
  },
  {
    id: "6",
    name: "Midnight Leather",
    brand: "Versace",
    description: "Bold and sophisticated leather cologne.",
    price: 98,
    gender: "men",
    reviews: 350,
    rating: 4.5,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 50, price: 85, stock: 14 },
      { size: 100, price: 145, stock: 9 },
      { size: 200, price: 240, stock: 2 },
    ],
    notes: {
      top: ["Black Pepper", "Ginger", "Lemon"],
      heart: ["Leather Accord", "Iris", "Lily"],
      base: ["Vetiver", "Cedar", "Patchouli"]
    }
  },
  {
    id: "7",
    name: "Blossom Garden",
    brand: "Burberry",
    description: "Floral garden scent for women.",
    price: 85,
    gender: "women",
    reviews: 440,
    rating: 4.6,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
      "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      "/assets/perfume/perfume-bottle-close-up.jpg"
    ],
    volumes: [
      { size: 30, price: 48, stock: 10 },
      { size: 50, price: 68, stock: 10 },
      { size: 100, price: 115, stock: 10 },
      { size: 200, price: 195, stock: 10 },
    ],
    notes: {
      top: ["Bergamot", "Green Apple", "Pear"],
      heart: ["Peony", "Freesia", "Rose"],
      base: ["Musk", "Cedar", "Sandalwood"]
    }
  }
]
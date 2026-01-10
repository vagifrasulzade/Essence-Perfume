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
  discountPercentage?: number;
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
  discountPercentage?: number;
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
    discountPercentage: apiProduct.discountPercentage || 0,
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

// Helper function to calculate price with discount
export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  if (discountPercentage <= 0) return originalPrice
  if (discountPercentage >= 100) return 0
  return originalPrice * (1 - discountPercentage / 100)
}
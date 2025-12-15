import type { ApiProduct } from "./products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Pagination response types
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// API Response types
export interface ApiResponse<T> {
  message?: string;
  product?: T;
  data?: T;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    // Handle different error response formats
    let errorMessage = "Request failed";
    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.join(", ");
    } else if (errorData.error) {
      errorMessage = typeof errorData.error === "string" 
        ? errorData.error 
        : JSON.stringify(errorData.error);
    } else if (Array.isArray(errorData)) {
      errorMessage = errorData.join(", ");
    } else if (typeof errorData === "string") {
      errorMessage = errorData;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
};

// Product Create/Update DTO types
export interface ProductCreateDTO {
  name: string;
  brand: string;
  description?: string;
  gender: "men" | "women" | "kid";
  reviews: number;
  rating: number;
  featured: boolean;
  top: string[];
  heart: string[];
  base: string[];
  images: Array<{
    url: string;
    publicId?: string | null;
    sort: number;
  }>;
  volumes: Array<{
    size: number;
    price: number;
    stock: number;
  }>;
}

export interface ProductUpdateDTO {
  name: string;
  brand: string;
  description?: string;
  gender: "men" | "women" | "kid";
  reviews: number;
  rating: number;
  featured: boolean;
  top: string[];
  heart: string[];
  base: string[];
  images: Array<{
    productId: number;
    url: string;
    publicId?: string | null;
    sort: number;
  }>;
  volumes: Array<{
    productId: number;
    size: number;
    price: number;
    stock: number;
  }>;
}

// Upload image response type
export interface ImageUploadResponse {
  url: string;
  publicId: string;
}

// Product API
export const productApi = {
  // Admin endpoints
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/admin/Product/upload-image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }

      const errorMessage = errorData.error || "Failed to upload image";
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    return response.json();
  },

  getAll: async (page: number = 1, pageSize: number = 10, search?: string): Promise<PaginationResponse<ApiProduct>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.append("search", search);
    
    return apiCall<PaginationResponse<ApiProduct>>(`/admin/Product/All?${params.toString()}`);
  },

  getById: async (id: number): Promise<ApiProduct> => {
    return apiCall<ApiProduct>(`/admin/Product/${id}`);
  },

  create: async (product: ProductCreateDTO): Promise<ApiResponse<ApiProduct>> => {
    return apiCall<ApiResponse<ApiProduct>>("/admin/Product/Add", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  update: async (id: number, product: ProductUpdateDTO): Promise<ApiResponse<ApiProduct>> => {
    return apiCall<ApiResponse<ApiProduct>>(`/admin/Product/${id}/update`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiCall<ApiResponse<void>>(`/admin/Product/${id}/delete`, {
      method: "DELETE",
    });
  },

  softDelete: async (id: number): Promise<ApiResponse<void>> => {
    return apiCall<ApiResponse<void>>(`/admin/Product/${id}/soft`, {
      method: "PATCH",
    });
  },

  recover: async (id: number): Promise<ApiResponse<void>> => {
    return apiCall<ApiResponse<void>>(`/admin/Product/${id}/recover`, {
      method: "PATCH",
    });
  },

  getFeaturedStatus: async (id: number): Promise<{ featured: boolean }> => {
    return apiCall<{ featured: boolean }>(`/admin/Product/${id}/featured`);
  },

  updateFeaturedStatus: async (id: number, featured: boolean): Promise<ApiResponse<{ featured: boolean }>> => {
    return apiCall<ApiResponse<{ featured: boolean }>>(`/admin/Product/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ featured }),
    });
  },

  // User endpoints
  getAllPublic: async (page: number = 1, pageSize: number = 10, search?: string): Promise<PaginationResponse<ApiProduct>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.append("search", search);
    
    return apiCall<PaginationResponse<ApiProduct>>(`/user/Product/All?${params.toString()}`);
  },

  getByIdPublic: async (id: number): Promise<ApiProduct> => {
    return apiCall<ApiProduct>(`/user/Product/${id}`);
  },
};

// Cart API Types
export interface CartItemDTO {
  productId: number;
  volume: number; // size in ml
  quantity: number;
}

export interface CartResponse {
  items: Array<{
    productId: number;
    product: ApiProduct;
    volume: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  itemCount: number;
}

// Cart API (using localStorage as fallback until backend is ready)
export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    // For now, return from localStorage
    // TODO: Replace with actual API call when backend is ready
    if (typeof window === "undefined") {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    const token = getAuthToken();
    if (!token) {
      return { items: [], total: 0, itemCount: 0 };
    }

    try {
      // Try API first
      return await apiCall<CartResponse>("/user/Cart");
    } catch {
      // Fallback to localStorage
      const userId = localStorage.getItem("currentUser");
      if (!userId) return { items: [], total: 0, itemCount: 0 };
      
      const saved = localStorage.getItem(`cart_${userId}`);
      if (!saved) return { items: [], total: 0, itemCount: 0 };
      
      const items = JSON.parse(saved);
      const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      return { items: [], total, itemCount };
    }
  },

  addItem: async (item: CartItemDTO): Promise<CartResponse | null> => {
    try {
      return await apiCall<CartResponse>("/user/Cart/Add", {
        method: "POST",
        body: JSON.stringify(item),
      });
    } catch (error) {
      // Return null to indicate API failed, context will handle fallback
      console.warn("Cart API not available, using localStorage fallback:", error);
      return null;
    }
  },

  removeItem: async (productId: number, volume: number): Promise<CartResponse | null> => {
    try {
      return await apiCall<CartResponse>(`/user/Cart/Remove?productId=${productId}&volume=${volume}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("Cart API not available, using localStorage fallback:", error);
      return null;
    }
  },

  updateQuantity: async (productId: number, volume: number, quantity: number): Promise<CartResponse | null> => {
    try {
      return await apiCall<CartResponse>("/user/Cart/Update", {
        method: "PUT",
        body: JSON.stringify({ productId, volume, quantity }),
      });
    } catch (error) {
      console.warn("Cart API not available, using localStorage fallback:", error);
      return null;
    }
  },

  clearCart: async (): Promise<boolean> => {
    try {
      await apiCall<void>("/user/Cart/Clear", {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.warn("Cart API not available, using localStorage fallback:", error);
      return false;
    }
  },
};

// Favorites API Types
export interface FavoritesResponse {
  productIds: number[];
}

// Favorites API (using localStorage as fallback until backend is ready)
export const favoritesApi = {
  getFavorites: async (): Promise<FavoritesResponse> => {
    try {
      return await apiCall<FavoritesResponse>("/user/Favorites");
    } catch (error) {
      // Fallback to localStorage
      console.warn("Favorites API not available, using localStorage fallback:", error);
      if (typeof window === "undefined") {
        return { productIds: [] };
      }
      
      const saved = localStorage.getItem("favorites");
      if (!saved) return { productIds: [] };
      
      try {
        const favorites = JSON.parse(saved);
        if (Array.isArray(favorites)) {
          // Convert string IDs to numbers
          const productIds = favorites.map((id: string) => parseInt(id, 10)).filter((id: number) => !isNaN(id));
          return { productIds };
        }
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
      
      return { productIds: [] };
    }
  },

  addFavorite: async (productId: number): Promise<FavoritesResponse | null> => {
    try {
      return await apiCall<FavoritesResponse>("/user/Favorites/Add", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.warn("Favorites API not available, using localStorage fallback:", error);
      return null;
    }
  },

  removeFavorite: async (productId: number): Promise<FavoritesResponse | null> => {
    try {
      return await apiCall<FavoritesResponse>(`/user/Favorites/Remove/${productId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("Favorites API not available, using localStorage fallback:", error);
      return null;
    }
  },

  toggleFavorite: async (productId: number): Promise<FavoritesResponse | null> => {
    try {
      return await apiCall<FavoritesResponse>("/user/Favorites/Toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.warn("Favorites API not available, using localStorage fallback:", error);
      return null;
    }
  },
};

// Order API Types
export interface OrderItemDTO {
  id: number;
  productId: number;
  name: string;
  brand: string;
  volume: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface OrderShippingDTO {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderDTO {
  id: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping: OrderShippingDTO;
  items: OrderItemDTO[];
}

export interface OrderCreateDTO {
  items: Array<{
    productId: number;
    volume: number; // ProductVolume Id
    quantity: number;
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderUpdateDTO {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface OrderShippingUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface OrderRequestDTO {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  userId?: number;
}

// Order API
export const orderApi = {
  // User endpoints
  create: async (order: OrderCreateDTO): Promise<OrderDTO> => {
    return apiCall<OrderDTO>("/user/orders/create", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  getUserOrders: async (): Promise<OrderDTO[]> => {
    return apiCall<OrderDTO[]>("/user/orders");
  },

  getUserOrderById: async (orderId: string): Promise<OrderDTO> => {
    return apiCall<OrderDTO>(`/user/orders/${orderId}`);
  },

  // Admin endpoints
  getAll: async (request: OrderRequestDTO): Promise<PaginationResponse<OrderDTO>> => {
    const params = new URLSearchParams({
      page: request.page.toString(),
      pageSize: request.pageSize.toString(),
    });
    if (request.search) params.append("search", request.search);
    if (request.status) params.append("status", request.status);
    if (request.userId) params.append("userId", request.userId.toString());
    
    return apiCall<PaginationResponse<OrderDTO>>(`/admin/orders/all?${params.toString()}`);
  },

  getById: async (orderId: string): Promise<OrderDTO> => {
    return apiCall<OrderDTO>(`/admin/orders/${orderId}`);
  },

  updateStatus: async (orderId: string, status: OrderUpdateDTO): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(status),
    });
  },

  updateShipping: async (orderId: string, shipping: OrderShippingUpdateDTO): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(`/admin/orders/${orderId}/shipping`, {
      method: "PUT",
      body: JSON.stringify(shipping),
    });
  },

  softDelete: async (orderId: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(`/admin/orders/${orderId}/soft`, {
      method: "PATCH",
    });
  },

  recover: async (orderId: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(`/admin/orders/${orderId}/recover`, {
      method: "PATCH",
    });
  },

  delete: async (orderId: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(`/admin/orders/${orderId}/delete`, {
      method: "DELETE",
    });
  },
};

// User API Types
export interface UpdateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
}

// User API
export const userApi = {
  update: async (userData: UpdateUserDTO): Promise<{ message: string; user: UserResponse }> => {
    return apiCall<{ message: string; user: UserResponse }>("/user/update", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (passwordData: ChangePasswordDTO): Promise<{ message: string }> => {
    return apiCall<{ message: string }>("/user/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    return apiCall<{ message: string }>("/user/Delete", {
      method: "DELETE",
    });
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    return apiCall<UserResponse>("/user/me");
  },
};



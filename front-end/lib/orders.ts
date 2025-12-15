export interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    id: string
    name: string
    brand: string
    volume: string
    price: number
    quantity: number
    image: string
  }[]
  shipping: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  total: number
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "1",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    date: "2024-01-15",
    status: "delivered",
    items: [
      {
        id: "1",
        name: "Midnight Rose",
        brand: "Essence",
        volume: "50ml",
        price: 89.99,
        quantity: 1,
        image: "/assets/perfume/elegant-rose-perfume-bottle.jpg",
      },
    ],
    shipping: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    total: 89.99,
  },
  {
    id: "ORD-002",
    userId: "2",
    customerName: "Michael Chen",
    customerEmail: "michael@example.com",
    date: "2024-01-16",
    status: "shipped",
    items: [
      {
        id: "3",
        name: "Velvet Oud",
        brand: "Luxe",
        volume: "30ml",
        price: 129.99,
        quantity: 2,
        image: "/assets/perfume/luxury-oud-perfume-bottle-gold.jpg",
      },
      {
        id: "5",
        name: "Noir Intense",
        brand: "Luxe",
        volume: "50ml",
        price: 99.99,
        quantity: 1,
        image: "/assets/perfume/black-luxury-perfume-bottle.jpg",
      },
    ],
    shipping: {
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    total: 359.97,
  },
  {
    id: "ORD-003",
    userId: "3",
    customerName: "Emma Wilson",
    customerEmail: "emma@example.com",
    date: "2024-01-17",
    status: "processing",
    items: [
      {
        id: "2",
        name: "Ocean Breeze",
        brand: "Aqua",
        volume: "100ml",
        price: 75.0,
        quantity: 1,
        image: "/assets/perfume/blue-aquatic-perfume-bottle.jpg",
      },
    ],
    shipping: {
      address: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    total: 75.0,
  },
  {
    id: "ORD-004",
    userId: "4",
    customerName: "James Brown",
    customerEmail: "james@example.com",
    date: "2024-01-18",
    status: "pending",
    items: [
      {
        id: "4",
        name: "Citrus Bloom",
        brand: "Essence",
        volume: "50ml",
        price: 65.0,
        quantity: 3,
        image: "/assets/perfume/citrus-perfume-bottle-yellow.jpg",
      },
    ],
    shipping: {
      address: "321 Elm St",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
    },
    total: 195.0,
  },
]

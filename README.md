# Essence - Luxury Perfume Shop

Full-stack e-commerce platform for luxury perfume sales with admin dashboard, user authentication, shopping cart, and order management.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Deployment](#deployment)

## 🎯 Overview

Essence is a modern, full-stack e-commerce application for selling luxury perfumes. It includes:

- **User Features**: Product browsing, shopping cart, favorites, order management, profile settings
- **Admin Features**: Product management, order management, customer messages, dashboard analytics
- **Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend

- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **Database**: SQL Server (LocalDB)
- **ORM**: Entity Framework Core 8.20
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **API Documentation**: Swagger/OpenAPI

## ✨ Features

### User Features

- ✅ User registration and authentication
- ✅ Product browsing with filters (gender, brand, price, rating)
- ✅ Product search functionality
- ✅ Shopping cart management
- ✅ Favorites/Wishlist
- ✅ Order placement and tracking
- ✅ User profile management
- ✅ Password change functionality
- ✅ Order history

### Admin Features

- ✅ Admin dashboard with statistics
- ✅ Product management (CRUD operations)
- ✅ Order management and status updates
- ✅ Customer message management
- ✅ User management
- ✅ Inventory management

### Technical Features

- ✅ JWT-based authentication
- ✅ Role-based access control (User/Admin)
- ✅ Input validation (FluentValidation)
- ✅ Error handling
- ✅ Responsive design
- ✅ Image upload support
- ✅ Pagination
- ✅ Search functionality

## 📁 Project Structure

```
Perfume Project/
├── front-end/                 # Next.js Frontend Application
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── account/          # User account pages
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout process
│   │   ├── login/            # Authentication pages
│   │   ├── product/          # Product pages
│   │   └── shop/             # Shop/Product listing
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── shop/            # Shop filters and components
│   │   └── ui/              # shadcn/ui components
│   ├── context/              # React Context providers
│   ├── lib/                  # Utilities and API client
│   ├── layout/               # Layout components
│   └── public/               # Static assets
│
└── back-end/                 # ASP.NET Core Backend
    └── Server/
        └── API/              # API Project
            ├── Controllers/   # API Controllers
            ├── Services/     # Business logic services
            ├── Models/       # Database models
            ├── DTOs/         # Data Transfer Objects
            ├── Validation/   # FluentValidation validators
            ├── Helpers/      # Helper classes
            ├── Mapper/       # AutoMapper profiles
            └── Data/         # DbContext
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **.NET SDK** 8.0
- **SQL Server** (LocalDB or SQL Server Express)
- **Visual Studio 2022** or **VS Code** with C# extension

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd back-end/Server/API
   ```

2. **Update connection string** in `appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "Perfume_DB": "Server=(localdb)\\MSSQLLocalDB;Database=PerfumeDB;Integrated Security=True;Trust Server Certificate=True;"
     }
   }
   ```

3. **Run database migrations:**

   ```bash
   dotnet ef database update
   ```

4. **Run the API:**

   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5000`
   Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd front-end
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Update API URL** in `lib/api.ts` if needed:

   ```typescript
   const API_BASE_URL =
     process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
   ```

4. **Run development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Default Admin Credentials

After running migrations, a default admin user is created:

- **Email**: `admin@gmail.com`
- **Password**: (Check DatabaseSeeder.cs for default password)

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/me` - Get current user info
- `PUT /api/user/update` - Update user profile
- `POST /api/user/change-password` - Change password
- `DELETE /api/user/Delete` - Delete user account

#### Admin Authentication

- `POST /api/admin/auth/login` - Admin login

### Product Endpoints

#### Public Endpoints

- `GET /api/user/Product/All` - Get all products (paginated)
- `GET /api/user/Product/{id}` - Get product by ID

#### Admin Endpoints

- `GET /api/admin/Product/All` - Get all products (admin)
- `GET /api/admin/Product/{id}` - Get product by ID
- `POST /api/admin/Product/Add` - Create new product
- `PUT /api/admin/Product/{id}/update` - Update product
- `DELETE /api/admin/Product/{id}/delete` - Delete product
- `PATCH /api/admin/Product/{id}/soft` - Soft delete product
- `PATCH /api/admin/Product/{id}/recover` - Recover soft-deleted product
- `GET /api/admin/Product/{id}/featured` - Get featured status
- `PATCH /api/admin/Product/{id}/featured` - Update featured status

### Order Endpoints

#### User Endpoints

- `POST /api/user/orders/create` - Create new order
- `GET /api/user/orders` - Get user orders
- `GET /api/user/orders/{orderId}` - Get order by ID

#### Admin Endpoints

- `GET /api/admin/orders/all` - Get all orders (paginated, filtered)
- `GET /api/admin/orders/{orderId}` - Get order by ID
- `PUT /api/admin/orders/{orderId}/status` - Update order status
- `PUT /api/admin/orders/{orderId}/shipping` - Update shipping info
- `DELETE /api/admin/orders/{orderId}/delete` - Delete order
- `PATCH /api/admin/orders/{orderId}/soft` - Soft delete order
- `PATCH /api/admin/orders/{orderId}/recover` - Recover order

### Cart Endpoints

- `GET /api/user/Cart` - Get user cart
- `POST /api/user/Cart/Add` - Add item to cart
- `PUT /api/user/Cart/Update` - Update cart item quantity
- `DELETE /api/user/Cart/Remove` - Remove item from cart
- `DELETE /api/user/Cart/Clear` - Clear cart

### Favorites Endpoints

- `GET /api/user/Favorites` - Get user favorites
- `POST /api/user/Favorites/Add` - Add to favorites
- `DELETE /api/user/Favorites/Remove/{productId}` - Remove from favorites
- `POST /api/user/Favorites/Toggle` - Toggle favorite status

### Contact Endpoints

#### Public

- `POST /api/contact-messages` - Submit contact message

#### Admin

- `GET /api/admin/contact-messages/all` - Get all messages (paginated)
- `GET /api/admin/contact-messages/{id}` - Get message by ID
- `PATCH /api/admin/contact-messages/{id}/soft` - Soft delete message
- `PATCH /api/admin/contact-messages/{id}/recover` - Recover message

## 🎨 Frontend Pages

### Public Pages

- `/` - Home page
- `/shop` - Product listing with filters
- `/product` - All products page
- `/product/[id]` - Product detail page
- `/about` - About page
- `/contact` - Contact page
- `/service` - Service page
- `/shipping` - Shipping information
- `/returns` - Returns policy

### Authentication Pages

- `/login` - User login
- `/register` - User registration
- `/changepassword` - Change password

### User Pages

- `/account` - User profile
- `/account/orders` - Order history
- `/account/orders/[id]` - Order details
- `/account/settings` - Account settings
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/order-success` - Order confirmation
- `/favorites` - Favorites/Wishlist
- `/track-order` - Track order status

### Admin Pages

- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/add` - Add new product
- `/admin/products/edit/[id]` - Edit product
- `/admin/orders` - Order management
- `/admin/orders/[id]` - Order details
- `/admin/messages` - Customer messages

## 🗄 Database Schema

### Main Entities

#### User

- Id, Email, FirstName, LastName, PasswordHash
- Phone, Address, City, State, ZipCode, Country
- Role (User/Admin)
- CreatedAt, UpdatedAt, DeletedAt

#### Product

- Id, Name, Brand, Description
- Gender (Men/Women/Kid)
- Rating, Reviews, Featured
- CreatedAt, UpdatedAt, DeletedAt

#### ProductImage

- Id, ProductId, Url, PublicId, Sort

#### ProductVolume

- Id, ProductId, Size (ml), Price, Stock

#### ProductNotes

- Id, ProductId, Top, Heart, Base (JSON arrays)

#### Order

- Id, UserId, CustomerName, CustomerEmail
- Date, Status, Total
- CreatedAt, UpdatedAt, DeletedAt

#### OrderItem

- Id, OrderId, ProductId, Name, Brand, Volume
- Price, Quantity, Subtotal, Image

#### OrderShipping

- Id, OrderId, Address, City, State, Zip, Country

#### Cart

- Id, UserId, ProductId, Volume, Quantity

#### Favorite

- Id, UserId, ProductId

#### ContactMessage

- Id, FullName, Email, Phone, Subject, Message
- Date, IsDeleted

## 🔐 Authentication

### JWT Token Structure

- **Secret Key**: Configured in `appsettings.json`
- **Issuer**: `http://localhost:5000`
- **Audience**: `http://localhost:5000`
- **Expiration**: 60 minutes (configurable)

### Password Requirements

- Minimum 8 characters
- Must start with uppercase letter
- Must contain at least one digit
- Maximum 150 characters

### Role-Based Access

- **User Role**: Access to user endpoints and pages
- **Admin Role**: Access to admin endpoints and dashboard

### Protected Routes

- Frontend routes are protected using `useAuth` hook
- Admin routes check for `isAdmin` flag
- API endpoints use `[Authorize]` attribute

## 🚢 Deployment

### Backend Deployment

1. Update `appsettings.json` with production connection string
2. Run migrations on production database
3. Configure CORS for production frontend URL
4. Set environment variables for JWT secret
5. Deploy to Azure App Service, AWS, or preferred hosting

### Frontend Deployment

1. Set `NEXT_PUBLIC_API_URL` environment variable
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or preferred hosting

### Environment Variables

**Backend (.env or appsettings.json):**

```json
{
  "ConnectionStrings": {
    "Perfume_DB": "Production connection string"
  },
  "JwtSettings": {
    "Secret": "Production secret key",
    "Issuer": "Production URL",
    "Audience": "Production URL"
  }
}
```

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 📝 Development Notes

### Password Validation

- Current password validation only checks for not empty (format validation removed)
- New password must follow format rules (uppercase start, contains digit)

### Image Handling

- Product images are stored as URLs
- Support for external image URLs
- Image URL length validation (max 2000 characters)

### Error Handling

- Frontend: Error messages displayed in user-friendly format
- Backend: FluentValidation for input validation
- API errors return structured error responses

### State Management

- React Context API for global state (Auth, Cart, Favorites)
- Local state for component-specific data
- localStorage for persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- shadcn/ui for component library
- Radix UI for accessible components
- Next.js team for the amazing framework
- ASP.NET Core team for the robust backend framework

---

**Note**: This is a full-stack e-commerce application. Make sure both backend and frontend are running for full functionality.

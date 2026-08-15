

Absolutely. Since this is your **EasyBite** interview project, I'd keep the README professional and technical without making it sound like an over-engineered production system.

## `README.md`

````md
# EasyBite 🍔

EasyBite is a full-stack restaurant ordering application built with **React Native + Expo** and a **Go backend**.

The project focuses on implementing a realistic food-ordering workflow with authentication, role-based access, cart management, order tracking, restaurant administration, and persistent data.

## Features

### Customer
- User registration and login
- JWT-based authentication
- Browse restaurant menu by category
- View individual food details
- Add food directly to cart
- Update item quantities
- Remove items from cart
- Persistent cart
- Checkout
- Cash on Delivery order placement
- View previous orders
- Track order status
- Pull-to-refresh order status
- Profile and logout

### Restaurant Admin
- Role-based admin access
- View all restaurant orders
- View customer/order information
- Update order status
- Manage order workflow:
  - PLACED
  - CONFIRMED
  - PREPARING
  - READY
  - COMPLETED
  - CANCELLED

## Tech Stack

### Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- React Context API
- AsyncStorage
- Expo SecureStore

### Backend

- Go
- Gin
- GORM
- PostgreSQL
- JWT Authentication
- REST API

### Deployment

- Render for backend deployment
- Expo / EAS for Android builds

## Architecture

```text
                    ┌─────────────────────┐
                    │   React Native App  │
                    │      Expo Router    │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Go + Gin API    │
                    │                     │
                    │ Authentication      │
                    │ Orders              │
                    │ Menu                │
                    │ Admin               │
                    └──────────┬──────────┘
                               │
                              GORM
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    └─────────────────────┘
````

## Mobile Architecture

The mobile application uses Expo Router for file-based navigation.

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── orders.tsx
│   │   ├── cart.tsx
│   │   └── profile.tsx
│   │
│   ├── menu/
│   │   └── [id].tsx
│   │
│   ├── order/
│   │   └── [id].tsx
│   │
│   ├── checkout.tsx
│   └── admin/
│       └── orders.tsx
│
├── components/
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── services/
│   └── api.ts
│
└── constants/
```

### Navigation

```text
Authentication
    │
    ├── Login
    └── Register
          │
          ▼
       Main App
          │
    ┌─────┼──────────┐
    ▼     ▼          ▼
   Menu  Orders    Profile
    │
    └── Food Details
          │
          ▼
         Cart
          │
          ▼
       Checkout
          │
          ▼
      Order Status
```

Admin users can access the restaurant order management screen from the profile section.

## Authentication

Authentication uses JWT tokens.

```text
Login/Register
      ↓
Backend validates credentials
      ↓
JWT generated
      ↓
Token stored on device
      ↓
Token sent with API requests
      ↓
Backend middleware validates token
```

The JWT contains the user's role:

```text
CUSTOMER
ADMIN
```

Admin-only APIs are protected using role-based middleware.

## Cart

Cart state is managed using React Context.

The cart supports:

* Add item
* Increase quantity
* Decrease quantity
* Remove item
* Calculate subtotal
* Calculate item count
* Clear cart
* Persistent storage

Storage behavior:

```text
Android/iOS → Expo SecureStore
Web          → AsyncStorage
```

## Order Flow

```text
Browse Menu
    ↓
Add Items
    ↓
Cart
    ↓
Checkout
    ↓
Create Order
    ↓
PLACED
    ↓
CONFIRMED
    ↓
PREPARING
    ↓
READY
    ↓
COMPLETED
```

An order can also be cancelled.

Customers can manually refresh their order status using pull-to-refresh.

## Backend Structure

A typical backend structure is organized around:

```text
server/
├── handlers/
├── middleware/
├── models/
├── routes/
├── database/
├── migrations/
└── main.go
```

### Main API Areas

#### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

#### Menu

```text
GET /restaurants/:id/menu
GET /menu-items/:id
```

#### Customer Orders

```text
POST /orders
GET  /orders
GET  /orders/:id
```

#### Admin

```text
GET   /admin/orders
PATCH /admin/orders/:id/status
```

Admin endpoints are protected by authentication and admin-role middleware.

## Database

PostgreSQL is used as the primary database with GORM as the ORM.

Main entities include:

```text
User
Restaurant
Category
MenuItem
Order
OrderItem
```

Relationships allow an order to contain multiple order items, with each item referencing a menu item and the user who placed the order.

## Error & Loading States

The mobile application includes basic production-style states:

* Loading indicators
* Empty states
* API error messages
* Retry buttons
* Pull-to-refresh
* Disabled/loading actions
* Authentication error alerts

## Environment Variables

Create a `.env` file in the mobile project:

```env
EXPO_PUBLIC_API_URL=https://your-backend-url/api
```

For local development:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:PORT/api
```

Do not use `localhost` when testing the API from a physical Android device.

## Running Locally

### Backend

```bash
cd server
go run .
```

Make sure PostgreSQL is running and the required environment variables are configured.

### Mobile

```bash
cd mobile
npm install
npx expo start
```

For Android:

```bash
npx expo start --android
```

For web:

```bash
npx expo start --web
```

## Production Build

Create a production Android build using EAS:

```bash
npx eas build -p android
```

Before building, make sure the production API URL is configured correctly.

## Key Engineering Decisions

### React Context instead of Redux

The application has relatively small global state requirements, mainly:

* Authentication
* Cart

React Context keeps the implementation simple without introducing unnecessary state-management complexity.

### REST API

REST was sufficient for the application's requirements. Real-time communication was not necessary for the current scope because customers can refresh order status manually.

### Role-Based Access

Admin authorization is enforced on the backend rather than relying only on hiding UI elements.

```text
Client UI restriction
        +
Backend authorization
        =
Secure role-based access
```

### File-Based Navigation

Expo Router provides a clean navigation structure and makes nested routes such as:

```text
/menu/[id]
/order/[id]
```

simple to implement.

## Future Improvements

Possible improvements for a larger production version:

* Real-time order updates using WebSockets
* Online payments
* Restaurant menu management UI
* Push notifications
* Multiple restaurants
* Search and filtering
* Image upload/storage
* Order analytics
* Redis caching
* Automated tests
* CI/CD pipeline

## Project Goal

EasyBite was built as a practical full-stack project to demonstrate:

* React Native development
* Expo and mobile navigation
* TypeScript
* REST API integration
* Authentication
* JWT authorization
* Role-based access control
* PostgreSQL
* Go backend development
* State management
* Persistent local storage
* API error handling
* Production Android builds

```

# LinkedIn Post

🚀 **Built EasyBite — a Full-Stack Restaurant Ordering App**

I recently built **EasyBite**, a simple restaurant ordering application, mainly to explore two areas I wanted to get hands-on with: **React Native + Expo** and **Go (Golang)**.

📱 **React Native + Expo**
Coming from web development, this helped me understand mobile development more deeply — navigation, state management, persistent storage, API integration, and building an Android application.

⚙️ **Go for Backend**
Since I already had experience with Node.js, learning Go gave me a different perspective on backend engineering. I got hands-on with:

* Strong typing and compile-time safety
* Lightweight runtime and efficient resource usage
* Goroutines and Go's approach to concurrency
* Building REST APIs with Gin
* PostgreSQL and GORM
* JWT authentication and role-based authorization

Go's simplicity, performance, and concurrency model also make it particularly interesting for **backend services, cloud infrastructure, and distributed/microservice systems**.

I intentionally kept the project **small in scope**, which allowed me to focus more on understanding the technologies rather than continuously adding features.

Now I'm looking forward to taking these learnings further by working on **more distributed, scalable, and production-oriented systems.** 🚀

#ReactNative #Expo #Golang #Go #BackendDevelopment #MobileDevelopment #DistributedSystems #FullStack #SoftwareEngineering #LearningInPublic

```

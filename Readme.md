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




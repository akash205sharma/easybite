go run ./cmd/server
air ./cmd/main.go

## learning
under stand about jwt and the calim of it wiht middleware
understand handlers code


### models

User
Orders
OrderItems
MenuItem
Category
Restaurant


order request
POST /api/orders
Authorization: Bearer <JWT>

{
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 4,
      "quantity": 1
    }
  ]
}


## http://localhost:8080/api/restaurants/1/menu


[
  {
    "id": 1,
    "createdAt": "2026-08-14T12:38:20.101587+05:30",
    "updatedAt": "2026-08-14T12:38:20.101587+05:30",
    "deletedAt": null,
    "name": "Burgers",
    "restaurantId": 1,
    "menuItems": [
      {
        "id": 1,
        "createdAt": "2026-08-14T12:38:24.854466+05:30",
        "updatedAt": "2026-08-14T12:38:24.854466+05:30",
        "deletedAt": null,
        "name": "Classic Chicken Burger",
        "description": "Crispy chicken, lettuce and special sauce",
        "price": 199,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        "categoryId": 1
      },
      {
        "id": 2,
        "createdAt": "2026-08-14T12:38:26.223761+05:30",
        "updatedAt": "2026-08-14T12:38:26.223761+05:30",
        "deletedAt": null,
        "name": "Cheese Burger",
        "description": "Juicy beef patty with melted cheese",
        "price": 249,
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349",
        "categoryId": 1
      }
    ]
  },
  {
    "id": 2,
    "createdAt": "2026-08-14T12:38:21.463261+05:30",
    "updatedAt": "2026-08-14T12:38:21.463261+05:30",
    "deletedAt": null,
    "name": "Pizza",
    "restaurantId": 1,
    "menuItems": [
      {
        "id": 3,
        "createdAt": "2026-08-14T12:38:27.303989+05:30",
        "updatedAt": "2026-08-14T12:38:27.303989+05:30",
        "deletedAt": null,
        "name": "Margherita Pizza",
        "description": "Fresh mozzarella, tomato and basil",
        "price": 299,
        "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        "categoryId": 2
      }
    ]
  },
  {
    "id": 3,
    "createdAt": "2026-08-14T12:38:22.567112+05:30",
    "updatedAt": "2026-08-14T12:38:22.567112+05:30",
    "deletedAt": null,
    "name": "Drinks",
    "restaurantId": 1,
    "menuItems": [
      {
        "id": 4,
        "createdAt": "2026-08-14T12:38:28.376228+05:30",
        "updatedAt": "2026-08-14T12:38:28.376228+05:30",
        "deletedAt": null,
        "name": "Cold Coffee",
        "description": "Chilled creamy coffee",
        "price": 129,
        "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        "categoryId": 3
      }
    ]
  },
  {
    "id": 4,
    "createdAt": "2026-08-14T12:38:23.648842+05:30",
    "updatedAt": "2026-08-14T12:38:23.648842+05:30",
    "deletedAt": null,
    "name": "Desserts",
    "restaurantId": 1,
    "menuItems": [
      {
        "id": 5,
        "createdAt": "2026-08-14T12:38:29.453745+05:30",
        "updatedAt": "2026-08-14T12:38:29.453745+05:30",
        "deletedAt": null,
        "name": "Chocolate Brownie",
        "description": "Warm chocolate brownie",
        "price": 149,
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
        "categoryId": 4
      }
    ]
  }
]



GET /api/orders
GET /api/orders/:id
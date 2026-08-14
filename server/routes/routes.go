package routes

import (
	"github.com/akash205sharma/server/internal/auth"
	"github.com/akash205sharma/server/internal/menu"
	"github.com/akash205sharma/server/internal/middleware"
	"github.com/akash205sharma/server/internal/order"
	"github.com/akash205sharma/server/internal/restaurant"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB) {
	authHandler := auth.NewHandler(db)
	restaurantHandler := restaurant.NewHandler(db)
	menuHandler := menu.NewHandler(db)
	orderHandler := order.NewHandler(db)

	api := router.Group("/api")

	api.POST("/auth/register", authHandler.Register)
	api.POST("/auth/login", authHandler.Login)
	api.GET(
		"/auth/me",
		middleware.AuthRequired(),
		authHandler.Me,
	)

	api.GET(
		"/restaurants/:id",
		restaurantHandler.GetRestaurant,
	)
	api.GET(
		"/restaurants/:id/menu",
		menuHandler.GetMenu,
	)
	api.GET(
		"/menu/:id",
		menuHandler.GetMenuItem,
	)

	api.POST(
		"/orders",
		middleware.AuthRequired(),
		orderHandler.CreateOrder,
	)
	api.GET(
		"/orders",
		middleware.AuthRequired(),
		orderHandler.GetOrders,
	)
	api.GET(
		"/orders/:id",
		middleware.AuthRequired(),
		orderHandler.GetOrder,
	)
}

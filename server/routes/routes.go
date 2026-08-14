package routes


import (
	"github.com/akash205sharma/server/internal/menu"
	"github.com/akash205sharma/server/internal/restaurant"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB) {
	restaurantHandler := restaurant.NewHandler(db)
	menuHandler := menu.NewHandler(db)

	api := router.Group("/api")

	api.GET(
		"/restaurants/:id",
		restaurantHandler.GetRestaurant,
	)

	api.GET(
		"/restaurants/:id/menu",
		menuHandler.GetMenu,
	)
}
package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"

	"github.com/akash205sharma/server/config"
	"github.com/akash205sharma/server/models"
	"github.com/akash205sharma/server/routes"
	// "github.com/akash205sharma/server/seed"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found")
	}

	db, err := config.ConnectDatabase()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Restaurant{},
		&models.Category{},
		&models.MenuItem{},
		&models.Order{},
		&models.OrderItem{},
	)

	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	// seed.Seed(db)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:8081"},
    AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
    AllowCredentials: true,
}))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "EasyBite API is running",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port", port)

	routes.RegisterRoutes(router, db)

	router.Run(":" + port)
}

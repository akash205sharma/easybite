package seed

import (
	"log"

	"github.com/akash205sharma/server/models"
	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	var count int64

	db.Model(&models.Restaurant{}).Count(&count)

	if count > 0 {
		return
	}

	restaurant := models.Restaurant{
		Name:        "EasyBite",
		Description: "Fresh and delicious food, made for you.",
	}

	if err := db.Create(&restaurant).Error; err != nil {
		log.Fatal("failed to seed restaurant:", err)
	}

	burgers := models.Category{
		Name:         "Burgers",
		RestaurantID: restaurant.ID,
	}

	pizza := models.Category{
		Name:         "Pizza",
		RestaurantID: restaurant.ID,
	}

	drinks := models.Category{
		Name:         "Drinks",
		RestaurantID: restaurant.ID,
	}

	desserts := models.Category{
		Name:         "Desserts",
		RestaurantID: restaurant.ID,
	}

	categories := []*models.Category{
		&burgers,
		&pizza,
		&drinks,
		&desserts,
	}

	for _, category := range categories {
		if err := db.Create(category).Error; err != nil {
			log.Fatal("failed to seed category:", err)
		}
	}

	menuItems := []models.MenuItem{
		{
			Name:        "Classic Chicken Burger",
			Description: "Crispy chicken, lettuce and special sauce",
			Price:       199,
			Image:       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
			CategoryID:  burgers.ID,
		},
		{
			Name:        "Cheese Burger",
			Description: "Juicy beef patty with melted cheese",
			Price:       249,
			Image:       "https://images.unsplash.com/photo-1550547660-d9450f859349",
			CategoryID:  burgers.ID,
		},
		{
			Name:        "Margherita Pizza",
			Description: "Fresh mozzarella, tomato and basil",
			Price:       299,
			Image:       "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
			CategoryID:  pizza.ID,
		},
		{
			Name:        "Cold Coffee",
			Description: "Chilled creamy coffee",
			Price:       129,
			Image:       "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
			CategoryID:  drinks.ID,
		},
		{
			Name:        "Chocolate Brownie",
			Description: "Warm chocolate brownie",
			Price:       149,
			Image:       "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
			CategoryID:  desserts.ID,
		},
	}

	for _, item := range menuItems {
		if err := db.Create(&item).Error; err != nil {
			log.Fatal("failed to seed menu item:", err)
		}
	}

	log.Println("Database seeded successfully")
}
package menu

import (
	"net/http"
	"strconv"

	"github.com/akash205sharma/server/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func (h *Handler) GetMenu(c *gin.Context) {
	restaurantID, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid restaurant id",
		})
		return
	}

	var categories []models.Category

	err = h.DB.
		Where("restaurant_id = ?", restaurantID).
		Preload("MenuItems").
		Find(&categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch menu",
		})
		return
	}

	c.JSON(http.StatusOK, categories)
}
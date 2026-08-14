package restaurant

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

func (h *Handler) GetRestaurant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid restaurant id",
		})
		return
	}

	var restaurant models.Restaurant

	err = h.DB.
		Preload("Categories").
		First(&restaurant, id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "restaurant not found",
		})
		return
	}

	c.JSON(http.StatusOK, restaurant)
}
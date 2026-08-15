package order

import (
	"net/http"

	"github.com/akash205sharma/server/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"strconv"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

type CreateOrderItem struct {
	MenuItemID uint `json:"menuItemId" binding:"required"`
	Quantity   int  `json:"quantity" binding:"required,min=1"`
}

type CreateOrderRequest struct {
	Items []CreateOrderItem `json:"items" binding:"required,min=1"`
}

func (h *Handler) CreateOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var createdOrder models.Order

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		order := models.Order{
			UserID: userID,
			Status: models.OrderPlaced,
			Total:  0,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		var total float64

		for _, requestedItem := range req.Items {
			var menuItem models.MenuItem

			if err := tx.First(
				&menuItem,
				requestedItem.MenuItemID,
			).Error; err != nil {
				return err
			}

			total += menuItem.Price *
				float64(requestedItem.Quantity)

			orderItem := models.OrderItem{
				OrderID:    order.ID,
				MenuItemID: menuItem.ID,
				Quantity:   requestedItem.Quantity,
				Price:      menuItem.Price,
			}

			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}
		}

		order.Total = total

		if err := tx.Save(&order).Error; err != nil {
			return err
		}

		createdOrder = order

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create order",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":     createdOrder.ID,
		"status": createdOrder.Status,
		"total":  createdOrder.Total,
	})
}

func (h *Handler) GetOrders(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var orders []models.Order

	err := h.DB.
		Where("user_id = ?", userID).
		Preload("Items").
		Order("created_at DESC").
		Find(&orders).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (h *Handler) GetOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order id",
		})
		return
	}

	var order models.Order

	err = h.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Preload("Items").
		First(&order).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "order not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch order",
		})
		return
	}

	c.JSON(http.StatusOK, order)
}

// admin role based access for the Order management

type UpdateOrderStatusRequest struct {
	Status models.OrderStatus `json:"status" binding:"required"`
}

func (h *Handler) UpdateOrderStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order id",
		})
		return
	}

	var req UpdateOrderStatusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	validStatuses := map[models.OrderStatus]bool{
		models.OrderPlaced:    true,
		models.OrderConfirmed: true,
		models.OrderPreparing: true,
		models.OrderReady:     true,
		models.OrderCompleted: true,
		models.OrderCancelled: true,
	}

	if !validStatuses[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order status",
		})
		return
	}

	var order models.Order

	if err := h.DB.First(&order, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "order not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to find order",
		})
		return
	}

	order.Status = req.Status

	if err := h.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update order",
		})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (h *Handler) GetAdminOrders(c *gin.Context) {
	var orders []models.Order

	if err := h.DB.
		Preload("Items").
		Preload("User").
		Preload("Items.MenuItem").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, orders)
}
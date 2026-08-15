package models


type OrderStatus string

const (
	OrderPlaced     OrderStatus = "PLACED"
	OrderConfirmed  OrderStatus = "CONFIRMED"
	OrderPreparing  OrderStatus = "PREPARING"
	OrderReady      OrderStatus = "READY"
	OrderCompleted  OrderStatus = "COMPLETED"
	OrderCancelled  OrderStatus = "CANCELLED"
)

type Order struct {
	GormModel

	UserID uint `json:"userId"`

	Status OrderStatus `json:"status" binding:"required"`

	Total float64 `json:"total"`

	Items []OrderItem `json:"items"`
	User  User `json:"user"`
}
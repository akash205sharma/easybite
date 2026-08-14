package models


type OrderStatus string

const (
	OrderPlaced     OrderStatus = "PLACED"
	OrderConfirmed  OrderStatus = "CONFIRMED"
	OrderPreparing  OrderStatus = "PREPARING"
	OrderReady      OrderStatus = "READY"
	OrderCompleted  OrderStatus = "COMPLETED"
)

type Order struct {
	GormModel

	UserID uint `json:"userId"`

	Status OrderStatus `json:"status"`

	Total float64 `json:"total"`

	Items []OrderItem `json:"items"`
}
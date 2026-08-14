package models


type OrderItem struct {
	GormModel
	OrderID   uint `json:"orderId"`
	MenuItemID uint `json:"menuItemId"`

	Quantity int `json:"quantity"`
	Price    float64 `json:"price"`
}
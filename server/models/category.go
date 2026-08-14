package models


type Category struct {
	GormModel
	Name         string `json:"name"`
	RestaurantID uint   `json:"restaurantId"`

	MenuItems []MenuItem `json:"menuItems"`
}

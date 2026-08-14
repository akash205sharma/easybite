package models


type Restaurant struct {
	GormModel

	Name        string `json:"name"`
	Description string `json:"description"`

	Categories []Category `json:"categories"`
}
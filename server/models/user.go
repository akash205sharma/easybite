package models

type UserRole string

const (
	RoleCustomer UserRole = "CUSTOMER"
	RoleAdmin    UserRole = "ADMIN"
)

type User struct {
	GormModel

	Name     string   `json:"name"`
	Email    string   `json:"email" gorm:"uniqueIndex"`
	Password string   `json:"-"`
	Role     UserRole `gorm:"type:varchar(20);default:'CUSTOMER'"`
}

package responses

import (
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/gofiber/fiber/v2"
)

type UserResponse struct {
	Status  int        `json:"status"`
	Message string     `json:"message"`
	Data    *fiber.Map `json:"data"`
}

type AuthorizationResponse struct {
	Status       int         `json:"status"`
	Message      string      `json:"message"`
	IsAuthorized bool        `json:"is_authorized"`
	Data         interface{} `json:"token"`
}

type KeyResponse struct {
	Status       int           `json:"status"`
	Message      string        `json:"message"`
	IsAuthorized bool          `json:"is_authorized"`
	Key          models.APIKey `json:"key"`
}

type UserDetailsResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Email   string `json:"email"`
}

type ErrorResponse struct {
	Status       int    `json:"status"`
	Message      string `json:"message"`
	IsAuthorized bool   `json:"is_authorized"`
}

type APIKeysResponse struct {
	Status  int             `json:"status"`
	Message string          `json:"message"`
	Keys    []models.APIKey `json:"api_keys"`
}

type GenericDeletedResponse struct {
	Status    int  `json:"status"`
	IsDeleted bool `json:"is_deleted"`
}

type GenericSuccessResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

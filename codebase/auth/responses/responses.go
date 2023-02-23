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

type IndexResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

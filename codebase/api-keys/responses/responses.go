package responses

import (
	"github.com/ArseniSkobelev/haudal/codebase/api-keys/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthorizationResponse struct {
	Status       int    `json:"status"`
	Message      string `json:"message"`
	IsAuthorized bool   `json:"is_authorized"`
}

type KeyResponse struct {
	Status       int           `json:"status"`
	Message      string        `json:"message"`
	IsAuthorized bool          `json:"is_authorized"`
	Key          models.APIKey `json:"key"`
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

type APIKeyResponse struct {
	Status  int           `json:"status"`
	Message string        `json:"message"`
	Key     models.APIKey `json:"api_key"`
}

type GenericDeletedResponse struct {
	Status    int  `json:"status"`
	IsDeleted bool `json:"is_deleted"`
}

type GenericSuccessResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

type UserDetailsResponse struct {
	Status   int                `json:"status"`
	Message  string             `json:"message"`
	Email    string             `json:"email"`
	Id       primitive.ObjectID `bson:"_id" json:"_id,omitempty"`
	UserType models.UserType    `bson:"user_type" json:"user_type"`
}

type GenericResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Success bool   `json:"success"`
}

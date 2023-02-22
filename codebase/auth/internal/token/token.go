package token

import (
	"context"
	"errors"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	models "github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var apikeyCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")

func VerifyToken(c *fiber.Ctx) (interface{}, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var at models.RequestData

	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return nil, errors.New("No access_token provided")
	}

	at.AccessToken = authHeader[7:]

	var APIKey models.APIKey

	err := apikeyCollection.FindOne(ctx, bson.M{"access_token": at.AccessToken}).Decode(&APIKey)

	if err != nil {
		return nil, errors.New("Invalid access_token provided")
	}

	return responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "Valid access_token provided", IsAuthorized: true, Data: APIKey.AccessToken}, nil
}

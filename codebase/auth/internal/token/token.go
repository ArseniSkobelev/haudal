package token

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	models "github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var apikeyCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")

func CreateToken(c *fiber.Ctx) error {
	var t models.APIKey

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	apiKey, err := helpers.GenerateAPIKey()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "API token creation failed", IsAuthorized: false, Data: ""})
	}

	t = apiKey.(models.APIKey)

	max_age, err := strconv.ParseInt(env.GetEnvValue("ACCESS_MAX_AGE", env.DEV), 10, 64)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.AuthorizationResponse{Status: fiber.StatusBadRequest, Message: "Unable to get access_token max age", IsAuthorized: false, Data: t.AccessToken})
	}

	t.ExpiresAt = time.Now().Unix() + max_age

	_, err = apikeyCollection.InsertOne(ctx, t)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.AuthorizationResponse{Status: fiber.StatusBadRequest, Message: "Unable to save the API key", IsAuthorized: false, Data: t.AccessToken})
	}

	return c.Status(fiber.StatusCreated).JSON(responses.KeyResponse{Status: fiber.StatusCreated, Message: "API Key created successfully", IsAuthorized: false, Key: t})
}

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

	if APIKey.ExpiresAt < time.Now().Unix() {
		return nil, errors.New("access_token expired")
	}

	return responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "Valid access_token provided", IsAuthorized: true, Data: APIKey.AccessToken}, nil
}

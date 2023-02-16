package controllers

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	token "github.com/ArseniSkobelev/haudal/internal/token"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var apikeyCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")

func VerifyKey(c *fiber.Ctx) error {
	data, err := token.VerifyToken(c)

	if err != nil {
		return c.Status(500).JSON(responses.ErrorResponse{Error: err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(data)
}

func RefreshToken(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return errors.New("No access_token provided")
	}
	var APIKey models.APIKey

	APIKey.RefreshToken = authHeader[7:]

	max_age, err := strconv.ParseInt(env.GetEnvValue("ACCESS_MAX_AGE", env.DEV), 10, 64)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.AuthorizationResponse{Status: fiber.StatusBadRequest, Message: "Unable to get access_token max age", IsAuthorized: false, Data: APIKey.RefreshToken})
	}

	_, err = apikeyCollection.UpdateOne(ctx, bson.M{"refresh_token": APIKey.RefreshToken}, bson.M{"$set": bson.M{"expires_at": time.Now().Unix() + max_age}})

	if err != nil {
		return c.Status(fiber.StatusCreated).JSON(responses.KeyResponse{Status: fiber.StatusCreated, Message: "Unable to find provided refresh_token", IsAuthorized: false, Key: APIKey})
	}

	return c.Status(fiber.StatusOK).JSON(responses.KeyResponse{Status: fiber.StatusOK, Message: "access_token refreshed successfully", IsAuthorized: true, Key: APIKey})
}

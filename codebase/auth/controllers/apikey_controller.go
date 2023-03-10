package controllers

import (
	"context"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	token "github.com/ArseniSkobelev/haudal/internal/token"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var apikeyCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")
var usersCollection *mongo.Collection = db.GetCollection(db.DB, "users")

func CreateToken(c *fiber.Ctx) error {
	var t models.APIKey
	var ad models.ApplicationData

	ad.Serialize()

	c.BodyParser(&ad)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	authHeader := c.Get("Authorization")

	uid, userType, verifyUser := helpers.VerifyUserToken(ctx, authHeader)

	if verifyUser != true {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "Invalid JWT token or invalid user signature", IsAuthorized: false})
	}

	if userType != "admin" {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "User is not an application admin", IsAuthorized: false, Data: ""})
	}

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "Unable to retrieve userid", IsAuthorized: false})
	}

	apiKey, err := helpers.GenerateAPIKey(objectId, ad.AppName)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "API token creation failed", IsAuthorized: false, Data: ""})
	}

	t = apiKey.(models.APIKey)

	_, err = apikeyCollection.InsertOne(ctx, t)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.AuthorizationResponse{Status: fiber.StatusBadRequest, Message: "Unable to save the API key", IsAuthorized: false, Data: t.AccessToken})
	}

	return c.Status(fiber.StatusCreated).JSON(responses.KeyResponse{Status: fiber.StatusCreated, Message: "API Key created successfully", IsAuthorized: false, Key: t})
}

func VerifyKey(c *fiber.Ctx) error {
	data, err := token.VerifyToken(c)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: err.Error(), IsAuthorized: false, Data: data})
	}

	return c.Status(fiber.StatusOK).JSON(data)
}

func GetTokens(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var retrievedKeys []models.APIKey

	authHeader := c.Get("Authorization")

	uid, userType, verifyUser := helpers.VerifyUserToken(ctx, authHeader)

	if verifyUser != true {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "Invalid JWT token or invalid user signature", IsAuthorized: false})
	}

	if userType != "admin" {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "User is not an application admin", IsAuthorized: false, Data: ""})
	}

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "Unable to retrieve userid", IsAuthorized: false})
	}

	result, err := apikeyCollection.Find(ctx, bson.M{"user_id": objectId})

	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "Unable to retrieve userid", IsAuthorized: false})
	}

	if err = result.All(ctx, &retrievedKeys); err != nil {
		log.Fatal(err)
	}

	retrievedTokens := retrievedKeys

	return c.Status(fiber.StatusOK).JSON(responses.APIKeysResponse{Status: fiber.StatusOK, Message: "OK", Keys: retrievedTokens})
}

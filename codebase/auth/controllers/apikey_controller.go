package controllers

import (
	"context"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	token "github.com/ArseniSkobelev/haudal/internal/token"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var apikeyCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")
var usersCollection *mongo.Collection = db.GetCollection(db.DB, "users")

func CreateToken(c *fiber.Ctx) error {
	var t models.APIKey
	var u models.User
	var ad models.ApplicationData

	ad.Serialize()

	c.BodyParser(&ad)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "JWT Token invalid", IsAuthorized: false, Data: ""})
	}

	authToken := authHeader[7:]

	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(authToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetEnvValue("SECRET_KEY", env.DEV)), nil
	})

	uid := helpers.GetUserIdByEmail(ctx, claims["user_email"].(string), claims["user_type"].(string))

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "User not found", IsAuthorized: false, Data: ""})
	}

	err = usersCollection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&u)

	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "User not found", IsAuthorized: false, Data: ""})
	}

	if u.UserType.String() != "admin" {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "User is not an application admin", IsAuthorized: false, Data: ""})
	}

	apiKey, err := helpers.GenerateAPIKey(uid, ad.AppName)

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

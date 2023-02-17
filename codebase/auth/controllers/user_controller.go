package controllers

import (
	"context"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = db.GetCollection(db.DB, "users")
var apikeysCollection *mongo.Collection = db.GetCollection(db.DB, "api_keys")
var validate = validator.New()

func CreateUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var u models.User
	defer cancel()

	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.UserResponse{Status: fiber.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	if validationErr := validate.Struct(&u); validationErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.UserResponse{Status: fiber.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
	}

	nu := models.User{
		Email:        u.Email,
		PasswordHash: helpers.HashPassword(u.PasswordHash, bcrypt.DefaultCost),
		UserType:     u.UserType,
	}

	nu.Serialize()

	if nu.UserType == "default" {
		apiKeyHeader := c.Get("X-Haudal-Key")

		if len(apiKeyHeader) == 0 {
			return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Invalid API key provided", IsAuthorized: false, Data: ""})
		}

		var apiKey models.APIKey

		err := apikeysCollection.FindOne(ctx, bson.M{"access_token": apiKeyHeader}).Decode(&apiKey)

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Invalid API key provided", IsAuthorized: false, Data: ""})
		}
	}

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": nu.Email},
		{"user_type": nu.UserType},
	}}).Decode(&u)

	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(responses.UserResponse{Status: fiber.StatusConflict, Message: "User with the given email already exists", Data: &fiber.Map{"data": ""}})
	}

	_, err = userCollection.InsertOne(ctx, nu)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.UserResponse{Status: fiber.StatusBadRequest, Message: "Unable to create user", Data: &fiber.Map{"data": ""}})
	}

	token := helpers.CreateJwtToken(nu.Email, string(nu.UserType))

	return c.Status(fiber.StatusCreated).JSON(responses.AuthorizationResponse{Status: fiber.StatusCreated, Message: "Created", IsAuthorized: true, Data: token})
}

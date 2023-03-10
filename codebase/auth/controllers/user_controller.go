package controllers

import (
	"context"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
		return c.Status(fiber.StatusBadRequest).JSON(responses.ErrorResponse{Status: fiber.StatusBadRequest, Message: "Not enough data has been provided in the POST request."})
	}

	if validationErr := validate.Struct(&u); validationErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.ErrorResponse{Status: fiber.StatusBadRequest, Message: "Invalid data provided in the POST request."})
	}

	nu := models.User{
		Email:        u.Email,
		PasswordHash: helpers.HashPassword(u.PasswordHash, bcrypt.DefaultCost),
		UserType:     u.UserType,
	}

	xHaudalKey := c.Get("X-Haudal-Key")

	if len(xHaudalKey) == 0 {
		nu.UserType = models.UserType(models.ADMIN.String())
	} else {
		var apiKey models.APIKey

		err := apikeysCollection.FindOne(ctx, bson.M{"access_token": xHaudalKey}).Decode(&apiKey)

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "X-Haudal-Key HTTP header is missing or is malformed.", IsAuthorized: false})
		}

		nu.UserType = models.UserType(models.DEFAULT.String())
	}

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": nu.Email},
		{"user_type": nu.UserType},
	}}).Decode(&u)

	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(responses.ErrorResponse{Status: fiber.StatusConflict, Message: "User with the given email already exists."})
	}

	_, err = userCollection.InsertOne(ctx, nu)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.UserResponse{Status: fiber.StatusBadRequest, Message: "Unable to create user.", Data: &fiber.Map{"data": ""}})
	}

	token := helpers.CreateJwtToken(nu.Email, string(nu.UserType))

	return c.Status(fiber.StatusCreated).JSON(responses.AuthorizationResponse{Status: fiber.StatusCreated, Message: "User created successfully.", IsAuthorized: true, Data: token})
}

func GetUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var u models.User
	defer cancel()

	token := helpers.GetAuthToken(c)

	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetEnvValue("SECRET_KEY", env.PRODUCTION)), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Unable to gather session data.", Data: token, IsAuthorized: false})
	}

	var userType string

	apiKeyHeader := c.Get("X-Haudal-Key")

	if len(apiKeyHeader) == 0 {
		userType = "admin"
	} else {
		userType = "default"
	}

	userId := helpers.GetUserIdByEmail(ctx, claims["user_email"].(string), userType)

	objId, err := primitive.ObjectIDFromHex(userId)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Unable to find a user with the provided data.", Data: token, IsAuthorized: false})
	}

	err = userCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&u)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Unable to find a user with the provided data.", Data: token, IsAuthorized: false})
	}

	return c.Status(fiber.StatusOK).JSON(responses.UserDetailsResponse{Status: fiber.StatusOK, Message: "OK", Email: u.Email})
}

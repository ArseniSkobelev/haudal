package controllers

import (
	"context"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	messages "github.com/ArseniSkobelev/haudal/internal/messages"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = db.GetCollection(db.DB, "users")

var validate = validator.New()

func CreateUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var u models.User
	defer cancel()

	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.ErrorResponse{Status: fiber.StatusBadRequest, Message: messages.SERVER_INCORRECT_OR_MISSING_DATA_IN_REQUEST})
	}

	if validationErr := validate.Struct(&u); validationErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.ErrorResponse{Status: fiber.StatusBadRequest, Message: messages.SERVER_INCORRECT_OR_MISSING_DATA_IN_REQUEST})
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

		err := apiKeyCollection.FindOne(ctx, bson.M{"access_token": xHaudalKey}).Decode(&apiKey)

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: messages.APIKEY_NON_EXISTANT, IsAuthorized: false})
		}

		nu.UserType = models.UserType(models.DEFAULT.String())
	}

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": nu.Email},
		{"user_type": nu.UserType},
	}}).Decode(&u)

	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(responses.ErrorResponse{Status: fiber.StatusConflict, Message: messages.USER_EMAIL_IN_USE})
	}

	_, err = userCollection.InsertOne(ctx, nu)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(responses.UserResponse{Status: fiber.StatusBadRequest, Message: messages.SERVER_INTERNAL_SERVER_ERROR, Data: &fiber.Map{"data": ""}})
	}

	token := helpers.CreateJwtToken(nu.Email, string(nu.UserType))

	return c.Status(fiber.StatusCreated).JSON(responses.AuthorizationResponse{Status: fiber.StatusCreated, Message: "User created successfully.", IsAuthorized: true, Data: token})
}

func GetUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var u models.RetrievedUser
	defer cancel()

	authHeader := c.Get("Authorization")

	uid, _, isUser := helpers.VerifyUserToken(ctx, authHeader)

	if isUser == false {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: messages.AUTH_INCORRECT_USERNAME_OR_PASSWORD, IsAuthorized: false})
	}

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: messages.SERVER_INTERNAL_SERVER_ERROR, IsAuthorized: false})
	}

	err = userCollection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&u)

	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusUnauthorized, Message: "Unable to find a user with the provided data.", IsAuthorized: false})
	}

	log.Println(u)

	return c.Status(fiber.StatusOK).JSON(responses.UserDetailsResponse{Status: fiber.StatusOK, Message: "OK", Email: u.Email, Id: u.ID, UserType: u.UserType})
}

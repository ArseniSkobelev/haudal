package controllers

import (
	"context"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/helpers"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var sessionCollection *mongo.Collection = db.GetCollection(db.DB, "sessions")

func Login(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	u := new(models.LoginData)
	var foundUser models.User

	if err := c.BodyParser(u); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusInternalServerError, Message: "Error", Data: &fiber.Map{"data": err.Error()}})
	}

	err := userCollection.FindOne(ctx, bson.M{"email": u.Email}).Decode(&foundUser)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusUnauthorized, Message: "Incorrect username and/or password provided", Data: &fiber.Map{"data": err.Error()}})
	}

	err = helpers.IsPasswordValid(foundUser.PasswordHash, u.Password)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusInternalServerError, Message: "Error", Data: &fiber.Map{"data": err.Error()}})
	}

	token := helpers.CreateJwtToken(foundUser.Email, foundUser.FirstName, foundUser.LastName)

	s := models.Session{
		JWT:    token,
		UserID: helpers.GetUserIdByEmail(ctx, foundUser.Email),
	}

	result, err := sessionCollection.InsertOne(ctx, s)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "Unable to create session", Data: token, IsAuthorized: false})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "Ok", Data: result, IsAuthorized: true})
}

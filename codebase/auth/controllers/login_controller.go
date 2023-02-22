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
	var u models.LoginData
	var foundUser models.User

	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusInternalServerError, Message: "Error", Data: &fiber.Map{"data": ""}})
	}

	u.Serialize()

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": u.Email},
		{"user_type": u.UserType.String()},
	}}).Decode(&foundUser)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusUnauthorized, Message: "Incorrect username and/or password provided", Data: &fiber.Map{"data": ""}})
	}

	err = helpers.IsPasswordValid(foundUser.PasswordHash, u.Password)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusInternalServerError, Message: "Error", Data: &fiber.Map{"data": ""}})
	}

	token := helpers.CreateJwtToken(foundUser.Email, foundUser.UserType.String())

	uid := helpers.GetUserIdByEmail(ctx, foundUser.Email, u.UserType.String())

	s := models.Session{
		JWT:    token,
		UserID: uid,
	}

	_, err = sessionCollection.DeleteOne(ctx, bson.M{"user_id": uid})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "Unable to create session", Data: token, IsAuthorized: false})
	}

	_, err = sessionCollection.InsertOne(ctx, s)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "Unable to create session", Data: token, IsAuthorized: false})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "Ok", Data: token, IsAuthorized: true})
}

// func GetSession(c *fiber.Ctx) error {
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// }

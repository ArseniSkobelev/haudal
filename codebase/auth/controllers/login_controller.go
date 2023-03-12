package controllers

import (
	"context"
	"log"
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
	log.Println("Login attempt started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var u models.LoginData
	var foundUser models.User

	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusInternalServerError, Message: "Not enough data has been provided in the POST request."})
	}

	u.Serialize()

	xHaudalKey := c.Get("X-Haudal-Key")

	if len(xHaudalKey) == 0 {
		u.UserType = models.UserType(models.ADMIN.String())
	} else {
		var apiKey models.APIKey

		err := apikeysCollection.FindOne(ctx, bson.M{"access_token": xHaudalKey}).Decode(&apiKey)

		if err != nil {
			log.Printf("Login attempt failed; err: %v", err.Error())
			return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: "X-Haudal-Key HTTP header is missing or is malformed.", IsAuthorized: false})
		}

		u.UserType = models.UserType(models.DEFAULT.String())
	}

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": u.Email},
		{"user_type": u.UserType.String()},
	}}).Decode(&foundUser)

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.UserResponse{Status: fiber.StatusUnauthorized, Message: "Incorrect username and/or password provided.", Data: &fiber.Map{"data": ""}})
	}

	err = helpers.IsPasswordValid(foundUser.PasswordHash, u.Password)

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusInternalServerError, Message: "Incorrect username and/or password provided."})
	}

	token := helpers.CreateJwtToken(foundUser.Email, foundUser.UserType.String())

	uid := helpers.GetUserIdByEmail(ctx, foundUser.Email, u.UserType.String())

	s := models.Session{
		JWT:    token,
		UserID: uid,
	}

	_, err = sessionCollection.DeleteOne(ctx, bson.M{"user_id": uid})

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "Unable to create session.", Data: token, IsAuthorized: false})
	}

	_, err = sessionCollection.InsertOne(ctx, s)

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusInternalServerError, Message: "Unable to create session.", Data: token, IsAuthorized: false})
	}

	log.Println("Login attempt succeeded")

	return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "Ok", Data: token, IsAuthorized: true})
}

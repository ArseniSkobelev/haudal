package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/helpers"
	messages "github.com/ArseniSkobelev/haudal/internal/messages"
	"github.com/ArseniSkobelev/haudal/models"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

// ------------------------------------------------------- //
// Create session with JWT and return it				   //
// ------------------------------------------------------- //
func Login(c *fiber.Ctx) error {
	log.Println("Login attempt started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var u models.LoginData
	var foundUser models.User

	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusInternalServerError, Message: messages.SERVER_INCORRECT_OR_MISSING_DATA_IN_REQUEST})
	}

	u.Serialize()

	xHaudalKey := c.Get("X-Haudal-Key")

	if len(xHaudalKey) == 0 {
		u.UserType = models.UserType(models.ADMIN.String())
	} else {
		var apiKey models.APIKey

		body := helpers.HTTPRequest(fmt.Sprintf("https://keys.haudal.com/api/v1/token/?access_token=%v", xHaudalKey), c.Get("Authorization"))

		if err := json.Unmarshal(body, &apiKey); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: messages.APIKEY_NON_EXISTANT, IsAuthorized: false})
		}

		u.UserType = models.UserType(models.DEFAULT.String())
	}

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": u.Email},
		{"user_type": u.UserType.String()},
	}}).Decode(&foundUser)

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusUnauthorized, Message: messages.AUTH_INCORRECT_USERNAME_OR_PASSWORD, IsAuthorized: false})
	}

	err = helpers.IsPasswordValid(foundUser.PasswordHash, u.Password)

	if err != nil {
		log.Printf("Login attempt failed; err: %v", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(responses.ErrorResponse{Status: fiber.StatusInternalServerError, Message: messages.AUTH_INCORRECT_USERNAME_OR_PASSWORD})
	}

	token := helpers.CreateJwtToken(foundUser.Email, foundUser.UserType.String())

	log.Println("Login attempt succeeded")

	return c.Status(fiber.StatusUnauthorized).JSON(responses.AuthorizationResponse{Status: fiber.StatusOK, Message: "OK", Data: token, IsAuthorized: true})
}

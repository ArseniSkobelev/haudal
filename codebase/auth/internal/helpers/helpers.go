package helpers

import (
	"context"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	models "github.com/ArseniSkobelev/haudal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = db.GetCollection(db.DB, "users")

func HashPassword(password string, cost int) string {
	hp, err := bcrypt.GenerateFromPassword([]byte(password), cost)

	if err != nil {
		log.Fatal(err)
	}

	return string(hp)
}

func IsPasswordValid(hp string, p string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hp), []byte(p))
	return err
}

func CreateJwtToken(email string, fn string, ln string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_email":      email,
		"user_first_name": fn,
		"user_last_name":  ln,
		"exp":             jwt.NewNumericDate(time.Unix(time.Now().Unix()+3600, 0)),
	})

	tokenString, err := token.SignedString([]byte(env.GetEnvValue("SECRET_KEY", env.DEV)))

	if err != nil {
		log.Fatal(err)
	}

	return tokenString
}

func GenerateAPIKey() (interface{}, error) {
	return models.APIKey{
		AccessToken:  uuid.New().String(),
		RefreshToken: uuid.New().String(),
	}, nil
}

func GetAuthToken(c *fiber.Ctx) string {
	if string(c.Get("Authorization")) != "" {
		return string(c.Get("Authorization")[7:])
	}
	return ""
}

func GetUserIdByEmail(ctx context.Context, email string) string {
	var id models.Id

	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&id)

	if err != nil {
		log.Fatal(err.Error())
		return ""
	}

	return id.Id
}

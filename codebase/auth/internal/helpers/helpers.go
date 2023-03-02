package helpers

import (
	"context"
	"log"
	"strconv"
	"time"

	"github.com/ArseniSkobelev/haudal/internal/db"
	"github.com/ArseniSkobelev/haudal/internal/env"
	models "github.com/ArseniSkobelev/haudal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = db.GetCollection(db.DB, "users")

func HashPassword(password string, cost int) string {
	hp, err := bcrypt.GenerateFromPassword([]byte(password), cost)

	if err != nil {
		log.Println(err)
	}

	return string(hp)
}

func IsPasswordValid(hp string, p string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hp), []byte(p))
	return err
}

func CreateJwtToken(email string, user_type string) string {
	max_age, err := strconv.ParseInt(env.GetEnvValue("SESSION_MAX_AGE", env.DEV), 10, 64)

	if err != nil {
		return ""
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_email": email,
		"user_type":  user_type,
		"exp":        time.Now().Unix() + max_age,
	})

	tokenString, err := token.SignedString([]byte(env.GetEnvValue("SECRET_KEY", env.DEV)))

	if err != nil {
		log.Println(err)
	}

	return tokenString
}

func GenerateAPIKey(uid primitive.ObjectID, appName string) (interface{}, error) {

	return models.APIKey{
		AccessToken: uuid.New().String(),
		UserID:      uid,
		AppName:     appName,
		// RefreshToken: uuid.New().String(),
	}, nil
}

func GetAuthToken(c *fiber.Ctx) string {
	if string(c.Get("Authorization")) != "" {
		return string(c.Get("Authorization")[7:])
	}
	return ""
}

func GetUserIdByEmail(ctx context.Context, email string, user_type string) string {
	var id models.Id

	// err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&id)

	err := userCollection.FindOne(ctx, bson.M{"$and": []bson.M{
		{"email": email},
		{"user_type": user_type},
	}}).Decode(&id)

	if err != nil {
		log.Println(err.Error())
		return ""
	}

	return id.Id
}

func VerifyUserToken(ctx context.Context, authHeader string) (string, string, bool) {
	var u models.User

	token := authHeader[7:]

	if token == "" {
		return "", "", false
	}

	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetEnvValue("SECRET_KEY", env.DEV)), nil
	})

	if err != nil {
		return "", "", false
	}

	uid := GetUserIdByEmail(ctx, claims["user_email"].(string), claims["user_type"].(string))

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		log.Println(err.Error())
		return "", "", false
	}

	err = userCollection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&u)

	if err != nil {
		log.Println(err.Error())
		return "", "", false
	}

	return uid, u.UserType.String(), true
}

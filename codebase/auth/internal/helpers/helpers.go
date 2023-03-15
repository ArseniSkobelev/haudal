package helpers

import (
	"context"
	"io/ioutil"
	"log"
	"net/http"
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
	// Default bcrypt password check; hp = hashed_password, p = plaintext password
	err := bcrypt.CompareHashAndPassword([]byte(hp), []byte(p))
	return err
}

func CreateJwtToken(email string, user_type string) string {
	// Set a max_age for the token. Default = current unix timestamp + 3600 seconds (1hr)
	max_age, err := strconv.ParseInt(env.GetEnvValue("SESSION_MAX_AGE", env.DEV), 10, 64)

	if err != nil {
		return ""
	}

	// Generate new JWT token with claims; user_email and user_type
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_email": email,
		"user_type":  user_type,
		"exp":        time.Now().Unix() + max_age,
	})

	// Sign the token with the SECRET_KEY variable
	tokenString, err := token.SignedString([]byte(env.GetEnvValue("SECRET_KEY", env.DEV)))

	if err != nil {
		log.Println(err)
	}

	return tokenString
}

func GenerateAPIKey(uid primitive.ObjectID, appName string) (interface{}, error) {
	// Generate a random API key. Currently, UUIDs are used, but that may be unsafe because of it's short length. Still deciding whether to switch to some-kind of encoded data string.
	return models.APIKey{
		AccessToken: uuid.New().String(),
		UserID:      uid,
		AppName:     appName,
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

	// Find the user by email and user_type
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

	// Substring of authHeader to remove 'Bearer ' from the header
	token := authHeader[7:]

	if token == "" {
		return "", "", false
	}

	claims := jwt.MapClaims{}

	// Parse the provided JWT token and decode it to the 'claims' variable
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetEnvValue("SECRET_KEY", env.DEV)), nil
	})

	if err != nil {
		return "", "", false
	}

	// Get user's id by email (and user_type) from the claims
	uid := GetUserIdByEmail(ctx, claims["user_email"].(string), claims["user_type"].(string))

	objectId, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		log.Println(err.Error())
		return "", "", false
	}

	// Check whether the user exists with the found _id
	// FIXME: Maybe remove this check? The 'GetUserIDByEmail' already fetches the DB to check whether the user exists and the _id is recieved straight from the function call. Think about that.
	err = userCollection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&u)

	if err != nil {
		log.Println(err.Error())
		return "", "", false
	}

	return uid, u.UserType.String(), true
}

/*
HTTPRequest returns a []byte from the url that was passed in. authHeader is required to ensure Authorization to the requested endpoint

Usage:

	body_byte_array = helpers.HTTPRequest({{endpoint}}, c.Get("Authorization"))

Unmarshal byte array body to struct

	var user models.User

	if err := json.Unmarshal(body, &user); err != nil {
			return c.Status(fiber.StatusInternalServerError)
		}
*/
func HTTPRequest(url string, authHeader string) []byte {

	client := http.Client{}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println(err.Error())
		return []byte{}
	}

	req.Header = http.Header{
		"Authorization": {authHeader},
	}

	res, err := client.Do(req)
	if err != nil {
		log.Println(err.Error())
		return []byte{}
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err.Error())
		return []byte{}
	}

	return body
}

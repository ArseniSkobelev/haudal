package helpers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/ArseniSkobelev/haudal/codebase/api-keys/internal/db"
	"github.com/ArseniSkobelev/haudal/codebase/api-keys/internal/env"
	models "github.com/ArseniSkobelev/haudal/codebase/api-keys/models"
	"github.com/ArseniSkobelev/haudal/codebase/api-keys/responses"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = db.GetCollection(db.DB, "users")

func GenerateAPIKey(uid primitive.ObjectID, appName string) (interface{}, error) {
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

func GetUserIdByEmail(ctx context.Context, email string, user_type string, authHeader string) string {
	client := http.Client{}

	baseUrl := env.GetEnvValue("BASE_URL", env.PRODUCTION)

	requestUrl := fmt.Sprintf("%v/api/v1/user", baseUrl)

	req, err := http.NewRequest("GET", requestUrl, nil)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	req.Header = http.Header{
		"Authorization": {authHeader},
	}

	res, err := client.Do(req)
	if err != nil {
		log.Println(err.Error())
		return ""
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	var u responses.UserDetailsResponse

	if err := json.Unmarshal(body, &u); err != nil {
		log.Println(err.Error())
		return ""
	}

	return u.Id.String()
}

func GetUserDetails(ctx context.Context, authHeader string) (primitive.ObjectID, string, bool) {
	var u responses.UserDetailsResponse

	token := authHeader[7:]

	if token == "" {
		return primitive.NewObjectID(), "", false
	}

	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetEnvValue("SECRET_KEY", env.DEV)), nil
	})

	if err != nil {
		return primitive.NewObjectID(), "", false
	}

	// uid := GetUserIdByEmail(ctx, claims["user_email"].(string), claims["user_type"].(string), token)

	// objectId, err := primitive.ObjectIDFromHex(uid)
	// if err != nil {
	// 	log.Println(err.Error())
	// 	return "", "", false
	// }

	// err = userCollection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&u)

	// if err != nil {
	// 	log.Println(err.Error())
	// 	return "", "", false
	// }

	body := HTTPRequest(fmt.Sprintf("%v/api/v1/user", env.GetEnvValue("BASE_URL", env.PRODUCTION)), authHeader)

	if err := json.Unmarshal(body, &u); err != nil {
		log.Println(err.Error())
	}

	return u.Id, claims["user_type"].(string), true
}

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

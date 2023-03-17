// alert

package env

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

// comment out before production
func GetEnvValue(key string) string {
	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}

	env_path := fmt.Sprintf("%v/.env", path)

	err = godotenv.Load(env_path)

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

//func GetEnvValue(key string) string {
//	return os.Getenv(key)
//}

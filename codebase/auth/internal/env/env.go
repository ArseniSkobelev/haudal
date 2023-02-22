package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Environment string

const (
	DEV        Environment = "/.env.dev"
	PRODUCTION Environment = "/.env.prod"
)

func (e Environment) String() string {
	return string(e)
}

func GetEnvValue(key string, e Environment) string {
	p, _ := os.Getwd()

	err := godotenv.Load(p + e.String())

	if err != nil {
		log.Fatalf("%v Error: %v", "[Technical]", err)
		os.Exit(1)
	}

	return os.Getenv(key)
}

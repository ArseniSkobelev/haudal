package env

import (
	"os"
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
	return os.Getenv(key)
}

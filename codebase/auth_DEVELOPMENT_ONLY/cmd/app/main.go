package main

import (
	"log"

	env "github.com/ArseniSkobelev/haudal/internal/env"

	routes "github.com/ArseniSkobelev/haudal/routes"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/gofiber/swagger"
)

func main() {
	app := fiber.New()

	app.Get("/swagger/*", swagger.HandlerDefault)

	routes.IndexRoute(app)
	routes.UserRoute(app)
	routes.LoginRoute(app)
	routes.APIKeyRoute(app)

	PORT := ":" + env.GetEnvValue("API_PORT", env.DEV)
	log.Printf("%v DEVELOPMENT SERVER STARTED ON PORT %v", env.GetEnvValue("LOG_PREFIX", env.DEV), PORT)
	app.Listen(PORT)
}

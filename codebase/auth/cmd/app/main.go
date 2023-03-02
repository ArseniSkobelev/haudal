package main

import (
	"log"

	env "github.com/ArseniSkobelev/haudal/internal/env"
	routes "github.com/ArseniSkobelev/haudal/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	routes.IndexRoute(app)
	routes.UserRoute(app)
	routes.LoginRoute(app)
	routes.APIKeyRoute(app)

	PORT := ":" + env.GetEnvValue("API_PORT", env.PRODUCTION)
	log.Printf("%v Web server started successfully on port %v", env.GetEnvValue("LOG_PREFIX", env.PRODUCTION), PORT)
	app.Listen(PORT)
}

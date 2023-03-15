package main

import (
	"log"

	env "github.com/ArseniSkobelev/haudal/codebase/api-keys/internal/env"
	routes "github.com/ArseniSkobelev/haudal/codebase/api-keys/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// ------------------------------------------------------- //
	// Include all of the routes from another module		   //
	// ------------------------------------------------------- //

	// routes.IndexRoute(app)
	// routes.UserRoute(app)
	// routes.LoginRoute(app)
	routes.APIKeyRoute(app)

	// ------------------------------------------------------- //
	// Setup the web server with the PORT provided in the ENV  //
	// ------------------------------------------------------- //
	PORT := ":" + env.GetEnvValue("API_PORT", env.PRODUCTION)
	log.Printf("%v Web server started successfully on port %v", env.GetEnvValue("LOG_PREFIX", env.PRODUCTION), PORT)
	app.Listen(PORT)
}

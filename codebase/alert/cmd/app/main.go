package main

import (
	"log"

	env "alert/internal/env"
	routes "alert/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// ------------------------------------------------------- //
	// Include all of the routes from another module		   //
	// ------------------------------------------------------- //

	routes.IndexRoute(app)

	// ------------------------------------------------------- //
	// Setup the web server with the PORT provided in the ENV  //
	// ------------------------------------------------------- //
	PORT := ":" + env.GetEnvValue("API_PORT")
	log.Printf("%v Web server started successfully on port %v", env.GetEnvValue("LOG_PREFIX"), PORT)
	app.Listen(PORT)
}

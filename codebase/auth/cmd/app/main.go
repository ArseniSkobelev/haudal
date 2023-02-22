package main

import (
	"log"

	env "github.com/ArseniSkobelev/haudal/internal/env"
	routes "github.com/ArseniSkobelev/haudal/routes"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/gofiber/swagger"
)

//	@title			Haudal Authentication API
//	@version		1.0
//	@description	Fortinaiti?

//	@host		https://auth.haudal.com
//	@BasePath	/api/v1

func main() {
	app := fiber.New()

	app.Get("/swagger/*", swagger.HandlerDefault)

	routes.UserRoute(app)
	routes.LoginRoute(app)
	routes.APIKeyRoute(app)

	PORT := ":" + env.GetEnvValue("API_PORT", env.PRODUCTION)
	log.Printf("%v Web server started successfully on port %v", env.GetEnvValue("LOG_PREFIX", env.PRODUCTION), PORT)
	app.Listen(PORT)
}

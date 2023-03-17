package routes

import (
	"github.com/ArseniSkobelev/haudal/controllers"
	"github.com/gofiber/fiber/v2"
)

func LoginRoute(app *fiber.App) {
	app.Post("/api/v1/session", controllers.Login)
	app.Get("/api/v1/session", controllers.IsUserAuthorized)
}

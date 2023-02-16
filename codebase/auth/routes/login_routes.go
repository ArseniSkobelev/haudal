package routes

import (
	"github.com/ArseniSkobelev/haudal/controllers"
	"github.com/gofiber/fiber/v2"
)

func LoginRoute(app *fiber.App) {
	app.Post("/api/v1/session/create", controllers.Login)
}

package routes

import (
	"alert/controllers"

	"github.com/gofiber/fiber/v2"
)

func IndexRoute(app *fiber.App) {
	app.Get("/api/v1/alert", controllers.Index)
	app.Post("/api/v1/alert", controllers.Alert)
}

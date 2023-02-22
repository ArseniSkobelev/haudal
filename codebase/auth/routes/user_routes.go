package routes

import (
	"github.com/ArseniSkobelev/haudal/controllers"
	"github.com/gofiber/fiber/v2"
)

func UserRoute(app *fiber.App) {
	app.Post("/api/v1/user", controllers.CreateUser)
	app.Get("/api/v1/user", controllers.GetUser)
}

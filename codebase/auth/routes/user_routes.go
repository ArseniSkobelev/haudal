package routes

import (
	"github.com/ArseniSkobelev/haudal/controllers"
	"github.com/gofiber/fiber/v2"
)

func UserRoute(app *fiber.App) {
	app.Post("/user", controllers.CreateUser)
}

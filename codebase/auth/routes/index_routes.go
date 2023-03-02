package routes

import (
	controller "github.com/ArseniSkobelev/haudal/controllers"
	"github.com/gofiber/fiber/v2"
)

func IndexRoute(app *fiber.App) {
	app.Get("api/v1/", controller.Index)
}

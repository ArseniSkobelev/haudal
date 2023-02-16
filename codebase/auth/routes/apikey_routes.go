package routes

import (
	controllers "github.com/ArseniSkobelev/haudal/controllers"
	token "github.com/ArseniSkobelev/haudal/internal/token"
	"github.com/gofiber/fiber/v2"
)

func APIKeyRoute(app *fiber.App) {
	// app.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: []byte(env.GetEnvValue("SECRET_KEY", env.DEV)),
	// }))

	app.Post("api/v1/token/create", token.CreateToken)
	app.Post("api/v1/token/verify", controllers.VerifyKey)
	app.Post("api/v1/token/refresh", controllers.RefreshToken)
}

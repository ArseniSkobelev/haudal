package routes

// import (
// 	"github.com/ArseniSkobelev/haudal/controllers"
// 	"github.com/ArseniSkobelev/haudal/internal/env"
// 	"github.com/gofiber/fiber/v2"
// 	jwtware "github.com/gofiber/jwt/v3"
// )

// func APIKeyRoute(app *fiber.App) {
// 	app.Use(jwtware.New(jwtware.Config{
// 		SigningKey: []byte(env.GetEnvValue("SECRET_KEY", env.DEV)),
// 	}))

// 	app.Post("api/v1/token", controllers.CreateToken)
// 	app.Get("api/v1/token", controllers.GetTokens)
// 	app.Delete("api/v1/token", controllers.DeleteToken)
// }

package controllers

import (
	"log"

	"github.com/ArseniSkobelev/haudal/internal/env"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	log.Printf("%v Index enpoint hit", env.GetEnvValue("LOG_PREFIX", env.PRODUCTION))
	return c.Status(fiber.StatusOK).JSON(responses.IndexResponse{Status: fiber.StatusOK, Message: "Hello :)"})
}

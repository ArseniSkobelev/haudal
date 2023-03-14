package controllers

import (
	"log"

	"github.com/ArseniSkobelev/haudal/internal/env"
	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
)

// ------------------------------------------------------- //
// Main endpoint     							           //
// ------------------------------------------------------- //
func Index(c *fiber.Ctx) error {
	log.Printf("%v Index enpoint hit", env.GetEnvValue("LOG_PREFIX", env.PRODUCTION))
	return c.Status(fiber.StatusOK).JSON(responses.GenericSuccessResponse{Status: fiber.StatusOK, Message: "Haudal Authentication API"})
}

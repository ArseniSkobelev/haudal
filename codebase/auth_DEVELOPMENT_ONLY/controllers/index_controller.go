package controllers

import (
	"log"

	"github.com/ArseniSkobelev/haudal/responses"
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	log.Println("[DEBUG] I am hit :)")
	return c.Status(fiber.StatusOK).JSON(responses.IndexResponse{Status: fiber.StatusOK, Message: "Hello :)"})
}

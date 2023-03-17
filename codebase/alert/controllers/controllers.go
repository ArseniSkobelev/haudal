package controllers

import (
	"alert/internal/env"
	"alert/responses"
	"log"
	"strconv"

	models "alert/models"

	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"

	gomail "gopkg.in/mail.v2"
)

var validate = validator.New()

// ------------------------------------------------------- //
// Simple hello route on index					           //
// ------------------------------------------------------- //
func Index(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(responses.GenericResponse{Status: fiber.StatusOK, Message: "Hello from alert", Success: true})
}

func Alert(c *fiber.Ctx) error {
	var alert_data models.AlertData

	err := c.BodyParser(&alert_data)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.GenericResponse{Status: fiber.StatusInternalServerError, Message: "Invalid data provided in the POST request", Success: true})
	}

	email := env.GetEnvValue("EMAIL")
	password := env.GetEnvValue("EMAIL_PASSWORD")
	smtp_port := env.GetEnvValue("EMAIL_SMTP_PORT")
	smtp_host := env.GetEnvValue("EMAIL_SMTP_HOST")

	m := gomail.NewMessage()

	m.SetAddressHeader("From", email, "Haudal")
	m.SetAddressHeader("To", alert_data.To, alert_data.To)
	m.SetHeader("Subject", alert_data.Header)
	m.SetBody("text/html", alert_data.Body)

	intVar, err := strconv.Atoi(smtp_port)

	d := gomail.NewDialer(smtp_host, intVar, email, password)

	if err := d.DialAndSend(m); err != nil {
		log.Println(err)
		panic(err)
	}

	return c.Status(fiber.StatusOK).JSON(responses.GenericResponse{Status: fiber.StatusOK, Message: "Alert sent successfully", Success: true})
}

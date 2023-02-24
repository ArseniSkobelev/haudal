package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserType string

const (
	DEFAULT UserType = "default"
	ADMIN   UserType = "admin"
)

type User struct {
	Email        string             `bson:"email" json:"email,omitempty" validate:"required"`
	PasswordHash string             `bson:"password_hash" json:"password_hash" validate:"required"`
	CreatedAt    primitive.DateTime `bson:"created_at" json:"created_at" bson:"created_at"`
	UserType     UserType           `bson:"user_type" json:"user_type"`
}

type LoginData struct {
	Email    string   `json:"email,omitempty" validate:"required"`
	Password string   `json:"password" validate:"required"`
	UserType UserType `bson:"user_type" json:"user_type"`
}

type APIKey struct {
	AccessToken string `bson:"access_token" json:"access_token"`
	UserID      string `bson:"user_id" json:"user_id"`
	AppName     string `bson:"app_name" json:"app_name"`
}

type RequestData struct {
	AccessToken string `bson:"access_token" json:"access_token"`
}

type Session struct {
	JWT    string `bson:"jwt" json:"jwt"`
	UserID string `bson:"user_id" json:"user_id"`
}

type Id struct {
	Id string `bson:"_id" json:"id"`
}

type ApplicationData struct {
	AppName string `bson:"app_name" json:"app_name"`
}

func (u *User) Serialize() {
	u.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
}

func (ut UserType) String() string {
	return string(ut)
}

func (ld *LoginData) Serialize() {
	if ld.UserType == "" {
		ld.UserType = DEFAULT
	}
}

func (ad *ApplicationData) Serialize() {
	if ad.AppName == "" {
		ad.AppName = "Application"
	}
}

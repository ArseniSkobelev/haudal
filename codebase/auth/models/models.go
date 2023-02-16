package models

import "time"

type User struct {
	Email        string    `bson:"email" json:"email,omitempty" validate:"required"`
	FirstName    string    `bson:"first_name" json:"first_name,omitempty"`
	LastName     string    `bson:"last_name" json:"last_name,omitempty"`
	PasswordHash string    `bson:"password_hash" json:"password_hash,omitempty" validate:"required"`
	CreatedAt    time.Time `bson:"created_at" json:"created_at" bson:"created_at"`
}

type LoginData struct {
	Email    string `json:"email,omitempty" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type APIKey struct {
	AccessToken  string `bson:"access_token" json:"access_token"`
	RefreshToken string `bson:"refresh_token" json:"refresh_token"`
	ExpiresAt    int64  `bson:"expires_at" json:"expires_at"`
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

func (u *User) Serialize() {
	if u.CreatedAt.IsZero() {
		u.CreatedAt = time.Now()
	}
}

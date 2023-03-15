package db

import (
	"context"
	"log"
	"time"

	"github.com/ArseniSkobelev/haudal/codebase/api-keys/internal/env"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connect() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(env.GetEnvValue("MONGO_URI", env.DEV)))

	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("%v Connection to the database established successfully", env.GetEnvValue("LOG_PREFIX", env.DEV))

	return client
}

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	collection := client.Database(env.GetEnvValue("DB_NAME", env.DEV)).Collection(collectionName)
	return collection
}

var DB *mongo.Client = connect()

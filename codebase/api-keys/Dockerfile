FROM golang:latest

WORKDIR /usr/src/haudal-api-keys

ENV SECRET_KEY=
ENV MONGO_URI=
ENV DB_NAME="haudal-api-keys"
ENV API_PORT=
ENV LOG_PREFIX="[Haudal API keys]"
ENV APP_NAME="haudal-api-keys"
ENV BASE_URL="http://localhost:19000"

COPY . .
RUN go mod tidy

WORKDIR /usr/src/haudal-api-keys/cmd/app

RUN go build -o /haudal-api-keys

EXPOSE ${API_PORT}

CMD [ "/haudal-api-keys" ]
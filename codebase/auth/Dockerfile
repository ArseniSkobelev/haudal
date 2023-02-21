FROM golang:latest

WORKDIR /usr/src/haudal-auth

ENV SECRET_KEY=
ENV MONGO_URI=
ENV DB_NAME="haudal-auth"
ENV API_PORT=
ENV LOG_PREFIX="[Haudal Authentication]"
ENV APP_NAME="haudal-auth"
ENV SESSION_MAX_AGE=3600

COPY . .
RUN go mod tidy

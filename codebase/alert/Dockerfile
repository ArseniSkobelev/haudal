FROM golang:latest

WORKDIR /usr/src/alert

ENV DB_NAME=alert
ENV API_PORT=
ENV LOG_PREFIX="[alert]"
ENV APP_NAME="alert"

COPY . .
RUN go mod tidy

WORKDIR /usr/src/alert/cmd/app

RUN go build -o /alert

EXPOSE 

CMD [ "/alert" ]
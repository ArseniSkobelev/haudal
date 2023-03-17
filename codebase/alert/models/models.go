// alert

package models

type AlertData struct {
	Body string `json:"body"`
	To   string `json:"to"`
	// AlertSubject string `json: "alert_subject"`
	Header string `json:"header"`
}

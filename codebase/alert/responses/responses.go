// alert

package responses

type GenericResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Success bool   `json:"success"`
}

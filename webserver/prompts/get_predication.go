package prompts

import (
	"encoding/json"
	"net/http"
)

type GetPredictionResponse struct {
	ID      string   `json:"id"`
	Version string   `json:"version"`
	Output  []string `json:"output"`
	Error   string   `json:"error"`
	Status  string   `json:"status"`
}

func GetPrediction(predicateId string) (*GetPredictionResponse, error) {
	url := baseUrl + "/v1/predictions/" + predicateId
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Token "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var data GetPredictionResponse
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

package prompts

import (
	"encoding/json"
	"net/http"
)

type GetProgressResponse struct {
	Code     int    `json:"code"`     // : 0,
	TaskId   int    `json:"task_id"`  // : 148947855,
	Progress int    `json:"progress"` // : -1,
	Url      string `json:"url"`      // : "",
	Filename string `json:"filename"` // : "",
	Size     int    `json:"size"`     // : 0,
	Width    int    `json:"width"`    // : 0,
	Height   int    `json:"height"`   // : 0,
	Errmsg   string `json:"errmsg"`   // : ""
}

func GetProgress(taskID string) (*GetProgressResponse, error) {
	url := baseUrl + "/v1/image/query?task_id=" + taskID
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var data GetProgressResponse
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

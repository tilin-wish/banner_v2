package prompts

import (
	"bytes"
	"encoding/json"
	"net/http"
)

const baseUrl = "https://api.easyopen.chat"
const token = "Bearer sk-gptallVebKXq3OBjGfEtWQuA91PFrBZVaB2DhKdRn3jHKRXM"

type SubmitPromptResponse struct {
	Code     int    `json:"code"`     // : 0,
	TaskID   int    `json:"task_id"`  // : 169932301,
	Progress int    `json:"progress"` // : 0,
	Url      string `json:"url"`      // : "",
	Filename string `json:"filename"` // : "",
	Size     int    `json:"size"`     // : 0,
	Width    int    `json:"width"`    // : 0,
	Height   int    `json:"height"`   // : 0,
	Errmsg   string `json:"errmsg"`   // : ""
}

func submitPrompt(prompt string) (*SubmitPromptResponse, error) {
	reqBody := map[string]any{
		"prompt": prompt,
		"mode":   1,
		"speed":  2,
		"async":  true,
		"stream": false,
	}

	b, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	url := baseUrl + "/v1/image/imagine"
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(b))
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
	var data SubmitPromptResponse
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

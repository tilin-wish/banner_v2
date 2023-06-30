package prompts

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
)

var apiKey string

func init() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	apiKey = os.Getenv("API_KEY")
}

func GenPrompts(theme string) string {
	contextTxt := `Stable Diffusion is an AI art generation model similar to DALLE-2.
Here are some prompts for generating art with Stable Diffusion. 
The generated picture is used for the Banner of an e-commerce web App, and the style cannot be gloomy or revealing, and there is no clear frontal face of the person.
The given theme is ` + theme + ` The prompt should adhere to and include all of the following rules:
- Generate only one prompt.
- Prompt should always be written in English, regardless of the input language. Please provide the prompts in English.
- Each prompt should consist of a description of the scene followed by modifiers divided by commas.
- The modifiers should alter the mood, style, lighting, and other aspects of the scene.
- Multiple modifiers can be used to provide more specific details.
- When generating prompts, reduce abstract psychological and emotional descriptions.
- Use affirmative sentences and avoid using negative sentences.
- Describe what you want clearly and avoid using abstract vocabulary.
- Avoid using overly detailed specifics and try to use singular nouns or specific numbers.
- Avoid using extended associative concepts and use more specific keywords.
- Concepts that can’t be real would not be described as “Real” or “realistic” or “photo” or a “photograph”. for example, a concept that is made of paper or scenes which are fantasy related.
- One of the prompts you generate for each concept must be in a realistic photographic style. you should also choose a lens type and size for it. Don’t choose an artist for the realistic photography prompts.
- Separate the different prompts with two new lines.`

	client := openai.NewClient(apiKey)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleAssistant,
					Content: contextTxt,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return ""
	}

	prompt := resp.Choices[0].Message.Content
	return prompt
}

func submitPost(url string, data map[string]interface{}) (*http.Response, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Token "+token)
	req.Header.Set("Content-Type", "application/json")
	return http.DefaultClient.Do(req)
}

func saveEncodedImage(b64Image string, outputPath string) error {
	decodedData, err := base64.StdEncoding.DecodeString(b64Image)
	if err != nil {
		return err
	}
	err = os.WriteFile(outputPath, decodedData, 0644)
	if err != nil {
		return err
	}
	return nil
}

type GenImageResponse struct {
	Prompt string                `json:"prompt"`
	Task   *SubmitPromptResponse `json:"task"`
}

func GenImage(theme string) (*GenImageResponse, error) {
	prompt := GenPrompts(theme)
	fmt.Println(prompt)
	task, err := submitPrompt(prompt)
	if err != nil {
		return nil, err
	}
	return &GenImageResponse{
		Prompt: prompt,
		Task:   task,
	}, nil
}

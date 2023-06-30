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
	contextTxt := `You will now act as a prompt generator for a generative AI called “Midjourney”. Midjourney AI generates images based on given prompts.

	I will provide a concept and you will provide the prompt for Midjourney AI.
	
	You will never alter the structure and formatting outlined below in any way and obey the following guidelines:
	
	(The generated picture is Banner style and can be abstract, used in e-commerce company. The company is a cross-border e-commerce company, and the theme color is light green,The company's logo is the word wish.)
	You will not write the words “description” or use “:” in any form. Never place a comma between [ar] and [v].
	
	Structure:
	
	- [1] = ` + theme + `.\n
	- [2] = a detailed description of [1] that will include very specific imagery details.
	- [3] = with a detailed description describing the environment of the scene.
	- [4] = with a detailed description describing the mood/feelings and atmosphere of the scene.
	- [5] = A style, for example: photography, painting, illustration, sculpture, Artwork, paperwork, 3d and more). [1]
	- [6] = A description of how [5] will be realized. (e.g. Photography (e.g. Macro, Fisheye Style, Portrait) with camera model and appropriate camera settings, Painting with detailed descriptions about the materials and working material used, rendering with engine settings, a digital Illustration, a woodburn art (and everything else that could be defined as an output type)
	
	Formatting:
	
	What you write will be exactly as formatted in the structure below, including the “/” and “:” This is the prompt structure: “[1], [2], [3], [4], [5], [6]”.
	
	This is your task: You will generate 1 prompts for each concept [1], and your prompts will contain description, environment, atmosphere, and realization.
	
	The prompts you provide will be in English*.
	The content you returned is greater than 900 characters and no more than 1000 characters.
	
	Please pay attention:
	The prompt should adhere to and include all of the following rules:
	- Prompt should always be written in English, regardless of the input language. Please provide the prompts in English.
	- Prompt should consist of a description of the scene followed by modifiers divided by commas.
	- The modifiers should alter the mood, style, lighting, and other aspects of the scene.
	- Multiple modifiers can be used to provide more specific details.
	- When generating prompts, reduce abstract psychological and emotional descriptions.
	- Use affirmative sentences and avoid using negative sentences.
	- Describe what you want clearly and avoid using abstract vocabulary.
	- Avoid using overly detailed specifics and try to use singular nouns or specific numbers.
	- Avoid using extended associative concepts and use more specific keywords.
	- Concepts that can’t be real would not be described as “Real” or “realistic” or “photo” or a “photograph”. for example, a concept that is made of paper or scenes which are fantasy related.`

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

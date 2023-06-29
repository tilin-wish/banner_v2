package main

import (
	"banner/webserver/prompts"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("./webclient/dist", true)))
	r.Use(cors.Default())
	api := r.Group("/api")
	{
		api.GET("/prompts", GetPromptsHandler())
		api.GET("/images", GenImageHandler())
	}

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	log.Fatal(r.Run())
}

func GetPromptsHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		theme, ok := c.GetQuery("theme")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "theme is required"})
			return
		}
		output := prompts.GenPrompts(theme)
		c.JSON(http.StatusOK, gin.H{
			"prompts": output,
		})
	}
}

func GenImageHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		maxNumParam, ok := c.GetQuery("maxNum")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "maxNum is required"})
			return
		}

		maxNum, err := strconv.Atoi(maxNumParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "maxNum must be number"})
			return
		}

		theme, ok := c.GetQuery("theme")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "theme is required"})
			return
		}

		prompts.GenImage(theme, maxNum)
		c.JSON(http.StatusOK, gin.H{
			"message": "success",
		})
	}
}

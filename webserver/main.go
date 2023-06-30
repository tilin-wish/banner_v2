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
		api.POST("/images", GenImageHandler())
		api.GET("/tasks", GetTaskHandler())
		api.GET("/upscale", UpscaleHandler())
	}

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	log.Fatal(r.Run())
}

func UpscaleHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID, ok := c.GetQuery("task_id")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "taskID is required"})
			return
		}
		id, err := strconv.Atoi(taskID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "task_id must be number "})
			return
		}
		index, ok := c.GetQuery("index")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "index is required "})
			return
		}
		i, err := strconv.Atoi(index)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "index must be number "})
			return
		}

		res, err := prompts.UpscaleImage(id, i)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		c.JSON(http.StatusOK, res)
	}
}

func GenImageHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		theme, ok := c.GetQuery("theme")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "theme is required"})
			return
		}

		res, err := prompts.GenImage(theme)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, res)
	}
}

func GetTaskHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID, ok := c.GetQuery("task_id")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "theme is required"})
			return
		}

		res, err := prompts.GetProgress(taskID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, res)
	}
}

func GetPredicationHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		predicateId := c.Param("predicateId")
		output, err := prompts.GetPrediction(predicateId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, output)
	}
}

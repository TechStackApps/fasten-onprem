package handler

import (
	"github.com/fastenhealth/fasten-onprem/backend/pkg"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/database"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// GetCurrentUser returns the current authenticated user's information
func GetCurrentUser(c *gin.Context) {
	logger := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		logger.Errorln("An error occurred while getting current user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get user information"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user": gin.H{
				"id":       currentUser.ID,
				"username": currentUser.Username,
				"email":    currentUser.Email,
				"fullName": currentUser.FullName,
				"role":     currentUser.Role,
				"picture":  currentUser.Picture,
			},
		},
	})
}

// UX: this is a secure endpoint, and should only be called after a double confirmation
func DeleteAccount(c *gin.Context) {
	logger := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	err := databaseRepo.DeleteCurrentUser(c)

	if err != nil {
		logger.Errorln("An error occurred while deleting current user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

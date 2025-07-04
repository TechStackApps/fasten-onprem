package handler

import (
	"net"
	"net/http"

	"github.com/fastenhealth/fasten-onprem/backend/pkg"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/auth"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/config"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/database"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	databaseModel "github.com/fastenhealth/fasten-onprem/backend/pkg/models/database"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func InitiateSync(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	appConfig := c.MustGet(pkg.ContextKeyTypeConfig).(config.Interface)

	log.Debug("Attempting to get current user for sync initiation")
	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}
	log.Debugf("Successfully retrieved user: %s", currentUser.Username)

	syncToken, err := auth.JwtGenerateSyncToken(*currentUser, appConfig.GetString("jwt.issuer.key"))
	if err != nil {
		log.Errorf("Failed to generate sync token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	log.Debug("Successfully generated sync token")

	// Get local IP address
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		log.Errorf("Failed to get local IP address: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get local IP address"})
		return
	}
	log.Debug("Successfully retrieved network interfaces")

	var ipAddress string
	for _, addr := range addrs {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ipAddress = ipnet.IP.String()
				break
			}
		}
	}

	log.Debugf("Responding with sync data: token=%s, address=%s, port=%s", syncToken, ipAddress, appConfig.GetString("web.listen.port"))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"token":   syncToken,
			"address": ipAddress,
			"port":    appConfig.GetString("web.listen.port"),
		},
	})
}

func SyncData(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	// The JWT is passed in the Authorization header, so we can use the existing GetCurrentUser middleware
	log.Debug("Attempting to get current user for sync data")
	_, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}
	log.Debug("Successfully retrieved user for sync data")
	// an empty query will return all resources for the user
	log.Debug("Querying all resources for user")
	allResources := make([]interface{}, 0)
	for _, resourceType := range databaseModel.GetAllowedResourceTypes() {
		resources, err := databaseRepo.QueryResources(c, models.QueryResource{
			From: resourceType,
		})
		if err != nil {
			log.Errorf("Failed to get resources of type %s: %v", resourceType, err)
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get resources"})
			return
		}
		//append to allResources
		allResources = append(allResources, resources)
	}
	log.Debugf("Successfully retrieved %d resources", len(allResources))

	lastUpdated, err := databaseRepo.GetLastUpdatedTimestamp(c)
	if err != nil {
		log.Errorf("Failed to get last updated timestamp: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get last updated timestamp"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"resources":    allResources,
			"last_updated": lastUpdated,
		},
	})
}

func GetLastUpdated(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	log.Debug("Attempting to get current user for last updated timestamp")
	_, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}
	log.Debug("Successfully retrieved user for last updated timestamp")

	lastUpdated, err := databaseRepo.GetLastUpdatedTimestamp(c)
	if err != nil {
		log.Errorf("Failed to get last updated timestamp: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get last updated timestamp"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"last_updated": lastUpdated,
		},
	})
}

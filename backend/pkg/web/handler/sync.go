package handler

import (
	"encoding/json"
	"fmt"
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
	ipAddress := appConfig.GetString("web.listen.external_host")
	if ipAddress == "" {
		addrs, err := net.InterfaceAddrs()
		if err != nil {
			log.Errorf("Failed to get local IP address: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get local IP address"})
			return
		}
		log.Debug("Successfully retrieved network interfaces")

		for _, addr := range addrs {
			if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
				if ipnet.IP.To4() != nil {
					ipAddress = ipnet.IP.String()
					break
				}
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

		if resources != nil {
			for _, r := range resources.([]models.ResourceBase) {
				allResources = append(allResources, r)
			}
		}
	}
	log.Debugf("Successfully retrieved %d resources", len(allResources))

	// lastUpdated, err := databaseRepo.GetLastUpdatedTimestamp(c)
	// if err != nil {
	// 	log.Errorf("Failed to get last updated timestamp: %v", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get last updated timestamp"})
	// 	return
	// }

	// sources, err := databaseRepo.GetSources(c)
	// if err != nil {
	// 	log.Errorf("Failed to get sources: %v", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get sources"})
	// 	return
	// }

	bundle := models.FhirBundle{
		ResourceType: "Bundle",
		Type:         "collection",
		Total:        len(allResources),
		Entry:        make([]models.BundleEntry, len(allResources)),
	}

	for i, resource := range allResources {
		bundle.Entry[i] = models.BundleEntry{
			Resource: resource,
		}
	}

	// ---- ADD THIS CODE FOR DEBUGGING ----
	bundleBytes, _ := json.MarshalIndent(bundle, "", "  ")
	fmt.Println("--- BEGIN DEBUG BUNDLE ---")
	fmt.Println(string(bundleBytes))
	fmt.Println("--- END DEBUG BUNDLE ---")
	// ------------------------------------

	c.JSON(http.StatusOK, bundle)
}

func GetResourceTypes(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	log.Debug("Getting all resource types")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    databaseModel.GetAllowedResourceTypes(),
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

func SyncDataUpdates(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	log.Debug("Attempting to get current user for sync data updates")
	_, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}
	log.Debug("Successfully retrieved user for sync data updates")

	since := c.Query("since")
	if since == "" {
		log.Error("Missing 'since' query parameter")
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Missing 'since' query parameter"})
		return
	}

	log.Debugf("Querying all resources for user since %s", since)
	allResources := make([]interface{}, 0)
	for _, resourceType := range databaseModel.GetAllowedResourceTypes() {
		resources, err := databaseRepo.QueryResources(c, models.QueryResource{
			From: resourceType,
			// Where: []models.QueryWhere{
			// 	{
			// 		Field:    "updated_at",
			// 		Operator: ">",
			// 		Value:    since,
			// 	},
			// },
		})
		if err != nil {
			log.Errorf("Failed to get resources of type %s: %v", resourceType, err)
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get resources"})
			return
		}

		if resources != nil {
			for _, r := range resources.([]models.ResourceBase) {
				allResources = append(allResources, r)
			}
		}
	}
	log.Debugf("Successfully retrieved %d resources", len(allResources))

	// lastUpdated, err := databaseRepo.GetLastUpdatedTimestamp(c)
	// if err != nil {
	// 	log.Errorf("Failed to get last updated timestamp: %v", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get last updated timestamp"})
	// 	return
	// }

	// sources, err := databaseRepo.GetSources(c)
	// if err != nil {
	// 	log.Errorf("Failed to get sources: %v", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get sources"})
	// 	return
	// }

	bundle := models.FhirBundle{
		ResourceType: "Bundle",
		Type:         "collection",
		Total:        len(allResources),
		Entry:        make([]models.BundleEntry, len(allResources)),
	}

	for i, resource := range allResources {
		bundle.Entry[i] = models.BundleEntry{
			Resource: resource,
		}
	}

	// ---- ADD THIS CODE FOR DEBUGGING ----
	bundleBytes, _ := json.MarshalIndent(bundle, "", "  ")
	fmt.Println("--- BEGIN DEBUG BUNDLE ---")
	fmt.Println(string(bundleBytes))
	fmt.Println("--- END DEBUG BUNDLE ---")
	// ------------------------------------

	c.JSON(http.StatusOK, bundle)
}

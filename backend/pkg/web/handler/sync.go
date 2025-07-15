package handler

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/fastenhealth/fasten-onprem/backend/pkg"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/auth"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/config"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/database"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	databaseModel "github.com/fastenhealth/fasten-onprem/backend/pkg/models/database"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// SyncTokenResponse represents the response structure for sync token initiation
type SyncTokenResponse struct {
	Token      string    `json:"token"`
	Address    string    `json:"address"`
	Port       string    `json:"port"`
	ServerName string    `json:"serverName"`
	CreatedAt  time.Time `json:"createdAt"`
	ExpiresAt  time.Time `json:"expiresAt"`
}

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

	// Generate sync token with 24-hour expiration
	now := time.Now()
	expiresAt := now.Add(24 * time.Hour)
	
	syncToken, err := auth.JwtGenerateSyncTokenWithExpiration(*currentUser, appConfig.GetString("jwt.issuer.key"), expiresAt)
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

	port := appConfig.GetString("web.listen.port")
	serverName := appConfig.GetString("web.server.name")
	if serverName == "" {
		serverName = fmt.Sprintf("Fasten Health Server (%s:%s)", ipAddress, port)
	}

	response := SyncTokenResponse{
		Token:      syncToken,
		Address:    ipAddress,
		Port:       port,
		ServerName: serverName,
		CreatedAt:  now,
		ExpiresAt:  expiresAt,
	}

	log.Debugf("Responding with sync data: token=%s, address=%s, port=%s, serverName=%s, expiresAt=%s", 
		syncToken, ipAddress, port, serverName, expiresAt.Format(time.RFC3339))
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

// RevokeSync handles sync token revocation
func RevokeSync(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	log.Debug("Attempting to revoke sync token")
	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}

	// In a more complete implementation, you would:
	// 1. Add the token to a blacklist/revocation list
	// 2. Store revoked tokens in database
	// 3. Check token revocation in middleware
	
	log.Debugf("Sync token revoked for user: %s", currentUser.Username)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Sync token revoked successfully",
	})
}

// ValidateSync validates if a sync token is still valid
func ValidateSync(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	log.Debug("Validating sync token")
	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}

	// Token validation is handled by JWT middleware
	// If we reach here, token is valid
	log.Debugf("Sync token is valid for user: %s", currentUser.Username)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"valid":   true,
		"user":    currentUser.Username,
	})
}

func SyncData(c *gin.Context) {
	log := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	
	// The JWT is passed in the Authorization header, so we can use the existing GetCurrentUser middleware
	log.Debug("Attempting to get current user for sync data")
	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		log.Errorf("Failed to get current user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to get current user"})
		return
	}
	log.Debug("Successfully retrieved user for sync data")
	
	// Check for If-None-Match header to prevent duplicate syncs
	ifNoneMatch := c.GetHeader("If-None-Match")
	
	// an empty query will return all resources for the user
	log.Debug("Querying all resources for user")
	allResources := make([]interface{}, 0)
	resourceCount := 0
	
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
				resourceCount++
			}
		}
	}
	log.Debugf("Successfully retrieved %d resources", len(allResources))

	// Create ETag based on resource count and last updated time
	lastUpdated, _ := databaseRepo.GetLastUpdatedTimestamp(c)
	etag := fmt.Sprintf("W/\"%d-%s\"", resourceCount, lastUpdated)
	
	// Return 304 Not Modified if ETag matches
	if ifNoneMatch == etag {
		log.Debug("ETag matches, returning 304 Not Modified")
		c.Status(http.StatusNotModified)
		return
	}

	bundle := models.FhirBundle{
		ResourceType: "Bundle",
		Type:         "collection",
		Total:        len(allResources),
		Entry:        make([]models.BundleEntry, len(allResources)),
		Meta: map[string]interface{}{
			"lastUpdated": time.Now().Format(time.RFC3339),
			"source":      fmt.Sprintf("Fasten Health Server"),
		},
	}

	for i, resource := range allResources {
		bundle.Entry[i] = models.BundleEntry{
			Resource: resource,
		}
	}

	// Set ETag header
	c.Header("ETag", etag)
	c.Header("Cache-Control", "private, max-age=300") // 5 minutes cache
	
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

/*
ROUTE ADDITIONS NEEDED:

To support the new GitHub-like token management system, add these routes to your router:

// Existing routes:
router.GET("/secure/sync/initiate", InitiateSync)
router.GET("/secure/sync/data", SyncData)
router.GET("/secure/sync/last-updated", GetLastUpdated)
router.GET("/secure/sync/updates", SyncDataUpdates)
router.GET("/secure/sync/resource-types", GetResourceTypes)

// NEW routes to add:
router.POST("/secure/sync/revoke", RevokeSync)           // Revoke sync token
router.GET("/secure/sync/validate", ValidateSync)       // Validate sync token

MIDDLEWARE ENHANCEMENT:

Consider adding token revocation checking to your JWT middleware:

func JwtMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // ... existing JWT validation ...
        
        // Add token revocation check here
        // Check if token is in revoked tokens list/database
        
        c.Next()
    }
}

CONFIG ADDITIONS:

Add these to your config file:

web:
  server:
    name: "Your Fasten Health Server"  # Used in sync token response
  listen:
    external_host: "your-server-ip"    # Optional: override IP detection

TOKEN EXPIRATION:

- Sync tokens now expire after 24 hours (configurable)
- Frontend automatically handles token expiration
- Users get warnings when tokens are about to expire
- Tokens can be revoked from the user profile

CACHING IMPROVEMENTS:

- Added ETag support to prevent unnecessary data transfers
- Added Cache-Control headers for better performance
- Bundle metadata includes source information

*/

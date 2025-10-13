package handler

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"

	"github.com/fastenhealth/fasten-onprem/backend/pkg"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/config"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/database"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	"github.com/gin-gonic/gin"
	"github.com/go-ldap/ldap/v3"
)

// Helper function to generate a random password for OIDC-created users
func generateRandomPassword() string {
	bytes := make([]byte, 16)
	_, _ = rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func TestLDAPConnection(c *gin.Context) {
	var req struct {
		URL        string `json:"url"`
		BindDN     string `json:"bindDN"`
		Password   string `json:"password"`
		BaseDN     string `json:"baseDN"`
		UserFilter string `json:"userFilter"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	l, err := ldap.DialURL(req.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("failed to connect: %v", err)})
		return
	}
	defer l.Close()

	// Bind as admin to check credentials
	if err := l.Bind(req.BindDN, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "invalid credentials"})
		return
	}

	// Optional: search first 5 users as preview
	searchReq := ldap.NewSearchRequest(
		req.BaseDN,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 5, false,
		req.UserFilter,
		[]string{"dn", "uid", "cn", "mail"},
		nil,
	)
	sr, err := l.Search(searchReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("search failed: %v", err)})
		return
	}

	users := make([]map[string]string, len(sr.Entries))
	for i, e := range sr.Entries {
		users[i] = map[string]string{
			"dn":   e.DN,
			"uid":  e.GetAttributeValue("uid"),
			"cn":   e.GetAttributeValue("cn"),
			"mail": e.GetAttributeValue("mail"),
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "preview": users})
}

func GetLDAPAuditLogs(c *gin.Context) {
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	logs, err := databaseRepo.GetLDAPAuditLogs(c, 50) // fetch last 50 logs
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "logs": logs})
}

func ImportUsersFromLDAP(c *gin.Context) {
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	appConfig := c.MustGet(pkg.ContextKeyTypeConfig).(config.Interface)

	ldapURL := appConfig.GetString("web.ldap.url")
	baseDN := appConfig.GetString("web.ldap.base_dn")
	bindDN := appConfig.GetString("web.ldap.bind_dn")
	bindPass := appConfig.GetString("web.ldap.bind_pass")
	userFilter := appConfig.GetString("web.ldap.user_filter")

	l, err := ldap.DialURL(ldapURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("failed to connect: %v", err)})
		return
	}
	defer l.Close()

	if err := l.Bind(bindDN, bindPass); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "invalid LDAP credentials"})
		return
	}

	searchReq := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false,
		userFilter,
		[]string{"dn", "uid", "cn", "mail"},
		nil,
	)
	sr, err := l.Search(searchReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("LDAP search failed: %v", err)})
		return
	}

	importedCount := 0
	for _, e := range sr.Entries {
		user := models.User{
			Username: e.GetAttributeValue("uid"),
			Email:    e.GetAttributeValue("mail"),
			FullName: e.GetAttributeValue("cn"),
			AuthType: "LDAP",
			SourceDN: e.DN,
			Password: generateRandomPassword(), // random password, won't be used
		}

		if err := databaseRepo.CreateUser(c, &user); err == nil {
			importedCount++
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": fmt.Sprintf("%d users imported from LDAP", importedCount)})
}

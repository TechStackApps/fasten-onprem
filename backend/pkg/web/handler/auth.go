package handler

import (
	"fmt"
	"net/http"

	"github.com/fastenhealth/fasten-onprem/backend/pkg"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/auth"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/config"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/database"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	"github.com/fastenhealth/fasten-onprem/backend/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-ldap/ldap/v3"
	"github.com/sirupsen/logrus"
)

type UserWizard struct {
	*models.User    `json:",inline"`
	JoinMailingList bool `json:"join_mailing_list"`
}

func IsAdmin(c *gin.Context) bool {
	logger := c.MustGet(pkg.ContextKeyTypeLogger).(*logrus.Entry)
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)

	currentUser, err := databaseRepo.GetCurrentUser(c)
	if err != nil {
		logger.Errorf("Error getting current user: %v", err)
		return false
	}
	return currentUser.Role == pkg.UserRoleAdmin
}

func AuthSignup(c *gin.Context) {
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	appConfig := c.MustGet(pkg.ContextKeyTypeConfig).(config.Interface)

	var userWizard UserWizard
	if err := c.ShouldBindJSON(&userWizard); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Check if this is the first user in the database
	userCount, err := databaseRepo.GetUserCount(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to check user count"})
		return
	}

	if userCount == 0 {
		userWizard.User.Role = pkg.UserRoleAdmin
	} else {
		userWizard.User.Role = pkg.UserRoleUser
	}
	err = databaseRepo.CreateUser(c, userWizard.User)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	//TODO: we can derive the encryption key and the hash'ed user from the responseData sub. For now the Sub will be the user id prepended with hello.
	userFastenToken, err := auth.JwtGenerateFastenTokenFromUser(*userWizard.User, appConfig.GetString("jwt.issuer.key"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	//check if the user wants to join the mailing list
	if userWizard.JoinMailingList {
		//ignore error messages, we don't want to block the user from signing up
		utils.JoinNewsletter(userWizard.FullName, userWizard.Email, "", "")
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": userFastenToken})
}

func AuthSignin(c *gin.Context) {
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	appConfig := c.MustGet(pkg.ContextKeyTypeConfig).(config.Interface)

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	foundUser, err := databaseRepo.GetUserByUsername(c, user.Username)
	if err != nil || foundUser == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("could not find user: %s", user.Username)})
		return
	}

	err = foundUser.CheckPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": fmt.Sprintf("username or password does not match: %s", user.Username)})
		return
	}

	//TODO: we can derive the encryption key and the hash'ed user from the responseData sub. For now the Sub will be the user id prepended with hello.
	userFastenToken, err := auth.JwtGenerateFastenTokenFromUser(*foundUser, appConfig.GetString("jwt.issuer.key"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": userFastenToken})
}

func AuthSigninLDAP(c *gin.Context) {
	databaseRepo := c.MustGet(pkg.ContextKeyTypeDatabase).(database.DatabaseRepository)
	appConfig := c.MustGet(pkg.ContextKeyTypeConfig).(config.Interface)

	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Find user in local DB
	foundUser, err := databaseRepo.GetUserByUsername(c, creds.Username)
	if err != nil || foundUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": fmt.Sprintf("user not found: %s", creds.Username)})
		return
	}

	// Check if the user is tagged as LDAP
	if foundUser.AuthType != "LDAP" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "user is not configured for LDAP authentication"})
		return
	}

	// Get LDAP connection config from app config or DB
	ldapURL := appConfig.GetString("web.ldap.url")            // e.g. ldap://localhost:389
	baseDN := appConfig.GetString("web.ldap.base_dn")         // e.g. dc=fasten,dc=local
	bindDN := appConfig.GetString("web.ldap.bind_dn")         // e.g. cn=admin,dc=fasten,dc=local
	bindPassword := appConfig.GetString("web.ldap.bind_pass") // e.g. admin

	l, err := ldap.DialURL(ldapURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("LDAP connection failed: %v", err)})
		return
	}
	defer l.Close()

	// Bind as admin to search for the user's DN
	if err := l.Bind(bindDN, bindPassword); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": fmt.Sprintf("LDAP bind failed: %v", err)})
		return
	}

	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false,
		fmt.Sprintf("(uid=%s)", creds.Username),
		[]string{"dn"},
		nil,
	)

	sr, err := l.Search(searchRequest)
	if err != nil || len(sr.Entries) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "LDAP user not found"})
		return
	}

	userDN := sr.Entries[0].DN

	// Try binding as the user to verify password
	if err := l.Bind(userDN, creds.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "invalid LDAP credentials"})
		return
	}

	// Generate Fasten token just like normal signin
	userFastenToken, err := auth.JwtGenerateFastenTokenFromUser(*foundUser, appConfig.GetString("jwt.issuer.key"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": userFastenToken})
}

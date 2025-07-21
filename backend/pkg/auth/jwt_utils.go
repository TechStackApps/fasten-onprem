package auth

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	"github.com/golang-jwt/jwt/v4"
)

// generateToken is a helper to generate JWT tokens with flexible claims
func generateToken(user models.User, issuerSigningKey string, expiresAt time.Time, tokenID, userAgent, tokenType string) (string, error) {
	if len(strings.TrimSpace(issuerSigningKey)) == 0 {
		return "", fmt.Errorf("issuer signing key cannot be empty")
	}
	claims := UserRegisteredClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "docker-fastenhealth",
			Subject:   user.Username,
		},
		UserMetadata: UserMetadata{
			FullName: user.FullName,
			Email:    user.Email,
			Role:     user.Role,
		},
		TokenID:   tokenID,
		UserAgent: userAgent,
		TokenType: tokenType,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(issuerSigningKey))
}

// JwtGenerateFastenTokenFromUser generates a standard user token
func JwtGenerateFastenTokenFromUser(user models.User, issuerSigningKey string) (string, error) {
	return generateToken(user, issuerSigningKey, time.Now().Add(1*time.Hour), "", "", "")
}

func JwtGenerateSyncToken(user models.User, issuerSigningKey string) (string, error) {
	if len(strings.TrimSpace(issuerSigningKey)) == 0 {
		return "", fmt.Errorf("issuer signing key cannot be empty")
	}
	//log.Printf("ISSUER KEY: " + issuerSigningKey)
	userClaims := UserRegisteredClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "docker-fastenhealth",
			Subject:   user.Username,
		},
		UserMetadata: UserMetadata{
			FullName: user.FullName,
			Email:    user.Email,
			Role:     user.Role,
		},
	}

	//FASTEN_JWT_ISSUER_KEY
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, userClaims)
	//token.Header["kid"] = "docker"
	tokenString, err := token.SignedString([]byte(issuerSigningKey))

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// JwtGenerateSyncTokenWithExpiration generates a sync token with custom expiration time
func JwtGenerateSyncTokenWithExpiration(user models.User, issuerSigningKey string, expiresAt time.Time) (string, error) {
	if len(strings.TrimSpace(issuerSigningKey)) == 0 {
		return "", fmt.Errorf("issuer signing key cannot be empty")
	}
	
	userClaims := UserRegisteredClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "docker-fastenhealth-sync",
			Subject:   user.Username,
		},
		UserMetadata: UserMetadata{
			FullName: user.FullName,
			Email:    user.Email,
			Role:     user.Role,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, userClaims)
	tokenString, err := token.SignedString([]byte(issuerSigningKey))

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// JwtValidateSyncToken validates a sync token and checks expiration
func JwtValidateSyncToken(encryptionKey string, signedToken string) (*UserRegisteredClaims, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&UserRegisteredClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(encryptionKey), nil
		},
	)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*UserRegisteredClaims)
	if !ok {
		err = errors.New("couldn't parse claims")
		return nil, err
	}
	if claims.ExpiresAt.Unix() < time.Now().Local().Unix() {
		err = errors.New("sync token expired")
		return nil, err
	}
	return claims, nil
}

func JwtValidateFastenToken(encryptionKey string, signedToken string) (*UserRegisteredClaims, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&UserRegisteredClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(encryptionKey), nil
		},
	)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*UserRegisteredClaims)
	if !ok {
		err = errors.New("couldn't parse claims")
		return nil, err
	}
	if claims.ExpiresAt.Unix() < time.Now().Local().Unix() {
		err = errors.New("token expired")
		return nil, err
	}
	return claims, nil
}

// JwtGenerateSyncToken generates a sync token with custom expiration and metadata
func JwtGenerateSyncToken(user models.User, issuerSigningKey string, expiresAt time.Time, tokenID string, userAgent string) (string, error) {
	return generateToken(user, issuerSigningKey, expiresAt, tokenID, userAgent, "sync")
}

// GetTokenIDFromToken extracts the token ID from a token
func GetTokenIDFromToken(tokenString string) (string, error) {
	// Parse without validation first to get the claims
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, &UserRegisteredClaims{})
	if err != nil {
		return "", fmt.Errorf("failed to parse token: %w", err)
	}
	
	claims, ok := token.Claims.(*UserRegisteredClaims)
	if !ok {
		return "", errors.New("token is not a valid token")
	}
	
	return claims.TokenID, nil
}

package models

type AuditLogs struct {
	ModelBase
	UserID      uint   `json:"user_id"`
	Action      string `json:"action"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

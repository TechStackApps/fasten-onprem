package models

type LDAPConfig struct {
	ModelBase
	Url          string `json:"url"`
	BindDN       string `json:"bind_dn"`
	BindPassword string `json:"bind_password"`
	BaseDN       string `json:"base_dn"`
	UserFilter   string `json:"user_filter"`
}

// THIS FILE IS GENERATED BY https://github.com/fastenhealth/fasten-onprem/blob/main/backend/pkg/models/database/generate.go
// PLEASE DO NOT EDIT BY HAND

package database

import (
	"encoding/json"
	"fmt"
	goja "github.com/dop251/goja"
	models "github.com/fastenhealth/fasten-onprem/backend/pkg/models"
	datatypes "gorm.io/datatypes"
	"time"
)

type FhirMedia struct {
	models.ResourceBase
	// Procedure that caused this media to be created
	// https://hl7.org/fhir/r4/search.html#reference
	BasedOn datatypes.JSON `gorm:"column:basedOn;type:text;serializer:json" json:"basedOn,omitempty"`
	// When Media was collected
	// https://hl7.org/fhir/r4/search.html#date
	Created *time.Time `gorm:"column:created;type:datetime" json:"created,omitempty"`
	// Observing Device
	// https://hl7.org/fhir/r4/search.html#reference
	Device datatypes.JSON `gorm:"column:device;type:text;serializer:json" json:"device,omitempty"`
	// Encounter associated with media
	// https://hl7.org/fhir/r4/search.html#reference
	Encounter datatypes.JSON `gorm:"column:encounter;type:text;serializer:json" json:"encounter,omitempty"`
	// Identifier(s) for the image
	// https://hl7.org/fhir/r4/search.html#token
	Identifier datatypes.JSON `gorm:"column:identifier;type:text;serializer:json" json:"identifier,omitempty"`
	// Language of the resource content
	// https://hl7.org/fhir/r4/search.html#token
	Language datatypes.JSON `gorm:"column:language;type:text;serializer:json" json:"language,omitempty"`
	// When the resource version last changed
	// https://hl7.org/fhir/r4/search.html#date
	MetaLastUpdated *time.Time `gorm:"column:metaLastUpdated;type:datetime" json:"metaLastUpdated,omitempty"`
	// Profiles this resource claims to conform to
	// https://hl7.org/fhir/r4/search.html#reference
	MetaProfile datatypes.JSON `gorm:"column:metaProfile;type:text;serializer:json" json:"metaProfile,omitempty"`
	// Tags applied to this resource
	// https://hl7.org/fhir/r4/search.html#token
	MetaTag datatypes.JSON `gorm:"column:metaTag;type:text;serializer:json" json:"metaTag,omitempty"`
	// Tags applied to this resource
	// This is a primitive string literal (`keyword` type). It is not a recognized SearchParameter type from https://hl7.org/fhir/r4/search.html, it's Fasten Health-specific
	MetaVersionId string `gorm:"column:metaVersionId;type:text" json:"metaVersionId,omitempty"`
	// The type of acquisition equipment/process
	// https://hl7.org/fhir/r4/search.html#token
	Modality datatypes.JSON `gorm:"column:modality;type:text;serializer:json" json:"modality,omitempty"`
	// Notes/comments
	// https://hl7.org/fhir/r4/search.html#string
	Note datatypes.JSON `gorm:"column:note;type:text;serializer:json" json:"note,omitempty"`
	// The person who generated the image
	// https://hl7.org/fhir/r4/search.html#reference
	Operator datatypes.JSON `gorm:"column:operator;type:text;serializer:json" json:"operator,omitempty"`
	// Observed body part
	// https://hl7.org/fhir/r4/search.html#token
	Site datatypes.JSON `gorm:"column:site;type:text;serializer:json" json:"site,omitempty"`
	// preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown
	// https://hl7.org/fhir/r4/search.html#token
	Status datatypes.JSON `gorm:"column:status;type:text;serializer:json" json:"status,omitempty"`
	// Who/What this Media is a record of
	// https://hl7.org/fhir/r4/search.html#reference
	Subject datatypes.JSON `gorm:"column:subject;type:text;serializer:json" json:"subject,omitempty"`
	// Text search against the narrative
	// https://hl7.org/fhir/r4/search.html#string
	Text datatypes.JSON `gorm:"column:text;type:text;serializer:json" json:"text,omitempty"`
	// Classification of media as image, video, or audio
	// https://hl7.org/fhir/r4/search.html#token
	Type datatypes.JSON `gorm:"column:type;type:text;serializer:json" json:"type,omitempty"`
	// Imaging view, e.g. Lateral or Antero-posterior
	// https://hl7.org/fhir/r4/search.html#token
	View datatypes.JSON `gorm:"column:view;type:text;serializer:json" json:"view,omitempty"`
}

func (s *FhirMedia) GetSearchParameters() map[string]string {
	searchParameters := map[string]string{
		"basedOn":              "reference",
		"created":              "date",
		"device":               "reference",
		"encounter":            "reference",
		"id":                   "keyword",
		"identifier":           "token",
		"language":             "token",
		"metaLastUpdated":      "date",
		"metaProfile":          "reference",
		"metaTag":              "token",
		"metaVersionId":        "keyword",
		"modality":             "token",
		"note":                 "string",
		"operator":             "reference",
		"site":                 "token",
		"sort_date":            "date",
		"source_id":            "keyword",
		"source_resource_id":   "keyword",
		"source_resource_type": "keyword",
		"source_uri":           "keyword",
		"status":               "token",
		"subject":              "reference",
		"text":                 "string",
		"type":                 "token",
		"view":                 "token",
	}
	return searchParameters
}
func (s *FhirMedia) PopulateAndExtractSearchParameters(resourceRaw json.RawMessage) error {
	s.ResourceRaw = datatypes.JSON(resourceRaw)
	// unmarshal the raw resource (bytes) into a map
	var resourceRawMap map[string]interface{}
	err := json.Unmarshal(resourceRaw, &resourceRawMap)
	if err != nil {
		return err
	}
	if len(fhirPathJs) == 0 {
		return fmt.Errorf("fhirPathJs script is empty")
	}
	vm := goja.New()
	// setup the global window object
	vm.Set("window", vm.NewObject())
	// set the global FHIR Resource object
	vm.Set("fhirResource", resourceRawMap)
	// compile the fhirpath library
	fhirPathJsProgram, err := goja.Compile("fhirpath.min.js", fhirPathJs, true)
	if err != nil {
		return err
	}
	// compile the searchParametersExtractor library
	searchParametersExtractorJsProgram, err := goja.Compile("searchParameterExtractor.js", searchParameterExtractorJs, true)
	if err != nil {
		return err
	}
	// add the fhirpath library in the goja vm
	_, err = vm.RunProgram(fhirPathJsProgram)
	if err != nil {
		return err
	}
	// add the searchParametersExtractor library in the goja vm
	_, err = vm.RunProgram(searchParametersExtractorJsProgram)
	if err != nil {
		return err
	}
	// execute the fhirpath expression for each search parameter
	// extracting BasedOn
	basedOnResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Media.basedOn')")
	if err == nil && basedOnResult.String() != "undefined" {
		s.BasedOn = []byte(basedOnResult.String())
	}
	// extracting Created
	createdResult, err := vm.RunString("extractDateSearchParameters(fhirResource, 'Media.createdDateTime | Media.createdPeriod')")
	if err == nil && createdResult.String() != "undefined" {
		if t, err := time.Parse(time.RFC3339, createdResult.String()); err == nil {
			s.Created = &t
		} else if t, err = time.Parse("2006-01-02", createdResult.String()); err == nil {
			s.Created = &t
		} else if t, err = time.Parse("2006-01", createdResult.String()); err == nil {
			s.Created = &t
		} else if t, err = time.Parse("2006", createdResult.String()); err == nil {
			s.Created = &t
		}
	}
	// extracting Device
	deviceResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Media.device')")
	if err == nil && deviceResult.String() != "undefined" {
		s.Device = []byte(deviceResult.String())
	}
	// extracting Encounter
	encounterResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Media.encounter')")
	if err == nil && encounterResult.String() != "undefined" {
		s.Encounter = []byte(encounterResult.String())
	}
	// extracting Identifier
	identifierResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.identifier')")
	if err == nil && identifierResult.String() != "undefined" {
		s.Identifier = []byte(identifierResult.String())
	}
	// extracting Language
	languageResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'language')")
	if err == nil && languageResult.String() != "undefined" {
		s.Language = []byte(languageResult.String())
	}
	// extracting MetaLastUpdated
	metaLastUpdatedResult, err := vm.RunString("extractDateSearchParameters(fhirResource, 'meta.lastUpdated')")
	if err == nil && metaLastUpdatedResult.String() != "undefined" {
		if t, err := time.Parse(time.RFC3339, metaLastUpdatedResult.String()); err == nil {
			s.MetaLastUpdated = &t
		} else if t, err = time.Parse("2006-01-02", metaLastUpdatedResult.String()); err == nil {
			s.MetaLastUpdated = &t
		} else if t, err = time.Parse("2006-01", metaLastUpdatedResult.String()); err == nil {
			s.MetaLastUpdated = &t
		} else if t, err = time.Parse("2006", metaLastUpdatedResult.String()); err == nil {
			s.MetaLastUpdated = &t
		}
	}
	// extracting MetaProfile
	metaProfileResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'meta.profile')")
	if err == nil && metaProfileResult.String() != "undefined" {
		s.MetaProfile = []byte(metaProfileResult.String())
	}
	// extracting MetaTag
	metaTagResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'meta.tag')")
	if err == nil && metaTagResult.String() != "undefined" {
		s.MetaTag = []byte(metaTagResult.String())
	}
	// extracting MetaVersionId
	metaVersionIdResult, err := vm.RunString("extractSimpleSearchParameters(fhirResource, 'meta.versionId')")
	if err == nil && metaVersionIdResult.String() != "undefined" {
		s.MetaVersionId = metaVersionIdResult.String()
	}
	// extracting Modality
	modalityResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.modality')")
	if err == nil && modalityResult.String() != "undefined" {
		s.Modality = []byte(modalityResult.String())
	}
	// extracting Note
	noteResult, err := vm.RunString("extractStringSearchParameters(fhirResource, 'note')")
	if err == nil && noteResult.String() != "undefined" {
		s.Note = []byte(noteResult.String())
	}
	// extracting Operator
	operatorResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Media.operator')")
	if err == nil && operatorResult.String() != "undefined" {
		s.Operator = []byte(operatorResult.String())
	}
	// extracting Site
	siteResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.bodySite')")
	if err == nil && siteResult.String() != "undefined" {
		s.Site = []byte(siteResult.String())
	}
	// extracting Status
	statusResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.status')")
	if err == nil && statusResult.String() != "undefined" {
		s.Status = []byte(statusResult.String())
	}
	// extracting Subject
	subjectResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Media.subject')")
	if err == nil && subjectResult.String() != "undefined" {
		s.Subject = []byte(subjectResult.String())
	}
	// extracting Text
	textResult, err := vm.RunString("extractStringSearchParameters(fhirResource, 'text')")
	if err == nil && textResult.String() != "undefined" {
		s.Text = []byte(textResult.String())
	}
	// extracting Type
	typeResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.type')")
	if err == nil && typeResult.String() != "undefined" {
		s.Type = []byte(typeResult.String())
	}
	// extracting View
	viewResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'Media.view')")
	if err == nil && viewResult.String() != "undefined" {
		s.View = []byte(viewResult.String())
	}
	return nil
}

// TableName overrides the table name from fhir_observations (pluralized) to `fhir_observation`. https://gorm.io/docs/conventions.html#TableName
func (s *FhirMedia) TableName() string {
	return "fhir_media"
}

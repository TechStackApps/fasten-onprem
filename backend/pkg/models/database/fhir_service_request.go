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

type FhirServiceRequest struct {
	models.ResourceBase
	// Date request signed
	// https://hl7.org/fhir/r4/search.html#date
	Authored *time.Time `gorm:"column:authored;type:datetime" json:"authored,omitempty"`
	// What request fulfills
	// https://hl7.org/fhir/r4/search.html#reference
	BasedOn datatypes.JSON `gorm:"column:basedOn;type:text;serializer:json" json:"basedOn,omitempty"`
	// Where procedure is going to be done
	// https://hl7.org/fhir/r4/search.html#token
	BodySite datatypes.JSON `gorm:"column:bodySite;type:text;serializer:json" json:"bodySite,omitempty"`
	// Classification of service
	// https://hl7.org/fhir/r4/search.html#token
	Category datatypes.JSON `gorm:"column:category;type:text;serializer:json" json:"category,omitempty"`
	/*
	   Multiple Resources:

	   * [AllergyIntolerance](allergyintolerance.html): Code that identifies the allergy or intolerance
	   * [Condition](condition.html): Code for the condition
	   * [DeviceRequest](devicerequest.html): Code for what is being requested/ordered
	   * [DiagnosticReport](diagnosticreport.html): The code for the report, as opposed to codes for the atomic results, which are the names on the observation resource referred to from the result
	   * [FamilyMemberHistory](familymemberhistory.html): A search by a condition code
	   * [List](list.html): What the purpose of this list is
	   * [Medication](medication.html): Returns medications for a specific code
	   * [MedicationAdministration](medicationadministration.html): Return administrations of this medication code
	   * [MedicationDispense](medicationdispense.html): Returns dispenses of this medicine code
	   * [MedicationRequest](medicationrequest.html): Return prescriptions of this medication code
	   * [MedicationStatement](medicationstatement.html): Return statements of this medication code
	   * [Observation](observation.html): The code of the observation type
	   * [Procedure](procedure.html): A code to identify a  procedure
	   * [ServiceRequest](servicerequest.html): What is being requested/ordered
	*/
	// https://hl7.org/fhir/r4/search.html#token
	Code datatypes.JSON `gorm:"column:code;type:text;serializer:json" json:"code,omitempty"`
	/*
	   Multiple Resources:

	   * [Composition](composition.html): Context of the Composition
	   * [DeviceRequest](devicerequest.html): Encounter during which request was created
	   * [DiagnosticReport](diagnosticreport.html): The Encounter when the order was made
	   * [DocumentReference](documentreference.html): Context of the document  content
	   * [Flag](flag.html): Alert relevant during encounter
	   * [List](list.html): Context in which list created
	   * [NutritionOrder](nutritionorder.html): Return nutrition orders with this encounter identifier
	   * [Observation](observation.html): Encounter related to the observation
	   * [Procedure](procedure.html): Encounter created as part of
	   * [RiskAssessment](riskassessment.html): Where was assessment performed?
	   * [ServiceRequest](servicerequest.html): An encounter in which this request is made
	   * [VisionPrescription](visionprescription.html): Return prescriptions with this encounter identifier
	*/
	// https://hl7.org/fhir/r4/search.html#reference
	Encounter datatypes.JSON `gorm:"column:encounter;type:text;serializer:json" json:"encounter,omitempty"`
	/*
	   Multiple Resources:

	   * [AllergyIntolerance](allergyintolerance.html): External ids for this item
	   * [CarePlan](careplan.html): External Ids for this plan
	   * [CareTeam](careteam.html): External Ids for this team
	   * [Composition](composition.html): Version-independent identifier for the Composition
	   * [Condition](condition.html): A unique identifier of the condition record
	   * [Consent](consent.html): Identifier for this record (external references)
	   * [DetectedIssue](detectedissue.html): Unique id for the detected issue
	   * [DeviceRequest](devicerequest.html): Business identifier for request/order
	   * [DiagnosticReport](diagnosticreport.html): An identifier for the report
	   * [DocumentManifest](documentmanifest.html): Unique Identifier for the set of documents
	   * [DocumentReference](documentreference.html): Master Version Specific Identifier
	   * [Encounter](encounter.html): Identifier(s) by which this encounter is known
	   * [EpisodeOfCare](episodeofcare.html): Business Identifier(s) relevant for this EpisodeOfCare
	   * [FamilyMemberHistory](familymemberhistory.html): A search by a record identifier
	   * [Goal](goal.html): External Ids for this goal
	   * [ImagingStudy](imagingstudy.html): Identifiers for the Study, such as DICOM Study Instance UID and Accession number
	   * [Immunization](immunization.html): Business identifier
	   * [List](list.html): Business identifier
	   * [MedicationAdministration](medicationadministration.html): Return administrations with this external identifier
	   * [MedicationDispense](medicationdispense.html): Returns dispenses with this external identifier
	   * [MedicationRequest](medicationrequest.html): Return prescriptions with this external identifier
	   * [MedicationStatement](medicationstatement.html): Return statements with this external identifier
	   * [NutritionOrder](nutritionorder.html): Return nutrition orders with this external identifier
	   * [Observation](observation.html): The unique id for a particular observation
	   * [Procedure](procedure.html): A unique identifier for a procedure
	   * [RiskAssessment](riskassessment.html): Unique identifier for the assessment
	   * [ServiceRequest](servicerequest.html): Identifiers assigned to this order
	   * [SupplyDelivery](supplydelivery.html): External identifier
	   * [SupplyRequest](supplyrequest.html): Business Identifier for SupplyRequest
	   * [VisionPrescription](visionprescription.html): Return prescriptions with this external identifier
	*/
	// https://hl7.org/fhir/r4/search.html#token
	Identifier datatypes.JSON `gorm:"column:identifier;type:text;serializer:json" json:"identifier,omitempty"`
	// Instantiates FHIR protocol or definition
	// https://hl7.org/fhir/r4/search.html#reference
	InstantiatesCanonical datatypes.JSON `gorm:"column:instantiatesCanonical;type:text;serializer:json" json:"instantiatesCanonical,omitempty"`
	// Instantiates external protocol or definition
	// https://hl7.org/fhir/r4/search.html#uri
	InstantiatesUri string `gorm:"column:instantiatesUri;type:text" json:"instantiatesUri,omitempty"`
	// proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
	// https://hl7.org/fhir/r4/search.html#token
	Intent datatypes.JSON `gorm:"column:intent;type:text;serializer:json" json:"intent,omitempty"`
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
	// Notes/comments
	// https://hl7.org/fhir/r4/search.html#string
	Note datatypes.JSON `gorm:"column:note;type:text;serializer:json" json:"note,omitempty"`
	// When service should occur
	// https://hl7.org/fhir/r4/search.html#date
	Occurrence *time.Time `gorm:"column:occurrence;type:datetime" json:"occurrence,omitempty"`
	// Requested performer
	// https://hl7.org/fhir/r4/search.html#reference
	Performer datatypes.JSON `gorm:"column:performer;type:text;serializer:json" json:"performer,omitempty"`
	// Performer role
	// https://hl7.org/fhir/r4/search.html#token
	PerformerType datatypes.JSON `gorm:"column:performerType;type:text;serializer:json" json:"performerType,omitempty"`
	// routine | urgent | asap | stat
	// https://hl7.org/fhir/r4/search.html#token
	Priority datatypes.JSON `gorm:"column:priority;type:text;serializer:json" json:"priority,omitempty"`
	// What request replaces
	// https://hl7.org/fhir/r4/search.html#reference
	Replaces datatypes.JSON `gorm:"column:replaces;type:text;serializer:json" json:"replaces,omitempty"`
	// Who/what is requesting service
	// https://hl7.org/fhir/r4/search.html#reference
	Requester datatypes.JSON `gorm:"column:requester;type:text;serializer:json" json:"requester,omitempty"`
	// Composite Request ID
	// https://hl7.org/fhir/r4/search.html#token
	Requisition datatypes.JSON `gorm:"column:requisition;type:text;serializer:json" json:"requisition,omitempty"`
	// Specimen to be tested
	// https://hl7.org/fhir/r4/search.html#reference
	Specimen datatypes.JSON `gorm:"column:specimen;type:text;serializer:json" json:"specimen,omitempty"`
	// draft | active | on-hold | revoked | completed | entered-in-error | unknown
	// https://hl7.org/fhir/r4/search.html#token
	Status datatypes.JSON `gorm:"column:status;type:text;serializer:json" json:"status,omitempty"`
	// Search by subject
	// https://hl7.org/fhir/r4/search.html#reference
	Subject datatypes.JSON `gorm:"column:subject;type:text;serializer:json" json:"subject,omitempty"`
	// Text search against the narrative
	// https://hl7.org/fhir/r4/search.html#string
	Text datatypes.JSON `gorm:"column:text;type:text;serializer:json" json:"text,omitempty"`
}

func (s *FhirServiceRequest) GetSearchParameters() map[string]string {
	searchParameters := map[string]string{
		"authored":              "date",
		"basedOn":               "reference",
		"bodySite":              "token",
		"category":              "token",
		"code":                  "token",
		"encounter":             "reference",
		"id":                    "keyword",
		"identifier":            "token",
		"instantiatesCanonical": "reference",
		"instantiatesUri":       "uri",
		"intent":                "token",
		"language":              "token",
		"metaLastUpdated":       "date",
		"metaProfile":           "reference",
		"metaTag":               "token",
		"metaVersionId":         "keyword",
		"note":                  "string",
		"occurrence":            "date",
		"performer":             "reference",
		"performerType":         "token",
		"priority":              "token",
		"replaces":              "reference",
		"requester":             "reference",
		"requisition":           "token",
		"sort_date":             "date",
		"source_id":             "keyword",
		"source_resource_id":    "keyword",
		"source_resource_type":  "keyword",
		"source_uri":            "keyword",
		"specimen":              "reference",
		"status":                "token",
		"subject":               "reference",
		"text":                  "string",
	}
	return searchParameters
}
func (s *FhirServiceRequest) PopulateAndExtractSearchParameters(resourceRaw json.RawMessage) error {
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
	// extracting Authored
	authoredResult, err := vm.RunString("extractDateSearchParameters(fhirResource, 'ServiceRequest.authoredOn')")
	if err == nil && authoredResult.String() != "undefined" {
		if t, err := time.Parse(time.RFC3339, authoredResult.String()); err == nil {
			s.Authored = &t
		} else if t, err = time.Parse("2006-01-02", authoredResult.String()); err == nil {
			s.Authored = &t
		} else if t, err = time.Parse("2006-01", authoredResult.String()); err == nil {
			s.Authored = &t
		} else if t, err = time.Parse("2006", authoredResult.String()); err == nil {
			s.Authored = &t
		}
	}
	// extracting BasedOn
	basedOnResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.basedOn')")
	if err == nil && basedOnResult.String() != "undefined" {
		s.BasedOn = []byte(basedOnResult.String())
	}
	// extracting BodySite
	bodySiteResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.bodySite')")
	if err == nil && bodySiteResult.String() != "undefined" {
		s.BodySite = []byte(bodySiteResult.String())
	}
	// extracting Category
	categoryResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.category')")
	if err == nil && categoryResult.String() != "undefined" {
		s.Category = []byte(categoryResult.String())
	}
	// extracting Code
	codeResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'AllergyIntolerance.code | AllergyIntolerance.reaction.substance | Condition.code | (DeviceRequest.codeCodeableConcept) | DiagnosticReport.code | FamilyMemberHistory.condition.code | List.code | Medication.code | (MedicationAdministration.medicationCodeableConcept) | (MedicationDispense.medicationCodeableConcept) | (MedicationRequest.medicationCodeableConcept) | (MedicationStatement.medicationCodeableConcept) | Observation.code | Procedure.code | ServiceRequest.code')")
	if err == nil && codeResult.String() != "undefined" {
		s.Code = []byte(codeResult.String())
	}
	// extracting Encounter
	encounterResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'Composition.encounter | DeviceRequest.encounter | DiagnosticReport.encounter | DocumentReference.context.encounter.where(resolve() is Encounter) | Flag.encounter | List.encounter | NutritionOrder.encounter | Observation.encounter | Procedure.encounter | RiskAssessment.encounter | ServiceRequest.encounter | VisionPrescription.encounter')")
	if err == nil && encounterResult.String() != "undefined" {
		s.Encounter = []byte(encounterResult.String())
	}
	// extracting Identifier
	identifierResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'AllergyIntolerance.identifier | CarePlan.identifier | CareTeam.identifier | Composition.identifier | Condition.identifier | Consent.identifier | DetectedIssue.identifier | DeviceRequest.identifier | DiagnosticReport.identifier | DocumentManifest.masterIdentifier | DocumentManifest.identifier | DocumentReference.masterIdentifier | DocumentReference.identifier | Encounter.identifier | EpisodeOfCare.identifier | FamilyMemberHistory.identifier | Goal.identifier | ImagingStudy.identifier | Immunization.identifier | List.identifier | MedicationAdministration.identifier | MedicationDispense.identifier | MedicationRequest.identifier | MedicationStatement.identifier | NutritionOrder.identifier | Observation.identifier | Procedure.identifier | RiskAssessment.identifier | ServiceRequest.identifier | SupplyDelivery.identifier | SupplyRequest.identifier | VisionPrescription.identifier')")
	if err == nil && identifierResult.String() != "undefined" {
		s.Identifier = []byte(identifierResult.String())
	}
	// extracting InstantiatesCanonical
	instantiatesCanonicalResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.instantiatesCanonical')")
	if err == nil && instantiatesCanonicalResult.String() != "undefined" {
		s.InstantiatesCanonical = []byte(instantiatesCanonicalResult.String())
	}
	// extracting InstantiatesUri
	instantiatesUriResult, err := vm.RunString("extractSimpleSearchParameters(fhirResource, 'ServiceRequest.instantiatesUri')")
	if err == nil && instantiatesUriResult.String() != "undefined" {
		s.InstantiatesUri = instantiatesUriResult.String()
	}
	// extracting Intent
	intentResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.intent')")
	if err == nil && intentResult.String() != "undefined" {
		s.Intent = []byte(intentResult.String())
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
	// extracting Note
	noteResult, err := vm.RunString("extractStringSearchParameters(fhirResource, 'note')")
	if err == nil && noteResult.String() != "undefined" {
		s.Note = []byte(noteResult.String())
	}
	// extracting Occurrence
	occurrenceResult, err := vm.RunString("extractDateSearchParameters(fhirResource, 'ServiceRequest.occurrenceDateTime | ServiceRequest.occurrencePeriod | ServiceRequest.occurrenceTiming')")
	if err == nil && occurrenceResult.String() != "undefined" {
		if t, err := time.Parse(time.RFC3339, occurrenceResult.String()); err == nil {
			s.Occurrence = &t
		} else if t, err = time.Parse("2006-01-02", occurrenceResult.String()); err == nil {
			s.Occurrence = &t
		} else if t, err = time.Parse("2006-01", occurrenceResult.String()); err == nil {
			s.Occurrence = &t
		} else if t, err = time.Parse("2006", occurrenceResult.String()); err == nil {
			s.Occurrence = &t
		}
	}
	// extracting Performer
	performerResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.performer')")
	if err == nil && performerResult.String() != "undefined" {
		s.Performer = []byte(performerResult.String())
	}
	// extracting PerformerType
	performerTypeResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.performerType')")
	if err == nil && performerTypeResult.String() != "undefined" {
		s.PerformerType = []byte(performerTypeResult.String())
	}
	// extracting Priority
	priorityResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.priority')")
	if err == nil && priorityResult.String() != "undefined" {
		s.Priority = []byte(priorityResult.String())
	}
	// extracting Replaces
	replacesResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.replaces')")
	if err == nil && replacesResult.String() != "undefined" {
		s.Replaces = []byte(replacesResult.String())
	}
	// extracting Requester
	requesterResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.requester')")
	if err == nil && requesterResult.String() != "undefined" {
		s.Requester = []byte(requesterResult.String())
	}
	// extracting Requisition
	requisitionResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.requisition')")
	if err == nil && requisitionResult.String() != "undefined" {
		s.Requisition = []byte(requisitionResult.String())
	}
	// extracting Specimen
	specimenResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.specimen')")
	if err == nil && specimenResult.String() != "undefined" {
		s.Specimen = []byte(specimenResult.String())
	}
	// extracting Status
	statusResult, err := vm.RunString("extractTokenSearchParameters(fhirResource, 'ServiceRequest.status')")
	if err == nil && statusResult.String() != "undefined" {
		s.Status = []byte(statusResult.String())
	}
	// extracting Subject
	subjectResult, err := vm.RunString("extractReferenceSearchParameters(fhirResource, 'ServiceRequest.subject')")
	if err == nil && subjectResult.String() != "undefined" {
		s.Subject = []byte(subjectResult.String())
	}
	// extracting Text
	textResult, err := vm.RunString("extractStringSearchParameters(fhirResource, 'text')")
	if err == nil && textResult.String() != "undefined" {
		s.Text = []byte(textResult.String())
	}
	return nil
}

// TableName overrides the table name from fhir_observations (pluralized) to `fhir_observation`. https://gorm.io/docs/conventions.html#TableName
func (s *FhirServiceRequest) TableName() string {
	return "fhir_service_request"
}

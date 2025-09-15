import { MedicalHistoryPage } from './pages/medical-history.po';
import { loginAsUser } from './helpers/auth.helper';
import { browser } from 'protractor';
import { clickExportToPDF } from './helpers/pdf-utils';
import * as path from 'path'
import * as fs from 'fs';

describe('Medical History - Add Medication Flow', () => {
  let medicalHistoryPage: MedicalHistoryPage;

  beforeAll(async () => {
    medicalHistoryPage = new MedicalHistoryPage();

    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);


    await loginAsUser('user', 'test@test.com');
  });

  it('should navigate to Medical History page', async () => {
    await medicalHistoryPage.clickMedicalHistoryLink();
    expect((await medicalHistoryPage.getMedicalHistoryLink().getText()).trim()).toEqual('Medical History');
  });

  it('should create new Encounter', async () => {
    await medicalHistoryPage.clickAddCondition();
    await medicalHistoryPage.clickFindCreateEncounter();
    await medicalHistoryPage.clickCreateButton();
    await medicalHistoryPage.typeInSearchInput("ACAS");
    await medicalHistoryPage.typePeriodStart('2025-08-22');
    await medicalHistoryPage.typePeriodEnd('2025-12-31');
    await medicalHistoryPage.clickAddEncounter();

    const cardText = await medicalHistoryPage.getEncounterCard().getText();
    expect(cardText).toContain('ACAS');
    expect(cardText).toContain('Start date');


  });

  it('should add Medical Practitioners', async () => {
    await medicalHistoryPage.clickPractitioners();
    await medicalHistoryPage.clickAddPractitionerButton();
    await medicalHistoryPage.clickCreateButton();
    await medicalHistoryPage.typeMedicationName("Dr.Sarah Levy");
    await medicalHistoryPage.typePractitionerType("Dentist");
    await medicalHistoryPage.typePractitionerTelephone("2125551234");
    await medicalHistoryPage.typePractitionerFax('(212) 555-9999');
    await medicalHistoryPage.typePractitionerEmail('dr.cohen@example.com');
    await medicalHistoryPage.typePractitionerAddressLine1('123 Main Street');
    await medicalHistoryPage.typePractitionerCity('New York');
    await medicalHistoryPage.typePractitionerState('New York');
    await medicalHistoryPage.typePractitionerZip('10001');
    await medicalHistoryPage.typePractitionerCountry('United States of America');
    await medicalHistoryPage.createAddPractitionerButton();

    const practitionerName = await medicalHistoryPage.getPractitionerName();
    expect(practitionerName.trim()).toBe('Dr.Sarah Levy');
  });

  it('should add a Medication with full data', async () => {
    await medicalHistoryPage.clickMedicationsTab();

    const title = await medicalHistoryPage.getPageTitleMedications();
    expect(title.trim()).toBe('Medications');
    await medicalHistoryPage.clickAddMedicationButton();
    await medicalHistoryPage.typeMedicationName('ZOCOR (Oral Pill)');
    await medicalHistoryPage.changeStatusTo("Activ");
    await medicalHistoryPage.typeDosage('3');
    await medicalHistoryPage.typeMedicationStartDate('2025-08-01');
    await medicalHistoryPage.typeMedicationStoppedDate('2025-12-31');
    await medicalHistoryPage.typeWhyStopped("Problem gone");
    await medicalHistoryPage.selectRequesterNewPractitioner('Dr.Sarah Levy');
    await medicalHistoryPage.typeInstructions(
      "Medications are a type of treatment, usually in the form of pills, liquids, or injections, prescribed by doctors to help your body fight off illnesses, manage symptoms, or improve overall health."
    );

  });

  it('should add a Procedure under "Major Surgeries and Implants"', async () => {
    await medicalHistoryPage.clickProceduresTab();

    const title = await medicalHistoryPage.getSurgeriesTitle();
    expect(title.trim()).toBe('Major Surgeries and Implants');

    await medicalHistoryPage.clickAddSurgeryOrImplantButton();
    await medicalHistoryPage.typeSurgeryOrImplant('Hernia repair');
    await medicalHistoryPage.typeDate('2025-08-01');
    await medicalHistoryPage.selectPerformedByProcedure('Dr.Sarah Levy');
    await medicalHistoryPage.selectLocation('New Organization');
    await medicalHistoryPage.typeDescription(
      'Surgery is a medical procedure where doctors use special tools to fix, remove, or improve something inside your body to help you feel better or get healthier.');
    await medicalHistoryPage.addNewAttachment();
    await medicalHistoryPage.typeNewAttachmentTitle('Surgery');
    await medicalHistoryPage.categorySearchNewAttachment('Radiology studies (set)');
    await medicalHistoryPage.typeNewAttachmentFileType('Document - JSON');
    await medicalHistoryPage.uploadAttachment();
    await medicalHistoryPage.clickCreateAttachmentButton();
  });


  it('should add Medical Organizations', async () => {
    await medicalHistoryPage.clickOrganizations();
    await medicalHistoryPage.clickAddOrganizationButton();
    await medicalHistoryPage.clickCreateButton();
    await medicalHistoryPage.typeMedicationName("Dr.Sarah Levy");
    await medicalHistoryPage.typeOrganizationType('Community Health Clinic/Center');
    await medicalHistoryPage.typePractitionerTelephone("2125551234");
    await medicalHistoryPage.typePractitionerFax('(212) 555-9999');
    await medicalHistoryPage.typePractitionerEmail('dr.cohen@example.com');
    await medicalHistoryPage.typePractitionerAddressLine1('123 Main Street');
    await medicalHistoryPage.typePractitionerCity('New York');
    await medicalHistoryPage.typePractitionerState('New York');
    await medicalHistoryPage.typePractitionerZip('10001');
    await medicalHistoryPage.typePractitionerCountry('United States of America');
    await medicalHistoryPage.createAddPractitionerButton();

    const practitionerName = await medicalHistoryPage.getPractitionerName();
    expect(practitionerName.trim()).toBe('Dr.Sarah Levy');

  });

  it('should create a Lab Result', async () => {
    await medicalHistoryPage.clickLabResults();
    await medicalHistoryPage.clickCreateLabResult();
    await medicalHistoryPage.typeLabPanel('Time period start & end panel');
    await medicalHistoryPage.typeNumberStartTime('1');
    await medicalHistoryPage.typeNumberEndTime('60');
    await medicalHistoryPage.clickCreateLabResultsButton();

    const title = await medicalHistoryPage.getObservationTitle();
    expect(title.trim()).toBe('Time period start and end panel Unspecified body region');
  });

  it('should verify Notes & Attachments already exist', async () => {
    await medicalHistoryPage.clickAttachments();
    await browser.sleep(3000);

    const value = await medicalHistoryPage.getNameInputValue();
    expect(value).toContain(
      'Surgery',
      `Expected input value to contain 'Surgery', but got '${value}'`
    );
    await medicalHistoryPage.clickSaveButton();

  });

  it('should download the PDF file', async () => {

    await medicalHistoryPage.clickExportToPDF();

    const downloadPath = path.resolve(process.cwd(), 'e2e/downloads');
    const expectedFile = path.join(downloadPath, 'ips_summary.pdf');

    let fileExists = false;
    for (let i = 0; i < 15; i++) {
      if (fs.existsSync(expectedFile)) {
        fileExists = true;
        break;
      }
      await new Promise(res => setTimeout(res, 3000));
    }

    expect(fileExists).toBe(true, `Expected file to exist at: ${expectedFile}`);
  });

  it('should verify all added medical history manually saved', async () => {

    const symptomText = await medicalHistoryPage.getSymptomText();
    expect(symptomText).toEqual("ACAS");

    const conditionDate = await medicalHistoryPage.getLatestConditionDate();
    expect(conditionDate).toMatch(/^[A-Z][a-z]{2} \d{2}$/);
  });
});


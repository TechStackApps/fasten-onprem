import { LoginPage } from './pages/login.po';
import { MedicalHistoryPage } from './pages/medicalHistory.po';
import { browser, ExpectedConditions as EC } from 'protractor';
import { clickExportToPDF } from './helpers/pdf-utils';

describe('Medical History - Add Medication Flow', () => {
  let loginPage: LoginPage;
  let medicalHistoryPage: MedicalHistoryPage;

  beforeAll(async () => {
    loginPage = new LoginPage();
    medicalHistoryPage = new MedicalHistoryPage();

    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginPage.navigateTo();
    await loginPage.login('user', 'test@test.com');
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
    await medicalHistoryPage.typePeriodStart('2025-05-29');
    await medicalHistoryPage.typePeriodEnd('2025-12-31');
    await medicalHistoryPage.clickAddEncounter();
  });

  it('should add a Medication with full data', async () => {
    await medicalHistoryPage.clickMedicationsTab();
    await medicalHistoryPage.clickAddMedicationButton();
    await medicalHistoryPage.typeMedicationName('ZOCOR (Oral Pill)');
    await medicalHistoryPage.changeStatusTo("Activ");
    await medicalHistoryPage.typeDosage('3');
    await medicalHistoryPage.typeMedicationStartDate('2025-08-01');
    await medicalHistoryPage.typeMedicationStoppedDate('2025-12-31');
    await medicalHistoryPage.typeWhyStopped("Problem gone");
    await medicalHistoryPage.selectRequesterNewPractitioner('New Practitioner');
    await medicalHistoryPage.typeInstructions(
      "Medications are a type of treatment, usually in the form of pills, liquids, or injections, prescribed by doctors to help your body fight off illnesses, manage symptoms, or improve overall health."
    );
    await medicalHistoryPage.clickSubmitButton();
  });
  it('should add a Procedure under "Major Surgeries and Implants"', async () => {
    await medicalHistoryPage.clickProceduresTab();
    await medicalHistoryPage.clickAddSurgeryOrImplantButton();
    console.log(' Clicked Add Surgery or Implant');
    await medicalHistoryPage.typeSurgeryOrImplant('Hernia repair');
    await medicalHistoryPage.typeDate('2025-08-01');
    await medicalHistoryPage.selectPerformedByProcedure('New Practitioner');
    await medicalHistoryPage.selectLocation('New Organization');
    await medicalHistoryPage.typeDescription(
      'Surgery is a medical procedure where doctors use special tools to fix, remove, or improve something inside your body to help you feel better or get healthier.');
    await medicalHistoryPage.addNewAttachment();
    await medicalHistoryPage.typeNewAttachmentTitle('Surgery');
    await medicalHistoryPage.categorySearchNewAttachment('Radiology studies (set)');
    await medicalHistoryPage.typeNewAttachmentFileType('Document - JSON');
    await medicalHistoryPage.uploadAttachment();
    await medicalHistoryPage.clickCreateAttachmentButton();
    await medicalHistoryPage.clickSaveButton();
});

it('should add Medical Practitioners', async () => {
  await medicalHistoryPage.clickPractitioners();
  await medicalHistoryPage.clickAddPractitionerButton();
  await medicalHistoryPage.clickCreateButton();
  await medicalHistoryPage.typeMedicationName("Dr.Sarah Levy");
  await medicalHistoryPage.typePractitionerType("Dentist");
  await medicalHistoryPage. typePractitionerTelephone("2125551234");
  await medicalHistoryPage.typePractitionerFax('(212) 555-9999');
  await medicalHistoryPage.typePractitionerEmail('dr.cohen@example.com');
  await medicalHistoryPage.typePractitionerAddressLine1('123 Main Street');
  await medicalHistoryPage.typePractitionerCity('New York');
  await medicalHistoryPage.typePractitionerState('New York');
  await medicalHistoryPage.typePractitionerZip('10001');
  await medicalHistoryPage.typePractitionerCountry('United States of America');
  await medicalHistoryPage.createAddPractitionerButton();
  await medicalHistoryPage.clickSaveButton();
});

it('should add Medical Organizations', async () => {
  await medicalHistoryPage.clickOrganizations();
  await medicalHistoryPage.clickAddOrganizationButton();
   await medicalHistoryPage.clickCreateButton();
  await medicalHistoryPage.typeMedicationName("Dr.Sarah Levy");
  await medicalHistoryPage.typeOrganizationType('Community Health Clinic/Center');
  await medicalHistoryPage. typePractitionerTelephone("2125551234");
  await medicalHistoryPage.typePractitionerFax('(212) 555-9999');
  await medicalHistoryPage.typePractitionerEmail('dr.cohen@example.com');
  await medicalHistoryPage.typePractitionerAddressLine1('123 Main Street');
  await medicalHistoryPage.typePractitionerCity('New York');
  await medicalHistoryPage.typePractitionerState('New York');
  await medicalHistoryPage.typePractitionerZip('10001');
  await medicalHistoryPage.typePractitionerCountry('United States of America');
  await medicalHistoryPage.createAddPractitionerButton();
  await medicalHistoryPage.clickSaveButton();
});

it('should create a Lab Result', async () => {
  await medicalHistoryPage.clickLabResults();
  await medicalHistoryPage.clickCreateLabResult();
  await medicalHistoryPage.typeLabPanel('Time period start & end panel');
  await medicalHistoryPage.typeNumberStartTime('1');
  await medicalHistoryPage.typeNumberEndTime('60');
  await medicalHistoryPage.clickCreateLabResultsButton();
  await medicalHistoryPage.clickSaveButton();
});

it('should verify Notes & Attachments already exist', async () => {
  await medicalHistoryPage.clickAttachments();
  await browser.sleep(3000);
  await medicalHistoryPage.verifyNameContainsSurgery();
  await medicalHistoryPage.clickCloseButton();
  
});

it('should download the PDF file', async () => {
 // await medicalHistoryPage.clickExportToPDF();
   await clickExportToPDF();
});
});

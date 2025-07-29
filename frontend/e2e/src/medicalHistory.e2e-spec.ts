import { LoginPage } from './pages/login.po';
import { MedicalHistoryPage } from './pages/medicalHistory.po';
import { browser, ExpectedConditions as EC } from 'protractor';

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
    await medicalHistoryPage.typeSurgeryOrImplant('Hernia repair');
    
  
});
});


import { browser } from 'protractor';
import { DashboardPage } from './pages/dashboard.po';
import { loginAsUser } from './helpers/auth.helper';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Auth Signin Page', () => {
  let dashboard: DashboardPage;

  beforeAll(async () => {
    dashboard = new DashboardPage();

    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  describe('Verify user health records', () => {
    it('should display Healthy status in user records', async () => {
      await dashboard.clickDashboardLink();
      await browser.sleep(4000);
      const name = await dashboard.getUserNameOnly();
      expect(name).toBeTruthy();
    });
  });

  it("should list all medical records", async () => {
    const records = await dashboard.getAllRecordsText();
    
    expect(records.join(" ")).toContain("Care Team");
    expect(records.join(" ")).toContain("Clinical Notes");
    expect(records.join(" ")).toContain("Files");
    expect(records.join(" ")).toContain("Lab Results");
    expect(records.join(" ")).toContain("Facilities");
    expect(records.join(" ")).toContain("Health Goals");
    expect(records.join(" ")).toContain("Health Insurance");
    expect(records.join(" ")).toContain("Health Assessments");
    expect(records.join(" ")).toContain("Immunizations");
    expect(records.join(" ")).toContain("Medications");
    expect(records.join(" ")).toContain("Demographics");
    expect(records.join(" ")).toContain("Procedures");
  })

  it("should list all medical records and verify numbers exist", async () => {
    const data = await dashboard.getAllRecordObjects();


    const expectedNames = [
      "Care Team", "Clinical Notes", "Files", "Lab Results",
      "Facilities", "Health Goals", "Health Insurance",
      "Health Assessments", "Immunizations", "Medications",
      "Demographics", "Procedures"
    ];

    expectedNames.forEach(name => {
      const item = data.find(d => d.name === name);
      expect(item).toBeDefined(`Row with '${name}' was not found`);

      expect(/\d+ Records/.test(item!.records)).toBe(true)

    });
  });

  it("should extract all patient vitals and verify expected titles with numeric values", async () => {
    const vitals = await dashboard.getAllPatientVitals();

    expect(vitals.length).toBeGreaterThan(0);

    const expectedTitles = [
      "Pain severity - 0-10 verbal numeric rating [Score] - Reported",
      "Weight difference [Mass difference] --pre dialysis - post dialysis",
      "Diastolic Blood Pressure",
      "Systolic Blood Pressure",
      "Body Weight",
      "Weight-for-length Per age and sex",
      "Body Height",
      "Body Mass Index",
      "Oral temperature"
    ];

    expectedTitles.forEach(title => {
      const item = vitals.find(v => v.title === title);
      expect(item).toBeDefined(`Vital '${title}' was not found`);


      const hasNumber = /\d+(\.\d+)?/.test(item!.value);
      expect(hasNumber).toBe(true, `Value for '${title}' is not numeric: ${item!.value}`);
    });
  });


  it("should verify Weight, Height and Blood Pressure vitals", async () => {
    const weightText = await dashboard.getWeightFromCard();
    const heightText = await dashboard.getHeightFromCard();
    const bpText = await dashboard.getBloodPressureFromCard();


    expect(/\d+(\.\d+)?/.test(weightText)).toBe(true, `Weight is not numeric: ${weightText}`);
    expect(/\d+(\.\d+)?/.test(heightText)).toBe(true, `Height is not numeric: ${heightText}`);
    expect(/\d+/.test(bpText)).toBe(true, `Blood Pressure is not numeric: ${bpText}`);
  });
});



import { browser } from 'protractor';
import * as path from 'path';
import { DashboardPage } from './pages/dashboard.po';
import { loginAsUser } from './helpers/auth.helper';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Dashboard Verify Medical Records', () => {
  let dashboard: DashboardPage;

  beforeAll(async () => {
    dashboard = new DashboardPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');

    const filePath = path.resolve(__dirname, './data/example_client.json');
    await dashboard.ensureDataOnDashboard(filePath);
  });

  it('should display user name in records', async () => {
    const name = await dashboard.getUserNameOnly();
    expect(name).toBeTruthy();
  });

  it('should list medical records dynamically', async () => {
    const records = await dashboard.getAllRecordsText();
    expect(records.length).toBeGreaterThan(0);
    records.forEach(r => {
      expect(r.trim().length).toBeGreaterThan(0);
    });
  });

  it('should list all medical records and verify numbers exist', async () => {
    const data = await dashboard.getAllRecordObjects();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(item => {
      expect(item.name).toBeTruthy(`Missing record name`);
      expect(/\d+\s+Records/.test(item.records)).toBe(
        true,
        `Invalid records count format for ${item.name}: ${item.records}`
      );
    });
  });

  it('should extract all patient vitals and verify they have numeric values', async () => {
    const vitals = await dashboard.getAllPatientVitals();
    expect(vitals.length).toBeGreaterThan(0);
    vitals.forEach(v => {
      expect(v.title).toBeTruthy(`Vital has no title`);
      const hasNumber = /\d+(\.\d+)?/.test(v.value);
      expect(hasNumber).toBe(true, `Vital '${v.title}' is not numeric: ${v.value}`);
    });
  });

  it('should verify Weight, Height and Blood Pressure vitals', async () => {
    const weightText = await dashboard.getWeightFromCard();
    const heightText = await dashboard.getHeightFromCard();
    const bpText = await dashboard.getBloodPressureFromCard();

    if (weightText) {
      expect(/\d+(\.\d+)?/.test(weightText)).toBe(true, `Weight is not numeric: ${weightText}`);
    }

    if (heightText) {
      expect(/\d+(\.\d+)?/.test(heightText)).toBe(true, `Height is not numeric: ${heightText}`);
    }

    if (bpText) {
      expect(/\d+/.test(bpText)).toBe(true, `Blood Pressure is not numeric: ${bpText}`);
    }
  });
});

import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { LabsPage } from './pages/labs.po';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Labs - Verify Lab Reports data and information', () => {
  let labsPage: LabsPage;

  beforeAll(async () => {
    labsPage = new LabsPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  
    it('should verify Tobacco smoking status', async () => {
      await labsPage.goToLabsPage();

      const status = await labsPage.getTobaccoSmokingStatus();
      expect(status.trim()).toContain('Tobacco smoking status');

      const fullObservationText = await labsPage.getTobaccoSmokingStatusSection();
      expect(fullObservationText).toContain('Short Name: Tobacco smoking status');
      expect(fullObservationText).toContain('Result:');
      expect(fullObservationText).toMatch(/Latest Test Date:\s+\w+\s+\d{1,2},\s+\d{4}/);
      expect(fullObservationText).toContain('LOINC Code:');
    });

    it('should verify Pain severity observation', async () => {
      await labsPage.goToLabsPage();

      const painSeverityText = await labsPage.getPainSeveritySection();
      expect(painSeverityText).toContain('Pain severity - 0-10 verbal numeric rating');

      const details = await labsPage.getPainObservation();
      expect(details[0]).toContain('Short Name: Pain severity');
      expect(details[0]).toMatch(/Result:\s+\d+(\.\d+)?\s+\{score\}/);
      expect(details[0]).toMatch(/Latest Test Date:\s+\w+\s+\d{1,2},\s+\d{4}/);
      expect(details[0]).toContain('Ordered By:');
      expect(details[0]).toContain('LOINC Code: 72514-3');
      expect(details[0]).toContain('Notes:');
    });

    
    it('should verify Weight-for-length observation', async () => {
      const text = await labsPage.getWeightForLengthText();
      expect(text).toContain('Weight-for-length');

      const observation = await labsPage.getWeightForLengthObservation();
      expect(observation).toContain('Short Name: Weight-for-length');
      expect(observation).toMatch(/Result:\s+\d+(\.\d+)?\s+%/);
      expect(observation).toMatch(/Latest Test Date:\s+\w+\s+\d{1,2},\s+\d{4}/);
      expect(observation).toContain('Ordered By:');
      expect(observation).toContain('LOINC Code: 77606-2');
      expect(observation).toContain('Notes:');
    });

    it('should verify Platelets in Blood by Automated count', async () => {
      const text = await labsPage.getPlateletsInBlood();
      expect(text).toContain('Platelets');

      const observation = await labsPage.getPlateletsInBloodObservation();
      expect(observation).toContain('Short Name: Platelets');
      expect(observation).toContain('Result:');
      expect(observation).toMatch(/Latest Test Date:\s+\w+\s+\d{1,2},\s+\d{4}/);
      expect(observation).toContain('LOINC Code:');
      expect(observation).toContain('Notes:');
    });

    it('should verify MCH [Entitic mass] by Automated count', async () => {
      const text = await labsPage.getMCHText();
      expect(text).toContain('MCH [Entitic mass]');

      const observation = await labsPage.getMCHObservation();
      expect(observation).toContain('Short Name: MCH [Entitic mass]');
      expect(observation).toMatch(/Result:\s+\d+(\.\d+)?\s+pg/);
      expect(observation).toMatch(/Latest Test Date:\s+\w+\s+\d{1,2},\s+\d{4}/);
      expect(observation).toContain('Ordered By:');
      expect(observation).toContain('LOINC Code: 785-6');
      expect(observation).toContain('Notes:');
    });
  });


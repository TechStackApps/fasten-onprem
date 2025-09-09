import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { LabsPage } from './pages/labs.po';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Auth Signin Page', () => {
  let labsPage: LabsPage;

  beforeAll(async () => {
    labsPage = new LabsPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  describe('Labs Observations', () => {
    it('should verify Tobacco smoking status', async () => {
      await labsPage.goToLabsPage();

      const status = await labsPage.getTobaccoSmokingStatus();
      expect(status.trim()).toBe('Tobacco smoking status NHIS');

      const fullObservationText =
        await labsPage.getTobaccoSmokingStatusSection();

      expect(fullObservationText).toContain(
        'Short Name: Tobacco smoking status NHIS'
      );
      expect(fullObservationText).toContain('Result:');
      expect(fullObservationText).toContain('Latest Test Date: Sep 6, 2019');
      expect(fullObservationText).toContain('LOINC Code: 72166-2');
    });

    it('should verify Pain severity observation', async () => {
      await labsPage.goToLabsPage();

      const observations = await labsPage.getAllObservations();

      expect(observations[0]).toEqual({
        date: 'Sep 6, 2019',
        result: 'Never smoker',
      });

      const painSeverityText = await labsPage.getPainSeveritySection();
      expect(painSeverityText).toContain(
        'Pain severity - 0-10 verbal numeric rating [Score] - Reported'
      );

      const details = await labsPage.getPainObservation();
      expect(details[0]).toContain(
        'Short Name: Pain severity - 0-10 verbal numeric rating [Score] - Reported'
      );
      expect(details[0]).toContain('Result: 5.588461282790446 {score}');
      expect(details[0]).toContain('Latest Test Date: Sep 16, 2019');
      expect(details[0]).toContain('Ordered By:');
      expect(details[0]).toContain('LOINC Code: 72514-3');
      expect(details[0]).toContain('Notes:');
    });

    it('should verify Weight difference observation', async () => {
      const weightDiff = await labsPage.getWeightDifferenceText();
      expect(weightDiff).toBe(
        'Weight difference [Mass difference] --pre dialysis - post dialysis'
      );

      const observation = await labsPage.getWeightDifferenceObservation();
      expect(observation).toContain(
        'Short Name: Weight difference [Mass difference] --pre dialysis - post dialysis'
      );
      expect(observation).toContain('Result: 1.9055235328162863 kg');
      expect(observation).toContain('Latest Test Date: Sep 16, 2019');
      expect(observation).toContain('Ordered By:');
      expect(observation).toContain('LOINC Code: 74006-8');
      expect(observation).toContain('Notes:');
    });

    it('should verify Weight-for-length observation', async () => {
      const text = await labsPage.getWeightForLengthText();
      expect(text).toBe('Weight-for-length Per age and sex');

      const observation = await labsPage.getWeightForLengthObservation();

      expect(observation).toContain(
        'Short Name: Weight-for-length Per age and sex'
      );
      expect(observation).toContain('Result: 7.3170067706392565 %');
      expect(observation).toContain('Latest Test Date: Sep 6, 2019');
      expect(observation).toContain('Ordered By:');
      expect(observation).toContain('LOINC Code: 77606-2');
      expect(observation).toContain('Notes:');
    });

    it('should verify Platelets [#/volume] in Blood by Automated count', async () => {
      const text = await labsPage.getPlateletsInBlood();

      expect(text).toBe('Platelets [#/volume] in Blood by Automated count');

      const observation = await labsPage.getPlateletsInBloodObservation();
      console.log('Platelets observation:', observation);

      expect(observation).toContain(
        'Short Name: Platelets [#/volume] in Blood by Automated count'
      );
      expect(observation).toContain('Result:');
      expect(observation).toContain('Latest Test Date:');
      expect(observation).toContain('LOINC Code:');
      expect(observation).toContain('Notes:');
    });
  });

  it('should verify Platelets [#/volume] in Blood by Automated count', async () => {
    const text = await labsPage.getPlateletsInBlood();

    expect(text).toBe('Platelets [#/volume] in Blood by Automated count');

    const observation = await labsPage.getPlateletsInBloodObservation();

    expect(observation).toContain(
      'Short Name: Platelets [#/volume] in Blood by Automated count'
    );
    expect(observation).toContain('Result:');
    expect(observation).toContain('Latest Test Date:');
    expect(observation).toContain('LOINC Code:');
    expect(observation).toContain('Notes:');
  });

  it('should verify MCH [Entitic mass] by Automated count', async () => {
    const text = await labsPage.getPlateletsInBlood();

    expect(text).toBe('Platelets [#/volume] in Blood by Automated count');

    const observation = await labsPage.getPlateletsInBloodObservation();

    expect(observation).toContain(
      'Short Name: Platelets [#/volume] in Blood by Automated count'
    );
    expect(observation).toContain('Result:');
    expect(observation).toContain('Latest Test Date:');
    expect(observation).toContain('LOINC Code:');
    expect(observation).toContain('Notes:');
  });

  it('should verify MCH [Entitic mass] by Automated count observation', async () => {
    const text = await labsPage.getMCHText();
    expect(text).toBe('MCH [Entitic mass] by Automated count');

    const observation = await labsPage.getMCHObservation();

    expect(observation).toContain(
      'Short Name: MCH [Entitic mass] by Automated count'
    );
    expect(observation).toContain('Result: 30.152225059357296 pg');
    expect(observation).toContain('Latest Test Date: Sep 6, 2019');
    expect(observation).toContain('Ordered By:');
    expect(observation).toContain('LOINC Code: 785-6');
    expect(observation).toContain('Notes:');
  });
});

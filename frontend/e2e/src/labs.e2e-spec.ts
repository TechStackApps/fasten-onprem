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
 it("should verify Tobacco smoking status", async () => {  
  await labsPage.goToLabsPage();

  const status = await labsPage.getTobaccoSmokingStatus();
  expect(status.trim()).toBe("Tobacco smoking status NHIS");

  const fullObservationText = await labsPage.getTobaccoSmokingStatusSection();
  console.log("OBSERVATION TEXT:", fullObservationText);

  expect(fullObservationText).toContain("Short Name: Tobacco smoking status NHIS");
  expect(fullObservationText).toContain("Result:");
  expect(fullObservationText).toContain("Latest Test Date: Sep 6, 2019");
  expect(fullObservationText).toContain("LOINC Code: 72166-2");
});
 });

it("should verify observations list", async () => {
  const observations = await labsPage.getAllObservations();

  console.log("Total observations:", observations.length);
  console.log("First observation:", observations[0]);
  console.log("Last observation:", observations[observations.length - 1]);

  // exemplu de verificare: primul rând
  expect(observations[0]).toEqual({
    date: "Sep 6, 2019",
    result: "Never smoker"
  });
});

it("should verify Pain severity observation", async () => {
  await labsPage.goToLabsPage();

  const painSeverityText = await labsPage.getPainSeveritySection();

  console.log("Pain severity observation:", painSeverityText);

  expect(painSeverityText).toContain("Pain severity - 0-10 verbal numeric rating [Score] - Reported");
});


  });
 
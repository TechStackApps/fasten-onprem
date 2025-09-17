import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { ExplorePage } from './pages/explore.po';


jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Explore Medical Records', () => {
  let explorePage: ExplorePage;

  beforeAll(async () => {
    explorePage = new ExplorePage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  
  it("should verify the Explore page if an uploaded file already exists", async () => {
    await explorePage.goToExplorePage();
    const text = await explorePage.getExplorePageTitle();
    expect(text).toEqual("Explore");

    const medicalRecord = await explorePage.getMedicalRecordLabel();
    expect(medicalRecord).toContain("Fasten Health");
  });
});

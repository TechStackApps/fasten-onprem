import { browser } from 'protractor';
import * as path from 'path';
import { SourcesPage } from './pages/sources.po';
import { loginAsUser } from './helpers/auth.helper';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Auth Signin Page', () => {
  let sourcesPage: SourcesPage;

  beforeAll(async () => {
    sourcesPage = new SourcesPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  describe('Sources Upload flow', () => {
    it('should navigate to Sources page and upload a file', async () => {
      console.log('Clicking on the Sources link');
      await sourcesPage.clickOnSourcesLink();

      const sourcesUrl = await browser.getCurrentUrl();
      console.log(`Current URL: ${sourcesUrl}`);
      expect(sourcesUrl).toContain('/sources');

      const filePath = path.resolve(__dirname, './data/example_client.json');
      console.log('Uploading file:', filePath);

      await sourcesPage.uploadFile(filePath);
    });
  });
});
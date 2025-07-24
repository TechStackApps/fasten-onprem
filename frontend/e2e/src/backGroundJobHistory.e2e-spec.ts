import { LoginPage } from './pages/login.po';
import { SourcesPage } from './pages/sources.po';
import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('🔐 Login and navigate to Background Jobs', () => {
  let loginPage: LoginPage;
  let sourcesPage: SourcesPage;

  it('should login and navigate to /background-jobs', async () => {
    loginPage = new LoginPage();
    sourcesPage = new SourcesPage();

    // Enable Angular sync and maximize window
    await browser.waitForAngularEnabled(true);
    await browser.driver.manage().window().maximize();

    // LOGIN
    await loginPage.navigateTo();
    await loginPage.login('beatrix', 'beatrix@beatrix.ro');

    await browser.wait(
      EC.urlContains('/dashboard'),
      10000,
      'Did not reach dashboard'
    );

    // NAVIGATE to /background-jobs
    await browser.waitForAngularEnabled(false); // if non-Angular page
    await browser.get('http://localhost:4200/background-jobs');

    const url = await browser.getCurrentUrl();
    expect(url).toContain('/background-jobs');

    // Verify STATUS_DONE label is visible
    await sourcesPage.verifyStatusDoneLabel();
  });
});

import { DashboardPage } from './pages/dashboard.po';
import { LoginPage } from './pages/login.po';
import { SourcesPage } from './pages/sources.po';
import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe(' Login and navigate to Background Jobs', () => {
  let loginPage: LoginPage;
  let sourcesPage: SourcesPage;
  let dashboard: DashboardPage

  it('should login and navigate to /background-jobs', async () => {
    loginPage = new LoginPage();
    sourcesPage = new SourcesPage();
    dashboard = new DashboardPage();

    // Enable Angular sync and maximize window
    await browser.waitForAngularEnabled(true);
    await browser.driver.manage().window().maximize();

    // LOGIN
    await loginPage.navigateTo();
    await loginPage.login('user', 'test@test.com');

    await browser.wait(
      EC.urlContains('/dashboard'),
      10000,
      'Did not reach dashboard'
    );

    console.log(' Opening notification dropdown');
     await sourcesPage.openNotificationsDropdown();
      
     console.log(' Clicking View History');
      await sourcesPage.clickOnViewHistory();

      await browser.waitForAngularEnabled(false);
       
     console.log(' Clicking on Details');
      await sourcesPage.clickDetailsButton();

      console.log(' Verifying status badge');
      await sourcesPage.verifyAnyValidStatusLabel(); 
      await sourcesPage.closeDetailsModal();
  });
    it('should go back to dashboard and verify Letha284 Haag279', async () => {
      await dashboard.clickDashboardLink();
      const name = await dashboard.getUserNameOnly();
      console.log(name);

  
});
});

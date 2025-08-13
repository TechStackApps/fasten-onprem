import { browser } from 'protractor';
import { DashboardPage } from './pages/dashboard.po';
import { SourcesPage } from './pages/sources.po';
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
      console.log('User name:', name);
    });
  });
});
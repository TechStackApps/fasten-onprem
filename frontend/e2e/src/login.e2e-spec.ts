import { browser } from 'protractor';
import { LoginPage } from './pages/login.po';
import { loginAsUser } from './helpers/auth.helper';

describe('Auth Signin Page', () => {
  let loginPage: LoginPage;

  beforeAll(async () => {
    loginPage = new LoginPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });

  describe('Login flow', () => {
    it('should navigate to dashboard after login', async () => {
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
    });

    it('should display welcome message', async () => {
      const messageText = await loginPage.getWelcomeMessage().getText();
      expect(messageText).toContain('Welcome back!');
    });
  });
});
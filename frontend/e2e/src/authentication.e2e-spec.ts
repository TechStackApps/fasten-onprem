import { browser } from 'protractor';
import { AuthenticationPage } from './pages/authentication.po';

describe('Login flow', () => {
  
  let authenticationPage: AuthenticationPage;

  beforeAll(async () => {
    authenticationPage = new AuthenticationPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
  });

  it('Authentication for the new user', async () => {
    await browser.get('/auth/signup/wizard');
    
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toContain('/auth/signup/wizard');

    const title = authenticationPage.getStartTitle();
    expect(await title.getText()).toEqual("Let's Get Started!");

    await authenticationPage.enterFullName('John Doe');
    await authenticationPage.enterUsername('john123');
    await authenticationPage.enterEmail('john.doe@test.com');
    await authenticationPage.enterPassword('Test@1234');
    await authenticationPage.checkAgreeTerms();
    await authenticationPage.clickCreateAccount();
  });

});

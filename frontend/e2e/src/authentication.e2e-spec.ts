import { browser } from 'protractor';
import { AuthenticationPage } from './pages/authentication.po';

describe('Create and Authenticate New User', () => {
  
  let authenticationPage: AuthenticationPage;

  beforeAll(async () => {
    authenticationPage = new AuthenticationPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
  });

  it('should create a new user in the app', async () => {
    await browser.get('/auth/signup/wizard');
    
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toContain('/auth/signup/wizard');

    const title = authenticationPage.getStartTitle();
    expect(await title.getText()).toEqual("Let's Get Started!");

    await authenticationPage.enterFullName('John Doe');
    await authenticationPage.enterUsername('user');
    await authenticationPage.enterEmail('test@test.com');
    await authenticationPage.enterPassword('test@test.com');
    await authenticationPage.checkAgreeTerms();
    await authenticationPage.clickCreateAccount();
    const text = await authenticationPage.getWelcomeMessageText();
    expect(text).toEqual('Welcome back!');
  });

});

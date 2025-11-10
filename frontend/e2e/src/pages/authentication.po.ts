import { 
  by, 
  element, 
  ElementFinder
} from 'protractor';

export class AuthenticationPage {

    getStartTitle(): ElementFinder {
    return element(by.cssContainingText('h2', "Let's Get Started!"));
  }

  async enterFullName(name: string): Promise<void> {
    const nameField = element(by.name('full_name'));
    await nameField.clear();
    await nameField.sendKeys(name);
  }

  async enterUsername(username: string): Promise<void> {
    const usernameField = element(by.name('username'));
    await usernameField.clear();
    await usernameField.sendKeys(username);
  }

  async enterEmail(email: string): Promise<void> {
    const emailField = element(by.name('email'));
    await emailField.clear();
    await emailField.sendKeys(email);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordField = element(by.name('password'));
    await passwordField.clear();
    await passwordField.sendKeys(password);
  }

  async checkAgreeTerms(): Promise<void> {
    const termsCheckbox = element(by.id('agreeTermsCheck'));
    const isSelected = await termsCheckbox.isSelected();

    if (!isSelected) {
      await termsCheckbox.click();
    }
  }

  async clickCreateAccount(): Promise<void> {
    const createAccountBtn = element(by.buttonText('Create Account'));
    await createAccountBtn.click();
  }

   async getWelcomeMessageText(): Promise<string> {
    const welcomeMessage = element(by.css('h2.az-dashboard-title'));
    return await welcomeMessage.getText();
  }
}

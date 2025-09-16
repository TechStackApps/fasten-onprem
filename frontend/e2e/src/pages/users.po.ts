import { element, by, ElementFinder, browser, ExpectedConditions as EC } from 'protractor';

export class UsersPage {
  async clickUsersLink(): Promise<void> {
    await element(by.css("[routerlink='/users']")).click();
  }

  async clickCreateNewUserButton(): Promise<void> {
    await element(by.css("button.btn.btn-az-primary.mt-3")).click();
  }

  getFullNameInput(): ElementFinder {
    return element(by.css("input[formcontrolname='full_name']"));
  }

  getUserNameInput(): ElementFinder {
    return element(by.css("input[formcontrolname='username']"));
  }

  getPasswordInput(): ElementFinder {
    return element(by.css("input[formcontrolname='password']"));
  }

  getRoleDropdown(): ElementFinder {
    return element(by.css("select[formcontrolname='role']"));
  }

  getEmailInput(): ElementFinder {
    return element(by.css("input[formcontrolname='email']"));
  }

  getCreateUserButton(): ElementFinder {
    return element(by.css("button.btn.btn-az-primary[type='submit']"));
  }

  async typeFullName(name: string): Promise<void> {
    const input = this.getFullNameInput();
    await browser.wait(EC.visibilityOf(input), 5000);
    await input.clear();
    await input.sendKeys(name);
  }

  async typeUserName(username: string): Promise<void> {
    const input = this.getUserNameInput();
    await browser.wait(EC.visibilityOf(input), 5000);
    await input.clear();
    await input.sendKeys(username);
  }

  async typePassword(password: string): Promise<void> {
    const input = this.getPasswordInput();
    await browser.wait(EC.visibilityOf(input), 5000);
    await input.clear();
    await input.sendKeys(password);
  }

  async typeEmail(email: string): Promise<void> {
    const input = this.getEmailInput();
    await browser.wait(EC.visibilityOf(input), 5000);
    await input.clear();
    await input.sendKeys(email);
  }

  async clickCreateUserButton(): Promise<void> {
    const btn = this.getCreateUserButton();
    await browser.wait(EC.elementToBeClickable(btn), 5000);
    await btn.click();
  }

  async isFullNameInTable(fullName: string): Promise<boolean> {
    const cell = element(by.cssContainingText("td", fullName));
    return cell.isPresent();
  }
}

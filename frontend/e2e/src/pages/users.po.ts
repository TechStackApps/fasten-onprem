import {protractor, element, by, ElementFinder, browser, ExpectedConditions as EC } from 'protractor';


export class UsersPage {

 async clickUsersLink(): Promise<void> {
  await element(by.css("[routerlink='/users']")).click();
} 

 async  clickCreateNewUserButton(): Promise<void> {
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
  await browser.wait(EC.visibilityOf(this.getFullNameInput()), 5000);
  await this.getFullNameInput().clear();
  await this.getFullNameInput().sendKeys(name);
}

async typeUserName(username: string): Promise<void> {
    await browser.wait(EC.visibilityOf(this.getUserNameInput()), 5000);
    await this.getUserNameInput().clear();
    await this.getUserNameInput().sendKeys(username);
  }
 
async typePassword(password: string): Promise<void> {
  await browser.wait(EC.visibilityOf(this.getPasswordInput()), 5000);
  await this.getPasswordInput().clear();
  await this.getPasswordInput().sendKeys(password);
}  

async selectUserRole(): Promise<void> {
  const roleDropdown = this.getRoleDropdown();
  await browser.wait(EC.elementToBeClickable(roleDropdown), 5000);
  await roleDropdown.click();

const userOption = roleDropdown.element(by.cssContainingText("option", "User"));
  await browser.wait(EC.elementToBeClickable(userOption), 5000);
  await userOption.click();
}

async typeEmail(email: string): Promise<void> {
  await browser.wait(EC.visibilityOf(this.getEmailInput()), 5000);
  await this.getEmailInput().clear();
  await this.getEmailInput().sendKeys(email);
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
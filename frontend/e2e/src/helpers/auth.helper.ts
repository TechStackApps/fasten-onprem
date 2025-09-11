import { browser, ExpectedConditions as EC } from 'protractor';
import { LoginPage } from '../pages/login.po';

export async function loginAsUser(
  username: string,
  password_or_email: string
) {
  const loginPage = new LoginPage();

  await loginPage.navigateTo();

  await browser.wait(
    EC.visibilityOf(loginPage.getUsernameInput()),
    10000,
    'Username field did not appear within 10 seconds'
  );

  await loginPage.login(username, password_or_email);

  await browser.wait(
    EC.visibilityOf(loginPage.getWelcomeMessage()),
    10000,
    'Dashboard page did not load after login'
  );
}

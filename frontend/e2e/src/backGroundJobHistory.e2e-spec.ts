import { browser } from 'protractor';
import { BackgroundPage } from './pages/backGroundJobHistory.po';
import { loginAsUser } from './helpers/auth.helper';

describe('Login and navigate to Background Jobs', () => {
  let background: BackgroundPage;

  beforeAll(async () => {
    background = new BackgroundPage();

    await browser.waitForAngularEnabled(true);
    await browser.driver.manage().window().maximize();
    await loginAsUser('user', 'test@test.com');
  });

  it('should open notifications and view background job details', async () => {

    await background.openNotificationsDropdown();
    await background.clickOnViewHistory();
    await browser.waitForAngularEnabled(false);
    await background.clickDetailsButton();
    await background.verifyAnyValidStatusLabel();

    const statusText = await background.getAnyValidStatusLabel().getText();
    expect(['STATUS_LOCKED', 'STATUS_DONE']).toContain(statusText);
    await background.closeDetailsModal();
  });
});
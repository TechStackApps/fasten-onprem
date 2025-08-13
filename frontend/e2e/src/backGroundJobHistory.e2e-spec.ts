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
    console.log('Opening notification dropdown');
    await background.openNotificationsDropdown();

    console.log('Clicking View History');
    await background.clickOnViewHistory();

    await browser.waitForAngularEnabled(false);

    console.log('Clicking on Details');
    await background.clickDetailsButton();

    console.log('Verifying status badge');
    await background.verifyAnyValidStatusLabel();

    await background.closeDetailsModal();
  });
});
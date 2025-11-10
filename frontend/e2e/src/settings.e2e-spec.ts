import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { SettingsPage } from './pages/settings.po';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Settings page Connected Devices', () => {
  let settingsPage: SettingsPage;

  beforeAll(async () => {
    settingsPage = new SettingsPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(false);
    await loginAsUser('user', 'test@test.com');
  });

  it('should navigate to Settings page and verify user data', async () => {
    await settingsPage.clickOnUserIcon();
    await settingsPage.clickOnSettingsLink();

    const settingsUrl = await browser.getCurrentUrl();
    expect(settingsUrl).toContain('/settings');

    const text = await settingsPage.getUserProfileText();
    expect(text).toContain('User Profile');

    expect(await settingsPage.isUserNamePresent()).toBe(true);
    expect(await settingsPage.isUserEmailPresent()).toBe(true);
    expect(await settingsPage.isUserRolePresent()).toBe(true);
  });

  it('should verify Connected Devices section', async () => {
    const devicesTitle = await settingsPage.getConnectedDevicesTitle();
    expect(devicesTitle).toContain('Connected Devices');

    await settingsPage.clickOnConnectNewDevice();
    await settingsPage.enterDeviceName('My Phone');
    await settingsPage.selectExpiration('7 Days');
    await settingsPage.clickOnConnectButton();

    expect(await settingsPage.isScanToConnectModalVisible()).toBe(true);

    await settingsPage.clickOnExpandTable();
    expect(await settingsPage.isTokenPresent()).toBe(true);

    await settingsPage.clickOnCloseButton();
    expect(await settingsPage.isDevicePresent('My Phone')).toBe(true);

    await settingsPage.clickOnDeleteDeviceButton();
    await settingsPage.confirmDeleteAlert();
    expect(await settingsPage.isDevicePresent('My Phone')).toBe(false);
  });
});

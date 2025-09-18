import { browser, by, element, protractor, ElementFinder, ExpectedConditions as EC } from 'protractor';

export class SettingsPage {
  getUserIcon(): ElementFinder {
    return element(by.css('img[alt="user"]'));
  }

  getSettingsLink(): ElementFinder {
    return element(by.css('a[href="/settings"]'));
  }

  getUserProfileTitle(): ElementFinder {
    return element(by.cssContainingText('h4.card-title', 'User Profile'));
  }

  getProfileValue(label: string): ElementFinder {
    return element(by.xpath(`//dt[text()="${label}"]/following-sibling::dd[1]`));
  }

  getConnectNewDeviceButton(): ElementFinder {
    return element(by.cssContainingText('button.btn', 'Connect New Device'));
  }

  getDeviceNameInput(): ElementFinder {
    return element(by.id('deviceNameInput'));
  }

  getExpirationSelect(): ElementFinder {
    return element(by.id('expirationSelect'));
  }

  getConnectButton(): ElementFinder {
    return element(by.css('button.btn-az-primary:not(.btn-sm)'));
  }

  getScanToConnectModalTitle(): ElementFinder {
    return element(by.cssContainingText('h5.modal-title span', 'Scan to Connect'));
  }

  getExpandTableButton(): ElementFinder {
    return element(by.css('a[aria-controls="rawQrCodeDataCollapse"]'));
  }

  getTokenTextarea(): ElementFinder {
    return element(by.css('textarea.form-control.font-monospace'));
  }

  getCloseButton(): ElementFinder {
    return element(by.cssContainingText('button.btn.btn-secondary', 'Close'));
  }

  getDeviceListItem(deviceName: string): ElementFinder {
    return element(by.cssContainingText('.list-group-item h6', deviceName));
  }

  getDeleteDeviceButton(): ElementFinder {
    return element(by.css('button.btn-outline-danger'));
  }

  async clickOnUserIcon(): Promise<void> {
    const icon = this.getUserIcon();
    await browser.wait(EC.visibilityOf(icon), 10000);
    await browser.wait(EC.elementToBeClickable(icon), 10000);
    await icon.click();
  }

  async clickOnSettingsLink(): Promise<void> {
    const link = this.getSettingsLink();
    await browser.wait(EC.visibilityOf(link), 10000);
    await browser.wait(EC.elementToBeClickable(link), 10000);
    await link.click();
  }

  async getUserProfileText(): Promise<string> {
    const title = this.getUserProfileTitle();
    await browser.wait(EC.visibilityOf(title), 10000);
    return title.getText();
  }

  async isUserNamePresent(): Promise<boolean> {
    const el = this.getProfileValue('User Name:');
    await browser.wait(EC.visibilityOf(el), 10000);
    const text = await el.getText();
    return text.trim().length > 0;
  }

  async isUserEmailPresent(): Promise<boolean> {
    const el = this.getProfileValue('User Email:');
    await browser.wait(EC.visibilityOf(el), 10000);
    const text = await el.getText();
    return text.trim().length > 0;
  }

  async isUserRolePresent(): Promise<boolean> {
    const el = this.getProfileValue('User Role:');
    await browser.wait(EC.visibilityOf(el), 10000);
    const text = await el.getText();
    return text.trim().length > 0;
  }

  async getConnectedDevicesTitle(): Promise<string> {
    const el = element(by.cssContainingText('h4.card-title', 'Connected Devices'));
    await browser.wait(EC.visibilityOf(el), 10000);
    return el.getText();
  }

  async clickOnConnectNewDevice(): Promise<void> {
    const button = this.getConnectNewDeviceButton();
    await browser.wait(EC.visibilityOf(button), 10000);
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async enterDeviceName(name: string): Promise<void> {
    const input = this.getDeviceNameInput();
    await browser.wait(EC.visibilityOf(input), 10000);
    await input.clear();
    await input.sendKeys(name);
  }

  async selectExpiration(valueText: string): Promise<void> {
    const select = this.getExpirationSelect();
    await browser.wait(EC.visibilityOf(select), 10000);
    const option = select.element(by.cssContainingText('option', valueText));
    await browser.wait(EC.elementToBeClickable(option), 10000);
    await option.click();
  }

  async clickOnConnectButton(): Promise<void> {
    const button = this.getConnectButton();
    await browser.wait(EC.visibilityOf(button), 10000);
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async isScanToConnectModalVisible(): Promise<boolean> {
    const modalTitle = this.getScanToConnectModalTitle();
    try {
      await browser.wait(EC.visibilityOf(modalTitle), 10000);
      return true;
    } catch {
      return false;
    }
  }

  async clickOnExpandTable(): Promise<void> {
    const button = this.getExpandTableButton();
    await browser.wait(EC.visibilityOf(button), 10000);
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async isTokenPresent(): Promise<boolean> {
    const textarea = this.getTokenTextarea();
    await browser.wait(EC.visibilityOf(textarea), 10000);
    const text = await textarea.getAttribute('value');
    return text.includes('"token":');
  }

  async clickOnCloseButton(): Promise<void> {
    const button = this.getCloseButton();
    await browser.wait(EC.visibilityOf(button), 10000);
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async isDevicePresent(deviceName: string): Promise<boolean> {
    const device = this.getDeviceListItem(deviceName);
    try {
      await browser.wait(EC.visibilityOf(device), 10000);
      return true;
    } catch {
      return false;
    }
  }

  async clickOnDeleteDeviceButton(): Promise<void> {
    const btn = this.getDeleteDeviceButton();
    await browser.wait(EC.visibilityOf(btn), 10000);
    await browser.wait(EC.elementToBeClickable(btn), 10000);
    await btn.click();
  }

  async confirmDeleteAlert(): Promise<void> {
    await browser.wait(EC.alertIsPresent(), 5000);
    const alertDialog = await browser.switchTo().alert();
    await alertDialog.accept();
  }
}

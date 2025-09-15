import { 
  browser, 
  by, 
  element, 
  ElementFinder, 
  ExpectedConditions as EC 
} from 'protractor';

export class BackgroundPage {

  getNotificationsDropdown(): ElementFinder {
    return element(by.css('#notificationsDropdown'));
  }

  getViewHistoryButton(): ElementFinder {
    return element(by.css('a[href="/background-jobs"]'));
  }

  getDetailsButton(): ElementFinder {
    return element(by.css('tbody > tr:nth-of-type(1) .btn'));
  }

  getToastSuccess(): ElementFinder {
    return element(by.css('.toast-success'));
  }

  getSourceDetailTitle(): ElementFinder {
    return element(by.cssContainingText('h2', 'Source Details'));
  }

  getStatusDoneLabel(): ElementFinder {
    return element(by.cssContainingText('label.badge-success', 'STATUS_DONE'));
  }

  getAnyValidStatusLabel(): ElementFinder {
    return element.all(by.css('label.badge')).filter(async (el: ElementFinder) => {
      const text = await el.getText();
      return text === 'STATUS_LOCKED' || text === 'STATUS_DONE';
    }).first();
  }

  getCloseDetailsModalButton(): ElementFinder {
    return element(by.buttonText('Close'));
  }

  async openNotificationsDropdown(): Promise<void> {
    const dropdown = this.getNotificationsDropdown();
    await browser.wait(EC.presenceOf(dropdown), 5000, 'Dropdown not present in DOM');
    await browser.wait(EC.elementToBeClickable(dropdown), 5000, 'Dropdown not clickable');
    await browser.executeScript('arguments[0].scrollIntoView(true);', dropdown.getWebElement());
    await dropdown.click();
    await browser.sleep(500);
  }

  async clickOnViewHistory(): Promise<void> {
    const button = this.getViewHistoryButton();
    await browser.wait(EC.elementToBeClickable(button), 5000, 'View History not clickable');
    await button.click();
  }

  async clickDetailsButton(): Promise<void> {
    const button = this.getDetailsButton();
    await browser.wait(EC.visibilityOf(button), 10000, 'Details button is not visible on the /background-jobs page');
    await browser.wait(EC.elementToBeClickable(button), 10000, 'Details button is not clickable');
    await button.click();
  }

  async waitForToastSuccess(): Promise<void> {
    const toast = this.getToastSuccess();
    await browser.wait(EC.visibilityOf(toast), 15000, 'Success toast not visible');
  }

  async waitForSourceDetail(): Promise<void> {
    const title = this.getSourceDetailTitle();
    await browser.wait(EC.visibilityOf(title), 15000, 'Source Details page not loaded');
  }

  async verifyAnyValidStatusLabel(): Promise<void> {
    const label = this.getAnyValidStatusLabel();
    await browser.wait(EC.visibilityOf(label), 5000, 'No STATUS_LOCKED or STATUS_DONE label visible');
    const text = await label.getText();
    expect(['STATUS_LOCKED', 'STATUS_DONE']).toContain(text);
  }

  async verifyStatusDoneLabel(): Promise<void> {
    const label = this.getStatusDoneLabel();
    await browser.wait(EC.visibilityOf(label), 5000, 'STATUS_DONE label not visible');
    const text = await label.getText();
    expect(text).toBe('STATUS_DONE');
  }

  async closeDetailsModal(): Promise<void> {
    const closeBtn = this.getCloseDetailsModalButton();
    await browser.wait(EC.visibilityOf(closeBtn), 5000, 'Close button not visible');
    await browser.wait(EC.elementToBeClickable(closeBtn), 5000, 'Close button not clickable');
    await closeBtn.click();
  }
}

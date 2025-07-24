import { browser, by, element, ElementFinder, ElementArrayFinder, ExpectedConditions as EC } from 'protractor';

export class SourcesPage {

  // ELEMENT GETTERS – used for consistency and easy test access

  getSourcesLink(): ElementFinder {
    return element(by.css('a[href="/sources"]'));
  }

  getFileInput(): ElementFinder {
    return element(by.css('ngx-dropzone input[type="file"]'));
  }

  getNotificationsDropdown(): ElementFinder {
    return element(by.css('#notificationsDropdown'));
  }

  getViewHistoryButton(): ElementFinder {
    return element(by.css('a[href="/background-jobs"]'));
  }

getDetailsButton(): ElementFinder {
  return element(by.css("tbody > tr:nth-of-type(1) .btn"));
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

  // ACTION METHODS – used to interact with the page

  /**
   * Clicks on the /sources link and waits until it is visible and clickable
   */
  async clickOnSourcesLink(): Promise<void> {
    const link = this.getSourcesLink();

    await browser.wait(EC.visibilityOf(link), 10000, 'Sources link not visible');
    await browser.wait(EC.elementToBeClickable(link), 10000, 'Sources link not clickable');

    await link.click();
  }

  /**
   * Uploads the specified file
   */
  async uploadFile(filePath: string): Promise<void> {
    const fileInput = this.getFileInput();

    await browser.wait(EC.presenceOf(fileInput), 5000, 'File input not present');
    await fileInput.sendKeys(filePath);
  }

  /**
   * Opens the notifications dropdown
   */
 async openNotificationsDropdown(): Promise<void> {
  const dropdown = this.getNotificationsDropdown();

  await browser.wait(EC.presenceOf(dropdown), 5000, 'Dropdown not present in DOM');
  await browser.wait(EC.elementToBeClickable(dropdown), 5000, 'Dropdown not clickable');

  await browser.executeScript('arguments[0].scrollIntoView(true);', dropdown.getWebElement());

  await dropdown.click();

  // Confirm dropdown opened (if there's a dropdown menu that becomes visible, wait for it here)
  await browser.sleep(500); // optional: allows animation to complete
}

  /**
   * Clicks on the "View History" button
   */
  async clickOnViewHistory(): Promise<void> {
    const button = this.getViewHistoryButton();

    await browser.wait(EC.elementToBeClickable(button), 5000, 'View History not clickable');
    await button.click();
  }

  /**
   * Clicks on the "Details" button
   */
  async clickDetailsButton(): Promise<void> {
  const button = this.getDetailsButton();
  await button.click();
}

  /**
   * Waits for the success toast to be visible
   */
  async waitForToastSuccess(): Promise<void> {
    const toast = this.getToastSuccess();

    await browser.wait(EC.visibilityOf(toast), 15000, 'Success toast not visible');
  }

  /**
   * Waits for the Source Details page to load
   */
  async waitForSourceDetail(): Promise<void> {
    const title = this.getSourceDetailTitle();

    await browser.wait(EC.visibilityOf(title), 15000, 'Source Details page not loaded');
  }

  /**
   * Verifies that a STATUS_LOCKED or STATUS_DONE label is visible
   */
  async verifyAnyValidStatusLabel(): Promise<void> {
    const label = this.getAnyValidStatusLabel();

    await browser.wait(EC.visibilityOf(label), 5000, 'No STATUS_LOCKED or STATUS_DONE label visible');

    const text = await label.getText();
    expect(['STATUS_LOCKED', 'STATUS_DONE']).toContain(text);
  }

  /**
   * Verifies that a STATUS_DONE label is visible and correct
   */
  async verifyStatusDoneLabel(): Promise<void> {
    const label = this.getStatusDoneLabel();

    await browser.wait(EC.visibilityOf(label), 5000, 'STATUS_DONE label not visible');

    const text = await label.getText();
    expect(text).toBe('STATUS_DONE');
  }

}

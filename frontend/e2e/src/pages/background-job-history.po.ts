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
    await browser.wait(EC.presenceOf(dropdown), 5000);
    await browser.wait(EC.elementToBeClickable(dropdown), 5000);
    await browser.executeScript('arguments[0].scrollIntoView(true);', dropdown.getWebElement());
    await dropdown.click();
    await browser.sleep(500);
  }

  async clickOnViewHistory(): Promise<void> {
    const button = this.getViewHistoryButton();
    await browser.wait(EC.elementToBeClickable(button), 5000);
    await button.click();
  }

  async clickDetailsButton(): Promise<void> {
    const button = this.getDetailsButton();
    await browser.wait(EC.visibilityOf(button), 10000);
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async verifyAnyValidStatusLabel(): Promise<void> {
    const label = this.getAnyValidStatusLabel();
    await browser.wait(EC.visibilityOf(label), 5000);
    const text = await label.getText();
    expect(['STATUS_LOCKED', 'STATUS_DONE']).toContain(text);
  }

  async closeDetailsModal(): Promise<void> {
    const closeBtn = this.getCloseDetailsModalButton();
    await browser.wait(EC.visibilityOf(closeBtn), 5000);
    await browser.wait(EC.elementToBeClickable(closeBtn), 5000);
    await closeBtn.click();
  }

 async isOnBackgroundJobHistory(): Promise<boolean> {
  const title = element(by.css('h4.card-title'));
  const text = await title.getText();
  return text.trim() === 'Background Job History';
}

}

import { browser, by, element, ElementFinder, ExpectedConditions as EC } from 'protractor';

export class SourcesPage {
  getSourcesLink(): ElementFinder {
    return element.all(by.css('a[href="/sources"]')).first();
  }

  getFileInput(): ElementFinder {
    return element(by.css('ngx-dropzone input[type="file"]'));
  }

  async clickOnSourcesLink(): Promise<void> {
    const link = this.getSourcesLink();
    await browser.wait(EC.visibilityOf(link), 10000);
    await browser.wait(EC.elementToBeClickable(link), 10000);
    await link.click();
  }

  async uploadFile(filePath: string): Promise<void> {
    const fileInput = this.getFileInput();
    await fileInput.sendKeys(filePath);
    await browser.sleep(3000);
  }

async isFileUploaded(): Promise<boolean> {
  const preview = element(by.css('ngx-dropzone-preview'));
  try {
    await browser.wait(EC.visibilityOf(preview), 20000);
    return true;
  } catch {
    return false;
  }
 }
}

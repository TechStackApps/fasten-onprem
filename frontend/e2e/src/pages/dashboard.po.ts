import { browser, by, element, ElementFinder, ExpectedConditions as EC } from 'protractor';

export class DashboardPage {

  
  getDashboardLink(): ElementFinder {
    return element(by.css("[routerLink='/dashboard']"));
  }


  async clickDashboardLink(): Promise<void> {
    const link = this.getDashboardLink();
    await browser.wait(EC.elementToBeClickable(link), 5000, 'Dashboard link not clickable');
    await link.click();
  }

 async getUserNameOnly(): Promise<string> {
  const el = element(by.css('.card.card-dashboard-pageviews .card-text'));
  await browser.wait(EC.visibilityOf(el), 5000);
  const fullText = await el.getText(); 
  return fullText.split('|')[0].trim(); 
}
}

import { 
  browser, 
  by, 
  element, 
  protractor, 
  ExpectedConditions as EC, 
  ElementFinder, 
  ElementArrayFinder 
} from 'protractor';

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
    const el = element(by.css('.card-dashboard-pageviews .card-text'));
    await browser.wait(EC.visibilityOf(el), 5000);
    const fullText = await el.getText();
    const firstPart = fullText.split('|')[0].trim();
    return firstPart;
  }

  async getAllRecordsText(): Promise<string[]> {
    const rows = element.all(by.css("table.table.mg-b-0 tbody tr"));
    await browser.wait(protractor.ExpectedConditions.presenceOf(rows.first()), 5000);
    return rows.map(async (el) => await el.getText());
  }

  async getAllRecordObjects(): Promise<{ name: string; records: string }[]> {
    const rows = await this.getAllRecordsText();
    return rows.map((row: string) => {
      const parts = row.split("\n").map(p => p.trim()).filter(Boolean);
      return {
        name: parts[0],
        records: `${parts[parts.length - 2]} Records`
      };
    });
  }

  async getAllPatientVitals(): Promise<{ title: string; date: string; value: string }[]> {
    const items = element.all(by.css(".card-dashboard-pageviews .az-list-item"));
    await browser.wait(protractor.ExpectedConditions.presenceOf(items.first()), 5000);
    const results = await items.map(async (item) => {
      const title = await item.element(by.css("h6")).getText();
      const date = await item.element(by.css("span")).getText();
      const value = await item.element(by.css("h6.tx-primary")).getText();
      return { title, date, value };
    });
    return results as { title: string; date: string; value: string }[];
  }

  async getWeightFromCard(): Promise<string> {
    const card = element(by.cssContainingText(".card-header p", "Weight"));
    const valueEl = card.element(by.xpath("preceding-sibling::h6"));
    await browser.wait(EC.visibilityOf(valueEl), 5000, "Weight card not visible");
    return valueEl.getText();
  }

  async getHeightFromCard(): Promise<string> {
    const card = element(by.cssContainingText(".card-header p", "Height"));
    const valueEl = card.element(by.xpath("preceding-sibling::h6"));
    await browser.wait(EC.visibilityOf(valueEl), 5000, "Height card not visible");
    return valueEl.getText();
  }

  async getBloodPressureFromCard(): Promise<string> {
    const card = element(by.cssContainingText(".card-header p", "Blood Pressure"));
    const valueEl = card.element(by.xpath("following-sibling::h6"));
    await browser.wait(EC.visibilityOf(valueEl), 5000, "Blood Pressure card not visible");
    return valueEl.getText();
  }
}

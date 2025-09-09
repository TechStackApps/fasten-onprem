import { 
  browser, 
  by, 
  element, 
  ExpectedConditions as EC 
} from 'protractor';

export class ExplorePage {

  async goToExplorePage(): Promise<void> {
    const labsLink = element(by.css("[routerlink='/explore']"));
    await labsLink.click();
  }

  async getExplorePageTitle(): Promise<string> {
    const elementLocator = element(by.css(".az-dashboard-title"));
    return await elementLocator.getText();
  }

  async getMedicalRecordLabel(): Promise<string> {
    const elementLocator = element(by.cssContainingText("small.tx-gray-700", "Fasten Health"));
    return await elementLocator.getText();
  }

  async clickFirstMedicalRecordCard(): Promise<void> {
    const elementLocator = element(by.css("app-medical-sources-card:nth-of-type(1) > .card .h-100"));
    await elementLocator.click();
  }
}

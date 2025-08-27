import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class LabsPage {

   async goToLabsPage(): Promise<void> {
    const labsLink = element(by.css("[routerlink='/labs']"));
    await labsLink.click();
  } 

   async getTobaccoSmokingStatus(): Promise<string> {
    const elementLocator = element(
      by.xpath("//span[normalize-space(text())='Tobacco smoking status NHIS']")
    );
    return await elementLocator.getText();
  }
 
  async getTobaccoSmokingStatusSection(): Promise<string> {
  const el = element(
    by.xpath("//p[contains(.,'Short Name: Tobacco smoking status NHIS Result:   Latest Test Date: Sep 6, 2019')]")
  );
  await browser.wait(EC.visibilityOf(el), 10000, "Observation not visible");
  return await el.getText();
}

async getAllObservations(): Promise<{ date: string, result: string }[]> {
  const rows = element.all(by.css("div.visualization-container table tbody tr"));
  const observations: { date: string, result: string }[] = [];

  const rowCount = await rows.count();

  for (let i = 0; i < rowCount; i++) {
    const date = await rows.get(i).element(by.css("td:first-child")).getText();
    const result = await rows.get(i).element(by.css("td:nth-child(2)")).getText();
    observations.push({ date, result });
  }

  return observations;
}

async getPainSeveritySection(): Promise<string> {
  const el = element(
    by.css("[ng-reflect-observation-code='PAIN-SEVERITY-CODE'] .col-12 > p")
  );
  await browser.wait(EC.visibilityOf(el), 10000, "Pain severity observation not visible");
  return await el.getText();
}

}


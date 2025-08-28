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
    by.xpath("//span[.='Pain severity - 0-10 verbal numeric rating [Score] - Reported']")
  );
  await browser.wait(EC.visibilityOf(el), 10000, "Pain severity observation not visible");
  return await el.getText();
}

async getPainObservation(): Promise<string[]> {
  const blocks = element.all(
    by.xpath("//p[contains(.,'Short Name: Pain severity')]")
  );
  const details: string[] = [];

  const blockCount = await blocks.count();
  console.log("DEBUG: Found", blockCount, "pain observation blocks");

  for (let i = 0; i < blockCount; i++) {
    let text = await blocks.get(i).getText();


    text = text.replace("show all", "");
    const cleaned = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .join("\n");

    details.push(cleaned);
  }

  return details;
}

async getWeightDifferenceText(): Promise<string> {
  const el = element(
    by.xpath("//span[.='Weight difference [Mass difference] --pre dialysis - post dialysis']")
  );
  return el.getText();
}

async getWeightDifferenceObservation(): Promise<string> {
  const el = element(
    by.xpath("//p[contains(.,'Short Name: Weight difference [Mass difference] --pre dialysis - post dialysis')]")
  );

  const text = await el.getText();

  return text
    .replace("show all", "")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join("\n");
}

async getWeightForLengthText(): Promise<string> {
  const el = element(
    by.xpath("//span[.='Weight-for-length Per age and sex']")
  );
  return el.getText();
}

async getWeightForLengthObservation(): Promise<string> {
  const el = element(
    by.xpath("//p[contains(.,'Short Name: Weight-for-length Per age and sex')]")
  );

  let text = await el.getText();


  text = text.replace("show all", "");
  return text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join("\n");
}

async getPlateletsInBlood(): Promise<string> {
  const el = element(
    by.xpath("//span[.='Platelets [#/volume] in Blood by Automated count']")
  );
  return el.getText();
}

async getPlateletsInBloodObservation(): Promise<string> {
  const el = element(
    by.xpath("//p[contains(.,'Short Name: Platelets [#/volume] in Blood by Automated count')]")
  );

  let text = await el.getText();


  text = text.replace("show all", "");
  return text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join("\n");
}

async getMCHText(): Promise<string> {
  const el = element(
    by.xpath("//span[.='MCH [Entitic mass] by Automated count']")
  );
  await browser.wait(EC.visibilityOf(el), 10000, "MCH text not visible");
  return el.getText();
}

async getMCHObservation(): Promise<string> {
  const el = element(
    by.xpath("//p[contains(.,'Short Name: MCH [Entitic mass] by Automated count')]")
  );
  await browser.wait(EC.visibilityOf(el), 10000, "MCH observation not visible");
  let text = await el.getAttribute("innerText");
  return text
    .replace("show all", "")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join("\n");
}


}


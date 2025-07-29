import { element, by, ElementFinder, browser, ExpectedConditions as EC } from 'protractor';

export class MedicalHistoryPage {

  getMedicalHistoryLink(): ElementFinder {
    return element(by.css("[routerlink='/medical-history']"));
  }

  getReportsDropdown(): ElementFinder {
    return element(by.id('dropdownReports'));
  }

  getAddConditionButton(): ElementFinder{
    return element (by.css("[routerlink='/resource/create']"));
  }

  getFindCreateEncounterButton(): ElementFinder {
  return element(by.buttonText('Find/Create Encounter'));
}
  getCreateButton(): ElementFinder {
  return element(by.buttonText('Create'));
}
  getSearchInput(): ElementFinder {
  return element(by.css('input[placeholder="Search"]'));
}
  async typeInSearchInput(text: string): Promise<void> {
  await this.typeIntoInput('input[placeholder="Search"]', text);
}

async typePeriodStart(date: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="period_start"]', date);
}

async typePeriodEnd(date: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="period_end"]', date);
}

async clickMedicationsTab(): Promise<void> {
  await this.clickElement('.nav-pills > a:nth-of-type(2)');
}

async clickAddMedicationButton(): Promise<void> {
  await this.clickElement('button.btn-outline-indigo.btn-block');
}

async typeMedicationName(name: string): Promise<void> {
  const input = element.all(by.css("input[placeholder='Search'][role='combobox']")).first();
  await this.typeIntoElement(input, name);
}

async typeDosage(value: string): Promise<void> {
  await this.typeIntoInput("input[placeholder='Input box']", value);
}

async typeMedicationStartDate(date: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="started"]', date);
}

async typeMedicationStoppedDate(date: string): Promise<void> {
  await this.typeIntoInput("input[formcontrolname='stopped']", date);
}

async typeInstructions(text: string): Promise<void> {
  await this.typeIntoInput("textarea[formcontrolname='instructions']", text);
}

async clickSubmitButton(): Promise<void> {
  await this.clickElement('[type="submit"]');
}

async typeSurgeryOrImplant(text: string): Promise<void> {
  const input = element.all(by.css("input[placeholder='Search'][role='combobox']")).first();
  await this.typeIntoElement(input, text);
}

async clickAddSurgeryOrImplantButton(): Promise<void> {
  await this.clickElement('.btn-outline-indigo');
}






  async clickMedicalHistoryLink(): Promise<void> {
    const link = this.getMedicalHistoryLink();
    await browser.wait(EC.elementToBeClickable(link), 5000);
    await link.click();
  }

  async clickReportsDropdown(): Promise<void> {
    const dropdown = this.getReportsDropdown();
    await browser.wait(EC.elementToBeClickable(dropdown), 5000);
    await dropdown.click();
  }

  async clickAddCondition(): Promise<void> {
  const addCondition = this.getAddConditionButton(); 
  await browser.wait(EC.elementToBeClickable(addCondition), 5000);
  await addCondition.click();
}

async clickFindCreateEncounter(): Promise<void> {
  const button = this.getFindCreateEncounterButton();
  await browser.wait(EC.elementToBeClickable(button), 5000);
  await button.click();
}

async clickCreateButton(): Promise<void> {
  const button = this.getCreateButton();
  await browser.wait(EC.elementToBeClickable(button), 5000);
  await button.click();
}

async typeIntoInput(selector: string, value: string): Promise<void> {
  const input = element(by.css(selector));
  await browser.wait(EC.visibilityOf(input), 5000);
  await browser.executeScript('arguments[0].scrollIntoView(true);', input.getWebElement());
  await browser.wait(EC.elementToBeClickable(input), 5000);
  await input.clear();
  await input.sendKeys(value);
}


async clickAddEncounter(): Promise<void> {
  const button = element(by.css('.btn-az-primary'));
  await browser.wait(EC.elementToBeClickable(button), 5000);
  await button.click();
}

async clickElement(selector: string): Promise<void> {
  const elementToClick = element(by.css(selector));
  await browser.wait(EC.visibilityOf(elementToClick), 5000);
  await browser.executeScript('arguments[0].scrollIntoView(true);', elementToClick.getWebElement());
  await browser.wait(EC.elementToBeClickable(elementToClick), 5000);
  await elementToClick.click();
}

async changeStatusTo(status: 'Activ' | 'Stopped'): Promise<void> {
  const dropdown = element(by.css("select[formcontrolname='status']"));
  await browser.wait(EC.elementToBeClickable(dropdown), 5000);
  await dropdown.sendKeys(status);
}

async typeIntoElement(input: ElementFinder, value: string): Promise<void> {
  await browser.wait(EC.visibilityOf(input), 5000);
  await browser.wait(EC.elementToBeClickable(input), 5000);
  await browser.executeScript('arguments[0].scrollIntoView(true);', input.getWebElement());
  await input.clear();
  await input.sendKeys(value);
}

async typeWhyStopped(text: string): Promise<void> {
  const input = element.all(by.css("input[placeholder='Search'][role='combobox']")).last();
  await browser.wait(EC.elementToBeClickable(input), 5000);
  await input.click();
  await browser.wait(EC.visibilityOf(input), 5000);
  await input.clear();
  await input.sendKeys(text);
}

async selectRequesterNewPractitioner(optionText: string): Promise<void> {
  const select = element(by.css('select[formcontrolname="requester"]'));
  const option = select.element(by.cssContainingText('option', optionText));
  await browser.wait(EC.elementToBeClickable(option), 5000);
  await option.click();
}

async clickProceduresTab(): Promise<void> {
  const tab = element(by.xpath("//a[normalize-space()='Procedures']"));
  await browser.wait(EC.visibilityOf(tab), 5000);
  await browser.executeScript('arguments[0].scrollIntoView(true);', tab.getWebElement());
  await browser.wait(EC.elementToBeClickable(tab), 5000);
  await tab.click();
}












}

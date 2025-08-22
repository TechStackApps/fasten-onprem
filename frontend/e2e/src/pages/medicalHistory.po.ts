import {protractor, element, by, ElementFinder, browser, ExpectedConditions as EC } from 'protractor';
import * as fs from 'fs';
import * as path from 'path';



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
  const input = element(by.css("input[placeholder='Search'][role='combobox']"));
  await input.clear();
  await input.sendKeys(text);
  await input.sendKeys(protractor.Key.ENTER);
}

async clickAddSurgeryOrImplantButton(): Promise<void> {
  const button = element(by.buttonText('Add Surgery or Implant'));
  await browser.wait(EC.elementToBeClickable(button), 5000, 'Button not clickable');
  await button.click();
}

async typeDate(date: string): Promise<void> {
  await this.typeIntoInput('input[placeholder="yyyy-mm-dd"]', date);
}

async selectPerformedByProcedure (optionText: string): Promise<void> {
  const select = element(by.css('select[formcontrolname="performer"]'));
  const option = select.element(by.cssContainingText('option', optionText));
  await browser.wait(EC.elementToBeClickable(option), 5000);
  await option.click();
}

async selectLocation (optionText: string): Promise<void> { 
  const select = element(by.css("[formcontrolname='location']"));
  const option = select.element(by.cssContainingText('option', optionText));
  await browser.wait(EC.elementToBeClickable(option), 5000);
  await option.click();
} 

async selectPerformedBy(date: string): Promise<void> {
  await this.typeIntoInput('input[placeholder="yyyy-mm-dd"]', date);
}

async typeDescription(message: string): Promise<void> {
  await this.typeIntoInput('textarea[formcontrolname="comment"]', message);
}

async addNewAttachment(): Promise<void> {
  const attachButton = element(by.xpath("//button[.//i[contains(@class, 'fa-paperclip')]]"));

  await browser.wait(EC.presenceOf(attachButton), 5000, 'Attach button not present');
  await browser.wait(EC.visibilityOf(attachButton), 5000, 'Attach button not visible');

  await browser.executeScript('arguments[0].scrollIntoView(true);', attachButton.getWebElement());
  await browser.wait(EC.elementToBeClickable(attachButton), 5000, 'Attach button not clickable');

  await attachButton.click();
}

async typeNewAttachmentTitle(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="name"]', text);
}

async categorySearchNewAttachment(text: string): Promise<void> {
  const input = element(by.css('app-nlm-typeahead[formcontrolname="category"] input[placeholder="Search"]'));

  await browser.wait(EC.presenceOf(input), 10000, '⚠️ Category input not present');
  await browser.wait(EC.elementToBeClickable(input), 5000, '⚠️ Category input not clickable');

  await input.clear();
  await input.sendKeys(text);
  await input.sendKeys(protractor.Key.ENTER);
}

async typeNewAttachmentFileType(text: string): Promise<void> {
  const input = element(by.css('app-nlm-typeahead[formcontrolname="file_type"] input[placeholder="Search"]'));

  await browser.wait(EC.presenceOf(input), 10000, '⚠️ File type input not present');
  await browser.wait(EC.elementToBeClickable(input), 5000, '⚠️ File type input not clickable');

  await input.clear();
  await input.sendKeys(text);
  await input.sendKeys(protractor.Key.ENTER);
}

async uploadAttachment(): Promise<void> {
  const filePath = path.resolve(__dirname, '../data/example_client.json');
  const fileInput = element(by.css('#customFile'));

  await browser.wait(EC.presenceOf(fileInput), 5000);
  await browser.executeScript('arguments[0].style.display = "block";', fileInput.getWebElement());
  await fileInput.sendKeys(filePath);
}

async clickCreateAttachmentButton(): Promise<void> {
  const button = element(by.buttonText('Create Attachment'));

  await browser.wait(EC.elementToBeClickable(button), 5000, '⚠️ Create Attachment button not clickable');
  await button.click();
}

async clickSaveButton(): Promise<void> {
  const button = element(by.buttonText('Save'));
  await browser.wait(EC.elementToBeClickable(button), 10000);
  await button.click();
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

////////// Practitioners page

async clickPractitioners(): Promise<void> {
  const practitionerTab = element(by.cssContainingText('.nav-link', 'Practitioners'));
  await browser.wait(EC.elementToBeClickable(practitionerTab), 10000, 'Practitioners tab not clickable');
  await practitionerTab.click();
}

async clickAddPractitionerButton(): Promise<void> {
  const addButton = element(by.buttonText('Add Practitioner'));
  await browser.wait(EC.elementToBeClickable(addButton), 10000, 'Add Practitioner button not clickable');
  await addButton.click();
}

async typePractitionerName(text: string): Promise<void> {
  await this.typeIntoInput(".tab-pane [formcontrolname='data'] > [placeholder='Search']", text);
}

async typePractitionerType(text: string): Promise<void> {
  await this.typeIntoInput('app-nlm-typeahead[formcontrolname="profession"] input', text);
}

async typePractitionerTelephone(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="phone"]', text);
}

async typePractitionerFax(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="fax"]', text);
}

async typePractitionerEmail(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="email"]', text);
}

async typePractitionerAddressLine1(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="line1"]', text);
}

async typePractitionerCity(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="city"]', text);
}

async typePractitionerState(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="state"]', text);
}

async typePractitionerZip(text: string): Promise<void> {
  await this.typeIntoInput('input[formcontrolname="zip"]', text);
}

async typePractitionerCountry(text: string): Promise<void> {
  const input = element(by.css('app-nlm-typeahead[formcontrolname="country"] input[placeholder="Search"]'));

  await this.typeIntoInput('app-nlm-typeahead[formcontrolname="country"] input[placeholder="Search"]', text);
  await browser.sleep(300);
  await input.sendKeys(protractor.Key.ENTER);
}

async createAddPractitionerButton(): Promise<void> {
  await this.clickElement('.modal-footer .btn.btn-az-primary');

}

////////// ////////// Organizations page

async clickOrganizations(): Promise<void> {
  const organizationsTab = element(by.cssContainingText('.nav-link', 'Organizations'));
  await browser.wait(EC.elementToBeClickable(organizationsTab), 10000, 'Organizations tab not clickable');
  await organizationsTab.click();
}

async clickAddOrganizationButton(): Promise<void> {
  const button = element(by.buttonText('Add Organization'));
  await browser.wait(EC.elementToBeClickable(button), 10000, 'Add Organization button is not clickable');
  await button.click();
}

async typeOrganizationType(text: string): Promise<void> {
  const inputSelector = 'app-nlm-typeahead[formcontrolname="type"] input';
  const input = element(by.css(inputSelector));

  await this.typeIntoInput(inputSelector, text);
  await browser.sleep(300);
  await input.sendKeys(protractor.Key.ENTER);
}

////////// ////////// Lab Results page

async clickLabResults(): Promise<void> {
  const practitionerTab = element(by.cssContainingText('.nav-link', ' Lab Results '));
  await browser.wait(EC.elementToBeClickable(practitionerTab), 10000, ' Lab Results tab not clickable');
  await practitionerTab.click();
}

async clickCreateLabResult(): Promise<void> {
  const button = element(by.buttonText('Create Lab Result'));
  await browser.wait(EC.elementToBeClickable(button), 10000, 'Create Lab Result button is not clickable');
  await button.click();
}

async typeLabPanel(text: string): Promise<void> {
  const input = element(by.css('input[placeholder="Search"][role="combobox"]'));

  await browser.wait(EC.visibilityOf(input), 10000, 'Lab Panel input not visible');
  await input.clear();
  await input.sendKeys(text);
  await browser.sleep(300);
  await input.sendKeys(protractor.Key.ENTER);
}

async typeNumberStartTime(text: string): Promise<void> {
  const input = element(by.css('input[id="/100301-1/1"]'));
  await browser.wait(EC.visibilityOf(input), 10000, 'Input not visible');
  await input.clear();
  await input.sendKeys(text);
}

async typeNumberEndTime(text: string): Promise<void> {
  const input = element(by.css('input[id="/100300-3/1"]'));
  await browser.wait(EC.visibilityOf(input), 10000, 'End time input not visible');
  await input.clear();
  await input.sendKeys(text);
}

async clickCreateLabResultsButton(): Promise<void> {
  const button = element(by.cssContainingText('button.btn.btn-az-primary', 'Create Lab Results'));
  await browser.wait(EC.elementToBeClickable(button), 10000, 'Create Lab Results button is not clickable');
  await button.click();
}

////////// ////////// Notes & Attachments page

async clickAttachments(): Promise<void> {
  const attachmentsTab = element(by.cssContainingText('.nav-link', 'Attachments'));
  await browser.wait(EC.elementToBeClickable(attachmentsTab), 10000, 'Attachments tab not clickable');
  await attachmentsTab.click();
}

async verifyNameContainsSurgery(): Promise<void> {
  const nameInput = element(by.css('input[formcontrolname="name"]'));
  await browser.wait(EC.visibilityOf(nameInput), 10000, 'Name input not visible');
  const value = await nameInput.getAttribute('value');
  expect(value).toContain('Surgery', `Expected input value to contain 'Surgery', but got '${value}'`);
}

async clickCloseButton(): Promise<void> {
  const closeButton = element(by.css('button.close[aria-label="Close"]'));
  await browser.wait(EC.elementToBeClickable(closeButton), 10000, 'Close button is not clickable');
  await closeButton.click();
}

async clickExportToPDF(): Promise<void> {
  const link = element(by.cssContainingText('a.nav-link', 'Export to PDF'));
  await browser.wait(EC.elementToBeClickable(link), 10000, '"Export to PDF" link not clickable');
  await link.click();
}

//assert 
 getEncounterCard(): ElementFinder {
    return element(by.css('fhir-card'));
  }

  async clickDropdownAll(): Promise<void> {
  await element(by.id('dropdownAll')).click();
}

  async getDropdownText(): Promise<string> {
  return await element(by.xpath("//div[@class='dropdown-menu show']")).getText();
}
}





import { 
  protractor, 
  element, 
  by, 
  ElementFinder, 
  browser, 
  ExpectedConditions as EC 
} from 'protractor';
import * as path from 'path';

export class MedicalHistoryPage {
  getMedicalHistoryLink(): ElementFinder {
    return element(by.css("[routerlink='/medical-history']"));
  }

  getReportsDropdown(): ElementFinder {
    return element(by.id('dropdownReports'));
  }

  getAddConditionButton(): ElementFinder {
    return element(by.css("[routerlink='/resource/create']"));
  }

  getFindCreateEncounterButton(): ElementFinder {
    return element(by.buttonText('Find/Create Encounter'));
  }

  getCreateButton(): ElementFinder {
    return element(by.buttonText('Create'));
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

  async getPageTitleMedications(): Promise<string> {
    const title = element(by.cssContainingText('h6.card-title', 'Medications'));
    await browser.wait(EC.visibilityOf(title), 10000);
    return title.getText();
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

  async getPractitionerName(): Promise<string> {
    const practitioner = element(by.cssContainingText('h6.card-title', 'Dr.Sarah Levy'));
    await browser.wait(EC.visibilityOf(practitioner), 10000);
    return practitioner.getText();
  }

  async typeSurgeryOrImplant(text: string): Promise<void> {
    const input = element(by.css("input[placeholder='Search'][role='combobox']"));
    await input.clear();
    await input.sendKeys(text);
    await input.sendKeys(protractor.Key.ENTER);
  }

  async getSurgeriesTitle(): Promise<string> {
    const title = element(by.cssContainingText('h6.card-title', 'Major Surgeries and Implants'));
    await browser.wait(EC.visibilityOf(title), 10000);
    return title.getText();
  }

  async clickAddSurgeryOrImplantButton(): Promise<void> {
    const button = element(by.buttonText('Add Surgery or Implant'));
    await browser.wait(EC.elementToBeClickable(button), 5000);
    await button.click();
  }

  async typeDate(date: string): Promise<void> {
    await this.typeIntoInput('input[placeholder="yyyy-mm-dd"]', date);
  }

  async selectPerformedByProcedure(optionText: string): Promise<void> {
    const select = element(by.css('select[formcontrolname="performer"]'));
    const option = select.element(by.cssContainingText('option', optionText));
    await browser.wait(EC.elementToBeClickable(option), 5000);
    await option.click();
  }

  async selectLocation(optionText: string): Promise<void> {
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
    await browser.wait(EC.presenceOf(attachButton), 5000);
    await browser.wait(EC.visibilityOf(attachButton), 5000);
    await browser.executeScript('arguments[0].scrollIntoView(true);', attachButton.getWebElement());
    await browser.wait(EC.elementToBeClickable(attachButton), 5000);
    await attachButton.click();
  }

  async typeNewAttachmentTitle(text: string): Promise<void> {
    await this.typeIntoInput('input[formcontrolname="name"]', text);
  }

  async categorySearchNewAttachment(text: string): Promise<void> {
    const input = element(by.css('app-nlm-typeahead[formcontrolname="category"] input[placeholder="Search"]'));
    await browser.wait(EC.presenceOf(input), 10000);
    await browser.wait(EC.elementToBeClickable(input), 5000);
    await input.clear();
    await input.sendKeys(text);
    await input.sendKeys(protractor.Key.ENTER);
  }

  async typeNewAttachmentFileType(text: string): Promise<void> {
    const input = element(by.css('app-nlm-typeahead[formcontrolname="file_type"] input[placeholder="Search"]'));
    await browser.wait(EC.presenceOf(input), 10000);
    await browser.wait(EC.elementToBeClickable(input), 5000);
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
    await browser.wait(EC.elementToBeClickable(button), 5000);
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

  async clickPractitioners(): Promise<void> {
    const practitionerTab = element(by.cssContainingText('.nav-link', 'Practitioners'));
    await browser.wait(EC.elementToBeClickable(practitionerTab), 10000);
    await practitionerTab.click();
  }

  async clickAddPractitionerButton(): Promise<void> {
    const addButton = element(by.buttonText('Add Practitioner'));
    await browser.wait(EC.elementToBeClickable(addButton), 10000);
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

  async clickOrganizations(): Promise<void> {
    const organizationsTab = element(by.cssContainingText('.nav-link', 'Organizations'));
    await browser.wait(EC.elementToBeClickable(organizationsTab), 10000);
    await organizationsTab.click();
  }

  async clickAddOrganizationButton(): Promise<void> {
    const button = element(by.buttonText('Add Organization'));
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async typeOrganizationType(text: string): Promise<void> {
    const inputSelector = 'app-nlm-typeahead[formcontrolname="type"] input';
    const input = element(by.css(inputSelector));
    await this.typeIntoInput(inputSelector, text);
    await browser.sleep(300);
    await input.sendKeys(protractor.Key.ENTER);
  }

  async clickLabResults(): Promise<void> {
    const practitionerTab = element(by.cssContainingText('.nav-link', ' Lab Results '));
    await browser.wait(EC.elementToBeClickable(practitionerTab), 10000);
    await practitionerTab.click();
  }

  async clickCreateLabResult(): Promise<void> {
    const button = element(by.buttonText('Create Lab Result'));
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async typeLabPanel(text: string): Promise<void> {
    const input = element(by.css('input[placeholder="Search"][role="combobox"]'));
    await browser.wait(EC.visibilityOf(input), 10000);
    await input.clear();
    await input.sendKeys(text);
    await browser.sleep(300);
    await input.sendKeys(protractor.Key.ENTER);
  }

  async typeNumberStartTime(text: string): Promise<void> {
    const input = element(by.css('input[id="/100301-1/1"]'));
    await browser.wait(EC.visibilityOf(input), 10000);
    await input.clear();
    await input.sendKeys(text);
  }

  async typeNumberEndTime(text: string): Promise<void> {
    const input = element(by.css('input[id="/100300-3/1"]'));
    await browser.wait(EC.visibilityOf(input), 10000);
    await input.clear();
    await input.sendKeys(text);
  }

  async clickCreateLabResultsButton(): Promise<void> {
    const button = element(by.cssContainingText('button.btn.btn-az-primary', 'Create Lab Results'));
    await browser.wait(EC.elementToBeClickable(button), 10000);
    await button.click();
  }

  async getObservationTitle(): Promise<string> {
    return element(
      by.cssContainingText(
        'h6.card-title',
        'Time period start and end panel Unspecified body region'
      )
    ).getText();
  }

  async clickAttachments(): Promise<void> {
    const attachmentsTab = element(by.cssContainingText('.nav-link', 'Attachments'));
    await browser.wait(EC.elementToBeClickable(attachmentsTab), 10000);
    await attachmentsTab.click();
  }

  async getNameInputValue(): Promise<string> {
    const nameInput = element(by.css('input[formcontrolname="name"]'));
    await browser.wait(EC.visibilityOf(nameInput), 10000);
    return nameInput.getAttribute('value');
  }

  async clickExportToPDF(): Promise<void> {
    const link = element(by.cssContainingText('a.nav-link', 'Export to PDF'));
    await browser.wait(EC.elementToBeClickable(link), 10000);
    await link.click();
  }

  async getSymptomText(): Promise<string> {
    const el = element.all(by.cssContainingText("a", "ACAS")).first();
    return await el.getText();
  }

  async getLatestConditionDate(): Promise<string> {
    const times = element.all(by.css(".timeline .time"));
    return await times.first().getText();
  }

  getEncounterCard(): ElementFinder {
    return element(by.css('fhir-card'));
  }
}

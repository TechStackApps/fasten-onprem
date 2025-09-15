import { 
  browser, 
  by, 
  element, 
  protractor, 
  ExpectedConditions as EC 
} from 'protractor';
import * as fs from 'fs';
import * as path from 'path';

export class AddressBookPage {
  async clickAddressBook(): Promise<void> {
    const el = element(by.css("[routerLink='/practitioners']"));
    await el.click();
  }

  async getPageTitle(): Promise<string> {
    return await element(by.css(".az-content-title")).getText();
  }

  async clickNewPractitioner(): Promise<void> {
    const el = element(by.cssContainingText("button.btn.btn-purple", "New Practitioner"));
    await el.click();
  }

  async getAddPractitionerTitle(): Promise<string> {
    return await element(by.css("h2.az-content-title")).getText();
  }

  async typeName(name: string): Promise<void> {
    const nameInput = element.all(
      by.css("[formcontrolname='data'] > [placeholder='Search']")
    ).get(0);
    await nameInput.clear();
    await nameInput.sendKeys(name);
    await nameInput.sendKeys(protractor.Key.ENTER);
  }

  async clickCreatePractitioner(): Promise<void> {
    const btn = element(by.buttonText("Create Practitioner"));
    await browser.wait(EC.visibilityOf(btn), 5000);
    await browser.wait(EC.elementToBeClickable(btn), 5000);
    try {
      await btn.click();
    } catch {
      await browser.executeScript(
        "arguments[0].scrollIntoView(true); arguments[0].click();",
        btn.getWebElement()
      );
    }
  }

  async handleSuccessAlert(expectedText: string): Promise<void> {
    await browser.wait(EC.alertIsPresent(), 5000);
    const alertDialog = await browser.switchTo().alert();
    const text = await alertDialog.getText();
    expect(text).toBe(expectedText);
    await alertDialog.accept();
  }

  async isPractitionerInList(name: string): Promise<boolean> {
    const practitioner = element(by.cssContainingText(".practitioner-name", name));
    await browser.wait(EC.presenceOf(practitioner), 5000).catch(() => null);
    return practitioner.isPresent();
  }

  async typePractitionerName(name: string): Promise<void> {
    const searchInput = element(by.css("input[placeholder='Search practitioners...']"));
    await searchInput.clear();
    await searchInput.sendKeys(name);
    await searchInput.sendKeys(protractor.Key.ENTER);
  }

  async clickOnPractitioner(name: string): Promise<void> {
    const practitionerCell = element(
      by.cssContainingText("td.name-cell div.practitioner-name", name)
    );
    await browser.wait(EC.visibilityOf(practitionerCell), 5000);
    await browser.wait(EC.elementToBeClickable(practitionerCell), 5000);
    await practitionerCell.click();
  }

  async isContactDetailsSectionVisible(): Promise<boolean> {
    const section = element(by.cssContainingText("h3.section-title", "Contact details"));
    return section.isDisplayed();
  }

  async getContactDetailsElements() {
    return {
      phone: element(by.css("div.contact-item i.fa-phone")),
      address: element(by.css("div.contact-item i.fa-map-marker-alt")),
      resourceId: element(by.css("div.contact-item i.fa-id-card"))
    };
  }

  async getHistorySection() {
    return element(by.cssContainingText("h3.section-title", "History"));
  }

  async clickBack(): Promise<void> {
    const backButton = element(by.css("i.fas.fa-arrow-left.fa-lg"));
    await backButton.click();
  }

  async typeProfession(profession: string): Promise<void> {
    const professionInput = element.all(
      by.css("[formcontrolname='profession'] > [placeholder='Search']")
    ).get(0);
    await professionInput.clear();
    await professionInput.sendKeys(profession);
    await professionInput.sendKeys(protractor.Key.ENTER);
  }

  async typePhone(phone: string): Promise<void> {
    const phoneInput = element(by.css("[formcontrolname='phone']"));
    await phoneInput.clear();
    await phoneInput.sendKeys(phone);
  }

  async typeFax(fax: string): Promise<void> {
    const faxInput = element(by.css("[formcontrolname='fax']"));
    await faxInput.clear();
    await faxInput.sendKeys(fax);
  }

  async typeEmail(email: string): Promise<void> {
    const emailInput = element(by.css("[placeholder='email@example.com']"));
    await emailInput.clear();
    await emailInput.sendKeys(email);
  }

  async typeAddressDetails(address: string): Promise<void> {
    const addressInput = element(
      by.css("[placeholder='Street address, P.O. box, company name, c/o']")
    );
    await addressInput.clear();
    await addressInput.sendKeys(address);
  }

  async typeCity(city: string): Promise<void> {
    const cityInput = element(by.css("[placeholder='City']"));
    await cityInput.clear();
    await cityInput.sendKeys(city);
  }

  async typeStateOrProvince(state: string): Promise<void> {
    const stateInput = element(by.css("[placeholder='State or Province']"));
    await stateInput.clear();
    await stateInput.sendKeys(state);
  }

  async typeZipOrPostalCode(zip: string): Promise<void> {
    const zipInput = element(by.css("[placeholder='Zip or postal code']"));
    await zipInput.clear();
    await zipInput.sendKeys(zip);
  }

  async typeCountry(country: string): Promise<void> {
    const countryInput = element.all(
      by.css("[formcontrolname='country'] > [placeholder='Search']")
    ).get(0);
    await countryInput.clear();
    await countryInput.sendKeys(country);
    await countryInput.sendKeys(protractor.Key.ENTER);
  }

  async deletePractitioner(name: string): Promise<{ confirmText: string; successText: string }> {
    const row = element(
      by.xpath(`//tr[.//div[contains(@class,'practitioner-name') and normalize-space(text())='${name}']]`)
    );
    await browser.actions().mouseMove(row).perform();
    const ellipsisButton = row.element(by.css("i.fas.fa-ellipsis-v"));
    await browser.wait(EC.elementToBeClickable(ellipsisButton), 5000);
    await ellipsisButton.click();
    const deleteButton = row.element(by.cssContainingText("button.dropdown-item.text-danger", "Delete"));
    await browser.wait(EC.elementToBeClickable(deleteButton), 5000);
    await deleteButton.click();
    const confirmAlert = await browser.switchTo().alert();
    const confirmText = await confirmAlert.getText();
    await confirmAlert.accept();
    await browser.wait(EC.alertIsPresent(), 5000);
    const successAlert = await browser.switchTo().alert();
    const successText = await successAlert.getText();
    await successAlert.accept();
    return { confirmText, successText };
  }

  async exportPractitionerAsCSV(name: string): Promise<void> {
    const row = element(
      by.xpath(`//tr[.//div[contains(@class,'practitioner-name') and normalize-space(text())='${name}']]`)
    );
    await browser.actions().mouseMove(row).perform();
    const ellipsisButton = row.element(by.css("i.fas.fa-ellipsis-v"));
    await browser.wait(EC.visibilityOf(ellipsisButton), 5000);
    await browser.wait(EC.elementToBeClickable(ellipsisButton), 5000);
    await ellipsisButton.click();
    const exportButton = row.element(by.cssContainingText("button.dropdown-item", "Export CSV"));
    await browser.wait(EC.visibilityOf(exportButton), 5000);
    await browser.wait(EC.elementToBeClickable(exportButton), 5000);
    await exportButton.click();
  }

  async getLatestExportedCSV(dir: string): Promise<string | null> {
    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith("practitioners-export") && f.endsWith(".csv"))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(dir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    if (!files.length) {
      return null;
    }
    const latestPath = path.join(dir, files[0].name);
    files.slice(1).forEach(f => fs.unlinkSync(path.join(dir, f.name)));
    return latestPath;
  }
}

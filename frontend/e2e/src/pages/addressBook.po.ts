import { 
  browser, 
  by, 
  element, 
  protractor, 
  ExpectedConditions as EC 
} from 'protractor';

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
    await browser.wait(EC.alertIsPresent(), 5000, "Alert not found");

    const alertDialog = await browser.switchTo().alert();
    const text = await alertDialog.getText();

    expect(text).toBe(expectedText, "Alert text is not correct");
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

    await browser.wait(EC.visibilityOf(practitionerCell), 5000, "Practitioner is not visible");
    await browser.wait(EC.elementToBeClickable(practitionerCell), 5000, "Practitioner is not clickable");

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
}

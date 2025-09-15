import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { AddressBookPage } from './pages/addressBook.po';
import * as fs from 'fs';
import * as path from 'path';

describe('Login and navigate to Address Book page', () => {
  let addressBook: AddressBookPage;
  const existingPractitioner = 'JOHNSON, MICHAEL';
  const newPractitioner = 'NEW TEST PRACTITIONER DENTIST';

  beforeAll(async () => {
    addressBook = new AddressBookPage();
    await browser.waitForAngularEnabled(true);
    await browser.driver.manage().window().maximize();
    await loginAsUser('user', 'test@test.com');
  });

  it('should navigate to Address Book page', async () => {
    await addressBook.clickAddressBook();
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toContain('/practitioners');
    const titleText = await addressBook.getPageTitle();
    expect(titleText).toContain('Address book');
  });

  it('should open Add New Practitioner page', async () => {
    await addressBook.clickNewPractitioner();
    const addTitle = await addressBook.getAddPractitionerTitle();
    expect(addTitle).toBe('Add New Practitioner');
  });

  it('should create new practitioner', async () => {
    await addressBook.typeName(existingPractitioner);
    await addressBook.clickCreatePractitioner();
    await addressBook.handleSuccessAlert('Practitioner created successfully!');
    const found = await addressBook.isPractitionerInList(existingPractitioner);
    expect(found).toBe(true);
  });

  it('should open practitioner details', async () => {
    await addressBook.typePractitionerName(existingPractitioner);
    await addressBook.clickOnPractitioner(existingPractitioner);
    expect(await addressBook.isContactDetailsSectionVisible()).toBe(true);
  });

  it('should show practitioner contact details', async () => {
    const contactDetails = await addressBook.getContactDetailsElements();
    expect(await contactDetails.phone.isPresent()).toBe(true);
    expect(await contactDetails.address.isPresent()).toBe(true);
    expect(await contactDetails.resourceId.isPresent()).toBe(true);
  });

  it('should show history section', async () => {
    const historySection = await addressBook.getHistorySection();
    expect(await historySection.isPresent()).toBe(true);
    await addressBook.clickBack();
    const titleText = await addressBook.getPageTitle();
    expect(titleText).toContain('Address book');
  });

  it('should delete practitioner from Address Book', async () => {
    const { confirmText, successText } = await addressBook.deletePractitioner(existingPractitioner);
    expect(confirmText).toContain(`Are you sure you want to delete ${existingPractitioner}`);
    expect(successText).toBe(`Successfully deleted ${existingPractitioner}.`);
    const found = await addressBook.isPractitionerInList(existingPractitioner);
    expect(found).toBe(false);
  });

  it('adding a new practitioner to the Address book', async () => {
    await addressBook.clickNewPractitioner();
    await addressBook.typeName(newPractitioner);
    await addressBook.typeProfession('Dentist');
    await addressBook.typePhone('0712345678');
    await addressBook.typeFax('0212345678');
    await addressBook.typeEmail('test.user@example.com');
    await addressBook.typeAddressDetails('Apartment 12, 3rd Floor, Building A');
    await addressBook.typeCity('New York');
    await addressBook.typeStateOrProvince('California');
    await addressBook.typeZipOrPostalCode('10001');
    await addressBook.typeCountry('United States');
    await addressBook.clickCreatePractitioner();
    await addressBook.handleSuccessAlert('Practitioner created successfully!');
    const found = await addressBook.isPractitionerInList(newPractitioner);
    expect(found).toBe(true);
  });

  it('Verify practitioner export file exists', async () => {
    const downloadsDir = path.resolve(__dirname, '../downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }
    await addressBook.exportPractitionerAsCSV(newPractitioner);
    await browser.sleep(5000);
    const latestCSV = await addressBook.getLatestExportedCSV(downloadsDir);
    expect(latestCSV).not.toBeNull();
    expect(path.basename(latestCSV!)).toMatch(/^practitioners-export-.*\.csv$/);
    expect(fs.existsSync(latestCSV!)).toBe(true);
  });

  it('Delete added new practitioner', async () => {
    const { confirmText, successText } = await addressBook.deletePractitioner(newPractitioner);
    expect(confirmText).toContain(`Are you sure you want to delete ${newPractitioner}?`);
    expect(successText).toBe(`Successfully deleted ${newPractitioner}.`);
    const found = await addressBook.isPractitionerInList(newPractitioner);
    expect(found).toBe(false);
  });
});

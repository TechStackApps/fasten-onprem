import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { AddressBookPage } from './pages/addressBook.po';

describe('Login and navigate to Address Book page', () => {
  let addressBook: AddressBookPage;

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
    await addressBook.typeName("JOHNSON, MICHAEL");
    await addressBook.clickCreatePractitioner();

    await addressBook.handleSuccessAlert("Practitioner created successfully!");

    const found = await addressBook.isPractitionerInList("JOHNSON, MICHAEL");
    expect(found).toBe(true, "Practitioner JOHNSON, MICHAEL was not found in the list");
  });

  it('should open practitioner details', async () => {
    await addressBook.typePractitionerName("JOHNSON, MICHAEL");
    await addressBook.clickOnPractitioner("JOHNSON, MICHAEL");

    expect(await addressBook.isContactDetailsSectionVisible())
      .toBe(true, "Contact details section is missing");
  });

  it('should show practitioner contact details', async () => {
    const contactDetails = await addressBook.getContactDetailsElements();

    expect(await contactDetails.phone.isPresent()).toBe(true, "Phone detail is missing");
    expect(await contactDetails.address.isPresent()).toBe(true, "Address detail is missing");
    expect(await contactDetails.resourceId.isPresent()).toBe(true, "Resource ID is missing");
  });

  it('should show history section', async () => {
    const historySection = await addressBook.getHistorySection();
    expect(await historySection.isPresent()).toBe(true, "History section is missing");
  });
});

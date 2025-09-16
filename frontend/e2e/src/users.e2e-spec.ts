import { browser } from 'protractor';
import { loginAsUser } from './helpers/auth.helper';
import { UsersPage } from './pages/users.po';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe('Add new users in User page', () => {
  let usersPage: UsersPage;

  beforeAll(async () => {
    usersPage = new UsersPage();
    await browser.driver.manage().window().maximize();
    await browser.waitForAngularEnabled(true);
    await loginAsUser('user', 'test@test.com');
  });
  
   it("should verify added user", async () => {  
    await usersPage.clickUsersLink();
    await usersPage.clickCreateNewUserButton();
    await usersPage.typeFullName("User Name");
    await usersPage.typeUserName("Test Name");
    await usersPage.typePassword("User123!");
    await usersPage.typeEmail("test@username.com");
    await usersPage.clickCreateUserButton();

   const exists = await usersPage.isFullNameInTable("User Name");
   expect(exists).toBe(true);
    
  });
}); 
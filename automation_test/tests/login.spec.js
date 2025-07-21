const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage.page');



test('Signin page opens and logs in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  expect(await loginPage.isOnSigninPage()).toBeTruthy();

  await loginPage.login('beatrix', 'beatrix@beatrix.ro');

  
  await loginPage.gotoSources();

  await expect(page).toHaveURL(/.*\/sources/);

  await page.waitForTimeout(5000);
 
  //await loginPage.clickEpicLegacyCard();

  await loginPage.clickEpicLegacyFooter();
  await expect(page.locator(loginPage.epicLegacyHeader)).toBeVisible();

  await loginPage.clickEpicLegacyListItem();

   await page.waitForTimeout(5000);
  
    await expect(page.locator(loginPage.myChartHeader)).toHaveText(
    'MyChart - Your secure online health connection'
  );
  await page.waitForTimeout(8000);

   
  await loginPage.fillUsername('fhircamila');
  await loginPage.fillPassword('epicepic1');
  await loginPage.clickSignIn();




  await page.waitForTimeout(9000);

    await expect(
  loginPage.getAppStatusExplanation()
).toHaveText(
  'Fasten Health, offered by Fasten Health, is not affiliated with your healthcare provider and not obligated by HIPAA privacy guidelines to protect your health information.'
);

await loginPage.clickNextButton();

await loginPage.getMyChartHeader();

await loginPage.clickOneYearToggle();

await loginPage.clickAllowAccess();

});

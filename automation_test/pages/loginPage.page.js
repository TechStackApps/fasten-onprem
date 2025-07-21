class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = 'input[name="username"]';
    this.passwordInput = 'input[name="password"]';
    this.signInButton = 'button[type="submit"]';
    this.sourcesLink = 'a[routerlink="/sources"]';
    this.epicLegacyCard = 'span.category-label:has-text("epic-legacy")';
    this.epicLegacyFooter = 'img[alt="Epic Legacy"]';
    this.epicLegacyHeader = 'h6:has-text("Epic Legacy")';
    this.epicLegacyListItem = 'div.list-group-item.cursor-pointer:has(h5:has-text("Epic Legacy (Sandbox)"))';
    this.myChartHeader = 'a.logo h1';
    this.usernameInputMyChart = '#Login';
    this.passwordInputMyChart = '#Password';
    this.signInButtonMyChart = '#submit';
    this.appStatusExplanation = 'p.appStatusExplanation';
    this.nextButton = '#nextButton';
    this.sharePageHeader = 'h2.header.no-outline-on-focus';
    this.oneYearToggle = 'label.togglebutton:has-text("1 year")';
    this.allowAccessButton = 'span:has-text("Allow access")';






  }

  async goto() {
    await this.page.goto('/auth/signin');
    await this.page.waitForLoadState();
  }

  async isOnSigninPage() {
    return this.page.url().includes('/auth/signin');
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.signInButton);
  }

  async gotoSources() {
    await this.page.click(this.sourcesLink);
  }

  async clickEpicLegacyCard() {
    await this.page.click(this.epicLegacyCard);
  }
  
async clickEpicLegacyFooter() {
  await this.page.click(this.epicLegacyFooter);
}

async clickEpicLegacyListItem() {
  await this.page.click(this.epicLegacyListItem);
}

getMyChartHeader() {
  return this.page.locator(this.myChartHeader);
}

async fillUsername(username) {
  await this.page.fill(this.usernameInputMyChart, username);
}

async fillPassword(password) {
  await this.page.fill(this.passwordInputMyChart, password);
}

async clickSignIn() {
  await this.page.click(this.signInButtonMyChart);
}

getAppStatusExplanation() {
  return this.page.locator(this.appStatusExplanation);
}

async clickNextButton() {
  await this.page.click(this.nextButton);
}

getSharePageHeader() {
  return this.page.locator(this.sharePageHeader);
}

async clickOneYearToggle() {
  await this.page.locator(this.oneYearToggle).scrollIntoViewIfNeeded();
  await this.page.click(this.oneYearToggle);
}

async clickAllowAccess() {
  await this.page.click(this.allowAccessButton);
}








}
module.exports = { LoginPage };

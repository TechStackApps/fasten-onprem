import * as fs from 'fs';
import * as path from 'path';
import { browser, element, by, ExpectedConditions as EC } from 'protractor';

export async function clickExportToPDF(): Promise<string> {
  const downloadPath = path.resolve(process.cwd(), 'e2e/downloads');
  const expectedFile = path.join(downloadPath, 'ips_summary.pdf');

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  if (fs.existsSync(expectedFile)) {
    fs.unlinkSync(expectedFile);
  }

  const link = element(by.cssContainingText('a.nav-link', 'Export to PDF'));
  await browser.wait(EC.elementToBeClickable(link), 10000);
  await link.click();

  await browser.wait(() => fs.existsSync(expectedFile), 15000);
  const fileStat = fs.statSync(expectedFile);
  expect(fileStat.size).toBeGreaterThan(0);

  return expectedFile;
}

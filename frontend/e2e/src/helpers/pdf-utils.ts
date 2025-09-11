import * as fs from 'fs';
import * as path from 'path';
import { browser, element, by, ExpectedConditions as EC } from 'protractor';

export async function clickExportToPDF(): Promise<void> {
  const downloadPath = path.resolve(process.cwd(), 'e2e/downloads');
  const expectedFile = path.join(downloadPath, 'ips_summary.pdf');

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
    console.log(`Download directory created at: ${downloadPath}`);
  }

  if (fs.existsSync(expectedFile)) {
    fs.unlinkSync(expectedFile);
  }

  const link = element(by.cssContainingText('a.nav-link', 'Export to PDF'));
  await browser.wait(
    EC.elementToBeClickable(link),
    10000,
    '"Export to PDF" link was not clickable'
  );
  await link.click();

  await browser.wait(
    () => fs.existsSync(expectedFile),
    15000,
    `File was not found at path: ${expectedFile}`
  );

  const fileStat = fs.statSync(expectedFile);
  expect(fileStat.size).toBeGreaterThan(
    0,
    'The downloaded PDF file is empty.'
  );

  console.log(
    `SUCCESS: File "${path.basename(expectedFile)}" was downloaded and verified successfully.`
  );
}

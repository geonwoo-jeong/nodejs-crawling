const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const page2 = await browser.newPage();
  const page3 = await browser.newPage();
  await page.goto("https://google.com");
  await page2.goto("https://naver.com");
  await page3.goto("https://github.com");
  await page.waitFor(3000);
  await page2.waitFor(3000);
  await page3.waitFor(3000);
  await page.close();
  await page2.close();
  await page3.close();
  await browser.close();
};

crawler();

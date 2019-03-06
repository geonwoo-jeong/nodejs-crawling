const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const result = [];
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  for (const [i, r] of records.entries()) {
    try {
      const page = await browser.newPage();

      // 이미지일 경우 불러오지 않도록
      await page.setRequestInterception(true);
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
      );
      console.log(await page.evaluate("navigator.userAgent"));
      page.on("request", request => {
        if (request.resourceType() === "image") {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page.goto(r[1]);
      const scoreEl = await page.$(
        "body .nav_container .nav_body .nav_content .content_view .post_view .post_content"
      );
      if (scoreEl) {
        const text = await page.evaluate(tag => {
          return tag.textContent;
        }, scoreEl);
        result[i] = [...r, text.trim()];
      }
      await page.waitFor(1000);
      await page.close();
    } catch (e) {
      console.log(e);
    }
  }
  await browser.close();
  const str = stringify(result);
  fs.writeFileSync("csv/result.csv", str);
};

crawler();

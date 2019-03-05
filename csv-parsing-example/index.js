const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
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
          await page.close();
        } catch (e) {
          console.log(e);
        }
      })
    );
    await browser.close();
    const str = stringify(result);
    fs.writeFileSync("csv/result.csv", str);
  } catch (e) {
    console.log(e);
  }
};

crawler();

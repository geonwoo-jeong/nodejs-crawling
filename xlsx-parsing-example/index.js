const xlsx = require("xlsx");
const axios = require("axios");
const cheerio = require("cheerio");

const workbook = xlsx.readFile("xlsx/data.xlsx");

// 워크시트 리스트 가져오기
const list = Object.keys(workbook.Sheets);

// 워크시트 내용 가져오기
const ws = workbook.Sheets.영화목록;

// JSON 으로 바꾸기
const records = xlsx.utils.sheet_to_json(ws);

// 하나씩 출력
records.forEach((r, i) => {
  //  console.log(i, r.제목, r.링크);
});

for (const [i, r] of records.entries()) {
  //  console.log(i, r.제목, r.링크);
}

const crawler = async () => {
  // 순차요청
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      // 응답이 성공한 경우
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text();
      console.log(r.제목, "평점", text.trim());
    }
  }

  //한번에 요청
  //   await Promise.all(
  //     records.map(async r => {
  //       const response = await axios.get(r.링크);
  //       if (response.status === 200) {
  //         // 응답이 성공한 경우
  //         const html = response.data;
  //         const $ = cheerio.load(html);
  //         const text = $(".score.score_left .star_score").text();
  //         console.log(r.제목, "평점", text.trim());
  //       }
  //     })
  //   );
};

crawler();

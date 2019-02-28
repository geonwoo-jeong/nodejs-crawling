const xlsx = require("xlsx");
const workbook = xlsx.readFile("xlsx/data.xlsx");

// 워크시트 리스트 가져오기
const list = Object.keys(workbook.Sheets);

// 워크시트 내용 가져오기
const ws = workbook.Sheets.영화목록;

// JSON 으로 바꾸기
const records = xlsx.utils.sheet_to_json(ws);

// 하나씩 출력
records.forEach((r, i) => {
  console.log(i, r.제목, r.링크);
});

for (const [i, r] of records.entries()) {
  console.log(i, r.제목, r.링크);
}

const XLSX = require("xlsx");
const axios = require("axios");

const fetchDataFromExcel = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = response.data;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    // Assuming the data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Parse the sheet data into JSON format
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return jsonData;
  } catch (error) {
    console.error("Error fetching or parsing Excel data:", error);
    throw error;
  }
};
const solution = async () => {
  const url = "https://go.microsoft.com/fwlink/?LinkID=521962";
  try {
    let dataList = await fetchDataFromExcel(url);
    let header = dataList[0];
    let data = dataList.slice(1, dataList.length);
    let formatedData = data.map((item) => {
      let obj = {};
      for (let i = 0; i < header.length; i++) {
        obj[header[i].trim()] = item[i];
      }
      return obj;
    });
    let result = formatedData.filter((item) => item.Sales > 50000 || item['Sales'] > 50000);
    const newWorkbook = XLSX.utils.book_new();

    const newSheet = XLSX.utils.json_to_sheet(result);

    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
    XLSX.writeFile(newWorkbook, "Result.xlsx");

    console.log("Filtered data saved to Result.xlsx");
  } catch (error) {
    throw error;
  }
};

solution();

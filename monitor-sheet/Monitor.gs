
const ERROR_MESSAGE = "NOT_FOUND"
const SHEET_TO_MONITOR = "your-sheet-name"
const ALERT = "Custom alert message for this error"

function main() {
  console.time("full");
  {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_TO_MONITOR);
    assert(!findInSheet(sheet, ERROR_MESSAGE), ALERT)
  }
  console.timeEnd("full");
}

function findInSheet(sheet, SEARCH_FOR) {
  let rows = sheet.getDataRange().getValues();
  for (const row of rows) {
    for (const cell of row) {
      if (cell == SEARCH_FOR) {
        console.log(`"${SEARCH_FOR}" FOUND in "${sheet.getSheetName()}"`)
        return true;
      }
    }
  }
  console.log(`"${SEARCH_FOR}" NOT FOUND in "${sheet.getSheetName()}"`)
  return false;
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    throw message;
  }
}

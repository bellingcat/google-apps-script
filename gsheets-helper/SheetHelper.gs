var SheetHelper = class SheetHelper {
  constructor(sheetId, sheetName, headerIndex, load = false, colNamer = (x) => x) {
    this.sheet = SpreadsheetApp.openById(sheetId);
    this.worksheet = this.sheet.getSheetByName(sheetName);
    this.headerIndex = headerIndex;
    this.protection = undefined;
    this.colNamer = colNamer;
    if (load) {
      this._load();
    }
  }
  _load() {
    // get all values + load headers + calculate headerMap
    this.rows = this.worksheet.getDataRange().getDisplayValues();
    // remove irrelevant rows
    this.rows.splice(0, this.headerIndex - 1);
    // retrieve header rows + remove from values
    this.header = this.rows[0];
    this.headerMap = this._indexHeader();// column name => column index
    this.rows.shift();
  }
  /**
   * receives a row 0-index (from the data, excludes the header),
   * a column name, and returns the cell value
   */
  getCell(rowIndex, colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.rows[rowIndex][this.headerMap[colName]];
  }
  /**
   * same as {@see getCell} but defaults to empty string and performs a trim
   */
  getCellOrEmpty(rowIndex, colName) {
    return (this.getCell(rowIndex, colName) || "").trim()
  }
  _indexHeader() {
    // receives list of header names, returns object of ColumnName:ColIndex1
    // colname is lowercased and trimmed
    return this.header.reduce((obj, name, i) => {
      obj[name.trim().toLowerCase()] = i;
      return obj;
    }, {});
  }
  _isEmptyRow(row) {
    // all cols need to be empty
    return row !== undefined && !row.some(cell => cell.length > 0)
  }
  newRowIndex(isEmptyRow = this._isEmptyRow) {
    // finds the next empty row to insert
    let i = this.rows.length - 1;
    while (isEmptyRow(this.rows[i])) {
      i--;
    }
    return i + this.headerIndex + 1 + 1; // 1 for the 1-based, 1 for new row
  }
  getCellAsRange(row, colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.worksheet.getRange(row, this.headerMap[colName] + 1);
  }
  getCellValue(row, colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.rows[row][this.headerMap[colName]];
  }
  // offsets the row index by the header, so it is the same as calling getCellAsRange.value()
  getCellValueH(row, colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.rows[row - this.headerIndex - 1][this.headerMap[colName]];
  }
  updateCell(row, colName, value, useColNamer = true) {
    //console.info(`cell(row=${row}, col=${this.headerMap[colName] + 1} [colName=${colName}]) = ${value}`)
    this.getCellAsRange(row, colName, useColNamer).setNumberFormat('@STRING@').setValue(value)
  }
  hasCol(colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.headerMap.hasOwnProperty(colName);
  }
  getColValues(colName, useColNamer = true) {
    colName = useColNamer ? this.colNamer(colName) : colName;
    return [].concat.apply([],
      this.rows.map(row => row[this.headerMap[colName]])
    );
  }
  getColAsRange(fromRow, numRows, colName, useColNamer = true){
    colName = useColNamer ? this.colNamer(colName) : colName;
    return this.worksheet.getRange(fromRow, this.headerMap[colName] + 1, numRows)
  }
  setCol(fromRow, colName, matrix, useColNamer = true) {
    if (matrix.length == 0) { return }
    this.getColAsRange(fromRow, matrix.length, colName, useColNamer).setNumberFormat('@STRING@').setValues(matrix);
  }
  resolveColName(colName) {
    return this.colNamer(colName);
  }
  lock(range, lockName) {
    lockName = lockName || 'Sheet is protected by an automated Apps Script'
    this.protection = this.worksheet.getRange(range).protect().setDescription(lockName);
    let me = Session.getEffectiveUser();
    this.protection.removeEditors(this.protection.getEditors());
    this.protection.addEditor(me);
  }
  unlock() {
    if (this.protection !== undefined) {
      this.protection.remove();
    }
    this.protection = undefined;
  }
  /**
   * Returns an object whose keys are description names
   * and values are protection objects
   */
  getAllProtectedDescriptions() {
    console.time("getAllProtectedDescriptions");
    let descriptionsToProtections = this.sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
    .reduce(function (obj, protection) {
        const description = protection.getDescription();
        if (description != null) {
          obj[description] = protection;
        }
        return obj;
      }, {});
    console.timeEnd("getAllProtectedDescriptions");
    return descriptionsToProtections;
  }
}

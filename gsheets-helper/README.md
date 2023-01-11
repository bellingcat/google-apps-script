### Goal
This class makes it easy to read/write from a google sheet instance via an API, it's aimed at tabular data that has a header row with names.

### Features:
* back up any google file
* choose a custom backup schedule per file(s)
* optionally: delete backups older than `X` days


### How
```gs
// be sure to have the sheet-helper class available in another file or via addons

let sh = new SheetHelper("id-of-gsheets", "worksheet-name", "header index - starts at 1", "loadData - if true will fetch data", "colNamer in case you want to refer to");
// id - the id of the google sheets doc
// sheetName - the worksheet tab name
// headerIndex - 1-based which row has the table header
// loadData - true to fetch all data from the start
// colNamer - custom function in case you want to customize how to refer to the header names, defaults to identity: (x) => x
let sh = new SheetHelper(id, sheetName, headerIndex, loadData, colNamer);


// example locking and unlocking for read/write operations
sh.lock();{
  // operations while locked, eg write an entire column of values from the next empty row
  
  let newLinks = ["a", "b", "c"];
  let insertAtRow = sh.newRowIndex()
  sh.setCol(insertAtRow, "linksColum", newLinks);
  
} sh.unlock();

```

check the [source code comments](SheetHelper.gs) for more info

### Goal
For when you need to regularly back up google docs into a google drive folder

### Features:
* back up any google file
* choose a custom backup schedule per file(s)
* optionally: delete backups older than `X` days


### How
> Note: to get the id of a file/folder navigate to it and copy the id from the URL, it's something like `kjhhdao87ah42hd98e9h29ud`


1. create a new google drive folder where you want your backups - get its id `BACKUP_FOLDER_ID`
2. create a new google sheets document (anywhere but can be in that folder)
3. open the sheet, go to "Extensions > Apps Script" and a new tab will open (if you close the sheet, the new tab closes automatically)
4. look at the [code.gs](code.gs) and adapt it to your needs, see the functions comments and code.
  1. the `main` function can be used to group files which should be backed up at the same time, you can have others like `mainDaily` or `mainWeekly` and then put the files logic there: backup + optional removal of old backups
  2. you can save and run to see if it works as expected
3. still in the "Apps Script" environment, go on the left side and switch to the "Triggers" tab
4. add a new trigger and select the `main` function, then select the event source as `Time-Driven` and add the desired interval. you can do this for multiple functions, in case you want some files backed up with different frequencies. 
  5. you can also decide to receive error notifications immediately upon failures
6. optional: explore the other tabs in the "Apps Script" since they give more info on previous executions and configurations.

## Result
You will get the following file structure for the example in [code.gs](code.gs):
* backups_folder
  * MY_SHEET
    * 1 `yyyy-dd-mm` folder per day
      * original_name_timestamp
      * ... other backups in that day ...
  * PRESENTATION_DOC
    * 1 `yyyy-dd-mm` folder per day
      * original_name_timestamp
      * ... other backups in that day ...
  * WORD_DOC
    * 1 `yyyy-dd-mm` folder per day
      * original_name_timestamp
      * ... other backups in that day ...

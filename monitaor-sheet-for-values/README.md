### Goal
This script can be added to any sheet and then used in conjunction with the Timed executions + immediate email notification to have an alert in case the content of a sheet shows a given error message.

### Features:
* monitors a sheet for any string value
* throws an error when a given string is found/not-found

### How
Use the gsheets formulas to detect errors/bugs and write something like `NOT_FOUND` when an error occurs (see [IFERROR](https://support.google.com/docs/answer/3093304?hl=en) method), then set up recurrent triggers and automated alerts for the sheet being monitored and you will get an email if something breaks in the sheet.

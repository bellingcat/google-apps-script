// Google Apps Script to backup specified google docs
// additionally deletes backups older than X days

BACKUP_FOLDER_ID = "BACKUP_FOLDER_ID_GOES_HERE"

function main() {
  to_backup = [
    { docFolderName: "MY_SHEET", docId: "MY_SHEET_ID_GOES_HERE", deleteOlderThanDays: 5 },
    { docFolderName: "PRESENTATION_DOC", docId: "PRESENTATION_DOC_ID_GOES_HERE", deleteOlderThanDays: 5 },
    { docFolderName: "WORD_DOC", docId: "WORD_DOC_ID_GOES_HERE", deleteOlderThanDays: 5 },
  ]
  to_backup.forEach(doc => {
    console.time(`maintaing backup for ${doc.docFolderName}`);
      
    // backup doc by docId into the docFolderName folder
    if(backup(doc.docId, doc.docFolderName)) {
      // optionally remove backups older than `deleteOlderThanDays`
      // makes sense to run it after backup. in case there's an exception during backup, older files will not get deleted
      deleteFolderOlderThanDays(doc.docFolderName, doc.deleteOlderThanDays);
    }
    
    console.timeEnd(`maintaing backup for ${doc.docFolderName}`);
  })
}


function backup(docId, docFolderName) {
  if (docId === undefined || docFolderName === undefined) {
    console.error(`backup: got invalid values (${docId},${docFolderName})`);
    return false;
  }

  let docToBackup = DriveApp.getFileById(docId);
  let timeNow = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd_HH-mm-ss");
  let dateFolderName = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");

  let docMainFolder = getDocMainFolder(docFolderName);
  let todayFolder = mkdir(docMainFolder, dateFolderName);

  console.log(`backing up sheet: ${docToBackup.getName()}`);
  let backupName = `${docToBackup.getName()}_backup_${timeNow}`;
  docToBackup.makeCopy(backupName, todayFolder);
  console.log(`success for sheet: ${docToBackup.getName()}`);
  return true;
}


function deleteFolderOlderThanDays(docFolderName, daysOld) {
  if (docFolderName === undefined || daysOld === undefined) {
    console.error(`deleteOlderThan: got invalid values (${docFolderName},${daysOld})`);
    return;
  } else if (daysOld < 2) { //failsafe not to delete most recent-backups
    console.error(`days old must be bigger than 2 (${daysOld})`);
    return;
  }

  let docMainFolder = getDocMainFolder(docFolderName);
  console.log(`Deleting folders older than ${daysOld} days, inside folder ${docMainFolder.getName()}`);

  let cutOffTime = new Date(new Date().getTime() - (3600 * 1000 * 24 * daysOld));
  let deletableFiles = docMainFolder.getFolders();

  let total = 0, deleted = 0;
  while (deletableFiles.hasNext()) {
    let folder = deletableFiles.next();
    if (folder.getDateCreated() <= cutOffTime) {
      folder.setTrashed(true);
      console.log(`moved folder ${folder.getName()} to trash.`);
      deleted++;
    } else {
      console.log(`folder ${folder.getName()} is not deletable yet.`);
    }
    total++;
  }
  console.log(`Finished deleting folders older than ${daysOld} days, deleted ${deleted}/${total}`);
}


function getDocMainFolder(docFolderName) {
  let mainBackupFolder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
  return mkdir(mainBackupFolder, docFolderName);
}


function mkdir(parent, folderName) {
  //create folder inside if not exists
  let foundFolders = parent.getFoldersByName(folderName);
  let folder = undefined;

  if (foundFolders.hasNext()) {
    folder = foundFolders.next();
    console.log(`Folder ${folderName} already exists`);
  } else {
    folder = parent.createFolder(folderName);
    console.log(`Folder ${folderName} created`);
  }
  return folder;
}

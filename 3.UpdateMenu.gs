//"updateCode" FUNCTION RUNNING FROM THE "Update" BUTTON IN THE SPREADSHEET MENU

function updateCode() {
  ListFiles()
}

function onOpen() {
   var ui = SpreadsheetApp.getUi()
  // Or DocumentApp or FormApp.
  ui.createMenu('Update')
  .addItem('Update', 'updateCode')
  .addToUi()
}

//"Phases" FUNCTION RUNNING AT LEAST ONCE A DAY >> TRIGGER

function Phases() {

  var ss = SpreadsheetApp.getActiveSpreadsheet()

  var sheet1 = ss.getSheetByName('Projects')
  var lastRow1 = sheet1.getLastRow()
  var data1 = sheet1.getRange(1,13,lastRow1,1).getValues()

  var sheet2 = ss.getSheetByName('Projects API')
  var lastRow2 = sheet2.getLastRow()
  var data2 = sheet2.getRange(1,1,lastRow2,4).getValues()

  for (i=1; i<data1.length; i++) {
    var task_id1 = data1[i][0]

    for (j=1; j<data2.length; j++) {
      var task_id2 = data2[j][0]

      if (task_id1 == task_id2) {
        var phase = data2[j][3]
        sheet1.getRange(i+1,14).setValue(phase)
        break
      }
    }
  }    
}

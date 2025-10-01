//"Phases" FUNCTION RUNNING AT LEAST ONCE A DAY >> TRIGGER

function Phases() {

  var planilha = SpreadsheetApp.getActiveSpreadsheet()

  var aba1 = planilha.getSheetByName('Projetos')
  var ultimalinha1 = aba1.getLastRow()
  var dados1 = aba1.getRange(1,13,ultimalinha1,1).getValues()

  var aba2 = planilha.getSheetByName('Projetos API')
  var ultimalinha2 = aba2.getLastRow()
  var dados2 = aba2.getRange(1,1,ultimalinha2,4).getValues()

  for (i=1; i<dados1.length; i++) {
    var task_id1 = dados1[i][0]

    for (j=1; j<dados2.length; j++) {
      var task_id2 = dados2[j][0]

      if (task_id1 == task_id2) {
        var fase = dados2[j][3]
        aba1.getRange(i+1,14).setValue(fase)
        break
      }
    }
  }    
}

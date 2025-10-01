//"ProjectsAPI" FUNCTION RUNNING AT LEAST ONCE A DAY >> TRIGGER

function ProjectsAPI() {
  
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheetByName('Projetos API');

  let dataset = []
  let response = null
  let responseJson

  let options = {
    'method': 'GET',
    'headers': {
      'muteHttpExceptions': true,
      'Authorization': 'pk_3031385_TYR5O7H2K5Q1JSLE3H2G97FVS1QFMHAB'
    }
  };

  url = "https://api.clickup.com/api/v2/list/13659954/task?include_closed=true"

  try{
  response = UrlFetchApp.fetch(url,options)
  responseJson = JSON.parse(response)
  }
  catch(e){
    Logger.log(e)
  }

  dataset = responseJson.tasks

  let returndata = []

  for (let i = 0; i < dataset.length; i++) {
    data = dataset[i];
    let assigneesList = data.assignees
    let returnAssignees = '';

    try{
      if (assigneesList.length > 0) {
        for (let listCount = 0; listCount < assigneesList.length; listCount++) {
          if (listCount == 0){
            returnAssignees = returnAssignees + assigneesList[listCount].username
          }
          else {
            returnAssignees = returnAssignees + ',' + assigneesList[listCount].username
          }
        };
      };
    }
    catch(e){
      Logger.log(e)
    };
    
    var stage = Stage(data.status.status)
    returndata.push([
      data.id
      ,data.name
      ,GetCustomField(data,'Nome exato pasta projeto')
      ,stage
    ])
  };

  let dataRange = sheets.getRange(2, 1, returndata.length, returndata[0].length);
  dataRange.setValues(returndata)
}

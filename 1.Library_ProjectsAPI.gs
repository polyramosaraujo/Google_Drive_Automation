function Stage(portfolio) {
  if (portfolio == "stage 01") {
    return('F01')
  }
  else {
    if (portfolio == "stage 02") {
      return('F02')
    }
    else {
      if (portfolio == "stage 03") {
        return('F03')
      }
      else {
        if (portfolio == "stage 04") {
          return('F04')
        }
        else {
          return('0')
        }
      }
    }
  }
}

function GetCustomField(data,fieldName) {
  var value = null
  for (var f = 0; f < Object.keys(data.custom_fields).length; f++){
    if (data.custom_fields[f].name == fieldName)
      try{
        value = data.custom_fields[f].value
      }
      catch (e){
      };
  };
  return value
}

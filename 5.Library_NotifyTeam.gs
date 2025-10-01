function DiscordNotification(projeto, array1, array2, array3, array4, id_discord, id_pasta_entrega) {
  //projeto, array1, array2, array3, array4, id_discord, id_pasta_entrega
  Logger.log('>>> Início da notificação da equipe <<<')

  /*var projeto = 'Teste1'
  var array1 = ['VIPLAN_VIS_HID_REV13.ifc','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg','VIPLAN_VIS_HID_1º PAVTO_REV13.dwg']
  var array2 = ['VIPLAN_VIS_HID_REV12.ifc']
  var array3 = ['VIPLAN_VIS_HID_REV11.ifc']
  var array4 = ['VIPLAN_VIS_SAN_REV10.ifc']
  var id_discord = '1136033924796129420'
  var id_pasta_entrega = '1sUWbKM1AuuamR5YiR4c-bi2zkt1Icpb3'*/

  mensagem = '\n **-------------------------------------------------------------------------------------------------------------------------**\n:loudspeaker:   **NOTIFICAÇÃO DO PROJETO:  ' + projeto + '**'

  var erros = array1.length + array2.length + array3.length
  var certos = array4.length
  var total = erros + certos

  if (erros>0 && erros<11){
    if (array1.length>0) {
      lista1='● ' + array1[0]
      if (array1.length>1) {
        for (m=1; m<array1.length; m++) {
          item1='\n● ' + array1[m]
          lista1=lista1+item1
        }
      }
      var mensagem = mensagem + '\n \n:arrow_right:  Foi identificado que os ' + array1.length + ' seguintes arquivos não seguem a nomenclatura padrão estabelecida: \n' + lista1
    }
    if (array2.length>0) {
      lista2='● ' + array2[0]
      if (array2.length>1) {
        for (n=1; n<array2.length; n++) {
          item2='\n● ' + array2[n]
          lista2=lista2+item2
        }
      }
      var mensagem = mensagem + '\n \n:arrow_right:  Foi identificado que já existem arquivos na pasta "Projetos Atualizados" com os mesmos nomes dos ' + array2.length + ' arquivos a seguir: \n' + lista2
    }
    if (array3.length>0) {
      lista3='● ' + array3[0]
      if (array3.length>1) {
        for (o=1; o<array3.length; o++) {
          item3='\n● ' + array3[o]
          lista3=lista3+item3
        }
      }
      var mensagem = mensagem + '\n \n:arrow_right:  Foi identificado que os ' + array3.length + ' seguintes arquivos já possuem revisões mais atualizadas na pasta "Projetos Atualizados": \n' + lista3
    }
    if (array4.length>0) {
      var mensagem = mensagem + '\n \n:arrow_right:  Apesar dos erros indicados acima, ' + array4.length + ' arquivos foram movimentados corretamente da pasta "Entregas" para suas respectivas subpastas em "Projetos Atualizados".'
    }
    mensagem = mensagem + '\n \n**Verifique os arquivos restantes na pasta "Entregas" !**\n ' + 'https://drive.google.com/drive/folders/' + id_pasta_entrega
  }
  
  if (erros>10){
    var mensagem = mensagem + '\n \n** De ' + total + ' arquivos analisados:**'
    if (array1.length>0) {
      var mensagem = mensagem + '\n \n● ' + array1.length + ' não seguem a nomenclatura padrão estabelecida'
    }
    if (array2.length>0) {
      var mensagem = mensagem + '\n \n● ' + array2.length + ' já existem na pasta "Projetos Atualizados"'
    }
    if (array3.length>0) {
      var mensagem = mensagem + '\n \n● ' + array3.length + ' já possuem revisões mais atualizadas na pasta "Projetos Atualizados"'
    }
    if (array4.length>0) {
      var mensagem = mensagem + '\n \n● ' + array4.length + ' foram movimentados corretamente da pasta "Entregas" para suas respectivas subpastas em "Projetos Atualizados"'
    }
    mensagem = mensagem + '\n \n**Verifique os arquivos restantes na pasta "Entregas"!**\n ' + 'https://drive.google.com/drive/folders/' + id_pasta_entrega
  }

  if (erros==0 && certos>0){
    var mensagem = mensagem + '\n \n● Um total de ' + certos + ' arquivos foram movimentados corretamente da pasta "Entregas" para suas respectivas subpastas em "Projetos Atualizados"'
  }

  var url = 'https://discord.com/api/v9/channels/'+id_discord+'/messages'
  var content = mensagem
  let options = {
    'method' : 'POST',
    'payload' : {
      'content': content
    },
    'headers' :{
      'muteHttpExceptions': true,
      'Authorization' : 'MTEzODE1Mjk0MTUwNTc0NDkwNg.Gqt91n.a5SUShSMrrK8GNE8XV5UfLh58MMQrBeo8Oytig' //autorização do usuário novo
    }
  }

  Logger.log(mensagem)
  UrlFetchApp.fetch(url,options)
  
  Logger.log("Notificação enviada com sucesso!")
  Logger.log('>>> Fim da notificação da equipe <<<')
}

function UpdateStatus(aba,ids_arquivos,novo_status){
  var array_aba = aba.getRange(2,1,aba.getLastRow()-1,aba.getLastColumn()).getValues()
  var array_id = []
  for (p = 0; p < array_aba.length; p++){
    array_id.push(array_aba[p][2])
  }
  for(q = 0; q<ids_arquivos.length; q++){
    var linha = array_id.indexOf(ids_arquivos[q])+2
    aba.getRange(linha,6).setValue(novo_status)
  }
  Logger.log('Status dos arquivos do projeto definidos como '+novo_status)
}

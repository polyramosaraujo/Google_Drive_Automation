//"ListFiles" FUNCTION RUNNING EVERY 15 MINUTES >> TRIGGER

function ListFiles() {
  Logger.log('INÍCIO DA LISTAGEM DE ARQUIVOS')

  //Pegando planilha mestra
  var planilha = SpreadsheetApp.getActiveSpreadsheet()

  //Pegando informações da aba 1 ("Projetos")
  var aba1 = planilha.getSheetByName('Projetos')
  var ultimalinha1 = aba1.getLastRow()
  var ultimacoluna1 = aba1.getLastColumn()
  var range1 = aba1.getRange(1,1,ultimalinha1,ultimacoluna1).getValues()

  Logger.log('Dados da aba "Projetos" importados com sucesso!')

  //Loop que vai rodar para cada linha da aba 1, ou seja, para cada projeto. Começa com 1 para ignorar o cabeçalho
  for (r=1; r<range1.length; r++) {
    var dados_projeto = range1[r]

    //Dados do projeto
    var status_projeto = dados_projeto[1]
    var projeto = dados_projeto[0]
    var id_pasta_entrega = dados_projeto[3]
    var nomenclatura_modelos = dados_projeto[6]

    Logger.log("Projeto: "+projeto+" ----------------------------------------------------------------------------------------")

    Logger.log('Dados do projeto importados com sucesso!')

    //Filtro para rodar a função apenas para os projetos em andamento (status = 10)
    if(status_projeto == 10){
      deliveryData(projeto, id_pasta_entrega, status_projeto, nomenclatura_modelos)
    }
  }
  Logger.log('FIM DA LISTAGEM DE ARQUIVOS')
}

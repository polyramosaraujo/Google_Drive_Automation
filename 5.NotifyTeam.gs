//"NotifyTeam" FUNCTION RUNNING EVERY 15 MINUTES >> TRIGGER

function NotifyTeam() {

  Logger.log('INÍCIO DA NOTIFICAÇÃO DAS EQUIPES NO DISCORD')

  //Pegando planilha mestra
  var planilha = SpreadsheetApp.getActiveSpreadsheet()

  //Pegando informações da aba 1 ("Projetos")
  var aba1 = planilha.getSheetByName('Projetos')
  var ultimalinha1 = aba1.getLastRow()
  var ultimacoluna1 = aba1.getLastColumn()
  var range1 = aba1.getRange(1,1,ultimalinha1,ultimacoluna1).getValues()

  Logger.log('Dados da aba "Projetos" importados com sucesso!')

  //Loop que vai rodar para cada linha da aba 1, ou seja, para cada projeto. Começa com 1 para ignorar o cabeçalho
  for (i=1; i<range1.length; i++) {

    var dados_projeto = range1[i]

    //Dados do projeto
    var projeto = dados_projeto[0]
    var id_pasta_entrega = dados_projeto[3]
    var id_discord = dados_projeto[10]

    Logger.log("Projeto: "+projeto+" ----------------------------------------------------------------------------------------")

    Logger.log('Dados do projeto importados com sucesso!')
    
    //Pegando informações da aba 2 ("Registros")
    var aba2 = planilha.getSheetByName('Registro de pasta de entrega')
    var ultimalinha2 = aba2.getLastRow()
    var ultimacoluna2 = aba2.getLastColumn()
    var range2 = aba2.getRange(1,1,ultimalinha2,ultimacoluna2).getValues()

    //Pegando o intervalo de dados da aba 2 cujo nome do projeto é igual ao projeto em questão
    var array_erro = []
    var array_certo = []
    var range2_filtro = range2.filter(function(item){return (item[0] == projeto)})

    //Array de todos os arquivos do projeto que não seguem a nomenclatura padrão
    var array1 = []
    var range2_filtro1 = range2_filtro.filter(function(item){return (item[5] == 10)})

    for(j=0; j<range2_filtro1.length; j++) {
      var arquivo = range2_filtro1[j][3]
      var id_arquivo = range2_filtro1[j][2]
      array1.push(arquivo)
      array_erro.push(id_arquivo)
    }

    //Array de todos os arquivos do projeto que já estão em "Projetos Atualizados"
    var array2 = []
    var range2_filtro2 = range2_filtro.filter(function(item){return (item[5] == 11)})

    for(k=0; k<range2_filtro2.length; k++) {
      var arquivo = range2_filtro2[k][3]
      var id_arquivo = range2_filtro2[k][2]
      array2.push(arquivo)
      array_erro.push(id_arquivo)
    }

    //Array de todos os arquivos que foram adicionados com revisão anterior ou igual a uma já existente
    var array3 = []
    var range2_filtro3 = range2_filtro.filter(function(item){return (item[5] == 12)})

    for(l=0; l<range2_filtro3.length; l++) {
      var arquivo = range2_filtro3[l][3]
      var id_arquivo = range2_filtro3[l][2]
      array3.push(arquivo)
      array_erro.push(id_arquivo)
    }

    //Array de todos os arquivos que foram movimentados corretamente
    var array4 = []
    var range2_filtro4 = range2_filtro.filter(function(item){return (item[5] == 20)})

    for(m=0; m<range2_filtro4.length; m++) {
      var arquivo = range2_filtro4[m][3]
      var id_arquivo = range2_filtro4[m][2]
      array4.push(arquivo)
      array_certo.push(id_arquivo)
    }

    //Se tiver arquivos com erro e/ou corretos
    if(array_erro.length>0 || array_certo.length>0) {
        DiscordNotification(projeto, array1, array2, array3,array4, id_discord, id_pasta_entrega)
        UpdateStatus(aba2,array_erro,15)
        UpdateStatus(aba2,array_certo,25)
      }
  }
  Logger.log('FIM DA NOTIFICAÇÃO DAS EQUIPES NO DISCORD')
}

//"DriveAutomation" FUNCTION RUNNING EVERY 15 MINUTES >> TRIGGER

function DriveAutomation() {

  Logger.log('INÍCIO DA MOVIMENTAÇÃO DE ARQUIVOS NO DRIVE')

  //Pegando planilha mestra
  var planilha = SpreadsheetApp.getActiveSpreadsheet()

  //Pegando informações da aba 1 ("Projetos")
  var aba1 = planilha.getSheetByName('Projetos')
  var ultimalinha1 = aba1.getLastRow()
  var ultimacoluna1 = aba1.getLastColumn()
  var range1 = aba1.getRange(1,1,ultimalinha1,ultimacoluna1).getValues()
  
  //Filtro para rodar a função apenas para os projetos em andamento (status = 10)        
  range1 = range1.filter(function(linha){return linha[1] == 10})

  Logger.log('Dados da aba "Projetos" importados com sucesso!')

  //Loop que vai rodar para cada linha da aba 1, ou seja, para cada projeto. Começa com 1 para ignorar o cabeçalho
  for (i=0; i<range1.length; i++) {
    var dados_projeto = range1[i]

    //Dados do projeto
    var projeto = dados_projeto[0]
    var id_pasta_controle = dados_projeto[4]
    var id_pasta_atualizados = dados_projeto[5]
    var abreviacao = dados_projeto[11]
    var fase = dados_projeto[13]

    Logger.log("Projeto: "+projeto+" ----------------------------------------------------------------------------------------")

    Logger.log('Dados do projeto importados com sucesso!')

    //Pegando informações da aba 2 ("Registros")
    var aba2 = planilha.getSheetByName('Registro de pasta de entrega')
    var ultimalinha2 = aba2.getLastRow()
    var ultimacoluna2 = aba2.getLastColumn()
    var range2 = aba2.getRange(1,1,ultimalinha2,ultimacoluna2).getValues()

    //Pegando o intervalo de dados da aba 2 cujo status=0, ou seja, todos os arquivos que foram listados pela função anterior referentes ao projeto em questão. Começa com 1 para ignorar o cabeçalho
    var range3 = []
    var linhas = []
    for (j=1; j<range2.length; j++) {
      if (range2[j][5]==0) {
        if(range2[j][0]==projeto){
          range3.push(range2[j])
          linhas.push(j+1)
        }
      }
    }

    //Loop que vai rodar para cada linha do intervalo selecionado anteriormente. Começa com 0 pois não tem mais cabeçalho
    for (k=0; k<range3.length; k++) {
      var dados_arquivo = range3[k]

      //Dados do arquivo
      var id_arquivo = dados_arquivo[2]
      var arquivo = dados_arquivo[3]
      var segue_padrao = dados_arquivo[6]
      var disciplina = dados_arquivo[7]
      var formato = dados_arquivo[8]
      var revisao = dados_arquivo[9]

      var linha = linhas[k]

      Logger.log("Arquivo "+arquivo+" --------------------------------------------")

      Logger.log('Dados do arquivo importados com sucesso!')

      //Se o arquivo não seguir o padrão de nomenclatura, sua coluna "Status" na planilha será preenchida com 10, para, posteriormente, a função NotificarEquipe possa enviar a notificação correta
      if (segue_padrao==0) {
        aba2.getRange(linha,6).setValue(10)
        Logger.log('O arquivo NÃO segue o padrão de nomenclatura!')
        Logger.log('Status do arquivo definido como 10')
      }

      //Se o arquivo seguir o padrão de nomenclatura, seguirá para o restante do código
      if (segue_padrao==1 || segue_padrao==5){

        Logger.log('O arquivo está de acordo com o padrão de nomenclatura!')

        //Verificação se já existe um arquivo de mesmo nome na pasta de "Projetos Atualizados"
        var arquivo_igual0=BuscarArquivoIgual1(disciplina,formato,arquivo,id_pasta_atualizados)

        //Se existir um arquivo de mesmo nome, sua coluna "Status" na planilha será preenchida com 11, para, posteriormente, a função NotificarEquipe possa enviar a notificação correta
        if (arquivo_igual0==1) {
          aba2.getRange(linha,6).setValue(11)
          Logger.log('Status do arquivo definido como 11')
        }

        //Se não existir, seguirá para o restante do código
        if (arquivo_igual0==0) {

          //Verificação se já existe um arquivo de mesmo nome na pasta de "Projetos Atualizados", ignorando a parte da revisão no nome do arquivo 
          var arquivo_semelhante=BuscarArquivoSemelhante(disciplina,formato,revisao,arquivo,id_pasta_atualizados)

          //Se o arquivo possui um arquivo semelhante na pasta de "Projetos Atualizados" mas a revisão do último é maior que a do arquivo postado na pasta de "Entregas", sua coluna "Status" na planilha será preenchida com 12, para, posteriormente, a função NotificarEquipe possa enviar a notificação correta
          if (arquivo_semelhante==1) {
            aba2.getRange(linha,6).setValue(12)
            Logger.log('Status do arquivo definido como 12')
          }

          //Se o arquivo não possui o problema de ter revisão menor que um arquivo semelhante já existente na pasta de "Projetos Atualizados", seguirá para o restante do código
          else {
            //Se existir um arquivo semelhante correto, vai ser verificado se este está em "Controle de Versão". Caso não esteja, será feita a cópia. Depois o arquivo será excluído de "Projetos Atualizados"
            if (arquivo_semelhante!=0) {
              var nome_arquivo_semelhante = arquivo_semelhante[0]
              var id_arquivo_semelhante = arquivo_semelhante[1]
              var rev_arquivo_semelhante = nome_arquivo_semelhante.slice(-6, -4)

              arquivo_igual1=BuscarArquivoIgual2(disciplina,formato,nome_arquivo_semelhante,id_pasta_controle)

              if (arquivo_igual1!=1) {
                ControleVersao(abreviacao,disciplina,formato,fase,rev_arquivo_semelhante,id_arquivo_semelhante,nome_arquivo_semelhante,arquivo_igual1)
              }

              DriveApp.getFolderById(id_arquivo_semelhante).setTrashed(true)

              Logger.log('Arquivo semelhante excluído de "Projetos Atualizados" com sucesso!')
            }

            //Verificação se já existe um arquivo de mesmo nome na pasta de "Controle de versão"
            arquivo_igual2=BuscarArquivoIgual2(disciplina,formato,arquivo,id_pasta_controle)

            //Se não existir um arquivo de mesmo nome,vai rodar a função que cria a pasta no formato correto na pasta "Controle de versão" e faz uma cópia do arquivo em questão até lá
            if (arquivo_igual2!=1) {
              ControleVersao(abreviacao,disciplina,formato,fase,revisao,id_arquivo,arquivo,arquivo_igual2)
            }

            //Após todas as etapas e verificações, fazer a cópia do arquivo em questão para a devida pasta em "Projetos Atualizados"
            FazerCopia(id_pasta_atualizados,disciplina,formato,id_arquivo,arquivo)

            //Excluir arquivo da pasta "Entregas"
            DriveApp.getFolderById(id_arquivo).setTrashed(true)
            Logger.log('Arquivo excluído da pasta de "Entregas" com sucesso!')

            //Definir status do arquivo como 20 na aba "Registro"
            aba2.getRange(linha,6).setValue(20)
            Logger.log('Status do arquivo definido como 20')
          }
        }
      }
    }
  }
  Logger.log('FIM DA MOVIMENTAÇÃO DE ARQUIVOS NO DRIVE')
}

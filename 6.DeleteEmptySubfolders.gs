//"DeleteEmptySubfolders" FUNCTION RUNNING EVERY 15 MINUTES >> CREATE TRIGGER

function DeleteEmptySubfolders() {

  Logger.log('INÍCIO DO CÓDIGO DE EXCLUSÃO DE SUBPASTAS VAZIAS')

  // Pegando planilha mestra
  let planilha = SpreadsheetApp.getActiveSpreadsheet()

  // Pegando informações da aba "Projetos"
  let aba = planilha.getSheetByName('Projetos')
  let range = aba.getRange(1, 1, aba.getLastRow(), aba.getLastColumn()).getValues()

  // Filtro para rodar a função apenas para os projetos em andamento (status = 10)
  range = range.filter(function (linha) { return linha[1] == 10 })

  Logger.log('Dados da aba "Projetos" importados com sucesso!')

  // Loop que vai rodar para cada linha da aba "Projetos", ou seja, para cada projeto
  for (let i = 0; i < range.length; i++) {

    // Dados do projeto
    let dados = range[i]
    let projeto = dados[0]
    let id_entregas = dados[3]

    Logger.log("Projeto: " + projeto + " ----------------------------------------------------------------------------------------")
    Logger.log('Dados do projeto importados com sucesso!')

    // Abrindo a pasta "Entregas" do projeto
    var pasta = DriveApp.getFolderById(id_entregas)

    // Verificar e excluir subpastas vazias recursivamente
    checkDeleteSubfolders(pasta)
  }
}

// Função recursiva para verificar e excluir subpastas vazias
function checkDeleteSubfolders(pasta) {
  var subpastas = pasta.getFolders()
  while (subpastas.hasNext()) {
    var subpasta = subpastas.next()
    var nome = subpasta.getName()
    var arquivos = subpasta.getFiles()
    var subSubpastas = subpasta.getFolders()

    // Verificando se a subpasta está vazia (sem arquivos e sem subpastas)
    if (!arquivos.hasNext() && !subSubpastas.hasNext()) {
      Logger.log("SUBPASTA VAZIA: " + nome)
      // Excluindo a subpasta vazia
      subpasta.setTrashed(true)
      Logger.log("SUBPASTA " + nome + " excluída com sucesso!")
    } else {
      // Verificando subpastas recursivamente
      checkDeleteSubfolders(subpasta)
    }
  }
}

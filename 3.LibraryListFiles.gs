function dadosEntregas(projeto, id_pasta_entrega, status_projeto, nomenclatura_modelos) {

  Logger.log('INÍCIO DA FUNÇÃO DADOS ENTREGAS')

  let now = Utilities.formatDate(new Date(), 'GMT-03', 'yyyy-MM-dd HH:mm:ss');

  // Pegando itens da planilha
  let planilha = SpreadsheetApp.getActiveSpreadsheet(); // Lista mestra
  let registroEntregas = planilha.getSheetByName("Registro de pasta de entrega");

  let lastRow = registroEntregas.getLastRow(); //Última linha preenchida na aba de entregas.

  let dataRange = registroEntregas.getRange(2, 3, lastRow, 1);
  let idsExistentes = dataRange.getValues().flat();

  //Pegando informações da aba 5 ("Disciplinas")
  let aba5 = planilha.getSheetByName('Disciplinas')
  let ultimalinha5 = aba5.getLastRow()
  let ultimacoluna5 = aba5.getLastColumn()
  let range5 = aba5.getRange(1,1,ultimalinha5,ultimacoluna5).getValues()

  let nome_disciplinas = [];
  let abreviacao_dis = [];
  
  let formatosAntes = [];
  let formatos = [];

  for (i = 1; i < range5.length; i++) {
    let dados_disciplinas = range5[i];

    let nome_disciplina = dados_disciplinas[0];
    let abreviacao_disciplina = dados_disciplinas[1];
    let formato = dados_disciplinas[2];

    nome_disciplinas.push(nome_disciplina);
    abreviacao_dis.push(abreviacao_disciplina);
    formatosAntes.push(formato);
  }

  for (i = 0; i < 4; i++) {
    formatos.push(formatosAntes[i]);
  }

  //Estou peganto o que tem antes de disciplina de acordo com o padrao de nomenclatura.
  var antesDisciplina = /^(.*?)DISCIPLINA/;
  var antisDisciplina = antesDisciplina.exec(nomenclatura_modelos);

  if (antisDisciplina > 0) {
    return antisDisciplina[1].trim();
  }

  let dados = []; // os itens abaixo vão ser adicionados a este array

  let nomesVerificacao = [];
  let idsVerificacao = []

  // Função recursiva para listar arquivos e subpastas dentro de uma pasta
  function varreduraDePastas(id_pasta_entrega) {
    let pasta = DriveApp.getFolderById(id_pasta_entrega); // Obtém a pasta com base no ID
    let arquivos = pasta.getFiles();
    let subpastas = pasta.getFolders();

    if (status_projeto == 10){
      while (arquivos.hasNext()) {
        let arquivo = arquivos.next();
        let nome = arquivo.getName();
        let id = arquivo.getId();
        let idPasta = arquivo.getParents().next();
        let pastaId = idPasta.getId();

        nomesVerificacao.push(nome);
        idsVerificacao.push(id);

        if (idsExistentes.indexOf(id) === -1) {
          verificarNomenclatura(dados, idsExistentes, antisDisciplina, projeto, pastaId, id, nome, now, abreviacao_dis, formatos);
        }
      }
      while (subpastas.hasNext()) {
        let subpasta = subpastas.next();
        let subpastaId = subpasta.getId();
        varreduraDePastas(subpastaId);
      }
    }
    return dados;
  }

  // Chama a função varreduraDePastas com o ID da pasta passado como argumento
  varreduraDePastas(id_pasta_entrega); 

  pegarArquivosStatus10(antisDisciplina, abreviacao_dis);

  Logger.log(dados);

  if (dados.length > 0){
    registroEntregas.getRange((lastRow + 1), 1, dados.length, 10).setValues(dados);
  }
}

function pegarArquivosStatus10(antisDisciplina, abreviacao_dis){
  Logger.log("----- INICIO FUNÇÃO STATUS DIFERENTE -----")

  // Pegando itens da planilha
  let planilha = SpreadsheetApp.getActiveSpreadsheet(); // Lista mestra

  let tabelaEntregas = planilha.getSheetByName('Registro de pasta de entrega')
  let ultimalinha1 = tabelaEntregas.getLastRow()
  let ultimacoluna1 = tabelaEntregas.getLastColumn()
  let filtro = tabelaEntregas.getRange(1,1,ultimalinha1,ultimacoluna1).getValues()

  for (i = 0; i < filtro.length; i++) {
    let idLocal = filtro[i][1]
    let id_planilha = filtro[i][2]
    let nome_planilha = filtro[i][3]
    let status = filtro[i][5]

    if (status === 10 || status == 11 || status === 12 || status === 15){
    
      Logger.log("-------------------------------------------------------------------------------------------------------------")
      Logger.log("----- Nome do arquivo com status diferente: " + nome_planilha + " -----")
      
      let pasta = DriveApp.getFolderById(idLocal); // Obtém a pasta com base no ID
      let arquivos = pasta.getFiles();
      let nome = null;
      let id = null;

      let idsVerificacao = [];

      while (arquivos.hasNext()) {
        let arquivo = arquivos.next();
        let nome_pasta = arquivo.getName();
        let idAquivo_pasta  = arquivo.getId();

        if (id_planilha === idAquivo_pasta && nome_planilha == nome_pasta){
          Logger.log("O arquivo não alterou o nome, " + nome_planilha);
          idsVerificacao.push(idAquivo_pasta);
          break
        } else if (id_planilha === idAquivo_pasta && nome_planilha != nome_pasta) {
          nome = nome_pasta;
          arquivoEncontrado = true;
          idsVerificacao.push(idAquivo_pasta);
          break
        } else {
          idsVerificacao.push(idAquivo_pasta);
        }
      }

      Logger.log(idsVerificacao)
      Logger.log(id_planilha)

      if (idsVerificacao.indexOf(id_planilha) === -1) {
        Logger.log("Arquivo não encontrado, nome: " + nome_planilha);
        tabelaEntregas.getRange(i + 1, 6).setValue(100);
      }

      if (nome != null) {

          Logger.log(">>> Iniciando a verificação de nomenclatura do arquivo com o nome alterado <<<")
          
          antisTrue = false;
          abreviacaoTrue = false;
          formatoTrue = false;
          revisaoTrue = false;

          let disciplinaArr = [];
          let formatoArr = [];
          let revisaoArr = [];

          let rev = 'REV';
          let regex = /R(\d+)/;
          
          if (nome.includes(antisDisciplina[1])){
            antisTrue = true;
            // Logger.log("O " + nome + " está correto pois tem " + antisDisciplina[1] + " no seu nome")
          }

          for (let j = 0; j < abreviacao_dis.length; j++) {
            let nomePadrao = abreviacao_dis[j];
            if (nome.includes(nomePadrao)) {
                // Logger.log("Abreviação do arquivo no status 10 está correta, pois tem: " + nomePadrao)
                abreviacaoTrue = true;
                disciplinaArr.push(nomePadrao);
                break;
            }
          }

          let extensao = nome.match(/\.(.+)$/);

          if (extensao[1] == 'ifc' || extensao[1] == 'dwg' || extensao[1] == 'pdf' || extensao[1] == 'rvt' || extensao[1] == 'IFC' || extensao[1] == 'DWG' || extensao[1] == 'PDF' || extensao[1] == 'RVT') {
            extensao = extensao[1].toUpperCase();
            formatoArr.push(extensao);
            // Logger.log("Formato existe " + extensao)
            formatoTrue == true
          } else{
            extensao = "OUTROS";
            formatoArr.push(extensao);
            // Logger.log("Extensão do arquivo: " + nome + ", não encontrada")
          }

          if (nome.includes(rev)){
            revisaoTrue = true;

            let depoesRev = /REV(\d+)/;
            let depoisRev = depoesRev.exec(nome);
            let numeroRev = depoisRev[1];

            if(numeroRev.length==1) {
              numeroRev = "0"+numeroRev
            }

            revisaoArr.push(numeroRev);
          }

          if (regex.test(nome)){
            revisaoTrue = true;

            let depoesRev = /R(\d+)/;
            let depoisRev = depoesRev.exec(nome);
            let numeroRev = depoisRev[1];

            if(numeroRev.length==1) {
            numeroRev = "0"+numeroRev
            // Logger.log('numeroRev = '+numeroRev)
            }
            revisaoArr.push(numeroRev);
            // Logger.log("O " + nome + " está correto pois tem " + rev + " no seu nome")
          }

          Logger.log("Nome teste: " + nome)

          if (antisTrue && abreviacaoTrue && revisaoTrue){
              Logger.log("A nomenclatura está correta")
            // Atualize a célula na coluna "status" para 100
              let now = Utilities.formatDate(new Date(), 'GMT-03', 'yyyy-MM-dd HH:mm:ss');

              tabelaEntregas.getRange(i + 1, 7).setValue(5);
              tabelaEntregas.getRange(i + 1, 4).setValue(nome);
              tabelaEntregas.getRange(i + 1, 5).setValue(now);
              tabelaEntregas.getRange(i + 1, 6).setValue(0);
              tabelaEntregas.getRange(i + 1, 8).setValue(disciplinaArr);
              tabelaEntregas.getRange(i + 1, 9).setValue(formatoArr[0]);
              tabelaEntregas.getRange(i + 1, 10).setValue(revisaoArr[0]);
          } else {
            Logger.log("Nomenclatura está incorreta no arquivo de status 10: " + nome)
          }
          Logger.log(">>> Fim da verificação do arquivo, " + nome + " <<<")
        }

        Logger.log(">>> Fim da verificação do arquivo <<<")

        // status_projeto = 0
      }

    }
    

  Logger.log("-------------------------------------------------------------------------------------------------------------")
  Logger.log("----- FIM DA FUNÇÃO DE STATUS DIFERENTE -----")
}

function verificarNomenclatura(dados, idsExistentes, antisDisciplina, projeto, pastaId, id, nome, now, abreviacao_dis, formatos) {

    let antisTrue = false;
    let abreviacaoTrue = false;
    let formatoTrue = false;
    let revisaoTrue = false;

    let status = 0;
    let rev = "REV";
    let regex = /R(\d+)/;
    let padrao = [];
    let disciplina = [];
    let formato = [];
    let revisao = [];

    // Faz a verificação se antes de disciplina está correto
    if (nome.includes(antisDisciplina[1])){
      antisTrue = true;
    }

    if (antisTrue == true){
      //Verifica se tem disciplina
      let nomeSemAntisDis = nome.split(antisDisciplina[1])[1];
      for (var j = 0; j < abreviacao_dis.length; j++) {
          var nomePadrao = abreviacao_dis[j];
          if (nomeSemAntisDis.startsWith(nomePadrao)) {
              abreviacaoTrue = true;
              break;  // Sai do loop interno assim que encontrar correspondência
          } else {
          }
      }
    }
    if (antisTrue == true && abreviacaoTrue == true){
      //Verifica se esta em um formato válido

      let extensao = nome.match(/\.(.+)$/);

      if (extensao[1] == 'ifc' || extensao[1] == 'dwg' || extensao[1] == 'pdf' || extensao[1] == 'rvt' || extensao[1] == 'IFC' || extensao[1] == 'DWG' || extensao[1] == 'PDF' || extensao[1] == 'RVT') {
        extensao = extensao[1].toUpperCase();
        formato.push(extensao);
        // Logger.log("Formato existe " + extensao)
        formatoTrue == true
      } else{
        extensao = "OUTROS";
        formato.push(extensao);
        Logger.log("Extensão do arquivo: " + nome + ", não encontrada")
      }
    }

    if (antisTrue == true && abreviacaoTrue == true){
      //Verifica a revisao
      if (nome.includes(rev)){
        revisaoTrue = true;

        let depoesRev = /REV(\d+)/;
        let depoisRev = depoesRev.exec(nome);
        let numeroRev = depoisRev[1];

        if(numeroRev.length==1) {
        numeroRev = "0"+numeroRev
        }
        revisao.push(numeroRev);
      }
    }

    if (antisTrue == true && abreviacaoTrue == true){
    if (regex.test(nome)){
        revisaoTrue = true;

        let depoesRev = /R(\d+)/;
        // Logger.log('depoesRev = '+depoesRev)
        let depoisRev = depoesRev.exec(nome);
        // Logger.log('depoisRev = '+depoisRev)
        let numeroRev = depoisRev[1];
        // Logger.log('numeroRev = '+numeroRev)

        if(numeroRev.length==1) {
        numeroRev = "0"+numeroRev
        // Logger.log('numeroRev = '+numeroRev)
        }
        revisao.push(numeroRev);
        // Logger.log("O " + nome + " está correto pois tem " + rev + " no seu nome")
    }

      }

    if (antisTrue == true && abreviacaoTrue == true && revisaoTrue == true) {
      disciplina.push(nomePadrao);
      padrao.push(1)
    }else {
      // Logger.log("O " + nome + " não está correto pois nao tem " + antisDisciplina + " no seu nome")
      padrao.push(0);
      disciplina.push("#");
      formato.push("#");
      revisao.push("#");
    }

    //Verificando se o arquivo ja existe na planilha atraves do id do arquivo
    if (idsExistentes.indexOf(id) === -1) {
      dados.push([projeto, pastaId, id, nome, now, status, padrao[0], disciplina[0], formato[0], revisao[0]])
    }  
}

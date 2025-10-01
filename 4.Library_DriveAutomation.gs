function FindDuplicateFile1(disciplina_inicial,formato_inicial,arquivo_inicial,id_pasta) {
  
  //Vai funcionar apenas pra pasta "Projetos Atualizados"

  Logger.log('>>> Início da busca de um arquivo igual em "Projetos Atualizados" <<<')
  //var disciplina_inicial = 'HID'
  //var formato_inicial = 'IFC'
  //var arquivo_inicial = 'VIPLAN_VIS_HID-REV13.ifc'
  //var id_pasta = '1B_yLOn9BmimbCaNWR8X6aNI3fe4N_pkI'
  
  var tamanho_formato = formato_inicial.length
  var pasta_projeto = DriveApp.getFolderById(id_pasta)
  var disciplinas = pasta_projeto.getFolders()

  while (disciplinas.hasNext()) {
    var disciplina = disciplinas.next()
    var name_disciplina = disciplina.getName().substring(disciplina.getName().length - 3)

    if (name_disciplina==disciplina_inicial) {
      var id_disciplina = disciplina.getId()
      var pasta_disciplina = DriveApp.getFolderById(id_disciplina)

      var formatos = pasta_disciplina.getFolders()
      while (formatos.hasNext()) {
        var formato = formatos.next()
        var name_formato = formato.getName().substring(formato.getName().length - tamanho_formato)

        if (name_formato==formato_inicial) {
          var id_formato = formato.getId()
          var pasta_formato = DriveApp.getFolderById(id_formato)

          var arquivos = pasta_formato.getFiles()
          while (arquivos.hasNext()) {
            var arquivo = arquivos.next()
            var name_arquivo = arquivo.getName()

            if (name_arquivo==arquivo_inicial){
              Logger.log('Arquivo já existente na pasta de "Projetos Atualizados"')
              Logger.log('>>> Fim da busca de um arquivo igual em "Projetos Atualizados" <<<')
              return 1 //Sim
            }
          }
        }
      }
    }
  }
  Logger.log('Não existe nehum arquivo de mesmo nome na pasta de "Projetos Atualizados"')
  Logger.log('>>> Fim da busca de um arquivo igual em "Projetos Atualizados" <<<')
  return 0 //Não
}

function FindSimilarFile(disciplina_inicial,formato_inicial,revisao_inicial,arquivo_inicial,id_pasta) {
  //Vai funcionar apenas pra pasta "Projetos Atualizados"

  Logger.log('>>> Início da busca de um arquivo semelhante em "Projetos Atualizados" <<<')

  //var disciplina_inicial = 'ARQ'
  //var formato_inicial = 'DWG'
  //var revisao_inicial = '05'
  //var arquivo_inicial = 'LC-ARQ-F2-P008-TOA-PGD-PLANT-REV05.dwg'
  //var id_pasta = '1V8KEcTbJc3cjh3h2J__iLQX7b_jHg44X'

  var revisao_inicial = parseFloat(revisao_inicial)
  var tamanho_formato = formato_inicial.length

  var arquivo_inicial_sem_formato = arquivo_inicial.slice(0,(tamanho_formato+1)*(-1))
  var posicao_r_inicial = arquivo_inicial_sem_formato.toLowerCase().lastIndexOf('r')
  var arquivo_inicial_simplificado = arquivo_inicial.slice(0,posicao_r_inicial)

  var pasta_projeto = DriveApp.getFolderById(id_pasta)
  var disciplinas = pasta_projeto.getFolders()

  while (disciplinas.hasNext()) {
    var disciplina = disciplinas.next()
    var name_disciplina = disciplina.getName().substring(disciplina.getName().length - 3)

    if (name_disciplina==disciplina_inicial) {
      var id_disciplina = disciplina.getId()
      var pasta_disciplina = DriveApp.getFolderById(id_disciplina)

      var formatos = pasta_disciplina.getFolders()
      while (formatos.hasNext()) {
        var formato = formatos.next()
        var name_formato = formato.getName().substring(formato.getName().length - tamanho_formato)

        if (name_formato==formato_inicial) {
          var id_formato = formato.getId()
          var pasta_formato = DriveApp.getFolderById(id_formato)

          var arquivos = pasta_formato.getFiles()
          while (arquivos.hasNext()) {
            var arquivo = arquivos.next()
            var name_arquivo = arquivo.getName()
            var id_arquivo = arquivo.getId()

            var arquivo_sem_formato = name_arquivo.slice(0,(tamanho_formato+1)*(-1))
            var posicao_r = arquivo_sem_formato.toLowerCase().lastIndexOf('r')
            var arquivo_simplificado = name_arquivo.slice(0,posicao_r)

            if (arquivo_inicial_simplificado==arquivo_simplificado){
              Logger.log('Arquivo semelhante existente na pasta de "Projetos Atualizados"')
              var revisao = parseFloat(name_arquivo.slice(name_arquivo.length-tamanho_formato-3,name_arquivo.length-tamanho_formato-1))

              if (revisao_inicial<=revisao) { //<<<<<<<<<<<<< pegar rev dos arquivos
                Logger.log('O arquivo semelhante encontrado tem revisão maior ou igual ao do arquivo postado na pasta de Entregas')
                return 1 //Sim, mas a rev não está certa
              }

              var array = [name_arquivo,id_arquivo]
              Logger.log('>>> Fim da busca de um arquivo semelhante em "Projetos Atualizados" <<<')
              return array //Sim
            }
          }
        }
      }
    }
  }
  Logger.log('Não existe nehum arquivo semelhante na pasta de "Projetos Atualizados"')
  Logger.log('>>> Fim da busca de um arquivo semelhante em "Projetos Atualizados" <<<')
  return 0 //Não
}

function FindDuplicateFile2(disciplina_inicial,formato_inicial,arquivo_inicial,id_pasta) {

  //Vai funcionar apenas pra pasta "Controle de versão"

  Logger.log('>>> Início da busca de um arquivo igual em "Controle de Versão" <<<')

  //var disciplina_inicial = 'HID'
  //var formato_inicial = 'IFC'
  //var arquivo_inicial = 'VIPLAN_VIS_HID-REV12.ifc'
  //var id_pasta = '1CuCd8eDCfDiTmicPK8ua9CsY9Koz25kB'

  var tamanho_formato = formato_inicial.length
  var pasta_projeto = DriveApp.getFolderById(id_pasta)
  var disciplinas = pasta_projeto.getFolders()

  while (disciplinas.hasNext()) {
    var disciplina = disciplinas.next()
    var name_disciplina = disciplina.getName().substring(disciplina.getName().length - 3)

    if (name_disciplina==disciplina_inicial) {
      var id_disciplina = disciplina.getId()
      var pasta_disciplina = DriveApp.getFolderById(id_disciplina)

      var versoes = pasta_disciplina.getFolders()
      while (versoes.hasNext()) {
        var versao = versoes.next()
        var name_versao = versao.getName()
        var id_versao = versao.getId()
        var pasta_versao = DriveApp.getFolderById(id_versao)

        var formatos = pasta_versao.getFolders()
        while (formatos.hasNext()) {
          var formato = formatos.next()
          var name_formato = formato.getName().substring(formato.getName().length - tamanho_formato)

          if (name_formato==formato_inicial) {
            var id_formato = formato.getId()
            var pasta_formato = DriveApp.getFolderById(id_formato)

            var arquivos = pasta_formato.getFiles()
            while (arquivos.hasNext()) {
              var arquivo = arquivos.next()
              var name_arquivo = arquivo.getName()

              if (name_arquivo==arquivo_inicial){
                Logger.log('Arquivo já existente na pasta de "Controle de Versão"')
                Logger.log('>>> Fim da busca de um arquivo igual em "Controle de Versão" <<<')
                return 1 //Sim
              }
            }
          }
        }
      }
    }
  }
  Logger.log('Não existe nehum arquivo de mesmo nome na pasta de "Controle de Versão"')
  Logger.log('>>> Fim da busca de um arquivo igual em "Controle de Versão" <<<')
  return pasta_disciplina //Não
}

function VersionControl(abreviacao,disciplina,formato_inicial,fase,revisao,id_arquivo,arquivo,pasta_disciplina) {

  Logger.log('>>> Início do controle de versão <<<')

  //var abreviacao = "VIS"
  //var disciplina = "ARQ"
  //var formato_inicial = "IFC"
  //var fase = "F01"
  //var revisao = "13"
  //var id_arquivo = "1jtbbFCTTGZOoQnRXLhIA6FtIJyo65XSf"
  //var arquivo = "VIPLAN_VIS_ARQ_REV13"
  //var pasta_disciplina = DriveApp.getFolderById('1iJMa0rf7qN5LbnhFNllTWith_y5XtonD')
  
  if (formato_inicial!='IFC' && formato_inicial!='RVT' && formato_inicial!='DWG' && formato_inicial!='PDF') {
    var formato_inicial = 'OUTROS'
  }

  var tamanho_formato = formato_inicial.length

  var data_atual = new Date();
  
  var dia = data_atual.getDate().toString().padStart(2, '0')
  var mes = (data_atual.getMonth() + 1).toString().padStart(2, '0')
  var ano = data_atual.getFullYear().toString().slice(-2)

  var name_padrao = abreviacao + "_" + disciplina + "_" + fase + "_" + ano + mes + dia + "_R" + revisao

  var versoes = pasta_disciplina.getFolders()
  while (versoes.hasNext()) {
    var versao = versoes.next()
    var name_versao = versao.getName()

    if (name_versao==name_padrao) {
      var id_versao = versao.getId()
      var pasta_versao = DriveApp.getFolderById(id_versao)
      
      var formatos = pasta_versao.getFolders()
      while (formatos.hasNext()) {
        var formato = formatos.next()
        var name_formato = formato.getName().substring(formato.getName().length - tamanho_formato)

        if (name_formato==formato_inicial) {
          var id_formato = formato.getId()
          var pasta_formato = DriveApp.getFolderById(id_formato)

          var arquivo_original = DriveApp.getFileById(id_arquivo)

          arquivo_original.makeCopy(arquivo,pasta_formato)
          Logger.log('Pasta correta encontrada')
          Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
          Logger.log('>>> Fim do controle de versão <<<')

          return "fim"
        }
      }
    }
  }

  var pasta_versao = pasta_disciplina.createFolder(name_padrao)

  pasta_formato1 = pasta_versao.createFolder("1. IFC")
  pasta_formato2 = pasta_versao.createFolder("2. RVT")
  pasta_formato3 = pasta_versao.createFolder("3. DWG")
  pasta_formato4 = pasta_versao.createFolder("4. PDF")
  pasta_formato5 = pasta_versao.createFolder("5. OUTROS")

  Logger.log('Pasta criada no formato correto')

  if (formato_inicial=="IFC") {
    var arquivo_original = DriveApp.getFileById(id_arquivo)
    arquivo_original.makeCopy(arquivo,pasta_formato1)
    Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
  }

  else if (formato_inicial=="RVT") {
    var arquivo_original = DriveApp.getFileById(id_arquivo)
    arquivo_original.makeCopy(arquivo,pasta_formato2)
    Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
  }

  else if (formato_inicial=="DWG") {
    var arquivo_original = DriveApp.getFileById(id_arquivo)
    arquivo_original.makeCopy(arquivo,pasta_formato3)
    Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
  }

  else if (formato_inicial=="PDF") {
    var arquivo_original = DriveApp.getFileById(id_arquivo)
    arquivo_original.makeCopy(arquivo,pasta_formato4)
    Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
  }

  else {
    var arquivo_original = DriveApp.getFileById(id_arquivo)
    arquivo_original.makeCopy(arquivo,pasta_formato5)
    Logger.log('Cópia de arquivo feita para a pasta de "Controle de Versão"')
  }

  Logger.log('>>> Fim do controle de versão <<<')
}

function MakeCopy(id_pasta_atualizados,disciplina0,formato0,id_arquivo,arquivo) {

  Logger.log('>>> Início da cópia do arquivo para Projetos Atualizados <<<')
  //var id_pasta_atualizados = '1B_yLOn9BmimbCaNWR8X6aNI3fe4N_pkI'
  //var disciplina0 = 'ARQ'
  //var formato0 = 'IFC'
  //var id_arquivo = '1RKTYgtmBjNDZEINcVjV5yKlBWAhewet8'
  //var arquivo = 'VIPLAN_VIS_ARQ_REV13.ifc'
  
  var tamanho_formato = formato0.length

  //Achar a pasta certa em "Projetos Atualizados>Discplina>Formato"
  var pasta_projeto = DriveApp.getFolderById(id_pasta_atualizados)
  var disciplinas = pasta_projeto.getFolders()

  //Varredura nas disciplinas
  while (disciplinas.hasNext()) {
    var disciplina = disciplinas.next()
    var name_disciplina = disciplina.getName().substring(disciplina.getName().length - 3)

    //Se for a disciplina certa vai seguir o código
    if (name_disciplina==disciplina0) {
      var id_disciplina = disciplina.getId()
      var pasta_disciplina = DriveApp.getFolderById(id_disciplina)
      var formatos = pasta_disciplina.getFolders()

      //Varredura nos formatos
      while (formatos.hasNext()) {
        var formato = formatos.next()
        var name_formato = formato.getName().substring(formato.getName().length - tamanho_formato)

        //Se for o formato certo vai seguir o código
        if (name_formato==formato0) {
          var id_formato = formato.getId()
          var pasta_formato = DriveApp.getFolderById(id_formato)

          //Arquivo original da pasta "Entregas"
          var arquivo_original=DriveApp.getFileById(id_arquivo)

          //Fazendo cópia do arquivo original para a pasta do formato correto
          arquivo_original.makeCopy(arquivo,pasta_formato)
          Logger.log('Cópia feita com sucesso')
        }
      }
    }
  }
  Logger.log('>>> Fim da cópia do arquivo para Projetos Atualizados <<<')
}

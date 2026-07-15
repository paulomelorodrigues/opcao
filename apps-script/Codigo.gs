/**
 * Opção Supermercado — API de conteúdo do site
 * -----------------------------------------------------------------------------
 * Este script fica VINCULADO à planilha "SITE — Opção Supermercado"
 * (Extensões → Apps Script) e é implantado como app da web:
 *   Implantar → Nova implantação → App da web
 *   → Executar como: EU  |  Quem pode acessar: QUALQUER PESSOA
 * A URL /exec gerada vai em assets/js/conteudo.js (CONTEUDO_URL).
 *
 * ATENÇÃO ao atualizar o código depois da primeira implantação:
 * usar "Implantar → Gerenciar implantações → (lápis) → Versão: Nova versão".
 * NUNCA criar uma "Nova implantação" — isso muda a URL e quebra o site.
 *
 * Segurança: este script é SOMENTE LEITURA (apenas doGet). Ele nunca recebe
 * nem guarda dados de clientes e não processa pagamentos. Os pedidos chegam
 * pelo WhatsApp; formulários (vagas/pesquisa) são Google Forms separados.
 *
 * Abas esperadas na planilha (linha 1 = cabeçalhos):
 *   Produtos:       Categoria | Nome | Detalhe | Preço | Unidade | Preço antigo | Em oferta | Imagem | Disponível
 *   Ofertas:        Data | Título | Descrição | Imagem | Vídeo | Válido até | Publicado
 *   Vídeos:         Data | Título | Link | Publicado
 *   Funcionários:   Nome | Cargo | Setor | Foto | Publicado
 *   Configurações:  Chave | Valor
 */

function doGet() {
  var cache = CacheService.getScriptCache();
  var json = cache.get('conteudo');
  if (!json) {
    json = JSON.stringify(montarConteudo());
    // Cache de 10 minutos: a planilha é lida no máximo a cada 10 min,
    // não importa quantas pessoas visitem o site.
    cache.put('conteudo', json, 600);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function montarConteudo() {
  var ss = SpreadsheetApp.getActive();
  return {
    geradoEm: new Date().toISOString(),
    config: lerConfig(ss.getSheetByName('Configurações')),
    produtos: lerTabela(ss.getSheetByName('Produtos')).filter(disponivel),
    ofertas: lerTabela(ss.getSheetByName('Ofertas')).filter(publicado),
    videos: lerTabela(ss.getSheetByName('Vídeos')).filter(publicado),
    funcionarios: lerTabela(ss.getSheetByName('Funcionários')).filter(publicado)
  };
}

/** Linha publicada? (coluna "Publicado" = SIM) */
function publicado(linha) {
  return String(linha.publicado || '').trim().toUpperCase() === 'SIM';
}

/** Produto disponível? Vazio conta como disponível; só "NÃO" esconde. */
function disponivel(linha) {
  var v = String(linha.disponivel == null ? '' : linha.disponivel).trim().toUpperCase();
  return v !== 'NÃO' && v !== 'NAO' && v !== 'N';
}

/** Aba de duas colunas Chave|Valor → objeto { chave: valor } */
function lerConfig(aba) {
  var config = {};
  if (!aba) return config;
  aba.getDataRange().getValues().slice(1).forEach(function (l) {
    var chave = normalizarChave(l[0]);
    if (chave) config[chave] = String(l[1] || '').trim();
  });
  return config;
}

/** Aba tabular → lista de objetos com chaves derivadas dos cabeçalhos. */
function lerTabela(aba) {
  if (!aba) return [];
  var valores = aba.getDataRange().getValues();
  if (valores.length < 2) return [];
  var chaves = valores[0].map(normalizarChave);
  return valores.slice(1)
    .filter(function (l) { return l.some(function (c) { return c !== '' && c != null; }); })
    .map(function (l) {
      var obj = {};
      chaves.forEach(function (k, i) {
        if (!k) return;
        var v = l[i];
        if (v instanceof Date) {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        obj[k] = String(v == null ? '' : v).trim();
      });
      // Colunas de imagem/foto aceitam link do Drive OU URL externa/caminho
      if (obj.imagem) obj.imagem = normalizarMidia(obj.imagem);
      if (obj.foto)   obj.foto   = normalizarMidia(obj.foto);
      return obj;
    });
}

/** "Título" → "titulo"; "Preço antigo" → "precoAntigo"; "Em oferta" → "emOferta" */
function normalizarChave(texto) {
  return String(texto || '')
    .replace(/\(.*?\)/g, '')
    .replace(/-/g, '')
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+(\w)/g, function (m, c) { return c.toUpperCase(); });
}

/**
 * Coluna de mídia: se for um link/ID do Google Drive, extrai só o ID (o site
 * monta a miniatura). Caso contrário (URL http externa ou caminho do site),
 * devolve o valor intacto. Assim, tanto fotos do Drive quanto URLs comuns
 * funcionam — sem quebrar URLs longas que não são do Drive.
 */
function normalizarMidia(texto) {
  var t = String(texto || '').trim();
  if (!t) return '';
  if (/drive\.google\.com|docs\.google\.com/i.test(t)) {
    var m = t.match(/[-\w]{25,}/);
    return m ? m[0] : t;
  }
  if (/^https?:\/\//i.test(t) || t.indexOf('/') !== -1) return t; // URL externa/caminho
  return t; // já é um ID solto
}

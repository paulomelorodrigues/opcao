// ---------------------------------------------------------------------------
// Conteúdo dinâmico — busca produtos, ofertas, vídeos, equipe e configurações
// do web app do Google Apps Script e renderiza nas seções marcadas com
// [data-conteudo]. Sequência: (1) renderiza o fallback/último cache na hora,
// (2) busca dados novos e re-renderiza quando chegarem.
//
// Para conectar à planilha: cole abaixo a URL /exec da implantação do
// Apps Script (ver apps-script/Codigo.gs e o README).
// ---------------------------------------------------------------------------
var CONTEUDO_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT/exec";
var CACHE_KEY = "opcao-conteudo-v1";

var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
             "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// "2026-07-20" -> { d:Date, curta:"20/07", longa:"20 de julho de 2026" }
function lerData(iso) {
  if (!iso) return null;
  var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  var d = new Date(+m[1], +m[2] - 1, +m[3]);
  return {
    d: d,
    curta: m[3] + "/" + m[2],
    longa: (+m[3]) + " de " + MESES[d.getMonth()] + " de " + m[1]
  };
}

// "5,99" / "R$ 1.234,56" -> centavos inteiros (599 / 123456); null se inválido.
// Trabalhar em centavos evita erros de arredondamento de ponto flutuante.
function parsePreco(texto) {
  var t = String(texto == null ? "" : texto).replace(/[R$\s]/g, "");
  if (!t) return null;
  t = t.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  var n = parseFloat(t);
  if (isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

function formatBRL(centavos) {
  if (centavos == null) return "";
  var inteiro = Math.floor(centavos / 100);
  var resto = String(centavos % 100);
  if (resto.length < 2) resto = "0" + resto;
  return "R$ " + String(inteiro).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + resto;
}

// Coluna "Imagem" aceita: ID/link do Drive, URL http(s) ou caminho local do site.
function urlImagem(valor, largura) {
  var v = String(valor || "").trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;              // URL externa
  if (v.indexOf("/") !== -1) return v;                // caminho relativo (fallback)
  return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(v) + "&sz=w" + (largura || 1200);
}

// Link de vídeo -> URL de player embutível (só YouTube e Google Drive viram
// iframe; qualquer outro endereço é tratado como link comum, por segurança).
function urlEmbedVideo(link) {
  var v = String(link || "").trim();
  var m = v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/))([-\w]{6,})/);
  if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
  m = v.match(/drive\.google\.com\/file\/d\/([-\w]{10,})/);
  if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
  return null;
}

// Cria elemento com classe e texto (todo conteúdo da planilha entra como
// texto puro — nunca como HTML).
function el(tag, cls, texto) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (texto != null && texto !== "") e.textContent = texto;
  return e;
}

function vazio(container, mensagem) {
  container.textContent = "";
  container.appendChild(el("p", "lead", mensagem));
}

/* ---------------------------------------------- Ofertas da semana (encartes) */
function ofertaValida(o) {
  if (!o.validoAte) return true;
  var dt = lerData(o.validoAte);
  if (!dt) return true;
  var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return dt.d >= hoje;
}

/* --------------------------------- Carrossel de banners (página inicial) */
function renderBannerOfertas(ofertas) {
  var vigentes = (ofertas || []).filter(ofertaValida).filter(function (o) {
    return o.imagem;
  }).sort(function (a, b) {
    return String(b.data).localeCompare(String(a.data));
  }).slice(0, 5);

  document.querySelectorAll("[data-banner-ofertas]").forEach(function (c) {
    if (!vigentes.length) { c.style.display = "none"; return; }
    c.style.display = "";
    c.textContent = "";
    if (c._timer) { clearInterval(c._timer); c._timer = null; }

    var atual = 0;
    var slides = [];

    var trilho = el("div", "banner-trilho");
    vigentes.forEach(function (o) {
      var slide = el("div", "banner-slide");
      var texto = el("div", "banner-texto");
      texto.appendChild(el("span", "kicker", "Oferta da semana"));
      texto.appendChild(el("h2", null, o.titulo));
      if (o.descricao) texto.appendChild(el("p", null, o.descricao));
      var dt = lerData(o.validoAte);
      texto.appendChild(el("span", "pill urgencia",
        dt ? "Válido até " + dt.curta + " ou enquanto durar o estoque"
           : "Válido enquanto durar o estoque"));
      var cta = el("div", "banner-cta");
      var b1 = el("a", "btn btn-amarelo", "Ver produtos em oferta");
      b1.href = "ofertas.html";
      cta.appendChild(b1);
      texto.appendChild(cta);
      slide.appendChild(texto);

      var fig = el("a", "banner-img");
      fig.href = "ofertas.html";
      fig.setAttribute("aria-label", o.titulo);
      var img = el("img");
      img.src = urlImagem(o.imagem, 1200);
      img.alt = o.titulo || "Encarte de ofertas";
      img.loading = slides.length ? "lazy" : "eager";
      fig.appendChild(img);
      slide.appendChild(fig);

      slides.push(slide);
      trilho.appendChild(slide);
    });
    c.appendChild(trilho);

    var dots = el("div", "banner-dots");
    var botoes = vigentes.map(function (o, i) {
      var d = el("button", "banner-dot");
      d.type = "button";
      d.setAttribute("aria-label", "Ir para a oferta " + (i + 1));
      d.onclick = function () { mostrar(i); reiniciar(); };
      dots.appendChild(d);
      return d;
    });
    c.appendChild(dots);

    function mostrar(i) {
      atual = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle("ativo", j === atual); });
      botoes.forEach(function (b, j) { b.classList.toggle("ativo", j === atual); });
    }
    function reiniciar() {
      if (c._timer) clearInterval(c._timer);
      if (slides.length > 1) {
        c._timer = setInterval(function () { mostrar(atual + 1); }, 6000);
      }
    }
    if (slides.length > 1) {
      var prev = el("button", "banner-seta prev", "‹");
      prev.type = "button"; prev.setAttribute("aria-label", "Oferta anterior");
      prev.onclick = function () { mostrar(atual - 1); reiniciar(); };
      var next = el("button", "banner-seta next", "›");
      next.type = "button"; next.setAttribute("aria-label", "Próxima oferta");
      next.onclick = function () { mostrar(atual + 1); reiniciar(); };
      c.appendChild(prev);
      c.appendChild(next);
    }
    mostrar(0);
    reiniciar();
  });
}

function renderOfertas(ofertas) {
  var vigentes = (ofertas || []).filter(ofertaValida).sort(function (a, b) {
    return String(b.data).localeCompare(String(a.data));
  });
  document.querySelectorAll('[data-conteudo="ofertas"]').forEach(function (c) {
    var limite = +c.getAttribute("data-limite") || Infinity;
    var lista = vigentes.slice(0, limite);
    if (!lista.length) {
      vazio(c, "Nenhuma oferta publicada no momento — volte em breve ou chame a gente no WhatsApp!");
      return;
    }
    c.textContent = "";
    var grade = el("div", "flyers-grid");
    lista.forEach(function (o) {
      var card = el("article", "flyer-card reveal in");
      var src = urlImagem(o.imagem, 1200);
      if (src) {
        var a = el("a", "capa");
        a.href = urlImagem(o.imagem, 2000);
        a.target = "_blank";
        a.rel = "noopener";
        var img = el("img");
        img.src = src;
        img.alt = o.titulo || "Encarte de ofertas";
        img.loading = "lazy";
        img.onerror = function () { if (a.parentNode) card.removeChild(a); };
        a.appendChild(img);
        card.appendChild(a);
      }
      var corpo = el("div", "corpo");
      corpo.appendChild(el("h3", null, o.titulo));
      if (o.descricao) corpo.appendChild(el("p", null, o.descricao));
      var dt = lerData(o.validoAte);
      corpo.appendChild(el("span", "pill urgencia",
        dt ? "Válido até " + dt.curta + " ou enquanto durar o estoque"
           : "Ofertas válidas enquanto durar o estoque"));
      var embed = urlEmbedVideo(o.video);
      if (embed) {
        var vid = el("iframe", "video-frame");
        vid.src = embed;
        vid.loading = "lazy";
        vid.allowFullscreen = true;
        vid.style.marginTop = "14px";
        corpo.appendChild(vid);
      }
      card.appendChild(corpo);
      grade.appendChild(card);
    });
    c.appendChild(grade);
  });
}

/* -------------------------------------------------------------- Vídeos */
function renderVideos(videos) {
  document.querySelectorAll('[data-conteudo="videos"]').forEach(function (c) {
    var lista = (videos || []).slice().sort(function (a, b) {
      return String(b.data).localeCompare(String(a.data));
    });
    var limite = +c.getAttribute("data-limite") || Infinity;
    lista = lista.slice(0, limite);
    if (!lista.length) { c.textContent = ""; c.style.display = "none"; return; }
    c.style.display = "";
    c.textContent = "";
    var grade = el("div", "grid grid-2");
    lista.forEach(function (v) {
      var bloco = el("div", "reveal in");
      var embed = urlEmbedVideo(v.link);
      if (embed) {
        var f = el("iframe", "video-frame");
        f.src = embed;
        f.loading = "lazy";
        f.allowFullscreen = true;
        f.title = v.titulo || "Vídeo de ofertas";
        bloco.appendChild(f);
      } else if (v.link) {
        var a = el("a", "btn btn-ghost", "▶ " + (v.titulo || "Assistir vídeo"));
        a.href = v.link;
        a.target = "_blank";
        a.rel = "noopener";
        bloco.appendChild(a);
      }
      if (v.titulo && embed) {
        var t = el("p", null, v.titulo);
        t.style.margin = "10px 4px 0";
        t.style.fontWeight = "600";
        bloco.appendChild(t);
      }
      grade.appendChild(bloco);
    });
    c.appendChild(grade);
  });
}

/* ----------------------------------------------------- Equipe (sobre nós) */
function renderFuncionarios(funcionarios) {
  document.querySelectorAll('[data-conteudo="funcionarios"]').forEach(function (c) {
    var lista = funcionarios || [];
    if (!lista.length) {
      vazio(c, "Em breve, a foto da nossa equipe aqui. Venha nos visitar na loja!");
      return;
    }
    c.textContent = "";
    // Agrupa por setor, mantendo a ordem da planilha
    var grupos = {}, ordem = [];
    lista.forEach(function (f) {
      var s = f.setor || "Nossa equipe";
      if (!grupos[s]) { grupos[s] = []; ordem.push(s); }
      grupos[s].push(f);
    });
    ordem.forEach(function (s) {
      if (ordem.length > 1 || s !== "Nossa equipe") {
        var h = el("h3", "section-title", s);
        h.style.fontSize = "1.4rem";
        h.style.margin = "34px 0 18px";
        c.appendChild(h);
      }
      var grade = el("div", "equipe-grid");
      grupos[s].forEach(function (f) {
        var card = el("div", "card reveal in");
        var img = el("img", "photo");
        img.src = urlImagem(f.foto, 400) || "assets/img/placeholder-person.svg";
        img.alt = f.nome || "";
        img.loading = "lazy";
        img.onerror = function () { img.src = "assets/img/placeholder-person.svg"; };
        card.appendChild(img);
        card.appendChild(el("h3", null, f.nome));
        if (f.cargo) card.appendChild(el("p", "cargo", f.cargo));
        if (f.setor) card.appendChild(el("p", "setor", f.setor));
        grade.appendChild(card);
      });
      c.appendChild(grade);
    });
  });
}

/* ------------------------------------- Configurações (contatos, PIX etc.) */
function renderConfig(config) {
  config = config || {};
  // Texto: <span data-config="horario"></span>
  document.querySelectorAll("[data-config]").forEach(function (e) {
    var v = config[e.getAttribute("data-config")];
    if (v) e.textContent = v;
  });
  // Links: <a data-config-link="whatsapp">; WhatsApp vira link wa.me
  document.querySelectorAll("[data-config-link]").forEach(function (e) {
    var chave = e.getAttribute("data-config-link");
    var v = config[chave];
    if (!v) return;
    if (chave === "whatsapp") {
      // data-whatsapp-text permite abrir a conversa com mensagem pronta
      e.href = linkWhatsApp(v, e.getAttribute("data-whatsapp-text") || "");
    } else if (chave === "telefone") {
      var tel = String(v).replace(/\D/g, "");
      e.href = "tel:+" + (tel.length <= 11 ? "55" + tel : tel);
    } else if (chave === "email") {
      e.href = "mailto:" + v;
    } else {
      e.href = v;
    }
  });
  // Google Forms embutidos: <iframe data-config-embed="formPesquisa">
  document.querySelectorAll("[data-config-embed]").forEach(function (f) {
    var v = String(config[f.getAttribute("data-config-embed")] || "").trim();
    // Só aceita URLs do Google Forms — nunca embute um endereço qualquer.
    if (/^https:\/\/docs\.google\.com\/forms\//i.test(v)) {
      if (f.src !== v) f.src = v;
      f.style.display = "";
      var aviso = f.parentNode && f.parentNode.querySelector("[data-sem-form]");
      if (aviso) aviso.style.display = "none";
    }
  });
  // Faixa de aviso no topo
  var faixa = document.querySelector(".aviso-topo");
  if (faixa && config.avisoTopo) {
    faixa.textContent = config.avisoTopo;
    faixa.classList.add("on");
  }
}

// "(38) 99944-6404" ou URL pronta -> link wa.me
function linkWhatsApp(valor, textoMensagem) {
  var val = String(valor || "").trim();
  var base;
  if (/^https?:\/\//i.test(val)) {
    base = val;
  } else {
    var digitos = val.replace(/\D/g, "");
    base = "https://wa.me/" + (digitos.length <= 11 ? "55" + digitos : digitos);
  }
  if (textoMensagem) {
    base += (base.indexOf("?") === -1 ? "?" : "&") + "text=" + encodeURIComponent(textoMensagem);
  }
  return base;
}

/* --------------------------------------------------- Botão "copiar PIX" */
document.addEventListener("click", function (ev) {
  var btn = ev.target.closest("[data-copiar-pix]");
  if (!btn) return;
  var chave = document.querySelector('[data-config="chavePix"]');
  if (!chave || !navigator.clipboard) return;
  navigator.clipboard.writeText(chave.textContent.trim()).then(function () {
    var original = btn.textContent;
    btn.textContent = "Copiado!";
    setTimeout(function () { btn.textContent = original; }, 2000);
  });
});

/* ------------------------------------------------------------- Núcleo */
function renderizarTudo(d) {
  if (!d) return;
  window.OPCAO_DADOS = d;
  renderBannerOfertas(d.ofertas || []);
  renderOfertas(d.ofertas || []);
  renderVideos(d.videos || []);
  renderFuncionarios(d.funcionarios || []);
  renderConfig(d.config);
  // produtos.js e carrinho.js escutam este evento e se re-renderizam
  document.dispatchEvent(new CustomEvent("opcao:conteudo", { detail: d }));
}

function carregarConteudo() {
  // 1) fallback ou último cache — na tela imediatamente, sem "carregando"
  var dados = window.CONTEUDO_PADRAO;
  try {
    var c = localStorage.getItem(CACHE_KEY);
    if (c) dados = JSON.parse(c);
  } catch (e) {}
  renderizarTudo(dados);

  // 2) dados frescos da planilha (se a URL já estiver configurada)
  if (CONTEUDO_URL.indexOf("script.google.com") === -1) return;
  var ctrl = ("AbortSignal" in window && AbortSignal.timeout) ? { signal: AbortSignal.timeout(8000) } : {};
  fetch(CONTEUDO_URL, ctrl)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (novo) {
      if (novo && novo.config && novo.produtos) {
        renderizarTudo(novo);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(novo)); } catch (e) {}
      }
    })
    .catch(function () { /* silencioso: o fallback já está na tela */ });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarConteudo);
} else {
  carregarConteudo();
}

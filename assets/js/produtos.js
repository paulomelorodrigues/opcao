// ---------------------------------------------------------------------------
// Catálogo de produtos — busca, filtro por categoria e grade de cards.
// Lê os dados carregados por conteudo.js (evento "opcao:conteudo") e conversa
// com o carrinho (carrinho.js) pelos eventos "opcao:carrinho".
//
// Na página: <div data-produtos-grid></div> (atributos opcionais:
// data-so-ofertas, data-limite), <input data-busca-produtos> e
// <div data-chips-categoria></div>.
// ---------------------------------------------------------------------------
(function () {
  var produtos = [];      // lista normalizada
  var categoria = "";     // filtro ativo ("" = todas)
  var busca = "";

  // Remove acentos e baixa a caixa, para busca tolerante
  function chave(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Indisponível = coluna "Disponível" marcada como NÃO/N. O produto continua
  // no site (aparece como "Fora de estoque"), só não pode ir para o carrinho.
  function indisponivel(p) {
    var v = String(p.disponivel == null ? "" : p.disponivel).trim().toUpperCase();
    return v === "NÃO" || v === "NAO" || v === "N";
  }

  // Ícone (emoji) de cada categoria — deixa os filtros mais visuais.
  var ICONES = {
    "hortifruti": "🥬", "acougue": "🥩", "frios e laticinios": "🥛",
    "padaria": "🥖", "mercearia": "🛒", "bebidas": "🥤",
    "higiene e limpeza": "🧽", "limpeza": "🧽", "higiene": "🧴"
  };
  function iconeCategoria(cat) { return ICONES[chave(cat)] || "🛒"; }

  function normalizar(lista) {
    return (lista || [])
      .filter(function (p) { return p.nome; })
      .map(function (p) {
        return {
          id: chave(p.categoria + "|" + p.nome + "|" + (p.detalhe || "")).replace(/[^a-z0-9|]+/g, "-"),
          categoria: String(p.categoria || "Outros").trim(),
          nome: String(p.nome).trim(),
          detalhe: String(p.detalhe || "").trim(),
          unidade: String(p.unidade || "un").trim(),
          precoCent: parsePreco(p.preco),
          precoAntigoCent: parsePreco(p.precoAntigo),
          emOferta: String(p.emOferta || "").trim().toUpperCase() === "SIM",
          disponivel: !indisponivel(p),
          imagem: p.imagem || "",
          textoBusca: chave(p.nome + " " + (p.detalhe || "") + " " + (p.categoria || ""))
        };
      });
  }

  /* ------------------------------------------------- Célula "adicionar" */
  function renderAcao(cont, p) {
    cont.textContent = "";
    if (!p.disponivel) {
      var aviso = el("span", "btn-indisponivel", "Fora de estoque");
      cont.appendChild(aviso);
      return;
    }
    if (p.precoCent == null) {
      var pill = el("span", "pill", "Consulte na loja");
      cont.appendChild(pill);
      return;
    }
    var carrinho = window.OpcaoCarrinho;
    var qtd = carrinho ? carrinho.qtdDe(p.id) : 0;
    if (!qtd) {
      var btn = el("button", "btn-add", "+ Adicionar");
      btn.type = "button";
      btn.onclick = function () { if (carrinho) carrinho.adicionar(p); };
      cont.appendChild(btn);
    } else {
      var st = el("div", "stepper");
      var menos = el("button", null, "−"); menos.type = "button";
      menos.setAttribute("aria-label", "Diminuir quantidade");
      menos.onclick = function () { carrinho.mudarQtd(p.id, -1); };
      var mais = el("button", null, "+"); mais.type = "button";
      mais.setAttribute("aria-label", "Aumentar quantidade");
      mais.onclick = function () { carrinho.mudarQtd(p.id, +1); };
      st.appendChild(menos);
      st.appendChild(el("span", "qtd", String(qtd) + (p.unidade === "kg" ? " kg" : "")));
      st.appendChild(mais);
      cont.appendChild(st);
    }
  }

  function cardProduto(p) {
    var card = el("article", "produto-card" +
      (p.emOferta ? " em-oferta" : "") + (p.disponivel ? "" : " indisponivel"));
    card.setAttribute("data-produto-id", p.id);
    if (!p.disponivel) card.appendChild(el("span", "selo-esgotado", "Fora de estoque"));
    else if (p.emOferta) card.appendChild(el("span", "selo-oferta", "OFERTA"));

    var img = el("img", "foto");
    img.src = urlImagem(p.imagem, 400) || "assets/img/placeholder-produto.svg";
    img.alt = p.nome;
    img.loading = "lazy";
    img.onerror = function () { img.src = "assets/img/placeholder-produto.svg"; };
    card.appendChild(img);

    card.appendChild(el("h3", "nome", p.nome));
    card.appendChild(el("p", "detalhe", p.detalhe));

    var linha = el("div", "preco-linha");
    if (p.precoCent != null) {
      var preco = el("span", "preco", formatBRL(p.precoCent) + " ");
      preco.appendChild(el("span", "un", "/" + p.unidade));
      linha.appendChild(preco);
      if (p.precoAntigoCent != null && p.precoAntigoCent > p.precoCent) {
        linha.appendChild(el("span", "preco-antigo", formatBRL(p.precoAntigoCent)));
      }
    }
    card.appendChild(linha);

    var acao = el("div", "acao");
    renderAcao(acao, p);
    card.appendChild(acao);
    return card;
  }

  /* -------------------------------------------------------------- Grade */
  function filtrar(grid) {
    var lista = produtos;
    if (grid.hasAttribute("data-so-ofertas")) {
      // Nas vitrines de oferta (home/ofertas) só entram itens disponíveis.
      lista = lista.filter(function (p) { return p.emOferta && p.disponivel; });
    }
    if (categoria) {
      lista = lista.filter(function (p) { return p.categoria === categoria; });
    }
    if (busca) {
      var q = chave(busca);
      lista = lista.filter(function (p) { return p.textoBusca.indexOf(q) !== -1; });
    }
    // Disponíveis primeiro; indisponíveis vão para o fim da lista.
    lista = lista.slice().sort(function (a, b) {
      return (a.disponivel === b.disponivel) ? 0 : (a.disponivel ? -1 : 1);
    });
    var limite = +grid.getAttribute("data-limite") || Infinity;
    return lista.slice(0, limite);
  }

  function renderGrades() {
    document.querySelectorAll("[data-produtos-grid]").forEach(function (grid) {
      var lista = filtrar(grid);
      grid.textContent = "";
      if (!lista.length) {
        var msg = busca
          ? "Nenhum produto encontrado para \"" + busca + "\". Não achou? Peça direto pelo WhatsApp!"
          : "Nenhum produto cadastrado nesta categoria ainda.";
        grid.appendChild(el("p", "lead", msg));
        return;
      }
      var grade = el("div", "produtos-grid");
      lista.forEach(function (p) { grade.appendChild(cardProduto(p)); });
      grid.appendChild(grade);
    });
  }

  /* -------------------------------------------------------------- Chips */
  function renderChips() {
    document.querySelectorAll("[data-chips-categoria]").forEach(function (c) {
      var cats = [];
      produtos.forEach(function (p) {
        if (cats.indexOf(p.categoria) === -1) cats.push(p.categoria);
      });
      c.textContent = "";
      var todas = el("button", "chip" + (categoria ? "" : " ativa"));
      todas.type = "button";
      todas.appendChild(el("span", "chip-ic", "🏠"));
      todas.appendChild(el("span", null, "Todos"));
      todas.onclick = function () { categoria = ""; renderChips(); renderGrades(); };
      c.appendChild(todas);
      cats.forEach(function (cat) {
        var chip = el("button", "chip" + (cat === categoria ? " ativa" : ""));
        chip.type = "button";
        chip.appendChild(el("span", "chip-ic", iconeCategoria(cat)));
        chip.appendChild(el("span", null, cat));
        chip.onclick = function () {
          categoria = (categoria === cat) ? "" : cat;
          renderChips();
          renderGrades();
        };
        c.appendChild(chip);
      });
    });
  }

  /* ------------------------------------------------------------- Eventos */
  document.addEventListener("opcao:conteudo", function (ev) {
    produtos = normalizar((ev.detail || {}).produtos);
    renderChips();
    renderGrades();
  });

  // Carrinho mudou: atualiza só as células de ação (mantém rolagem e foco)
  document.addEventListener("opcao:carrinho", function () {
    document.querySelectorAll("[data-produto-id]").forEach(function (card) {
      var id = card.getAttribute("data-produto-id");
      var p = null;
      for (var i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) { p = produtos[i]; break; }
      }
      var acao = card.querySelector(".acao");
      if (p && acao) renderAcao(acao, p);
    });
  });

  document.addEventListener("input", function (ev) {
    var input = ev.target.closest("[data-busca-produtos]");
    if (!input) return;
    busca = input.value.trim();
    renderGrades();
  });

  // Parâmetros da URL: produtos.html?cat=Hortifruti ou ?busca=arroz
  // (lidos já na carga do módulo, antes da primeira renderização)
  try {
    var params = new URLSearchParams(location.search);
    if (params.get("cat")) categoria = params.get("cat");
    if (params.get("busca")) busca = params.get("busca");
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    if (!busca) return;
    var input = document.querySelector("[data-busca-produtos]");
    if (input) input.value = busca;
  });
})();

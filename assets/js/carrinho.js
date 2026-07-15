// ---------------------------------------------------------------------------
// Carrinho de compras + checkout pelo WhatsApp.
//
// • Estado guardado em localStorage (persiste entre páginas e recargas).
// • Nenhum pagamento acontece no site: o pedido é enviado como mensagem de
//   WhatsApp para a loja, que confirma peso/total e envia PIX ou link de
//   pagamento na conversa. Assim, nenhum dado de cartão passa por aqui.
// • Expõe window.OpcaoCarrinho para o produtos.js (adicionar/mudarQtd/qtdDe)
//   e dispara o evento "opcao:carrinho" quando muda.
// ---------------------------------------------------------------------------
(function () {
  var STORE_KEY = "opcao-carrinho-v1";
  var itens = carregar();          // [{id, nome, detalhe, unidade, precoCent, qtd}]
  var config = {};                 // preenchido pelo evento opcao:conteudo

  function carregar() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function salvar() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(itens)); } catch (e) {}
  }

  function achar(id) {
    for (var i = 0; i < itens.length; i++) if (itens[i].id === id) return itens[i];
    return null;
  }

  function totalCent() {
    return itens.reduce(function (s, it) { return s + it.precoCent * it.qtd; }, 0);
  }
  function totalItens() {
    return itens.reduce(function (s, it) { return s + it.qtd; }, 0);
  }
  function temPeso() {
    return itens.some(function (it) { return it.unidade === "kg"; });
  }

  /* ------------------------------------------------ API para produtos.js */
  window.OpcaoCarrinho = {
    qtdDe: function (id) { var it = achar(id); return it ? it.qtd : 0; },
    adicionar: function (p) {
      if (p.precoCent == null) return;
      var it = achar(p.id);
      if (it) { it.qtd += 1; }
      else {
        itens.push({ id: p.id, nome: p.nome, detalhe: p.detalhe || "",
                     unidade: p.unidade || "un", precoCent: p.precoCent, qtd: 1 });
      }
      mudou();
    },
    mudarQtd: function (id, delta) {
      var it = achar(id);
      if (!it) return;
      it.qtd += delta;
      if (it.qtd <= 0) itens = itens.filter(function (x) { return x.id !== id; });
      mudou();
    },
    remover: function (id) {
      itens = itens.filter(function (x) { return x.id !== id; });
      mudou();
    },
    limpar: function () { itens = []; mudou(); },
    abrir: function () { abrir(); }
  };

  // Qualquer botão com [data-abrir-carrinho] (ex.: carrinho no cabeçalho) abre o drawer
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-abrir-carrinho]")) {
      e.preventDefault();
      abrir();
    }
  });

  function mudou() {
    salvar();
    atualizarFab();
    renderDrawer();
    document.dispatchEvent(new CustomEvent("opcao:carrinho"));
  }

  /* ------------------------------------- Sincroniza preços com o catálogo */
  // Ao carregar o catálogo, mantém os preços do carrinho atualizados e
  // remove itens que saíram de linha (indisponíveis).
  document.addEventListener("opcao:conteudo", function (ev) {
    var d = ev.detail || {};
    config = d.config || {};
    var mapa = {};
    (d.produtos || []).forEach(function (p) {
      var indisp = ["NÃO", "NAO"].indexOf(String(p.disponivel || "SIM").trim().toUpperCase()) !== -1;
      if (indisp || !p.nome) return;
      var id = String((p.categoria || "Outros") + "|" + p.nome + "|" + (p.detalhe || ""))
        .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9|]+/g, "-");
      mapa[id] = parsePreco(p.preco);
    });
    var mudouAlgo = false;
    itens = itens.filter(function (it) {
      if (!(it.id in mapa) || mapa[it.id] == null) {
        // produto não está mais no catálogo: mantém com o preço já salvo
        return true;
      }
      if (mapa[it.id] !== it.precoCent) { it.precoCent = mapa[it.id]; mudouAlgo = true; }
      return true;
    });
    if (mudouAlgo) salvar();
    atualizarFab();
    renderDrawer();
    // aplica links de config (whatsapp do rodapé etc.) já é feito por conteudo.js
  });

  /* -------------------------------------------------------------- Montagem */
  var fab, overlay, drawer, corpo, rodape;

  function montarUI() {
    // Botão flutuante
    fab = document.createElement("button");
    fab.className = "carrinho-fab vazio";
    fab.type = "button";
    fab.setAttribute("aria-label", "Abrir carrinho");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/>' +
      '<circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.3 12.3a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L21.5 7H5.3"/></svg>' +
      '<span class="rotulo">Meu carrinho</span><span class="badge">0</span>';
    fab.onclick = abrir;
    document.body.appendChild(fab);

    // Overlay + drawer
    overlay = document.createElement("div");
    overlay.className = "carrinho-overlay";
    overlay.onclick = fechar;

    drawer = document.createElement("aside");
    drawer.className = "carrinho-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-label", "Carrinho de compras");
    drawer.innerHTML =
      '<header><h2>Meu carrinho</h2>' +
      '<button class="carrinho-fechar" type="button" aria-label="Fechar">✕</button></header>' +
      '<div class="carrinho-corpo"></div>' +
      '<div class="carrinho-rodape"></div>';
    drawer.querySelector(".carrinho-fechar").onclick = fechar;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    corpo = drawer.querySelector(".carrinho-corpo");
    rodape = drawer.querySelector(".carrinho-rodape");

    atualizarFab();
    renderDrawer();
  }

  function abrir() { overlay.classList.add("aberto"); drawer.classList.add("aberto"); document.body.style.overflow = "hidden"; renderDrawer(); }
  function fechar() { overlay.classList.remove("aberto"); drawer.classList.remove("aberto"); document.body.style.overflow = ""; checkoutAberto = false; }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("aberto")) fechar();
  });

  function atualizarFab() {
    var n = totalItens();
    if (fab) {
      fab.querySelector(".badge").textContent = String(n);
      fab.classList.toggle("vazio", n === 0);
    }
    // contadores do cabeçalho: <span data-cart-count>
    document.querySelectorAll("[data-cart-count]").forEach(function (b) {
      b.textContent = String(n);
      b.classList.toggle("zerado", n === 0);
    });
  }

  /* --------------------------------------------------------- Render drawer */
  var checkoutAberto = false;

  function renderDrawer() {
    if (!corpo) return;
    corpo.textContent = "";
    rodape.textContent = "";

    if (!itens.length) {
      var v = el("div", "carrinho-vazio");
      v.appendChild(el("p", "lead", "Seu carrinho está vazio."));
      var link = el("a", "btn btn-solid", "Ver produtos");
      link.href = "produtos.html";
      v.appendChild(link);
      corpo.appendChild(v);
      checkoutAberto = false;
      return;
    }

    itens.forEach(function (it) {
      var linha = el("div", "carrinho-item");
      var info = el("div");
      info.appendChild(el("div", "nome", it.nome));
      var det = [it.detalhe, formatBRL(it.precoCent) + "/" + it.unidade].filter(Boolean).join(" · ");
      info.appendChild(el("div", "detalhe", det));
      linha.appendChild(info);
      linha.appendChild(el("div", "subtotal", formatBRL(it.precoCent * it.qtd)));

      var ctr = el("div", "controles");
      var st = el("div", "stepper");
      var menos = el("button", null, "−"); menos.type = "button";
      menos.onclick = function () { window.OpcaoCarrinho.mudarQtd(it.id, -1); };
      var mais = el("button", null, "+"); mais.type = "button";
      mais.onclick = function () { window.OpcaoCarrinho.mudarQtd(it.id, +1); };
      st.appendChild(menos);
      st.appendChild(el("span", "qtd", String(it.qtd) + (it.unidade === "kg" ? " kg" : "")));
      st.appendChild(mais);
      ctr.appendChild(st);
      var rem = el("button", "remover", "Remover"); rem.type = "button";
      rem.onclick = function () { window.OpcaoCarrinho.remover(it.id); };
      ctr.appendChild(rem);
      linha.appendChild(ctr);
      corpo.appendChild(linha);
    });

    if (temPeso()) {
      corpo.appendChild(el("div", "carrinho-nota",
        "Itens vendidos por quilo (kg) são pesados na loja — o valor final é confirmado pelo WhatsApp antes da entrega."));
    }

    // Rodapé: total + botão que abre o formulário de checkout
    var tot = el("div", "carrinho-total");
    tot.appendChild(el("span", "rotulo", "Total estimado"));
    tot.appendChild(el("span", null, formatBRL(totalCent())));
    rodape.appendChild(tot);

    if (!checkoutAberto) {
      var btn = el("button", "btn btn-zap", "Continuar o pedido");
      btn.type = "button";
      btn.style.width = "100%";
      btn.style.justifyContent = "center";
      btn.onclick = function () { checkoutAberto = true; renderDrawer(); };
      rodape.appendChild(btn);
    } else {
      rodape.appendChild(montarCheckout());
    }
  }

  /* -------------------------------------------------------- Checkout form */
  function campo(label, attrs) {
    var wrap = document.createElement("div");
    var l = el("label", null, label);
    var input = document.createElement(attrs.tag || "input");
    if (attrs.tag !== "textarea") input.type = "text";
    Object.keys(attrs).forEach(function (k) {
      if (k !== "tag") input.setAttribute(k, attrs[k]);
    });
    wrap.appendChild(l);
    wrap.appendChild(input);
    return { wrap: wrap, input: input };
  }

  function montarCheckout() {
    var form = document.createElement("form");
    form.className = "checkout-form aberto";

    form.appendChild(el("h3", null, "Como quer receber?"));

    // Entrega / Retirar
    var toggle = el("div", "toggle-duplo");
    ["Entrega", "Retirar na loja"].forEach(function (op, i) {
      var lab = document.createElement("label");
      var r = document.createElement("input");
      r.type = "radio"; r.name = "modo"; r.value = op; if (i === 0) r.checked = true;
      lab.appendChild(r);
      lab.appendChild(el("span", null, op));
      toggle.appendChild(lab);
    });
    form.appendChild(toggle);

    var nome = campo("Seu nome", { placeholder: "Ex.: Maria Silva", required: "required", autocomplete: "name" });
    form.appendChild(nome.wrap);

    var end = campo("Endereço para entrega", { placeholder: "Rua, número, bairro e ponto de referência", tag: "textarea", autocomplete: "street-address" });
    form.appendChild(end.wrap);

    // Mostra/esconde endereço conforme o modo
    function sincModo() {
      var retira = form.querySelector('input[name="modo"]:checked').value === "Retirar na loja";
      end.wrap.style.display = retira ? "none" : "";
      end.input.required = !retira;
    }
    toggle.addEventListener("change", sincModo);
    sincModo();

    // Pagamento
    form.appendChild(el("h3", null, "Forma de pagamento"));
    var pags = el("div", "radios-pagamento");
    var opcoesPag = ["PIX", "Cartão na entrega", "Dinheiro"];
    opcoesPag.forEach(function (op, i) {
      var lab = document.createElement("label");
      var r = document.createElement("input");
      r.type = "radio"; r.name = "pagamento"; r.value = op; if (i === 0) r.checked = true;
      lab.appendChild(r);
      lab.appendChild(document.createTextNode(" " + op));
      pags.appendChild(lab);
    });
    form.appendChild(pags);

    var troco = campo("Troco para quanto? (opcional)", { placeholder: "Ex.: R$ 100,00", inputmode: "numeric" });
    troco.wrap.style.display = "none";
    form.appendChild(troco.wrap);
    pags.addEventListener("change", function () {
      var dinheiro = form.querySelector('input[name="pagamento"]:checked').value === "Dinheiro";
      troco.wrap.style.display = dinheiro ? "" : "none";
    });

    var obs = campo("Observações (opcional)", { placeholder: "Alguma preferência ou recado para a loja?", tag: "textarea" });
    form.appendChild(obs.wrap);

    var enviar = el("button", "btn btn-zap", "Enviar pedido pelo WhatsApp");
    enviar.type = "submit";
    enviar.style.width = "100%";
    enviar.style.justifyContent = "center";
    enviar.style.marginTop = "16px";
    form.appendChild(enviar);

    var voltar = el("button", null, "‹ Voltar ao carrinho");
    voltar.type = "button";
    voltar.style.cssText = "width:100%;background:none;border:0;color:var(--muted);cursor:pointer;padding:12px;font-weight:600;";
    voltar.onclick = function () { checkoutAberto = false; renderDrawer(); };
    form.appendChild(voltar);

    form.onsubmit = function (e) {
      e.preventDefault();
      if (!nome.input.value.trim()) { nome.input.focus(); return; }
      var modo = form.querySelector('input[name="modo"]:checked').value;
      if (modo === "Entrega" && !end.input.value.trim()) { end.input.focus(); return; }
      enviarPedido({
        nome: nome.input.value.trim(),
        modo: modo,
        endereco: end.input.value.trim(),
        pagamento: form.querySelector('input[name="pagamento"]:checked').value,
        troco: troco.input.value.trim(),
        obs: obs.input.value.trim()
      });
    };

    return form;
  }

  /* --------------------------------------------- Monta e envia a mensagem */
  function enviarPedido(d) {
    var linhas = [];
    linhas.push("*Pedido — Opção Supermercado*");
    linhas.push("");
    itens.forEach(function (it) {
      var qtd = it.unidade === "kg" ? (it.qtd + " kg") : (it.qtd + "x");
      var sufixo = it.unidade === "kg" ? " (peso a confirmar)" : "";
      var nome = it.nome + (it.detalhe ? " " + it.detalhe : "");
      linhas.push("• " + qtd + " " + nome + " — " + formatBRL(it.precoCent * it.qtd) + sufixo);
    });
    linhas.push("");
    linhas.push("*Total estimado: " + formatBRL(totalCent()) + "*");
    if (temPeso()) linhas.push("_(itens por kg são pesados na loja)_");
    linhas.push("");
    linhas.push("Nome: " + d.nome);
    if (d.modo === "Entrega") {
      linhas.push("Entrega no endereço: " + d.endereco);
    } else {
      linhas.push("Vou retirar na loja");
    }
    linhas.push("Pagamento: " + d.pagamento + (d.troco ? " (troco para " + d.troco + ")" : ""));
    if (d.obs) linhas.push("Observações: " + d.obs);

    var numero = config.whatsapp || (window.CONTEUDO_PADRAO && window.CONTEUDO_PADRAO.config.whatsapp) || "";
    var url = linkWhatsApp(numero, linhas.join("\n"));
    window.open(url, "_blank");

    // Confirmação e limpeza
    confirmacao();
    itens = [];
    mudou();
  }

  function confirmacao() {
    if (!corpo) return;
    corpo.textContent = "";
    rodape.textContent = "";
    var box = el("div", "msg-confirmacao");
    box.appendChild(el("div", "check", "✅"));
    box.appendChild(el("h3", null, "Pedido enviado!"));
    box.appendChild(el("p", "lead",
      "Abrimos o WhatsApp com o seu pedido. É só tocar em enviar. Em seguida a loja confirma os itens, o valor final e a forma de pagamento (PIX ou link)."));
    var ok = el("button", "btn btn-solid", "Fechar");
    ok.type = "button";
    ok.onclick = fechar;
    box.appendChild(ok);
    corpo.appendChild(box);
    checkoutAberto = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montarUI);
  } else {
    montarUI();
  }
})();

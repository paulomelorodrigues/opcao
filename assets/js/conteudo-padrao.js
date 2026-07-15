// ---------------------------------------------------------------------------
// Conteúdo padrão (fallback) — exibido imediatamente ao abrir a página e
// sempre que a planilha do Google não puder ser consultada. Mantenha estes
// dados corretos: eles são a "rede de segurança" do site.
// Catálogo e preços extraídos dos folhetos de maio–julho/2026.
// ---------------------------------------------------------------------------
window.CONTEUDO_PADRAO = {
  config: {
    nomeDaLoja: "Opção Supermercado",
    whatsapp: "(38) 99944-6404",
    telefone: "",
    endereco: "Avenida Frei Estevão, 567 — Bairro Cidade Nova",
    horario: "Todos os dias, das 7h às 20h",
    linkMaps: "https://www.google.com/maps/search/?api=1&query=Avenida+Frei+Estev%C3%A3o+567+Cidade+Nova",
    formasDePagamento: "Cartões de crédito e débito, cartão alimentação, PIX e dinheiro",
    bairrosDeEntrega: "Consulte os bairros atendidos pelo WhatsApp",
    taxaDeEntrega: "Consulte pelo WhatsApp",
    pedidoMinimo: "",
    chavePix: "",
    instagram: "",
    facebook: "",
    avisoTopo: "",
    formTrabalheConosco: "",
    formPesquisa: "",
    formCadastro: ""
  },

  ofertas: [
    {
      data: "2026-07-14",
      titulo: "Terça Hortifruti",
      descricao: "Frutas, verduras e legumes fresquinhos com preço de feira, toda terça-feira.",
      imagem: "assets/img/folheto-hortifruti.jpeg",
      video: "",
      validoAte: "",
      publicado: "SIM"
    },
    {
      data: "2026-07-08",
      titulo: "Quarta das Carnes",
      descricao: "As melhores carnes bovinas e suínas com preços especiais, toda quarta no açougue.",
      imagem: "assets/img/folheto-carnes.jpeg",
      video: "",
      validoAte: "",
      publicado: "SIM"
    },
    {
      data: "2026-07-10",
      titulo: "Fim de Semana da Economia",
      descricao: "Ofertas em todo o mercado para encher o carrinho gastando menos, de sexta a domingo.",
      imagem: "assets/img/folheto-economia.jpeg",
      video: "",
      validoAte: "",
      publicado: "SIM"
    }
  ],

  videos: [],

  funcionarios: [],

  produtos: [
    // ---------------- Hortifruti
    { categoria: "Hortifruti", nome: "Tomate Extra", detalhe: "", preco: "5,99", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/tomate-extra.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Batata Inglesa", detalhe: "", preco: "5,89", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/batata-inglesa.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Cenoura", detalhe: "", preco: "5,99", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/cenoura.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Alface Crespa", detalhe: "unidade", preco: "3,99", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/alface-crespa.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Banana Prata", detalhe: "", preco: "4,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/banana-prata.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Banana Nanica", detalhe: "", preco: "3,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/banana-nanica.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Banana Maçã", detalhe: "", preco: "7,19", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/banana-maca.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Maçã Gala", detalhe: "", preco: "7,19", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/maca-gala.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Laranja", detalhe: "", preco: "2,95", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/laranja.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Abacaxi Pérola", detalhe: "extra G", preco: "8,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/abacaxi-perola.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Chuchu", detalhe: "", preco: "4,89", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/chuchu.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Pimentão Verde", detalhe: "", preco: "6,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pimentao-verde.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Couve Manteiga", detalhe: "maço", preco: "3,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/couve-manteiga.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Cheiro Verde", detalhe: "maço", preco: "3,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/cheiro-verde.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Cebola Extra", detalhe: "", preco: "6,69", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/cebola-extra.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Abóbora Cabotiá", detalhe: "", preco: "3,69", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/abobora-cabotia.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Abobrinha Verde", detalhe: "", preco: "5,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/abobrinha-verde.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Repolho Verde", detalhe: "", preco: "4,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/repolho-verde.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Pimenta de Cheiro", detalhe: "bandeja", preco: "2,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pimenta-de-cheiro.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Gengibre", detalhe: "bandeja", preco: "5,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/gengibre.jpg", disponivel: "SIM" },
    { categoria: "Hortifruti", nome: "Mandioca com Casca", detalhe: "", preco: "4,49", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/mandioca.jpg", disponivel: "SIM" },

    // ---------------- Açougue
    { categoria: "Açougue", nome: "Costela Bovina", detalhe: "", preco: "19,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/costela-bovina.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Paleta Bovina", detalhe: "", preco: "33,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/paleta-bovina.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Patinho Bovino", detalhe: "", preco: "37,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/patinho-bovino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Almôndegas Bovinas", detalhe: "", preco: "23,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/almondegas-bovinas.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Músculo Bovino", detalhe: "", preco: "28,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/musculo-bovino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Retalho Bovino", detalhe: "", preco: "21,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/retalho-bovino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Coxão Mole", detalhe: "", preco: "43,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/coxao-mole.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Coxão Duro", detalhe: "", preco: "43,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/coxao-duro.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Contra Filé", detalhe: "", preco: "49,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/contra-file.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Alcatra", detalhe: "", preco: "49,95", unidade: "kg", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/alcatra.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Costelão Bovino", detalhe: "", preco: "22,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/costelao-bovino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Pescoço Bovino", detalhe: "", preco: "28,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pescoco-bovino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Acém", detalhe: "", preco: "33,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/acem.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Linguiça Fina Suína", detalhe: "", preco: "26,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/linguica-fina-suina.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Linguiça Mista", detalhe: "", preco: "12,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/linguica-mista.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Chambaril Suíno", detalhe: "", preco: "12,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/chambaril-suino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Bisteca Suína", detalhe: "", preco: "17,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/bisteca-suina.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Pernil Suíno", detalhe: "", preco: "23,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pernil-suino.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Frango Caipirão Paraíso", detalhe: "", preco: "24,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/frango-caipirao.jpg", disponivel: "SIM" },
    { categoria: "Açougue", nome: "Hambúrguer Artesanal", detalhe: "de costela", preco: "26,90", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/hamburguer-artesanal.jpg", disponivel: "SIM" },

    // ---------------- Frios e Laticínios
    { categoria: "Frios e Laticínios", nome: "Leite da Fazenda", detalhe: "garrafa 2L", preco: "8,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/leite-fresco-2l.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Leite UHT Triângulo", detalhe: "integral 1L", preco: "6,25", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/leite-uht-triangulo.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Leite Condensado Triângulo", detalhe: "semidesnatado 395g", preco: "6,29", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/leite-condensado.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Queijo Fresco", detalhe: "unidade", preco: "15,00", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/queijo-fresco.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Ovos Brancos", detalhe: "cartela com 30", preco: "18,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/ovos-brancos.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Ovos Caipira", detalhe: "cartela com 30", preco: "32,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/ovos-caipira.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Ovos de Codorna", detalhe: "cartela com 30", preco: "6,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/ovos-codorna.jpg", disponivel: "SIM" },
    { categoria: "Frios e Laticínios", nome: "Chocomil", detalhe: "200ml", preco: "1,25", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/chocomil.jpg", disponivel: "SIM" },

    // ---------------- Padaria
    { categoria: "Padaria", nome: "Pão de Sal", detalhe: "", preco: "14,99", unidade: "kg", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pao-de-sal.jpg", disponivel: "SIM" },
    { categoria: "Padaria", nome: "Pão de Forma Pullman", detalhe: "tradicional 400g", preco: "8,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pao-forma-pullman.jpg", disponivel: "SIM" },
    { categoria: "Padaria", nome: "Bisnaguito Pullman", detalhe: "300g", preco: "8,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/bisnaguito-pullman.jpg", disponivel: "SIM" },
    { categoria: "Padaria", nome: "Pão de Alho Mencuccini", detalhe: "300g", preco: "9,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/pao-de-alho.jpg", disponivel: "SIM" },

    // ---------------- Mercearia
    { categoria: "Mercearia", nome: "Café Unaí", detalhe: "pacote 250g", preco: "12,45", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/cafe-unai.jpg", disponivel: "SIM" },
    { categoria: "Mercearia", nome: "Rosquinhas de Coco Mabel", detalhe: "600g", preco: "7,95", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/rosquinhas-mabel.jpg", disponivel: "SIM" },
    { categoria: "Mercearia", nome: "Rosquinha Rancheiro", detalhe: "500g", preco: "8,25", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/rosquinha-rancheiro.jpg", disponivel: "SIM" },
    { categoria: "Mercearia", nome: "Biscoito Recheado Show Gol", detalhe: "76g, sabores", preco: "1,95", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/biscoito-show-gol.jpg", disponivel: "SIM" },
    { categoria: "Mercearia", nome: "Molho de Tomate Fugini", detalhe: "tradicional 300g", preco: "1,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/molho-fugini.jpg", disponivel: "SIM" },
    { categoria: "Mercearia", nome: "Batata Congelada Bem Brasil", detalhe: "2kg", preco: "24,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/batata-bem-brasil.jpg", disponivel: "SIM" },

    // ---------------- Bebidas
    { categoria: "Bebidas", nome: "Coca-Cola", detalhe: "2L", preco: "10,49", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/coca-cola-2l.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Guaraná Kuat", detalhe: "1,5L", preco: "3,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/guarana-kuat.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Fanta e Sprite", detalhe: "1,5L, sabores", preco: "5,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/fanta-sprite.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Suco Tial", detalhe: "1L, sabores", preco: "6,45", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/suco-tial.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Cerveja Brahma", detalhe: "caixa 12x350ml", preco: "43,95", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/cerveja-brahma-cx.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Cerveja Antarctica", detalhe: "269ml, caixa c/ 15", preco: "44,90", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/cerveja-antarctica-cx15.jpg", disponivel: "SIM" },
    { categoria: "Bebidas", nome: "Cerveja Antarctica Litrinho", detalhe: "retornável", preco: "2,95", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/antarctica-litrinho.jpg", disponivel: "SIM" },

    // ---------------- Higiene e Limpeza
    { categoria: "Higiene e Limpeza", nome: "Papel Higiênico Paloma", detalhe: "neutro, 4 rolos 30m", preco: "3,69", unidade: "un", precoAntigo: "", emOferta: "SIM", imagem: "assets/img/produtos/papel-paloma.jpg", disponivel: "SIM" },
    { categoria: "Higiene e Limpeza", nome: "Papel Higiênico Sublime", detalhe: "4 rolos 30m", preco: "4,49", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/papel-sublime.jpg", disponivel: "SIM" },
    { categoria: "Higiene e Limpeza", nome: "Papel Higiênico Stylus", detalhe: "12 rolos 20m", preco: "12,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/papel-stylus.jpg", disponivel: "SIM" },
    { categoria: "Higiene e Limpeza", nome: "Sabão em Pó Tixan Ypê", detalhe: "primavera 800g", preco: "13,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/sabao-tixan.jpg", disponivel: "SIM" },
    { categoria: "Higiene e Limpeza", nome: "Multiuso Veja Gold", detalhe: "500ml", preco: "3,99", unidade: "un", precoAntigo: "", emOferta: "", imagem: "assets/img/produtos/veja-gold.jpg", disponivel: "SIM" }
  ]
};

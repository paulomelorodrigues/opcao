# Site do Opção Supermercado

Site institucional e de pedidos do **Opção Supermercado** (Av. Frei Estevão, 567 —
Bairro Cidade Nova). Site **estático** (HTML + CSS + JavaScript puro, sem build),
hospedado no **GitHub Pages**, com conteúdo mantido **pelo Google Drive** (planilha +
Google Apps Script) por pessoas não técnicas.

- **Pedidos**: carrinho no próprio site → o cliente envia o pedido pelo **WhatsApp**
  (link `wa.me` com o pedido já escrito). O pagamento (PIX / link Mercado Pago / na
  entrega) é combinado pela loja na conversa. **Nenhum dado de pagamento passa pelo
  site** — é o modelo de segurança de um site estático.
- **Conteúdo dinâmico**: produtos, ofertas, vídeos, equipe e configurações vêm de uma
  planilha Google via Apps Script (cache de 10 min). Sem a planilha, o site funciona
  com os dados de `assets/js/conteudo-padrao.js`.

## Estrutura

```
index.html            Início (hero, ofertas, categorias, como pedir, loja)
ofertas.html          Encartes + vídeos + produtos em oferta
produtos.html         Catálogo com busca, filtro por categoria e carrinho
sobre.html            História + equipe
trabalhe-conosco.html Google Form de vagas
contato.html          Endereço/mapa, entrega, pagamentos, pesquisa de satisfação
404.html
assets/css/style.css  Tema (cores da logo nas variáveis :root)
assets/js/
  main.js             Menu, header, animações
  conteudo.js         Busca o JSON do Apps Script e renderiza (CONTEUDO_URL)
  conteudo-padrao.js  Dados de segurança (fallback) — sempre visível
  produtos.js         Busca/filtro e grade de produtos
  carrinho.js         Carrinho (localStorage) + checkout via WhatsApp
apps-script/Codigo.gs Backend (Google Apps Script) — somente leitura (doGet)
MANUAL-DO-ADMINISTRADOR.md  Guia para quem atualiza o conteúdo
```

## Configuração inicial (uma vez)

### 1. Planilha Google
Crie uma planilha chamada **"SITE — Opção Supermercado"** com as abas (linha 1 = títulos):

- **Produtos**: `Categoria | Nome | Detalhe | Preço | Unidade | Preço antigo | Em oferta | Imagem | Disponível`
- **Ofertas**: `Data | Título | Descrição | Imagem | Vídeo | Válido até | Publicado`
- **Vídeos**: `Data | Título | Link | Publicado`
- **Funcionários**: `Nome | Cargo | Setor | Foto | Publicado`
- **Configurações**: `Chave | Valor` (Nome da loja, WhatsApp, Telefone, Endereço,
  Horário, Link Maps, Formas de pagamento, Bairros de entrega, Taxa de entrega,
  Pedido mínimo, Chave PIX, Instagram, Facebook, Aviso topo, Form trabalhe conosco,
  Form pesquisa, Form cadastro)

As fotos ficam na pasta **Website_mercado** do Google Drive (compartilhadas como
"Qualquer pessoa com o link — Leitor"); os produtos atuais já têm fotos locais em
`assets/img/produtos/` (recortadas dos folhetos).

### 2. Apps Script
1. Na planilha: **Extensões → Apps Script**.
2. Cole o conteúdo de `apps-script/Codigo.gs`.
3. **Implantar → Nova implantação → App da web**:
   - *Executar como*: **Eu**
   - *Quem pode acessar*: **Qualquer pessoa**
4. Copie a **URL /exec**.
5. Ao **atualizar o código depois**, use **Gerenciar implantações → editar → Nova
   versão** (nunca "Nova implantação", senão a URL muda).

### 3. Ligar o site à planilha
- Em `assets/js/conteudo.js`, substitua `CONTEUDO_URL` pela URL `/exec` do passo 2.
- Enquanto essa URL não for configurada, o site usa o fallback (`conteudo-padrao.js`).

### 4. Google Forms (vagas e pesquisa)
- Crie um formulário de **vagas** e um de **pesquisa de satisfação** (NPS 0–10 +
  comentário). Copie o link "incorporar/enviar" de cada um e cole na aba
  **Configurações** (chaves `Form trabalhe conosco` e `Form pesquisa`).

### 5. Deploy no GitHub Pages
1. Crie um repositório e suba todos os arquivos (a `.nojekyll` já está incluída).
2. **Settings → Pages → Deploy from branch → main / root**.
3. Ative **Enforce HTTPS**.
4. (Opcional) Domínio próprio: aponte o DNS e configure em **Custom domain**.

## Manutenção diária
Ver **MANUAL-DO-ADMINISTRADOR.md** — feito para pessoas não técnicas.

## Segurança
- Apps Script é **somente leitura** (`doGet`); expõe apenas o JSON público de conteúdo.
- Nenhum segredo no frontend; nenhum dado de cliente ou de cartão trafega pelo site.
- Todo conteúdo da planilha é inserido como **texto** (proteção contra XSS); apenas
  vídeos do YouTube/Drive viram player embutido.
- HTTPS obrigatório via GitHub Pages. Avisos anti-golpe no rodapé de todas as páginas.

## Rodar localmente
```
python3 -m http.server 5173
# abra http://localhost:5173
```
Sem `CONTEUDO_URL` configurada, o site renderiza com os dados de `conteudo-padrao.js`.

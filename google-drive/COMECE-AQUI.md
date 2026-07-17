# Comece aqui — pôr o site no ar com o Google Drive

Esta pasta tem **tudo pronto** para você copiar para o Google Drive e ligar o site.
Você faz isso **uma única vez**. Depois, a manutenção é só editar a planilha.

## O que tem nesta pasta

- **SITE - Opção Supermercado.xlsx** → a planilha já preenchida com os 71 produtos,
  as ofertas e as configurações da loja. É o coração da manutenção.
- **Codigo.gs** → o "programa" que liga a planilha ao site (você vai colar no Google).
- **planilhas-csv/** → cópia das abas em CSV (só um backup; normalmente não precisa).

---

## Passo 1 — Subir a planilha para o Google Drive

1. Abra a pasta **Website_mercado** no seu Google Drive.
2. Arraste o arquivo **`SITE - Opção Supermercado.xlsx`** para dentro dela.
3. Clique com o botão direito no arquivo → **Abrir com → Planilhas Google**.
4. No menu **Arquivo → Salvar como Planilhas Google** (assim ele vira uma planilha
   de verdade do Google, com as abas Produtos, Ofertas, Vídeos, Funcionários e
   Configurações). Pode apagar o `.xlsx` depois.

## Passo 2 — Colar o programa (Apps Script)

1. Com a planilha do Google aberta, vá em **Extensões → Apps Script**.
2. Apague o que estiver lá e **cole todo o conteúdo do arquivo `Codigo.gs`**.
3. Clique no disquete (Salvar).
4. Clique em **Implantar → Nova implantação**.
   - Em "Tipo", escolha **App da Web**.
   - **Executar como:** Eu (sua conta).
   - **Quem pode acessar:** Qualquer pessoa.
   - Clique **Implantar** e autorize o acesso quando pedir.
5. Copie o **link que termina em `/exec`**. Guarde esse link.

> ⚠️ Quando precisar mudar o programa depois, use **Implantar → Gerenciar
> implantações → (lápis) → Nova versão**. **Nunca** crie uma "Nova implantação"
> nova, senão o link muda e o site para de atualizar.

## Passo 3 — Ligar o site à planilha

1. No projeto do site, abra o arquivo `assets/js/conteudo.js`.
2. Na primeira linha, troque:
   ```
   var CONTEUDO_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT/exec";
   ```
   pelo link `/exec` que você copiou no Passo 2.
3. Salve e publique (o site atualiza sozinho depois).

> Enquanto esse link não estiver colado, **o site já funciona** com os produtos que
> vieram prontos (os 71 itens desta planilha) — ele só não recebe as mudanças da
> planilha ainda.

## Passo 4 (opcional) — Formulários

Crie no Google Forms:
- um formulário de **Trabalhe Conosco** (vagas);
- um de **Pesquisa de satisfação** (nota de 0 a 10 + comentário);
- se quiser, um de **Cadastro para receber ofertas**.

Copie o link "incorporar" de cada um e cole na aba **Configurações** da planilha,
nas linhas *Form trabalhe conosco*, *Form pesquisa* e *Form cadastro*.

---

## Sobre as fotos dos produtos

Os 71 produtos que já vêm na planilha **usam fotos que estão dentro do site**
(coluna *Imagem* com algo como `assets/img/produtos/tomate-extra.jpg`). Elas
aparecem sozinhas, você não precisa fazer nada.

Para **um produto novo**, coloque na coluna *Imagem* o **link de uma foto do Google
Drive** (compartilhada como "Qualquer pessoa com o link — Leitor"). Se deixar a
coluna vazia, aparece uma imagem padrão — sem problema.

## Produto em falta?

Nunca precisa apagar a linha. Na coluna **Disponível**, escreva **NÃO**. O produto
continua no site, mas aparece marcado como **"Fora de estoque"** e não pode ser
adicionado ao carrinho. Quando voltar, troque para **SIM**.

---

Dúvidas do dia a dia? Veja o **MANUAL-DO-ADMINISTRADOR.md** (na pasta principal do site).

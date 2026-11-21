# VOLT Training Club — ClickFocus

Landing page estática e responsiva para a academia conceitual **VOLT Training Club**, reconstruída a partir do **HTML exportado pelo SITE123** e enviado pelo proprietário do projeto. O resultado preserva o conteúdo e a composição estrutural e recria os estilos e as interações em arquivos independentes.

## Conteúdo reconstruído

- Hero cinematográfico com título, fotografia e chamadas para ação.
- Faixa horizontal animada (*marquee*).
- Modalidades em grade assimétrica: musculação, funcional, HIIT e personalizado.
- Seção de experiência com imagem vertical e benefícios numerados.
- Galeria/mosaico de sete fotografias em fundo claro.
- Planos mensal e trimestral, com o trimestral em destaque.
- Aula experimental com formulário, seção com imagem e botões do WhatsApp.
- FAQ com acordeão nativo, navegação desktop e menu mobile.
- Favicon próprio com raio vermelho, sem referência à marca SITE123.

## Como executar

Não há etapa de build, Node.js, banco de dados ou servidor de aplicação.

Abra `index.html` no navegador ou, para simular uma hospedagem estática:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Como publicar na Vercel

1. Crie um repositório GitHub para a VOLT (por exemplo, `VOLT_Training_Club`).
2. Envie **todo o conteúdo desta pasta**, mantendo `index.html` na raiz.
3. Importe o repositório na Vercel em **Add New → Project**.
4. Selecione **Other / site estático**, deixe Build Command e Output Directory em branco.
5. Faça o deploy. Não é necessário um framework JavaScript.

O arquivo `vercel.json` contém somente a configuração de site estático e cabeçalhos de segurança básicos.

## IMPORTANTE — configurar WhatsApp

O HTML do SITE123 usa `https://wa.me/?text=...`, **sem número de destino**. Para evitar direcionar visitantes ou dados pessoais incorretamente, a versão independente começa com o contato desabilitado. Os botões mostram um aviso neutro.

Abra `assets/app.js` e preencha a constante no começo:

```js
const WHATSAPP_NUMBER = '5511999999999'; // SUBSTITUA pelo número autorizado, com DDI 55
```

Depois de configurado, os botões abrirão o WhatsApp com mensagem pré-preenchida. O formulário valida as informações e abre uma mensagem com os dados digitados **somente quando o número está configurado**. Não grava dados em banco, não envia e-mails e não declara envio bem-sucedido sem o usuário confirmar a mensagem no WhatsApp.

**Privacidade:** para usar o formulário em um negócio real, publique uma política de privacidade e informe como os dados recebidos pelo WhatsApp serão tratados.

## Fidelidade visual e limitações

O HTML inclui referências a quatro folhas de estilo hospedadas no SITE123 (`theme.css`, `main.css`, `components.css`, `layout.css`) e ao script `app.js`. **Não foi possível recuperar esses arquivos nem acessar a versão visual do preview do SITE123** neste ambiente. Portanto, os estilos e as interações foram **recriados**; não é possível prometer fidelidade de 100% pixel a pixel sem os originais ou capturas de tela.

A estrutura e os conteúdos originais foram preservados, com CSS Tailwind v4 compilado **localmente** (não depende de compilador do navegador) e CSS/JS de componentes escritos separadamente.

**Recursos externos restantes:**

- Fotografias: links do CDN do SITE123 indicados no HTML fornecido. Podem ficar indisponíveis ou ter condições de licença específicas. Antes de uso comercial, substitua por imagens próprias/licenciadas e hospede-as em `assets/images/`.
- Fontes: Google Fonts (`Anton`, `Barlow Condensed`, `Inter`).
- Ícones: Font Awesome via CDN público.

## Arquivos

```text
index.html          Página única
assets/site.css     Identidade visual e estilos dos componentes
assets/tailwind.css Utilitários CSS compilados para as classes usadas
assets/app.js       Menu mobile, animações, WhatsApp e formulário
assets/favicon.svg  Ícone VOLT
vercel.json         Configuração da Vercel
REFERENCIAS.md      Relação com o HTML do SITE123 e observações técnicas
```

---

**ClickFocus** — A atenção do seu cliente onde realmente importa.

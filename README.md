# Poupaê Aurora

App de metas financeiras. Você define quanto quer juntar e até quando; ele monta
um plano de depósitos, mostra a rota com marcos, acompanha o progresso e libera
conquistas. Tudo fica salvo no próprio navegador — não existe servidor de dados.

Instalável como aplicativo (PWA) e funciona offline.

## Conteúdo

| Arquivo | O que é |
|---|---|
| `index.html` | Estrutura de todas as telas |
| `styles.css` | Sistema visual, animações e temas claro/escuro |
| `app.js` | Lógica, render e motor de animação |
| `manifest.webmanifest` | Torna o app instalável (nome, ícones, atalhos) |
| `sw.js` | Service worker — cache offline |
| `icons/` | Ícones do app, incluindo o *maskable* do Android |
| `.nojekyll` | Impede o GitHub Pages de processar a pasta como Jekyll |

Os caminhos são todos relativos, então funciona tanto na raiz de um domínio
quanto numa subpasta (`https://usuario.github.io/poupae/`).

## Publicar

A instalação como aplicativo **exige HTTPS**. Qualquer uma das opções abaixo
resolve, e todas são gratuitas. Publique **o conteúdo desta pasta** na raiz do
site.

### Netlify (mais rápido, sem terminal)

1. Acesse <https://app.netlify.com/drop>
2. Arraste esta pasta para a área indicada
3. Copie o endereço `https://....netlify.app` que aparecer

### GitHub Pages

```bash
git init
git add .
git commit -m "Poupaê Aurora"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/poupae.git
git push -u origin main
```

Depois, no repositório: **Settings → Pages → Source: Deploy from a branch →
Branch: `main` / `/ (root)` → Save**. Em um ou dois minutos o app estará em
`https://SEU-USUARIO.github.io/poupae/`.

O repositório precisa ser público (ou ter GitHub Pro, se for privado).

### Cloudflare Pages

**Create a project → Direct Upload**, arraste esta pasta e publique.

## Instalar no aparelho

Abra o endereço HTTPS e:

- **Android / Chrome** — menu ⋮ → *Instalar app*, ou o botão **Instalar** na
  barra superior do próprio app
- **iPhone / Safari** — Compartilhar → *Adicionar à Tela de Início*
  (precisa ser o Safari; o iOS não oferece o botão automático)
- **Windows / macOS** — Chrome ou Edge: ícone de instalar na barra de endereço

Segurando o ícone instalado aparecem os atalhos **Depósitos**, **Plano** e
**Nova meta**.

## Atualizar depois de publicado

O service worker busca `index.html`, `app.js`, `styles.css` e o manifesto **pela
rede primeiro**, usando o cache só como reserva quando está offline. Então
mudanças em código aparecem sozinhas na próxima abertura, sem passo extra.

Ícones e imagens vêm do cache primeiro (por velocidade). Se você trocar um
ícone, incremente a versão na primeira linha de `sw.js` para descartar o cache
antigo:

```js
const VERSION = "poupae-aurora-v3";
```

## Rodar localmente

```bash
py -m http.server 5500
```

E abra `http://localhost:5500/`. O `localhost` também conta como origem segura,
então dá para instalar e testar o modo offline sem publicar nada.

## Dados

Contas e metas ficam em `localStorage`, presos ao navegador e ao endereço.
Publicar em um domínio novo significa começar do zero — não há sincronização
entre aparelhos, e a senha guardada não é criptografia de verdade (é apenas
codificação), então não reaproveite uma senha importante.

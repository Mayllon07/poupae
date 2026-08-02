# Poupaê Aurora

App de metas financeiras. Você define quanto quer juntar e até quando; ele monta
um plano de depósitos, mostra a rota com marcos, acompanha o progresso e libera
conquistas. Tudo fica salvo no próprio navegador — não existe servidor de dados.

Instalável como aplicativo (PWA) e funciona offline.

No ar em <https://mayllon07.github.io/poupae/>

## Telas

- **Início** — anel de progresso, indicadores, rota com os marcos e a ação
  recomendada do momento
- **Metas** — todas as metas criadas, com progresso de cada uma
- **Plano** — gráfico do planejado contra o realizado, detalhes e recálculo
- **Depósitos** — agenda completa, com busca e filtros
- **Conquistas** — marcos liberados ao longo da jornada
- **Conta** — dados de acesso

Atalho de teclado: `Ctrl + K` abre a paleta de comandos.

## Conteúdo

| Arquivo | O que é |
|---|---|
| `index.html` | Estrutura de todas as telas |
| `styles.css` | Sistema visual e animações |
| `core.js` | Cálculo do plano — lógica pura, sem DOM |
| `app.js` | Interface, render e motor de animação |
| `testes.html` | Suíte de testes do `core.js` |
| `manifest.webmanifest` | Torna o app instalável (nome, ícones, atalhos) |
| `sw.js` | Service worker — cache offline |
| `icons/logo-mark.png` | Marca exibida dentro do app |
| `icons/icon-*.png` | Ícones do PWA, incluindo o *maskable* do Android |
| `.nojekyll` | Impede o GitHub Pages de processar a pasta como Jekyll |

Os caminhos são todos relativos, então funciona tanto na raiz de um domínio
quanto numa subpasta (`https://usuario.github.io/poupae/`).

## Tema

O app é **só escuro**. O `color-scheme: only dark` e a meta `color-scheme` não
são decoração: sem eles, o Tema escuro automático do Chrome no Android
reinterpreta as cores por conta própria. Se um dia voltar o tema claro, esses
dois precisam declarar `only light` no modo claro — declarar apenas `light`
sinaliza "página só clara" e faz o sistema escurecer tudo por cima.

## Publicar

A instalação como aplicativo **exige HTTPS**. Qualquer uma das opções abaixo
resolve, e todas são gratuitas. Publique **o conteúdo desta pasta** na raiz do
site.

### GitHub Pages (o que está em uso)

```bash
git push
```

A configuração já está feita em **Settings → Pages → Deploy from a branch →
`main` / `/ (root)`**. Em um ou dois minutos a mudança está no ar.

Para começar um repositório do zero:

```bash
git init
git add .
git commit -m "Poupaê Aurora"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/poupae.git
git push -u origin main
```

O repositório precisa ser público (ou ter GitHub Pro, se for privado).

### Netlify (sem terminal)

1. Acesse <https://app.netlify.com/drop>
2. Arraste esta pasta para a área indicada
3. Copie o endereço `https://....netlify.app` que aparecer

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

Em alguns aparelhos (Xiaomi/MIUI principalmente) aparece um aviso de segurança
na instalação. Ele vem da camada do fabricante, que reage a **qualquer** pacote
instalado fora da Play Store — não há nada no código que o evite. É só escolher
continuar. A única forma de eliminá-lo em todos os aparelhos seria publicar na
Play Store como TWA.

## Atualizar depois de publicado

O service worker busca `index.html`, `app.js`, `styles.css` e o manifesto **pela
rede primeiro**, usando o cache só como reserva quando está offline. Então
mudanças em código aparecem sozinhas na próxima abertura, sem passo extra.

Ícones e imagens vêm do cache primeiro (por velocidade). Se você trocar um
ícone, incremente a versão na primeira linha de `sw.js` para descartar o cache
antigo:

```js
const VERSION = "poupae-aurora-v7";
```

No app já instalado no celular, a versão nova só assume quando **todas** as
janelas dele são fechadas. Feche pelos aplicativos recentes e abra de novo;
voltar à tela inicial não basta.

## Testes

Abra `testes.html` — direto do disco ou pelo servidor local, funciona nos dois.
Ele carrega o `core.js` de verdade, o mesmo que o app usa, e cobre o cálculo do
plano: divisão dos valores, contagem de períodos, progresso, sequência no prazo,
leitura de comportamento e a higienização da importação.

Rode depois de qualquer mudança em `core.js`. Todo cálculo novo deve nascer lá,
não no `app.js` — é essa separação que permite testar sem montar a interface.

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

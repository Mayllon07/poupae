# Como regerar o desenho do nome

O nome do app não é texto numa fonte carregada: são **contornos
vetoriais** embutidos no `index.html`. Há dois:

| Onde | O quê |
|---|---|
| `<symbol id="marcaPoupae">` | "Poupaê" — usado no topo e na tela de entrada |
| `<svg class="boot-svg">` | "POUPAÊ" — a abertura, com cada letra num `<g class="bl">` para saltar uma de cada vez |

## Por que não é uma fonte

A tipografia é a **Valve**, da Typodermic. A licença que vem no ZIP
(`fonts/valve/read-this.html`) diz, em "Not allowed":

> `web page (embedded)` · `app (embedded)`

"Embedded" é servir o arquivo da fonte pelo site, com `@font-face` —
justamente o que **não** podemos fazer. Mas em "Allowed" estão:

> `logo` · `trademarked logo` · `web page (not embedded)`

Ou seja: usar a fonte para desenhar a marca e publicar **o desenho** é
permitido. Por isso a fonte fica só na máquina — `fonts/` está no
`.gitignore` e nunca vai para o site.

Efeito colateral bom: some um download, e o nome nunca aparece na
tipografia errada enquanto uma fonte carrega.

## Regerando

Precisa da fonte em `fonts/valve/valve bd.otf` e do `fonttools`:

```bash
python -m pip install fonttools
```

O script vive no scratchpad da sessão (`gera_marcas.py`). O essencial:

```python
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
```

Para cada letra: mede a caixa, calcula o deslocamento horizontal pelo
avanço (`hmtx`), e desenha com um `TransformPen` que já aplica
`translate(x, yMax) . scale(1, -1)`.

**O espelhamento e a posição precisam entrar nas coordenadas do path,
não num atributo `transform`.** Se a posição ficasse no atributo, a
animação em CSS — que também usa `transform` — substituiria o atributo
e empilharia todas as letras sobre a primeira.

## Ao trocar o texto

- Confira se a fonte tem os acentos com `BoundsPen`: estar no `cmap`
  não garante desenho. A fonte anterior tinha o `Ê` mapeado, mas com o
  circunflexo desenhado **abaixo** da linha de base.
- Atualize o `viewBox` dos dois SVGs — ele vem da largura somada e da
  caixa vertical real, não de valores fixos.
- Mantenha um `<g class="bl" style="--i:N">` por letra na abertura, com
  os índices em sequência a partir de 0.

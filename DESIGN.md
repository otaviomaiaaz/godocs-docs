---
name: GoDocs Docs
description: Sistema visual oficial de documentação claro, acolhedor e orientado à leitura.
colors:
  laranja-guia: "#ff7600"
  laranja-marca: "#ff8c42"
  laranja-guia-contraste: "#a84b00"
  laranja-suave-tema-escuro: "#472f21"
  laranja-suave-tema-claro: "#fff0e6"
  grafite-institucional: "#232222"
  grafite-superficie: "#2a2a2a"
  grafite-elevado: "#313237"
  grafite-borda: "#4d4d4d"
  branco-leitura: "#ffffff"
  cinza-leitura: "#c4c4c4"
  papel-tecnico: "#f7f7f6"
  papel-interativo: "#f0f0ee"
  papel-borda: "#bdbdb8"
  tinta-principal: "#1a1a1a"
  tinta-secundaria: "#4f5459"
  sucesso: "#2fbf71"
  aviso: "#f5a524"
  perigo: "#ff6467"
  informacao: "#4c8dff"
typography:
  display:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.94rem + 1vw, 2.85rem)"
    fontWeight: 690
    lineHeight: 1.08
    letterSpacing: "-0.052em"
  headline:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6875rem, 1.57rem + 0.52vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.38rem + 0.45vw, 1.8rem)"
    fontWeight: 670
    lineHeight: 1.22
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "0.13em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  page-mobile: "20px"
  page-tablet: "24px"
  page-desktop: "32px"
  section: "40px"
  section-large: "48px"
  home-section-entry: "56px"
  spacious: "64px"
components:
  icon-button:
    backgroundColor: "var(--surface)"
    textColor: "var(--text-secondary)"
    rounded: "{rounded.md}"
    size: "44px"
  search-trigger-header:
    backgroundColor: "var(--surface)"
    textColor: "var(--text-muted)"
    rounded: "{rounded.md}"
    padding: "0 9px 0 14px"
    height: "44px"
  search-trigger-hero:
    backgroundColor: "var(--surface)"
    textColor: "var(--text-secondary)"
    rounded: "{rounded.md}"
    padding: "0 12px 0 18px"
    height: "52px"
  doc-card:
    backgroundColor: "var(--surface)"
    textColor: "var(--text-primary)"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  navigation-active:
    backgroundColor: "var(--accent-subtle)"
    textColor: "var(--accent-text)"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  search-field:
    backgroundColor: "var(--surface-interactive)"
    textColor: "var(--text-primary)"
    rounded: "{rounded.md}"
    padding: "0 13px 0 16px"
    height: "52px"
  search-dialog:
    backgroundColor: "var(--surface-elevated)"
    textColor: "var(--text-primary)"
    rounded: "{rounded.xl}"
    width: "min(calc(100% - 40px), 720px)"
  editorial-panel:
    backgroundColor: "color-mix(in srgb, var(--surface) 68%, transparent)"
    textColor: "var(--text-secondary)"
    padding: "0"
  pagination-link:
    textColor: "var(--text-secondary)"
    rounded: "{rounded.md}"
    padding: "14px"
    height: "72px"
---

# Design System: GoDocs Docs

## Overview

**Creative North Star: "A Sala de Referência GoDocs"**

A Sala de Referência GoDocs é um espaço oficial, organizado e confiável para encontrar, compreender e aplicar informações sobre o produto. A interface transmite tranquilidade e proximidade sem perder precisão: cada superfície, controle e estado existe para sustentar o aprendizado e a consulta, nunca para transformar a documentação em promoção.

A atmosfera é clara e acolhedora, com densidade confortável para leitura prolongada. O sistema combina a identidade laranja do GoDocs com neutros grafite no tema escuro e o Papel Técnico no tema claro. A experiência deve permanecer reconhecível como documentação moderna, sem assumir aparência de dashboard administrativo, landing page ou composição excessivamente decorativa.

**Key Characteristics:**

- Conteúdo e busca ocupam o centro da experiência.
- Laranja orienta foco, estado atual, links e ícones sem dominar grandes superfícies.
- Bordas, divisores e variações tonais estruturam a interface antes das sombras.
- Inter Variable oferece uma voz tipográfica única, humana, legível e precisa.
- Movimento é curto, funcional e removido quando o usuário prefere movimento reduzido.

## Design Governance

O `DESIGN.md` registra as decisões visuais e interativas canônicas do GoDocs Docs; ele não é apenas uma fotografia produzida a partir do código. A implementação deve permanecer alinhada a essas decisões, e uma divergência não se torna automaticamente um novo padrão. Ela pode representar uma mudança deliberada ainda não documentada, design drift, implementação incorreta ou documentação desatualizada. Antes de alterar código ou documentação, o agente deve identificar qual caso se aplica.

Mudanças deliberadas no sistema visual devem atualizar implementação e `DESIGN.md` de forma coordenada. Alterações acidentais no código não redefinem o Design System, e uma nova execução de `/impeccable document` funciona como auditoria, não como autorização para sobrescrever decisões canônicas sem revisão.

### Complementary Sources

- `AGENTS.md` define como os agentes trabalham no projeto: restrições, procedimentos e critérios de execução.
- `PRODUCT.md` define o produto: público, propósito, posicionamento, princípios e restrições fundamentais.
- `DESIGN.md` define como a experiência visual e interativa deve funcionar.

As três fontes têm responsabilidades complementares; não existe uma precedência geral baseada apenas no nome do arquivo. Quando houver conflito real entre elas, o agente deve identificá-lo, informar a inconsistência e não escolher silenciosamente uma interpretação. Se a resolução exigir mudança de produto, design ou regra operacional, deve solicitar uma decisão antes de prosseguir.

## Colors

Os nomes Laranja Guia, Grafite Institucional e Papel Técnico são descrições semânticas da paleta já implementada; não criam novas cores nem substituem as variáveis de `app/globals.css`.

### Primary

- **Laranja Guia** (`#ff7600`): orienta foco, links, item ativo, ícones e indicadores no tema escuro.
- **Laranja de Marca** (`#ff8c42`): preserva o tom do wordmark e dos ativos oficiais.
- **Laranja Guia de Contraste** (`#a84b00`): mantém a função do Laranja Guia com contraste adequado no tema claro.
- **Laranja Suave do Tema Escuro** (`#472f21`) e **Laranja Suave do Tema Claro** (`#fff0e6`): criam fundos e anéis de foco discretos no tema indicado pelo nome, sem converter superfícies inteiras em laranja.

### Neutral

- **Grafite Institucional** (`#232222`): fundo principal do tema escuro, mais suave que preto absoluto.
- **Superfícies Grafite** (`#2a2a2a` e `#313237`): distinguem conteúdo, controles e elementos realmente elevados.
- **Borda Grafite** (`#4d4d4d`): separa superfícies escuras com contraste controlado.
- **Branco de Leitura e Cinza de Leitura** (`#ffffff` e `#c4c4c4`): formam a hierarquia principal e secundária no tema escuro.
- **Papel Técnico** (`#f7f7f6`): fundo levemente aquecido do tema claro.
- **Papel Interativo e Borda de Papel** (`#f0f0ee` e `#bdbdb8`): distinguem controles e contornos no tema claro.
- **Tintas Principal e Secundária** (`#1a1a1a` e `#4f5459`): sustentam títulos e corpo no tema claro.

### Tertiary

- **Sucesso, Aviso, Perigo e Informação** (`#2fbf71`, `#f5a524`, `#ff6467`, `#4c8dff`): comunicam estados funcionais em callouts e resultados; não competem com o Laranja Guia como identidade.

### Base Colors and Semantic Use

O bloco `colors` do front matter representa a paleta-base suportada pelo Design System e pelo schema. Em componentes, a referência operacional é sempre o token semântico apropriado ao tema. Agentes não devem aplicar diretamente um valor-base ignorando `--accent-*`, `--text-*`, `--surface-*` ou os tokens funcionais; quando os temas usam valores distintos, prevalece o token semântico daquele tema. Aliases e composições existentes por `color-mix()` também devem ser preservados.

### Semantic Token Mapping

**Nota de implementação:** o tema escuro é definido em `:root`; o tema claro substitui valores por meio de `html[data-theme="light"]`. A tabela registra o mapeamento implementado nessas duas fontes. Quando um token é um alias, a expressão original é preservada.

| Token | Tema escuro | Tema claro |
|---|---|---|
| `--brand-logo` | `#ff8c42` | `#ff8c42` (herdado) |
| `--accent-primary` | `#ff7600` | `#ff7600` (herdado) |
| `--accent-hover` | `#f06e00` | `#8f3f00` |
| `--accent-pressed` | `#eb6a00` | `#783500` |
| `--accent-text` | `#ff7600` | `#a84b00` |
| `--accent-subtle` | `#472f21` | `#fff0e6` |
| `--accent-border` | `#b95b1a` | `#c7661c` |
| `--focus-ring` | `#ff7600` | `#a84b00` |
| `--focus-shadow` | `#4c321f` | `#fff0e6` |
| `--selection-background` | `#5a351e` | `#ffdcc4` |
| `--background` | `#232222` | `#f7f7f6` |
| `--surface` | `#2a2a2a` | `#ffffff` |
| `--surface-elevated` | `#313237` | `#ffffff` |
| `--surface-interactive` | `#292929` | `#f0f0ee` |
| `--surface-hover` | `#313237` | `#fff0e6` |
| `--divider` | `#3f3f3f` | `#d4d4d0` |
| `--surface-border` | `#4d4d4d` | `#bdbdb8` |
| `--border` | `var(--surface-border)` | `var(--surface-border)` |
| `--border-strong` | `#737373` | `#898985` |
| `--control-border` | `var(--border-strong)` | `var(--border-strong)` |
| `--text-primary` | `#ffffff` | `#1a1a1a` |
| `--text-secondary` | `#c4c4c4` | `#4f5459` |
| `--text-muted` | `#a1a1a1` | `#686d72` |
| `--text-on-accent` | `#1a1a1a` | `#1a1a1a` (herdado) |
| `--disabled-surface` | `#313237` | `#f0f0ee` |
| `--disabled-text` | `#737373` | `#8a8a8a` |
| `--overlay` | `rgba(18, 18, 18, 0.7)` | `rgba(24, 24, 24, 0.42)` |
| `--code-background` | `#202020` | `#f0f0ee` |
| `--success` | `#2fbf71` | `#217a45` |
| `--warning` | `#f5a524` | `#f5a524` (herdado) |
| `--danger` | `#ff6467` | `#b42318` |
| `--info` | `#4c8dff` | `#4c8dff` (herdado) |

Composições por `color-mix()` permanecem contextuais e não se tornam novos tokens globais. O item ativo da navegação mistura `--accent-subtle` a `64%` com transparente; painéis editoriais misturam `--surface` a `68%` com transparente; callouts combinam a cor funcional a `36%` com `--border` na borda e a `8%` com `--surface` no fundo; cards “Em breve” misturam `--surface` a `88%` com `--background`.

### Named Rules

**The Laranja Guia Rule.** Use laranja para orientar atenção e estado, não como preenchimento persistente de grandes áreas.

**The Two Reading Rooms Rule.** Temas claro e escuro preservam os mesmos papéis semânticos, mas usam valores próprios para contraste e conforto de leitura.

**The Status-with-Context Rule.** Cores funcionais orientam ícones, bordas e fundos tonais, mas não substituem `--text-primary` ou `--text-secondary` sem contraste suficiente. Texto e informação crítica permanecem legíveis independentemente da cor, e o significado combina rótulo, ícone, borda, fundo tonal ou outro sinal visual em vez de depender somente da cor.

## Typography

- **Display Font:** Inter Variable (com Inter, `ui-sans-serif` e `system-ui` como fallback).
- **Body Font:** Inter Variable (com Inter, `ui-sans-serif` e `system-ui` como fallback).
- **Label/Mono Font:** Inter Variable para interface; SFMono-Regular, Consolas e Liberation Mono para código.

**Nota de implementação:** a pilha monoespaçada é declarada localmente em código inline e blocos de código; não existe um token tipográfico mono global. Por isso, ela permanece documentada na narrativa e não é promovida a um papel estruturado no front matter.

**Character:** uma única família variável mantém a voz direta, humana e profissional. Títulos compactos e firmes criam orientação; corpo aberto e com entrelinha generosa sustenta leitura prolongada.

### Hierarchy

- **Display** (peso `690`, `clamp(2.2rem, 1.94rem + 1vw, 2.85rem)`, entrelinha `1.08`): título principal da home, central e equilibrado.
- **Headline** (peso `700`, `clamp(1.6875rem, 1.57rem + 0.52vw, 2rem)`, entrelinha `1.16`): título de artigo.
- **Title** (peso `670`, `clamp(1.5rem, 1.38rem + 0.45vw, 1.8rem)`, entrelinha `1.22`): títulos editoriais da home.
- **Body** (peso `400`, `1rem`, entrelinha `1.72`): texto documental dentro da coluna de `44rem`.
- **Label** (peso `600`, `0.8125rem`, entrelinha `1.35`): navegação, metadados e controles compactos.
- **Eyebrow** (peso `750`, `0.625rem`, tracking `0.13em`, caixa alta): numeração e orientação de seções, sempre em pequenas doses.

### Named Rules

**The Long-Read Rule.** Títulos podem ser densos e compactos; o corpo documental permanece aberto, com coluna controlada e entrelinha ampla.

**The One-Family Rule.** A hierarquia nasce de tamanho, peso, tracking e ritmo, não da introdução de novas famílias tipográficas.

## Layout

O sistema usa uma grade editorial centrada. O limite global é `1440px`; a home restringe o conteúdo principal a `1120px`, o hero a `820px` e a busca central a `680px`. O artigo desktop organiza sidebar de `240px`, coluna de leitura de `44rem` e sumário de `220px`.

O ritmo utiliza predominantemente incrementos de `4px`, com padding de página de `32px` no desktop, `24px` no tablet e `20px` no celular.

**Nota de implementação:** o gap do artigo desktop e a composição em duas colunas do diretório por objetivos usam `42px`. Esse valor é uma exceção contextual, não um token global de spacing.

A entrada das seções da home é o token contextual `--home-section-entry`, com `56px` no desktop e `44px` até `767px`. O valor de `56px` também aparece na altura do header da home, mas `--home-header-height` é uma medida de componente independente. As seções usam saída de `48px` e grid com gap de `16px`; no celular esses valores passam a `36px` e `12px`.

Em até `1279px`, o sumário lateral cede lugar ao sumário móvel. Em até `1023px`, a sidebar vira drawer, o artigo passa a uma coluna e a grade de funcionalidades usa duas colunas. Em até `767px`, grades passam a uma coluna, o diálogo de busca ocupa a viewport e os controles preservam alvos mínimos de `44px`.

**The Reading Column Rule.** A navegação pode expandir ou recolher, mas a coluna documental permanece controlada e central.

## Elevation & Depth

**Estratificação discreta** é a filosofia de profundidade. Bordas, divisores e pequenas variações entre fundo, superfície, superfície interativa e superfície elevada fazem a maior parte da separação. Cards e blocos de conteúdo permanecem planos em repouso.

Sombras ficam restritas a sobreposição real ou resposta pontual: diálogo e drawer usam a elevação ampla do sistema; cards recebem uma sombra curta somente em hover ou foco; a busca do hero usa uma sombra ambiente baixa para indicar affordance.

### Shadow Vocabulary

- **Elevação de sobreposição** (`0 24px 70px rgba(0, 0, 0, 0.38)` no tema escuro; `0 24px 70px rgba(35, 25, 16, 0.14)` no claro): diálogos e drawers.
- **Resposta de card** (`0 8px 22px rgba(0, 0, 0, 0.1)` no tema escuro; `0 8px 22px rgba(35, 25, 16, 0.05)` no claro): hover ou foco de cards clicáveis.
- **Busca ambiente** (`0 10px 26px` com preto a `7%`): reforço sutil para o controle principal da home.

### Motion

O sistema possui três durações reutilizadas: `--duration-fast` (`120ms`) para cor, borda e ícones; `--duration-base` (`180ms`) para transições comuns, diálogo, drawer e backdrop; e `--duration-interaction` (`200ms`) para respostas compostas de cards. A curva compartilhada é `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`.

- **Hover / Active:** cards podem subir `1px` na home; setas e ícones se deslocam entre `2px` e `3px`. Estados pressionados removem ou reduzem esse deslocamento sem alterar o layout.
- **Focus:** outline de `2px`, offset de `3px` e halo são aplicados imediatamente; borda, fundo e cor seguem a duração do controle quando possuem transição.
- **Overlays:** backdrop usa fade; o diálogo entra de `translateY(-10px) scale(0.985)` e o drawer de `translateX(-20px)`, ambos em `180ms`.
- **Movimento reduzido:** `prefers-reduced-motion: reduce` reduz globalmente transições e animações a `0.01ms`, limita a repetição a uma vez e remove explicitamente animações e transforms de revelação, cards e setas.

**Nota de implementação:** overlays são removidos ao fechar e não possuem animação de saída. O spinner da busca é a única animação contínua do fluxo implementado, com rotação linear de `900ms`.

### Named Rules

**The Flat-by-Default Rule.** Uma superfície comum não flutua; sombra exige sobreposição ou interação real.

**The Functional Motion Rule.** Movimento comunica entrada, resposta ou continuidade; não adiciona decoração autônoma e não é necessário para compreender estado ou conteúdo.

## Shapes

O sistema usa cantos moderados e consistentes: `8px` em elementos compactos, ícones e navegação; `12px` em inputs, cards e botões; `16px` em painéis maiores; `20px` no diálogo de busca. Bordas de `1px` são a forma principal de delimitação.

Círculos ficam reservados a marcadores de etapa, ícones de estado e elementos ambientais do hero. Linhas, divisores e indicadores laterais de `2px` comunicam continuidade ou item ativo sem introduzir ornamento gratuito.

**The Moderate Corners Rule.** Cantos suavizam a interface sem transformá-la em uma coleção de cápsulas ou superfícies excessivamente arredondadas.

## Iconography

`lucide-react` é a família canônica de ícones da interface. O sistema usa seu estilo outline, sem preenchimentos decorativos, com traço entre `1.6` e `2` e tamanhos predominantemente entre `15px` e `20px`; ícones auxiliares podem chegar a `12px` em hints compactos ou a `22px` em estados informativos.

- Ícones que acompanham texto reforçam a ação ou o contexto e permanecem decorativos para tecnologia assistiva quando o rótulo já comunica o significado.
- Controles somente com ícone exigem nome acessível por `aria-label`, texto equivalente ou mecanismo semântico apropriado; o ícone visual não substitui esse nome.
- Botões de ícone compactos preservam o alvo de `44px`, foco visível e os estados do componente `icon-button`.
- Logos oficiais em `public/brand/` e o favicon próprio são ativos de identidade separados; não devem ser redesenhados ou substituídos por um ícone genérico da biblioteca.
- Novas implementações devem reutilizar Lucide antes de introduzir outra família. Uma biblioteca concorrente exige necessidade comprovada e revisão para evitar mistura arbitrária de linguagem visual.

## Components

Os componentes são **contidos e orientadores**: esclarecem hierarquia, navegação, ação e estado sem disputar atenção com o conteúdo.

### Icon Buttons

- **Shape:** quadrado de `44px`, canto moderado (`12px`) e borda de `1px`.
- **Color:** superfície e texto secundário; hover aproxima borda e ícone do Laranja Guia.
- **Focus / Active:** foco global de `2px` com halo de `3px`; estado pressionado usa superfície interativa.

### Search Trigger and Dialog

- **Header Trigger:** altura mínima de `44px`, padding de `0 9px 0 14px`, canto de `12px`, ícone de `17px`, rótulo “Buscar” e atalho de teclado.
- **Hero Trigger:** altura mínima de `52px`, padding de `0 12px 0 18px`, canto de `12px`, ícone de `20px`, rótulo completo e sombra ambiente.
- **Dialog:** largura máxima de `720px`, canto de `20px`, superfície elevada e sombra de sobreposição.
- **Field:** altura de `52px`, canto de `12px`, fundo interativo e halo visível ao foco.
- **Responsive:** no celular, o diálogo ocupa `100dvh`, remove borda e radius e organiza resultados em uma coluna.

### Accessible Overlays

- **Modalidade e confinamento:** busca e drawer usam `<dialog>` aberto por `showModal()`; o confinamento de foco e a navegação cíclica por `Tab` são fornecidos pelo comportamento modal nativo do navegador.
- **Foco inicial:** a busca direciona o foco ao campo de pesquisa; o drawer direciona o foco para um controle apropriado dentro do overlay.
- **Fechamento:** `Escape` é tratado pelo evento nativo `cancel` e pelo hook compartilhado; botão explícito e clique no backdrop também fecham os overlays. O drawer fecha adicionalmente após selecionar um link ou ao entrar no breakpoint desktop de `1024px`.
- **Retorno de foco:** ao desmontar o overlay, o foco retorna sem scroll ao acionador que o abriu. A busca preserva o acionador real usado por clique ou pelo atalho `Ctrl`/`Cmd` + `K`.
- **Ordem e teclado:** a ordem de `Tab` segue o DOM. No campo de busca, `ArrowDown` e `ArrowUp` percorrem resultados, `Enter` abre o resultado ativo e `Tab` continua pelos controles do diálogo.
- **Mobile e movimento:** abaixo de `768px`, a busca ocupa a viewport e o drawer permanece modal; as animações de entrada seguem as regras de movimento reduzido descritas em Motion.

**Nota de implementação:** o primeiro controle focável do drawer é o botão “Fechar navegação”.

### Cards and Learning Path

- **Shape:** canto de `12px`, borda fina, superfície plana e padding de `16px 18px` na home.
- **Hierarchy:** ícone laranja de `34px`, título firme, descrição secundária e seta discreta.
- **State:** hover altera borda e tonalidade, move no máximo `1px` e usa sombra curta; `prefers-reduced-motion` remove a transformação.
- **Coming Soon:** quando um documento publicado usa `availability: coming-soon`, o card continua sendo um `Link` com `href` obrigatório para a rota real do documento, badge e redução tonal; a disponibilidade não desativa rota, navegação ou busca.

### Navigation

- **Header:** sticky, `64px` nos artigos e `56px` na home; a home começa transparente e ganha fundo desfocado após scroll.
- **Sidebar / TOC:** labels compactos, grupos em caixa alta, item ativo com fundo laranja suave e indicador lateral de `2px`.
- **Mobile:** sidebar vira drawer e a busca vira botão de ícone; o conteúdo continua sendo a prioridade.

### Article Reading

- **Body:** `1rem`, entrelinha `1.72`, texto secundário e títulos em texto primário.
- **Links:** Laranja Guia, peso `500`, sublinhado com offset de `4px`.
- **Code / Tables / Figures:** superfícies e bordas do tema, cantos de `12px` e overflow controlado.

### Callouts, Steps and Editorial Panels

- **Callouts:** borda e fundo tonal derivados de informação, sucesso, aviso ou perigo; radius final de `8px`.
- **Steps:** marcador circular de `30px`, linha de continuidade e conteúdo sem card externo.
- **Editorial Panels:** bordas somente em cima e embaixo, fundo tonal e header compacto; evitam caixa elevada desnecessária.

### Pagination and Related Links

- **Pagination:** links de `72px`, borda forte, canto de `12px` e alinhamento direcional.
- **Related Links:** grid de duas colunas no desktop e uma no celular, com cards compactos de `8px`.

## Accessibility Guardrails

- Contraste de texto e controles deve permanecer compatível com WCAG AA quando aplicável; texto funcional usa `--text-primary`, `--text-secondary` ou outro token com contraste suficiente, não a cor de status indiscriminadamente.
- Controles compactos de ação, especialmente botões somente com ícone e acionadores de navegação, preservam alvo mínimo de `44px` quando essa regra faz parte do componente.
- Foco permanece visível, e interações essenciais funcionam por teclado com ordem coerente.
- Informação e estado não dependem somente de cor; texto, ícone, borda, fundo tonal ou outro sinal complementar preserva o significado.
- Overlays mantêm foco inicial apropriado, navegação modal, fechamento por `Escape` e retorno do foco ao acionador conforme Accessible Overlays.
- `prefers-reduced-motion` é respeitado, e movimento nunca é necessário para compreender conteúdo, ação ou estado.

## Do's and Don'ts

### Do:

- **Do** use os ativos oficiais em `public/brand/` e preserve sua relação entre laranja e neutros.
- **Do** use tokens semânticos para que temas claro e escuro mantenham os mesmos papéis.
- **Do** reserve o Laranja Guia para orientação, foco, links, estados atuais e ícones relevantes.
- **Do** mantenha bordas e variações tonais como estrutura principal das superfícies.
- **Do** preserve a coluna de leitura, o ritmo generoso e a adaptação progressiva dos breakpoints.
- **Do** mantenha estados de hover, foco, active e movimento reduzido claros e funcionais.

### Don't:

- **Don't** transforme a documentação em dashboard administrativo ou página promocional.
- **Don't** use verde ou cores funcionais como substitutas da identidade laranja.
- **Don't** aplique sombra persistente a cards, blocos de conteúdo ou superfícies comuns.
- **Don't** introduza decoração, gradientes, glassmorphism ou animação sem função de orientação.
- **Don't** copie marca, conteúdo, navegação ou CTAs das referências Mintlify/AbacatePay.
- **Don't** altere o significado factual da documentação durante melhorias visuais sem uma solicitação editorial explícita.

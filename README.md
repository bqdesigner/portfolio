### Portfolio desenvolvido totalmente com IA

Site vibecoded usando Claude Code + MCP do Figma, com foco em performance, acessibilidade e fidelidade pixel-perfect ao design.

**Acesse:** [brunoqueiros.com](https://brunoqueiros.com)

![Demo do portfolio](assets/portfolio-demo.webp)

---

#### Stack

- **Site principal:** HTML/CSS/JS vanilla — sem framework, sem bundler
- **Blog:** Next.js 16 + Notion como CMS (projeto separado em `/blog`, deployado via rewrite no Vercel)
- **Deploy:** Vercel (push em `main` = deploy automático)

#### Features

- Dark/Light mode com persistência via `localStorage`
- i18n PT/EN client-side (nav, footer e conteúdo de cases)
- Hero com fundo animado **ColorBends** (shader WebGL via three) e escala consistente em qualquer aspect
- **Scroll-motion do hero** na index — card encolhe de full-bleed até colapsar, com os cases subindo em sincronia (off em `prefers-reduced-motion`)
- Cases responsivos com carrossel lateral e cards parallax em `position: sticky`
- Typewriter animation com suporte a `prefers-reduced-motion`
- Header/footer em partials reutilizáveis (loader injeta via `fetch`)
- Toggle de controles (theme + lang) escondidos atrás de botão
- Página **Manda Freelas** — hero com cursor acenando, help/process sticky, serviços, pagamento, FAQ e form multi-step
- Blog integrado puxando posts do Notion, com tempo de leitura calculado
- Google Analytics em todas as páginas
- Imagens otimizadas em WebP

#### Workflow com IA

- **Vibecoding** end-to-end com Claude Code
- **MCP do Figma** pra traduzir design → código com fidelidade
- **Skills customizadas** garantindo performance, acessibilidade e pixel-perfect
- **CLAUDE.md** na raiz com guidelines de comportamento pro agente

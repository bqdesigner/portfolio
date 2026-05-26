// Manda Freelas — conteúdo estruturado, bilíngue.
// Consumido por manda-freelas.js (render) e lang-switcher (re-render on langchange).
window.MandaFreelas = {
  help: [
    {
      tag:   { pt: 'Descoberta', en: 'Discovery' },
      title: { pt: 'Você tem um problema, eu tenho método.', en: 'You have a problem, I have method.' },
      body:  { pt: 'Não entrego pixel, entrego solução. Cada projeto começa com escuta ativa — entender o negócio, o usuário e as restrições reais antes de abrir o Figma.', en: "I don't deliver pixels, I deliver solutions. Every project starts with active listening — understanding the business, the user and the real constraints before opening Figma." }
    },
    {
      tag:   { pt: 'Velocidade', en: 'Speed' },
      title: { pt: 'Da ideia ao protótipo em dias, não semanas.', en: 'From idea to prototype in days, not weeks.' },
      body:  { pt: 'Trabalho rápido sem abrir mão de qualidade. Ciclos curtos de validação para garantir que estamos construindo a coisa certa antes de escalar.', en: "I work fast without compromising quality. Short validation cycles to make sure we're building the right thing before scaling." }
    },
    {
      tag:   { pt: 'Execução', en: 'Execution' },
      title: { pt: 'Você recebe entregáveis que o time consegue usar.', en: 'You get deliverables the team can actually use.' },
      body:  { pt: 'Handoff limpo, specs documentadas, componentes organizados. O desenvolvedor não fica refém de perguntas no Slack — tudo está no arquivo.', en: "Clean handoff, documented specs, organized components. The developer isn't stuck asking questions on Slack — everything is in the file." }
    },
    {
      tag:   { pt: 'Visão', en: 'Vision' },
      title: { pt: 'Estratégia e craft no mesmo pacote.', en: 'Strategy and craft in the same package.' },
      body:  { pt: '12 anos transitando entre produto, dados e visual design. Posso tanto definir o que construir quanto garantir que fique impecável na entrega.', en: '12 years moving between product, data and visual design. I can both define what to build and make sure it looks impeccable at delivery.' }
    }
  ],

  services: [
    {
      id: 'Design',
      icon: '✦',
      color: '#1DA1F2',
      name: { pt: 'Design', en: 'Design' },
      desc: { pt: 'Do problema ao pixel — pesquisa, conceito e entrega visual de alta qualidade.', en: 'From problem to pixel — research, concept and high quality visual delivery.' },
      items: [
        { pt: 'Design de apps', en: 'App design' },
        { pt: 'Redesign de produtos digitais', en: 'Digital product redesign' },
        { pt: 'Design Systems', en: 'Design Systems' },
        { pt: 'Protótipos navegáveis', en: 'Interactive prototypes' },
        { pt: 'Telas prontas para dev', en: 'Dev-ready screens' },
        { pt: 'Relatório de usabilidade', en: 'Usability report' }
      ]
    },
    {
      id: 'Web',
      icon: '◈',
      color: '#6BA6FF',
      name: { pt: 'Web', en: 'Web' },
      desc: { pt: 'Design e código no mesmo par de mãos. Páginas rápidas, bem construídas e prontas para produção.', en: 'Design and code in the same pair of hands. Fast, well-built pages ready for production.' },
      items: [
        { pt: 'Landing Pages', en: 'Landing Pages' },
        { pt: 'Sites institucionais', en: 'Institutional websites' },
        { pt: 'Portfólios', en: 'Portfolios' },
        { pt: 'E-commerces', en: 'E-commerce' },
        { pt: 'Sites em React', en: 'React sites' }
      ]
    },
    {
      id: 'Produto',
      icon: '⬡',
      color: '#8DD5A6',
      name: { pt: 'Produto', en: 'Product' },
      desc: { pt: 'Visão de produto para times que precisam de mais do que um designer de telas.', en: 'Product vision for teams who need more than just a screen designer.' },
      items: [
        { pt: 'Diagnóstico de produto', en: 'Product diagnostic' },
        { pt: 'Roadmap de melhorias', en: 'Improvement roadmap' },
        { pt: 'Fluxos de onboarding', en: 'Onboarding flows' },
        { pt: 'Dashboard & dados', en: 'Dashboard & data' },
        { pt: 'Consultoria estratégica', en: 'Strategic consulting' }
      ]
    },
    {
      id: 'Mentoria',
      icon: '◎',
      color: '#C4A8FF',
      name: { pt: 'Mentoria', en: 'Mentoring' },
      desc: { pt: 'Ajudo designers a evoluírem mais rápido — com clareza, direção e sem enrolação.', en: 'I help designers level up faster — with clarity, direction and no fluff.' },
      items: [
        { pt: '1:1 de carreira', en: '1:1 career' },
        { pt: 'Revisão de portfólio', en: 'Portfolio review' },
        { pt: 'Feedback de projetos', en: 'Project feedback' },
        { pt: 'Transição para UX', en: 'Transition to UX' }
      ]
    }
  ],

  process: [
    { name: { pt: 'Kickoff',                en: 'Kickoff' },               dur: { pt: '1–2h',     en: '1–2h' },     desc: { pt: 'Reunião inicial para entender o desafio, o negócio, os usuários e as restrições. Alinhamos expectativas, escopo e entregáveis.', en: 'Initial meeting to understand the challenge, the business, the users and the constraints. We align expectations, scope and deliverables.' } },
    { name: { pt: 'Discovery',              en: 'Discovery' },             dur: { pt: '3–5 dias', en: '3–5 days' }, desc: { pt: 'Pesquisa, análise de dados e benchmarking. Identificamos oportunidades reais antes de partir para solução.', en: 'Research, data analysis and benchmarking. We identify real opportunities before jumping to solutions.' } },
    { name: { pt: 'Conceito',               en: 'Concept' },               dur: { pt: '3–7 dias', en: '3–7 days' }, desc: { pt: 'Exploração visual e de fluxo. Wireframes, moodboards e primeiras direções. Você vê e aprova antes de eu detalhar.', en: 'Visual and flow exploration. Wireframes, moodboards and first directions. You see and approve before I go into detail.' } },
    { name: { pt: 'Design & Prototipação',  en: 'Design & Prototyping' },  dur: { pt: '5–15 dias', en: '5–15 days' }, desc: { pt: 'Interface de alta fidelidade, componentes e protótipo navegável para validação com usuários ou stakeholders.', en: 'High-fidelity interface, components and clickable prototype for validation with users or stakeholders.' } },
    { name: { pt: 'Revisão',                en: 'Review' },                dur: { pt: '2–4 dias', en: '2–4 days' }, desc: { pt: 'Ciclo de feedback e ajustes. Incluímos rodadas de revisão no escopo — sem cobranças surpresa por pequenas mudanças.', en: 'Feedback and refinement cycle. Revision rounds are included in the scope — no surprise charges for small changes.' } },
    { name: { pt: 'Entrega & Handoff',      en: 'Delivery & Handoff' },    dur: { pt: '1–2 dias', en: '1–2 days' }, desc: { pt: 'Arquivo Figma organizado, specs documentadas, assets exportados e guia de uso. O time pode construir sem depender de mim.', en: 'Organized Figma file, documented specs, exported assets and usage guide. The team can build without depending on me.' } }
  ],

  payment: [
    {
      icon: '□',
      highlight: true,
      name: { pt: 'Por projeto', en: 'Per project' },
      desc: { pt: 'Escopo fechado, prazo definido, preço combinado. Ideal para landing pages, redesigns e entregas pontuais.', en: 'Fixed scope, defined deadline, agreed price. Ideal for landing pages, redesigns and one-off deliveries.' }
    },
    {
      icon: '◷',
      name: { pt: 'Por hora', en: 'Hourly' },
      desc: { pt: 'Pago pelo tempo efetivo dedicado. Ótimo para consultorias, revisões e projetos com escopo aberto.', en: 'Paid for actual time dedicated. Great for consulting, reviews and open-scope projects.' }
    },
    {
      icon: '↻',
      name: { pt: 'Retainer mensal', en: 'Monthly retainer' },
      desc: { pt: 'Horas mensais reservadas para o seu produto. Prioridade de agenda e desconto progressivo conforme o volume.', en: 'Monthly hours reserved for your product. Priority scheduling and progressive discount based on volume.' }
    }
  ],

  faq: [
    { q: { pt: 'Como funciona o processo de trabalho?', en: 'How does the work process work?' }, a: { pt: 'Começo com uma conversa de alinhamento para entender o problema, prazo e contexto. A partir daí, estruturo o escopo, apresento uma proposta e — após aprovação — inicio o projeto. Trabalho de forma iterativa, com entregas parciais para feedback contínuo.', en: 'I start with an alignment conversation to understand the problem, deadline and context. From there, I structure the scope, present a proposal and — after approval — start the project. I work iteratively, with partial deliveries for continuous feedback.' } },
    { q: { pt: 'Quanto tempo leva um projeto típico?', en: 'How long does a typical project take?' }, a: { pt: 'Depende do escopo. Uma landing page pode sair em 1–2 semanas. Um redesign de produto ou design system completo pode levar de 4 a 8 semanas. Estimo o prazo com precisão na proposta, após o alinhamento inicial.', en: 'It depends on scope. A landing page can be done in 1–2 weeks. A product redesign or complete design system can take 4 to 8 weeks. I estimate the timeline precisely in the proposal, after initial alignment.' } },
    { q: { pt: 'Você trabalha com contrato?', en: 'Do you work with contracts?' }, a: { pt: 'Sim, sempre. Todo projeto tem um contrato com escopo, prazo, forma de pagamento e políticas de revisão definidas. Isso protege ambos os lados e garante clareza desde o início.', en: 'Yes, always. Every project has a contract with defined scope, deadline, payment method and revision policies. This protects both sides and ensures clarity from the start.' } },
    { q: { pt: 'Quantas rodadas de revisão estão incluídas?', en: 'How many revision rounds are included?' }, a: { pt: 'Projetos fechados incluem 2 rodadas de revisão por entrega. Revisões adicionais são cobradas por hora. Para projetos por hora ou retainer, não há limite — você paga pelo tempo efetivo.', en: 'Fixed projects include 2 revision rounds per delivery. Additional revisions are charged hourly. For hourly or retainer projects, there is no limit — you pay for actual time spent.' } },
    { q: { pt: 'Você faz entrega de código ou só design?', en: 'Do you deliver code or just design?' }, a: { pt: 'Faço os dois. Para projetos de Web, entrego o design E o código (HTML/CSS/JS ou React), pronto para produção. Para projetos de produto e UX, entrego o design com handoff completo para o time de dev.', en: 'Both. For Web projects, I deliver design AND code (HTML/CSS/JS or React), production-ready. For product and UX projects, I deliver the design with full handoff to the dev team.' } },
    { q: { pt: 'Como funciona a mentoria?', en: 'How does mentoring work?' }, a: { pt: 'As sessões são 1:1, por videochamada, com duração de 1 hora. Você escolhe o tema, me manda material com antecedência se quiser, e a gente trabalha de forma direta — sem enrolação. O valor é R$ 150/hora, pago antes da sessão.', en: 'Sessions are 1:1, via video call, 1 hour long. You pick the topic, send material in advance if you want, and we work directly — no fluff. The price is R$ 150/hour, paid before the session.' } },
    { q: { pt: 'Você aceita projetos internacionais?', en: 'Do you accept international projects?' }, a: { pt: 'Sim. Atendo clientes remotamente e em inglês. Pagamentos internacionais via Wise ou transferência bancária. Os preços podem ser cotados em dólar ou euro, conforme o combinado.', en: 'Yes. I work with clients remotely and in English. International payments via Wise or bank transfer. Prices can be quoted in USD or EUR, as agreed.' } }
  ],

  form: {
    temas: [
      { value: 'Transição para UX',         label: { pt: 'Transição para UX',         en: 'Transition to UX' } },
      { value: 'Construção de portfólio',   label: { pt: 'Construção de portfólio',   en: 'Portfolio building' } },
      { value: 'Feedback de projetos',      label: { pt: 'Feedback de projetos',      en: 'Project feedback' } },
      { value: 'Carreira como freelancer',  label: { pt: 'Carreira como freelancer',  en: 'Freelance career' } },
      { value: 'Crescimento como designer', label: { pt: 'Crescimento como designer', en: 'Growth as a designer' } }
    ],
    placeholders: {
      outro: { pt: 'Outro (especifique)', en: 'Other (specify)' },
      desc:  { pt: 'Descreva brevemente o projeto — contexto, prazo, referências...', en: 'Briefly describe the project — context, deadline, references...' },
      datas: { pt: 'Ex: terças e quintas à tarde, semana do dia 12...', en: 'Ex: Tuesdays and Thursdays in the afternoon, week of the 12th...' }
    }
  }
};

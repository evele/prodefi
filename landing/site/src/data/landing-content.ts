export interface LandingNavLink {
  href: string
  label: string
}

export interface LandingPrizeCard {
  eyebrow: string
  title: string
  description: string
  note?: string
  href?: string
  cta?: string
}

export interface LandingStep {
  number: string
  title: string
  description: string
}

export interface LandingFaqItem {
  question: string
  answer: string
}

export interface LandingContent {
  locale: 'es' | 'en'
  page: {
    title: string
    description: string
    launchMessage: string
    targetDate: string
    targetDateLabel: string
    targetTimeLabel: string
  }
  header: {
    brandAriaLabel: string
    nav: LandingNavLink[]
    ctaLabel: string
  }
  hero: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    lead: string
    trust: string
    posterAlt: string
  }
  countdown: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    lead: string
    valueLabels: {
      days: string
      hours: string
      minutes: string
      seconds: string
    }
    ariaLabel: string
    metaStrip: string[]
  }
  prizes: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    lead: string
    prizeCards: LandingPrizeCard[]
    metaStrip: string[]
  }
  steps: LandingStep[]
  waitlist: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    lead: string
    emailLabel: string
    emailPlaceholder: string
    buttonLabel: string
    messages: {
      invalidEmail: string
      noEndpoint: string
      sending: string
      success: string
      rateLimited: string
      error: string
    }
  }
  faq: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    items: LandingFaqItem[]
  }
  footer: {
    sections: {
      navigation: {
        label: string
        links: LandingNavLink[]
      }
      status: {
        label: string
        lines: string[]
      }
    }
    meta: string[]
  }
}

export const landingContent: Record<'es' | 'en', LandingContent> = {
  es: {
    locale: 'es',
    page: {
      title: 'Prode Mundial 2026 | Predicciones y premios | ProDefi',
      description:
        'Jugá al Prode Mundial 2026 con predicciones, ranking verificable, reglas públicas y premios reales. Sumate a la lista de espera de ProDefi.',
      launchMessage: 'Dejá tu mail y te avisamos apenas abramos los cartones.',
      targetDate: '2026-06-11T16:00:00-03:00',
      targetDateLabel: '11 de junio de 2026',
      targetTimeLabel: '16:00 Buenos Aires',
    },
    header: {
      brandAriaLabel: 'ProDefi, inicio',
      nav: [
        { href: '#countdown', label: 'Mundial' },
        { href: '#premios', label: 'Premios' },
        { href: '#waitlist', label: 'Lista de espera' },
        { href: '#faq', label: 'FAQ' },
      ],
      ctaLabel: 'Sumarme',
    },
    hero: {
      eyebrow: 'Prode Mundial 2026 · Predicciones onchain',
      titlePrimary: 'Prode Mundial',
      titleEditorial: '2026',
      lead:
        'Jugá el <strong>Prode Mundial 2026</strong>: conseguí tu cartón, cargá predicciones de resultados y del top 4, y competí por <strong>premios reales</strong> en un ranking verificable.',
      trust: 'Prode mundial · Reglas públicas · Ranking verificable',
      posterAlt: 'Poster oficial del Mundial 2026',
    },
    countdown: {
      eyebrow: 'Cuenta regresiva',
      titlePrimary: 'Falta poco para',
      titleEditorial: 'la fiesta',
      lead:
        'El silbatazo inicial del Mundial 2026 está cada vez más cerca. Asegurá tu lugar en ProDefi antes de que arranque la pelota.',
      valueLabels: {
        days: 'Días',
        hours: 'Horas',
        minutes: 'Minutos',
        seconds: 'Segundos',
      },
      ariaLabel: 'Cuenta regresiva al Mundial 2026',
      metaStrip: ['● En vivo', 'La ansiedad también juega'],
    },
    prizes: {
      eyebrow: 'Premios',
      titlePrimary: 'Más acertás',
      titleEditorial: 'más te llevás',
      lead:
        'El pozo crece hasta que se cierran las inscripciones. Treinta y dos cobran. El resto mira desde abajo. ¿Te alcanza para entrar?',
      prizeCards: [
        {
          eyebrow: 'Pozo',
          title: 'Pozo en aumento',
          description: 'El 95% de lo recaudado por cartones integra el pozo premiable de esa edición.',
          note: 'El 5% restante cubre infraestructura, mantenimiento y subsidio de gas.',
        },
        {
          eyebrow: 'Puestos',
          title: '32 ganadores',
          description: 'Del 1° al 32°: campeón, segundo, tercero, cuarto, cuartos, octavos y dieciseisavos  .',
          note: '',
        },
        {
          eyebrow: 'Reglas',
          title: 'Reglas públicas',
          description:
            'La fórmula de puntaje, los premios y las reglas de empates quedan publicadas para que sepas a qué jugás.',
          note: '',
          href: '/reglas',
          cta: 'Ver reglas y criterios',
        },
      ],
      metaStrip: ['● Pozo único ', '● 32 premiados', '● Reglas públicas'],
    },
    steps: [
      {
        number: '01',
        title: 'Conseguí tu cartón',
        description: 'Tu entrada al ranking del Mundial. Un cartón, una chance real de pelear arriba.',
      },
      {
        number: '02',
        title: 'Hacé tus predicciones',
        description: 'Cargá resultados exactos y tu top 4 del torneo.',
      },
      {
        number: '03',
        title: 'Competí por premios',
        description: 'Cada acierto suma. Si hay empate en puntos, comparten posición y se divide el bloque de premios.',
      },
    ],
    waitlist: {
      eyebrow: 'Lista de espera',
      titlePrimary: 'Que no te lo',
      titleEditorial: 'cuente otro',
      lead: 'Dejanos tu mail y te avisamos apenas abramos los cartones. Prioridad de acceso, cero spam, cero vueltas.',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      buttonLabel: 'Sumarme',
      messages: {
        invalidEmail: 'Mirá, ese mail no anda. Probá de nuevo.',
        noEndpoint: 'La lista de espera abre pronto. Volvé en un rato para dejar tu mail.',
        sending: 'Enviando...',
        success: 'Estás adentro. Te avisamos apenas abramos los cartones.',
        rateLimited: 'Estamos recibiendo muchos intentos desde esa conexión. Esperá un poco y probá de nuevo.',
        error: 'No pudimos guardar tu mail. Probá de nuevo en un rato.',
      },
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      titlePrimary: '¿Tenés',
      titleEditorial: 'dudas',
      items: [
        {
          question: '¿Qué es ProDefi?',
          answer:
            'ProDefi es un Prode Mundial 2026 con reglas onchain. Conseguís tu cartón, cargás predicciones de resultados y competís contra otros hinchas en un único ranking global.',
        },
        {
          question: '¿Cómo funciona?',
          answer:
            'Entrás al Prode Mundial 2026 con tu cartón, cargás tus resultados exactos y tu top 4 antes del cierre, y seguís tu posición en el ranking a medida que se juegan los partidos.',
        },
        {
          question: '¿Necesito saber de crypto para jugar?',
          answer:
            'No hace falta ser experto. La experiencia está pensada para que la parte técnica no te frene. Como diría el Chiqui: "No trates de entenderla, disfrutala".',
        },
        {
          question: '¿Cómo participo?',
          answer: 'Sumate a la lista de espera y te avisamos cuando abramos el Prode Mundial 2026.',
        },
        {
          question: '¿Cómo se define el ranking?',
          answer:
            'El ranking se ordena por puntaje total. Si dos o más cartones empatan, comparten posición con lógica de competencia estándar: 1, 2, 2, 4.',
        },
        {
          question: '¿Qué puedo ganar?',
          answer:
            'Premios reales según tu posición final. Se cobran en USDC y alcanzan a los primeros 32 puestos con porcentajes fijos sobre el pozo premiable.',
        },
        {
          question: '¿Cuándo se lanza?',
          answer: 'Antes del silbatazo inicial del Mundial 2026. La fecha exacta la anunciamos por la lista de espera.',
        },
        {
          question: '¿Qué significa que sea onchain?',
          answer:
            'Que las reglas, los puntajes y los premios quedan verificables públicamente. No dependés de que alguien te diga que fue justo: podés comprobarlo y cobrar tu premio sin intermediarios.',
        },
      ],
    },
    footer: {
      sections: {
        navigation: {
          label: 'Navegación',
          links: [
            { href: '#waitlist', label: 'Lista de espera' },
            { href: '#faq', label: 'FAQ' },
            { href: '/reglas', label: 'Reglas' },
          ],
        },
        status: {
          label: 'Estado',
          lines: [
            'Waitlist abierta. Reglas y estructura de premios ya publicadas.',
            'Hecho en Argentina, con la pelota en los pies.',
          ],
        },
      },
      meta: ['ProDefi · Todos los partidos', 'Predicciones · Mundial 2026'],
    },
  },
  en: {
    locale: 'en',
    page: {
      title: 'World Cup Predictions 2026 | Prizes and Rules | ProDefi',
      description:
        'Join ProDefi for World Cup Predictions 2026. Submit exact scorelines and your final four, climb the leaderboard and compete for real prizes.',
      launchMessage: 'Leave your email and we will let you know as soon as entries open.',
      targetDate: '2026-06-11T16:00:00-03:00',
      targetDateLabel: '11 Jun 2026',
      targetTimeLabel: '4:00 PM ART',
    },
    header: {
      brandAriaLabel: 'ProDefi, home',
      nav: [
        { href: '#countdown', label: 'Countdown' },
        { href: '#premios', label: 'Prizes' },
        { href: '#waitlist', label: 'Waitlist' },
        { href: '#faq', label: 'FAQ' },
      ],
      ctaLabel: 'Join Waitlist',
    },
    hero: {
      eyebrow: 'World Cup Predictions 2026 · Onchain',
      titlePrimary: 'World Cup 2026',
      titleEditorial: 'Predictions',
      lead:
        'Join <strong>World Cup Predictions 2026</strong> on ProDefi: get your entry, submit exact scorelines and your final four, and compete for <strong>real prizes</strong> on a verifiable leaderboard.',
      trust: 'Public rules · Verifiable leaderboard · Real prizes',
      posterAlt: 'Official 2026 World Cup poster',
    },
    countdown: {
      eyebrow: 'Countdown',
      titlePrimary: 'Not long until',
      titleEditorial: 'kick-off',
      lead:
        'The opening whistle of the 2026 World Cup is getting closer. Secure your spot in ProDefi before the tournament gets underway.',
      valueLabels: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
      },
      ariaLabel: 'Countdown to the 2026 World Cup',
      metaStrip: ['● Live', 'Nerves are part of the game'],
    },
    prizes: {
      eyebrow: 'Prizes',
      titlePrimary: 'The more you hit,',
      titleEditorial: 'the more you win',
      lead:
        'The pool keeps growing until registration closes. Thirty-two players get paid. Everyone else finishes below the line. Are you good enough to make it in?',
      prizeCards: [
        {
          eyebrow: 'Pool',
          title: 'Growing pool',
          description: '95% of all entry sales goes into that edition\'s prize pool.',
          note: 'The remaining 5% covers infrastructure, maintenance and gas subsidy.',
        },
        {
          eyebrow: 'Places',
          title: '32 winners',
          description: 'Places 1 through 32 get paid: champion, runner-up, third, fourth, quarter-finals, round of 16 and min-cash.',
          note: '',
        },
        {
          eyebrow: 'Rules',
          title: 'Public rules',
          description: 'The scoring formula, payout structure and tie rules are published before you play.',
          note: '',
          href: '/en/rules',
          cta: 'View rules and payouts',
        },
      ],
      metaStrip: ['● One prize pool', '● 32 paid places', '● Public rules'],
    },
    steps: [
      {
        number: '01',
        title: 'Get your entry',
        description: 'Your way into the World Cup leaderboard. One entry, one real shot at finishing high.',
      },
      {
        number: '02',
        title: 'Make your picks',
        description: 'Submit exact scorelines and your tournament top four.',
      },
      {
        number: '03',
        title: 'Compete for prizes',
        description: 'Every hit counts. If entries tie on points, they share the position and split the affected prize block.',
      },
    ],
    waitlist: {
      eyebrow: 'Waitlist',
      titlePrimary: 'Be there from',
      titleEditorial: 'day one',
      lead: 'Leave us your email and we will let you know as soon as entries open. Priority access, zero spam, zero nonsense.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      buttonLabel: 'Join',
      messages: {
        invalidEmail: 'That email does not look right. Try again.',
        noEndpoint: 'The waitlist will open soon. Check back in a bit to leave your email.',
        sending: 'Sending...',
        success: 'You are in. We will let you know as soon as entries open.',
        rateLimited: 'Too many attempts are coming from this connection. Wait a bit and try again.',
        error: 'We could not save your email. Please try again in a bit.',
      },
    },
    faq: {
      eyebrow: 'FAQ',
      titlePrimary: 'Got',
      titleEditorial: 'questions',
      items: [
        {
          question: 'What is ProDefi?',
          answer:
            'ProDefi is a World Cup Predictions 2026 game with onchain rules. You get an entry, submit score predictions and compete against other fans on one global leaderboard.',
        },
        {
          question: 'How does it work?',
          answer:
            'You enter World Cup Predictions 2026 with your entry, submit your exact scorelines and final four before the deadline, and track your position on the leaderboard as matches are played.',
        },
        {
          question: 'Do I need crypto experience to play?',
          answer:
            'No. The experience is designed so the technical side does not get in the way. As Chiqui would say: "No trates de entenderla, disfrutala".',
        },
        {
          question: 'How do I join?',
          answer: 'Join the waitlist and we will let you know when World Cup Predictions 2026 opens.',
        },
        {
          question: 'How is the leaderboard ranked?',
          answer:
            'The leaderboard is ordered by total points. If two or more entries tie, they share the position using standard competition ranking: 1, 2, 2, 4.',
        },
        {
          question: 'What can I win?',
          answer:
            'Real prizes based on your final position. They are paid in USDC across the top 32 places using a fixed payout on the final pool.',
        },
        {
          question: 'When does it launch?',
          answer: 'Before the opening whistle of the 2026 World Cup. We will announce the exact launch date through the waitlist.',
        },
        {
          question: 'What does onchain mean?',
          answer:
            'It means the rules, scoring and prizes are publicly verifiable. You do not have to take anyone\'s word for it: you can check it yourself and collect your prize without intermediaries.',
        },
      ],
    },
    footer: {
      sections: {
        navigation: {
          label: 'Navigation',
          links: [
            { href: '#waitlist', label: 'Waitlist' },
            { href: '#faq', label: 'FAQ' },
            { href: '/en/rules', label: 'Rules' },
          ],
        },
        status: {
          label: 'Status',
          lines: ['Waitlist is open. Rules and prize structure are already published.', 'Built in Argentina, with the ball at our feet.'],
        },
      },
      meta: ['ProDefi · Every match counts', 'Predictions · World Cup 2026'],
    },
  },
}

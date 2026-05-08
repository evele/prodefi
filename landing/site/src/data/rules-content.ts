export interface RulesContent {
  locale: 'es' | 'en'
  page: {
    title: string
    description: string
  }
  header: {
    brandAriaLabel: string
    nav: Array<{ href: string; label: string }>
    ctaLabel: string
  }
  hero: {
    eyebrow: string
    titlePrimary: string
    titleEditorial: string
    lead: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
  }
  sections: {
    participation: {
      eyebrow: string
      title: string
      items: string[]
    }
    matchScoring: {
      eyebrow: string
      title: string
      intro: string
      formula: string
      formulaDescription: string
      rows: Array<[string, string]>
    }
    examples: {
      eyebrow: string
      title: string
      rows: Array<[string, string]>
      note: string
    }
    winners: {
      eyebrow: string
      title: string
      rows: Array<[string, string]>
      items: string[]
    }
    ranking: {
      eyebrow: string
      title: string
      items: string[]
    }
    ties: {
      eyebrow: string
      title: string
      items: string[]
    }
    prizes: {
      eyebrow: string
      title: string
      items: string[]
      payoutRows: Array<[string, string]>
    }
    transparency: {
      eyebrow: string
      title: string
      items: string[]
    }
  }
  quickSummary: {
    eyebrow: string
    body: string
  }
  footer: {
    sections: {
      navigation: {
        label: string
        links: Array<{ href: string; label: string }>
      }
      community: {
        label: string
        emptyText: string
      }
      status: {
        label: string
        lines: string[]
      }
    }
  }
}

export const rulesContent: Record<'es' | 'en', RulesContent> = {
  es: {
    locale: 'es',
    page: {
      title: 'Reglas del Prode Mundial 2026 | Puntaje, ranking y premios | ProDefi',
      description: 'Consultá las reglas del Prode Mundial 2026: puntaje por partido, ranking, empates, pozo y premios de ProDefi.',
    },
    header: {
      brandAriaLabel: 'ProDefi, inicio',
      nav: [
        { href: '/', label: 'Inicio' },
        { href: '/#premios', label: 'Premios' },
        { href: '/#waitlist', label: 'Lista de espera' },
      ],
      ctaLabel: 'Sumarme',
    },
    hero: {
      eyebrow: 'Reglas del Prode Mundial 2026',
      titlePrimary: 'Reglas del Prode',
      titleEditorial: 'Mundial 2026',
      lead:
        'Esta página concentra las reglas del Prode Mundial 2026: puntaje por partido, ranking, empates, premios y condiciones con las que se publica el ranking final de ProDefi. Cuando una edición esté abierta, esta misma página mostrará además su fecha límite, pozo final y distribución de premios en USDC.',
      primaryCtaLabel: 'Sumarme a la lista de espera',
      secondaryCtaLabel: 'Volver a la landing',
    },
    sections: {
      participation: {
        eyebrow: 'Participación',
        title: 'Cómo participa un cartón',
        items: [
          'Cada cartón confirmado cuenta como una inscripción independiente dentro del ranking.',
          'Las ventas se mantienen abiertas hasta el cierre definido para la copa.',
          'Las predicciones se pueden enviar hasta la fecha límite de la edición.',
          'Una vez enviada una predicción, ya no se puede editar.',
        ],
      },
      matchScoring: {
        eyebrow: 'Puntaje por partido',
        title: 'Cercanía al resultado exacto',
        intro: 'Cada partido se puntúa con esta fórmula:',
        formula: 'max(0, 7 - error total de goles) + 3 si acertás local / empate / visitante',
        formulaDescription:
          'Donde el error total de goles es la suma de la diferencia absoluta entre tu marcador y el marcador oficial de cada equipo.',
        rows: [
          ['Base por partido', '7 puntos'],
          ['Bonus por acertar local / empate / visitante', '+3 puntos'],
          ['Puntaje mínimo por partido', '0 puntos'],
          ['Puntaje máximo por partido', '10 puntos'],
        ],
      },
      examples: {
        eyebrow: 'Ejemplos',
        title: 'Qué puntúa cada caso',
        rows: [
          ['Oficial 2-1, tu predicción 2-1', '10 puntos'],
          ['Oficial 5-5, tu predicción 6-5', '6 puntos'],
          ['Oficial 6-5, tu predicción 1-0', '3 puntos'],
          ['Oficial 5-5, tu predicción 0-1', '0 puntos'],
        ],
        note:
          'Los errores grandes no generan puntajes negativos: a partir de cierto desvío, el piso es 0 y sólo puede sobrevivir el bonus de resultado si acertaste local, empate o visitante.',
      },
      winners: {
        eyebrow: 'Ganadores',
        title: 'Top 4 del mundial',
        rows: [
          ['Campeón', '25 puntos'],
          ['Subcampeón', '18 puntos'],
          ['Tercer puesto', '10 puntos'],
          ['Cuarto puesto', '10 puntos'],
        ],
        items: [],
      },
      ranking: {
        eyebrow: 'Ranking',
        title: 'Cómo se arma la tabla',
        items: [
          'El puntaje total de cada cartón es la suma de partidos resueltos más puntos de ganadores.',
          'Mientras el torneo está en curso puede existir un ranking provisorio.',
          'El ranking final se publica cuando ya están cargados todos los resultados oficiales, los 4 ganadores oficiales y las posiciones finales.',
          'El ranking final es la referencia para premios y cobros.',
        ],
      },
      ties: {
        eyebrow: 'Empates',
        title: 'Qué pasa si igualan en puntos',
        items: [
          'La tabla se ordena por puntaje total acumulado del cartón.',
          'Si dos o más cartones empatan en puntos, comparten posición final con ranking estándar de competencia: por ejemplo, `1, 2, 2, 4`.',
          'No existe un criterio adicional de desempate por cantidad de exactos ni por ningún otro dato secundario.',
          'Si ese empate ocupa varias posiciones premiadas, se suman los premios de todos esos puestos y se reparten en partes iguales entre los empatados.',
        ],
      },
      prizes: {
        eyebrow: 'Premios',
        title: 'Pozo, reparto y cobros',
        items: [
          'El 95% de lo recaudado por cartones integra el pozo de esa edición.',
          'El 5% restante queda fuera del pozo para infraestructura y mantenimiento.',
          'Los primeros 32 puestos del ranking final son premiados.',
          'La cantidad de premiados no cambia con el tamaño del field: cambian los montos según el pozo final.',
          'Los premios se liquidan en USDC.',
          'Si hay empate definitivo en puestos premiados, se suman los premios de los puestos alcanzados por ese empate y se reparten por partes iguales.',
          'Los cobros se habilitan recién cuando el torneo queda finalizado y el ranking final ya es definitivo.',
        ],
        payoutRows: [
          ['1° puesto', '22% del pozo'],
          ['2° puesto', '14% del pozo'],
          ['3° puesto', '9% del pozo'],
          ['4° puesto', '7% del pozo'],
          ['5° al 8°', '4% cada uno'],
          ['9° al 16°', '2% cada uno'],
          ['17° al 32°', '1% cada uno'],
        ],
      },
      transparency: {
        eyebrow: 'Transparencia',
        title: 'Qué queda público',
        items: [
          'Los resultados oficiales cargados, los ganadores oficiales y el ranking final quedan verificables públicamente.',
          'Si hubiera cambios antes del arranque de una edición, se reflejan en esta misma página.',
          'Una vez iniciado el torneo, la versión de reglas de esa edición queda cerrada.',
        ],
      },
    },
    quickSummary: {
      eyebrow: 'Resumen rápido',
      body:
        'Por partido el rango va de 0 a 10. Nunca restás puntos por errarle muy lejos. El campeón vale 25, el subcampeón 18 y el tercer y cuarto puesto valen 10 cada uno. Si no enviás la predicción de ganadores, esa parte suma 0. El 95% de lo recaudado integra el pozo de esa edición y el 5% restante cubre infraestructura y mantenimiento. Los primeros 32 puestos cobran un porcentajes fijos del pozo. Si hay empate en puntos, comparten posición con lógica `1, 2, 2, 4` y reparten en partes iguales los premios de los puestos que ocuparon.',
    },
    footer: {
      sections: {
        navigation: {
          label: 'Navegación',
          links: [
            { href: '/', label: 'Inicio' },
            { href: '/#waitlist', label: 'Lista de espera' },
            { href: '/reglas', label: 'Reglas' },
          ],
        },
        community: {
          label: 'Comunidad',
          emptyText: 'Canales oficiales en camino.',
        },
        status: {
          label: 'Estado',
          lines: ['Waitlist abierta. Reglas y estructura de premios ya publicadas','Hecho en Argentina, con la pelota en los pies.'],
        },
      },
    },
  },
  en: {
    locale: 'en',
    page: {
      title: 'World Cup 2026 Rules | Scoring, leaderboard and prizes | ProDefi',
      description: 'Read the World Cup Predictions 2026 rules: match scoring, leaderboard ties, prize pool and payouts on ProDefi.',
    },
    header: {
      brandAriaLabel: 'ProDefi, home',
      nav: [
        { href: '/en/', label: 'Home' },
        { href: '/en/#premios', label: 'Prizes' },
        { href: '/en/#waitlist', label: 'Waitlist' },
      ],
      ctaLabel: 'Join Waitlist',
    },
    hero: {
      eyebrow: 'World Cup 2026 Rules',
      titlePrimary: 'Rules for the',
      titleEditorial: '2026 World Cup',
      lead:
        'This page gathers the rules for World Cup Predictions 2026: match scoring, leaderboard, ties, prizes and the conditions used to publish ProDefi\'s final standings. Once an edition is open, this page will also show its submission deadline, final pool and USDC prize amounts.',
      primaryCtaLabel: 'Join the waitlist',
      secondaryCtaLabel: 'Back to landing',
    },
    sections: {
      participation: {
        eyebrow: 'Participation',
        title: 'How an entry gets in',
        items: [
          'Each confirmed entry counts as one independent position in the leaderboard.',
          'Sales stay open until the deadline set for the world cup.',
          'Predictions can be submitted until the edition deadline.',
          'Once an onchain prediction is submitted, that prediction can no longer be edited.',
        ],
      },
      matchScoring: {
        eyebrow: 'Match scoring',
        title: 'How close you get to the exact score',
        intro: 'Each match is scored using this formula:',
        formula: 'max(0, 7 - total goal error) + 3 if you call home / draw / away correctly',
        formulaDescription:
          'Here, total goal error is the sum of the absolute difference between your scoreline and the official score for each team.',
        rows: [
          ['Base points per match', '7 points'],
          ['Bonus for calling home / draw / away', '+3 points'],
          ['Minimum match score', '0 points'],
          ['Maximum match score', '10 points'],
        ],
      },
      examples: {
        eyebrow: 'Examples',
        title: 'What each case scores',
        rows: [
          ['Official 2-1, your prediction 2-1', '10 points'],
          ['Official 5-5, your prediction 6-5', '6 points'],
          ['Official 6-5, your prediction 1-0', '3 points'],
          ['Official 5-5, your prediction 0-1', '0 points'],
        ],
        note:
          'Large misses never create negative points. Beyond a certain error range, the floor is 0 and only the outcome bonus can survive if you still called home, draw or away correctly.',
      },
      winners: {
        eyebrow: 'Winners',
        title: 'Wordlcup winners',
        rows: [
          ['Champion', '25 points'],
          ['Runner-up', '18 points'],
          ['Third place', '10 points'],
          ['Fourth place', '10 points'],
        ],
        items: [''],
      },
      ranking: {
        eyebrow: 'Leaderboard',
        title: 'How the table is built',
        items: [
          'Each entry\'s total score is the sum of resolved match points plus winner-pick points.',
          'A provisional leaderboard may exist while the tournament is still being played.',
          'The final leaderboard is published once all official match results, the official top four and final placings are loaded.',
          'The final leaderboard is the reference for prizes and payouts.',
        ],
      },
      ties: {
        eyebrow: 'Ties',
        title: 'What happens when points are level',
        items: [
          'The table is ordered by total points only.',
          'If two or more entries tie on points, they share the position using standard competition ranking, for example `1, 2, 2, 4`.',
          'There is no secondary tie-break based on exact scores or any other metric.',
          'If that tie occupies prize positions, all affected prizes are added together and split equally among the tied entries.',
        ],
      },
      prizes: {
        eyebrow: 'Prizes',
        title: 'Pool, payouts and claiming',
        items: [
          '95% of all entry revenue goes into that edition\'s prize pool.',
          'The remaining 5% stays outside the pool to cover infrastructure and maintenance.',
          'The first 32 places on the final leaderboard are paid.',
          'The number of paid places does not scale with field size: only the prize amounts grow with the final pool.',
          'Prizes are paid in USDC.',
          'If a final tie covers paid places, the occupied prizes are added together and split equally.',
          'Prize claiming only opens once the tournament is fully finalized and the leaderboard is final.',
        ],
        payoutRows: [
          ['1st place', '22% of the pool'],
          ['2nd place', '14% of the pool'],
          ['3rd place', '9% of the pool'],
          ['4th place', '7% of the pool'],
          ['5th to 8th', '4% each'],
          ['9th to 16th', '2% each'],
          ['17th to 32nd', '1% each'],
        ],
      },
      transparency: {
        eyebrow: 'Transparency',
        title: 'What stays public',
        items: [
          'Official results, official winners and the final leaderboard remain publicly verifiable.',
          'If anything changes before an edition starts, it will be reflected on this same page.',
          'Once the tournament begins, that edition\'s rule set is locked.',
        ],
      },
    },
    quickSummary: {
      eyebrow: 'Quick summary',
      body:
        'Match scoring ranges from 0 to 10. You never lose points for a bad miss. The champion is worth 25, the runner-up 18, and third and fourth are worth 10 each. If you do not submit winner picks, that section scores 0. 95% of revenue goes into the edition pool and the remaining 5% covers infrastructure and maintenance. The top 32 places get paid through a fixed percentual payout scheme. If entries tie on points, they share the position using `1, 2, 2, 4` logic and split the affected prize block equally.',
    },
    footer: {
      sections: {
        navigation: {
          label: 'Navigation',
          links: [
            { href: '/en/', label: 'Home' },
            { href: '/en/#waitlist', label: 'Waitlist' },
            { href: '/en/rules', label: 'Rules' },
          ],
        },
        community: {
          label: 'Community',
          emptyText: 'Official channels coming soon.',
        },
        status: {
          label: 'Status',
          lines: ['Waitlist is open. Rules and prize structure are already published.', 'Built in Argentina, with the ball at our feet.'],
        },
      },
    },
  },
}

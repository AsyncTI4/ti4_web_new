import {
  WebActivityHistory,
} from "./types";

export const mockActivityHistoryData: WebActivityHistory = {
  activities: [
    /* ============================================================
     * TACTICAL ACTION
     * ============================================================ */
    {
      gameStateId: 'GAME-001',
      activitySummaryType: 'ACTION',
      activityStatus: 'COMPLETE',
      timestamp: '2026-01-16T18:42:11Z',
      actionType: 'TACTICAL',
      actionedBy: 'Hacan',
      activeSystemId: 'SYS-03',
      summaryDetails: {
        explores: ['Hazardous Exploration'],
        spaceCombatUnits: ['Cruiser', 'Destroyer'],
        groundCombatUnits: {
          MecatolRex: ['Infantry', 'Infantry', 'Mech'],
        },
        planetsGained: ['Mecatol Rex'],
        producedUnits: ['Carrier', 'Infantry'],
        scoredSOIds: {
          Hacan: ['SO-04'],
        },
        transactions: [
          {
            transactor: {
              player: 'Hacan',
              tradeGoods: 3,
            },
            transactee: {
              player: 'Jol-Nar',
              commodities: 2,
            },
          },
        ],
      },
    },

    /* ============================================================
     * STRATEGY ACTION
     * ============================================================ */
    {
      gameStateId: 'GAME-001',
      activitySummaryType: 'ACTION',
      activityStatus: 'COMPLETE',
      timestamp: '2026-01-16T18:55:42Z',
      actionType: 'STRATEGY',
      actionedBy: 'Sol',
      strategyCardId: 5, // Trade
      summaryDetails: {
        secondaryUsers: ['Hacan', 'Naalu'],
        transactions: [
          {
            transactor: {
              player: 'Sol',
              tradeGoods: 2,
            },
            transactee: {
              player: 'Hacan',
              commodities: 2,
            },
          },
        ],
      },
    },

    /* ============================================================
     * COMPONENT ACTION
     * ============================================================ */
    {
      gameStateId: 'GAME-001',
      activitySummaryType: 'ACTION',
      activityStatus: 'COMPLETE',
      timestamp: '2026-01-16T19:03:10Z',
      actionType: 'COMPONENT',
      actionedBy: 'Naalu',
      componentId: 'AC-12', // Action Card ID
      summaryDetails: {
        actionCardsUsed: ['Skilled Retreat'],
      },
    },

    /* ============================================================
     * AGENDA
     * ============================================================ */
    {
      gameStateId: 'GAME-001',
      activitySummaryType: 'AGENDA',
      activityStatus: 'IN-PROGRESS',
      timestamp: '2026-01-16T19:21:37Z',
      agendaId: 'AGENDA-07',
      summaryDetails: {
        agendaOutcome: 'For',
        votes: [
          'Sol: 4',
          'Hacan: 3',
          'Naalu: 2',
          'Jol-Nar: 1',
        ],
        transactions: [
          {
            transactor: {
              player: 'Hacan',
              tradeGoods: 2,
            },
            transactee: {
              player: 'Naalu',
              promissories: ['Trade Agreement'],
            },
          },
        ],
      },
    },
  ],
};

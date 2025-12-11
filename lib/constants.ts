export const TICKERS = ['YM', 'NQ', 'GC', 'MYM', 'MNQ', 'MGC'] as const;

export const CONTRACT_MULTIPLIERS: Record<string, number> = {
    'YM': 5,
    'NQ': 20,
    'GC': 100,
    'MYM': 0.5,
    'MNQ': 2,
    'MGC': 10
};

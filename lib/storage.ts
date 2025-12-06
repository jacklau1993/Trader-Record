"use client";

// Types
export interface Tag {
    id: string;
    name: string;
    color?: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    tags: Tag[];
}

export interface Template {
    id: string;
    name: string;
    content: string;
}

export interface Trade {
    id: string;
    date: string;
    ticker: string;
    type: "Long" | "Short";
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    tags: string[]; // Tag IDs
    notes: string;

    // New Fields
    contracts?: number;
    points?: number;
    ticks?: number;
    rating?: number; // 1-5 or 1-10
    profitTarget?: number;
    stopLoss?: number;
    plannedRR?: number;
    realizedRR?: number;
}

export interface Note {
    id: string;
    sectionId: string;
    title: string;
    date: string;
    content: string;
    tags: string[]; // Tag strings or IDs
}

export interface Section {
    id: string;
    name: string;
}

// Initial Data
const INITIAL_CATEGORIES: Category[] = [
    {
        id: "cat_mistakes",
        name: "Mistakes",
        color: "red",
        tags: [
            { id: "tag_fomo", name: "FOMO", color: "text-red-500 bg-red-500/10" },
            { id: "tag_revenge", name: "Revenge", color: "text-red-500 bg-red-500/10" },
        ]
    },
    {
        id: "cat_strategies",
        name: "Strategies",
        color: "blue",
        tags: [
            { id: "tag_breakout", name: "Breakout", color: "text-blue-500 bg-blue-500/10" },
            { id: "tag_reversal", name: "Reversal", color: "text-blue-500 bg-blue-500/10" },
        ]
    },
    {
        id: "cat_timeframe",
        name: "Time Frame",
        color: "yellow",
        tags: [
            { id: "tag_1m", name: "1 Minute", color: "text-yellow-500 bg-yellow-500/10" },
        ]
    }
];

const INITIAL_TEMPLATES: Template[] = [
    {
        id: "t1",
        name: "Daily Plan",
        content: "\n# Daily Plan\n- [ ] Review Overnight Action\n- [ ] Check Economic Calendar\n- [ ] Key Levels to Watch:\n  - ES: \n  - NQ: \n"
    },
    {
        id: "t2",
        name: "Trade Review",
        content: "\n# Trade Review\n- Setup:\n- Execution:\n- Psychology:\n- Outcome:\n- Improvements:\n"
    },
    {
        id: "t3",
        name: "Weekly Review",
        content: "\n# Weekly Review\n- P&L: \n- Best Trade:\n- Worst Trade:\n- Lessons Learned:\n"
    }
];

const INITIAL_SECTIONS: Section[] = [
    { id: "s1", name: "Trade Notes" },
    { id: "s2", name: "Daily Journal" },
    { id: "s3", name: "Strategy" },
    { id: "s4", name: "Backtesting" },
];

// Helper Functions
const STORAGE_KEYS = {
    TRADES: "trading_journal_trades",
    CATEGORIES: "trading_journal_categories",
    NOTES: "trading_journal_notes",
    SECTIONS: "trading_journal_sections",
    TEMPLATES: "trading_journal_templates",
};

// --- TRADES ---
export const getTrades = (): Trade[] => {
    if (typeof window === "undefined") return [];
    const start = localStorage.getItem(STORAGE_KEYS.TRADES);
    return start ? JSON.parse(start) : [];
};

export const saveTrade = (trade: Trade) => {
    const trades = getTrades();
    const index = trades.findIndex(t => t.id === trade.id);
    let newTrades;
    if (index >= 0) {
        newTrades = [...trades];
        newTrades[index] = trade;
    } else {
        newTrades = [trade, ...trades];
    }
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(newTrades));
    return newTrades;
};

// --- CATEGORIES ---
export const getCategories = (): Category[] => {
    if (typeof window === "undefined") return INITIAL_CATEGORIES;
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
    }
    return JSON.parse(stored);
};

export const saveCategories = (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// --- NOTES ---
export const getSections = (): Section[] => {
    if (typeof window === "undefined") return INITIAL_SECTIONS;
    const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_SECTIONS));
        return INITIAL_SECTIONS;
    }
    return JSON.parse(stored);
}

export const getNotes = (): Note[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : [];
}

export const saveNote = (note: Note) => {
    const notes = getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    let newNotes;
    if (index >= 0) {
        newNotes = [...notes];
        newNotes[index] = note;
    } else {
        newNotes = [note, ...notes];
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(newNotes));
    return newNotes;
}

export const deleteNote = (noteId: string) => {
    const notes = getNotes();
    const newNotes = notes.filter(n => n.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(newNotes));
    return newNotes;
}

// --- TEMPLATES ---
export const getTemplates = (): Template[] => {
    if (typeof window === "undefined") return INITIAL_TEMPLATES;
    const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
        return INITIAL_TEMPLATES;
    }
    return JSON.parse(stored);
}

export const saveTemplates = (templates: Template[]) => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

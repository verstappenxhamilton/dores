import type { PainEntry } from '../types/pain';

const STORAGE_KEY = 'pain_tracker_data';

// Função de migração para garantir que todos os timestamps sejam números
export const migratePainEntries = (): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const parsed = JSON.parse(data) as Array<Record<string, unknown>>;
    let changed = false;
    const migrated = parsed.map((entry) => {
        let timestamp: number;
        if (typeof entry.timestamp === 'number') {
            timestamp = entry.timestamp;
        } else {
            timestamp = new Date(entry.timestamp as string | number).getTime();
            changed = true;
        }
        return { ...(entry as unknown as PainEntry), timestamp } as PainEntry;
    });
    if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
};

export const saveEntry = (entry: PainEntry): void => {
    migratePainEntries();
    const data = getEntries();
    data.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getEntries = (): PainEntry[] => {
    migratePainEntries();
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return (JSON.parse(data) as Array<Record<string, unknown>>).map((entry) => ({
        ...(entry as unknown as PainEntry),
        timestamp: typeof entry.timestamp === 'number'
            ? entry.timestamp
            : new Date(entry.timestamp as string | number).getTime()
    }));
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const removeEntry = (id: string): void => {
    migratePainEntries();
    const data = getEntries().filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportEntries = (): string => {
    migratePainEntries();
    return JSON.stringify(getEntries(), null, 2);
};

export const importEntries = (json: string): void => {
    const parsed = JSON.parse(json) as Array<Record<string, unknown>>;
    const entries: PainEntry[] = parsed.map(entry => ({
        ...(entry as unknown as PainEntry),
        timestamp: typeof entry.timestamp === 'number'
            ? entry.timestamp
            : new Date(entry.timestamp as string | number).getTime()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

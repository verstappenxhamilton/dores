import type { PainEntry } from '../types/pain';

const STORAGE_KEY = 'pain_tracker_data';

// Função de migração para garantir que todos os timestamps sejam Date
export const migratePainEntries = (): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const parsed: PainEntry[] = JSON.parse(data);
    let changed = false;
    const migrated = parsed.map((entry) => {
        if (typeof entry.timestamp === 'string' || typeof entry.timestamp === 'number') {
            changed = true;
            return { ...entry, timestamp: new Date(entry.timestamp) };
        }
        return entry;
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
    return (JSON.parse(data) as PainEntry[]).map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
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

export const updateEntry = (id: string, updates: Partial<PainEntry>): void => {
    migratePainEntries();
    const data = getEntries();
    const index = data.findIndex(entry => entry.id === id);
    if (index === -1) return;
    data[index] = { ...data[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

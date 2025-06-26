export interface PainEntry {
    id: string;
    // Unix timestamp in milliseconds
    timestamp: number;
    intensity: number;
    location: string;
    comment?: string;
}

export type PainData = PainEntry[];

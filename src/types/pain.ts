export interface PainEntry {
    id: string;
    timestamp: Date;
    intensity: number;
    location: string;
    comment?: string;
}

export type PainData = PainEntry[];

export interface Game { id: number; title: string; genre: string; platform: string; release_year: number; created_at: string; }
export type NewGame = Omit<Game, 'id' | 'created_at'>;

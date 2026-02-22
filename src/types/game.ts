export type NoteType = 'sangmo' | 'kkwaenggwari' | 'stomp';

export type GamePhase = 'ready' | 'countdown' | 'playing' | 'result';

export type JudgmentType = 'perfect' | 'great' | 'good' | 'miss' | null;

export type CharacterAction = 'idle' | 'sangmo' | 'kkwaenggwari' | 'stomp';

export interface Note {
  id: number;
  type: NoteType;
  createdAt: number;
  hit: boolean;
  hitJudgment?: JudgmentType;
  hitTime?: number;
}

export interface GameStats {
  score: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  combo: number;
  maxCombo: number;
}

export const INITIAL_STATS: GameStats = {
  score: 0,
  perfect: 0,
  great: 0,
  good: 0,
  miss: 0,
  combo: 0,
  maxCombo: 0,
};

export const GAME_CONSTANTS = {
  GAME_DURATION: 60,
  NOTE_FALL_DURATION: 2500,
  NOTE_SPAWN_INTERVAL: 900,
  HIT_LINE_RATIO: 0.58,
  HIT_WINDOW: {
    PERFECT: 80,
    GREAT: 150,
    GOOD: 250,
  },
  SCORE: {
    PERFECT: 100,
    GREAT: 75,
    GOOD: 50,
    MISS: 0,
  },
};

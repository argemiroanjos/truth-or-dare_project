export interface Player {
  id: string;
  name: string;
  truthPicks: number;
}

export interface GameState {
  id: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  players: Player[];
  usedCardIds: { [playerId: string]: number[]};
}
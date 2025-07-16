export interface Card {
  id: number;
  type: 'truth' | 'dare';
  content: string;
  level: number;
}

export interface Player {
  id: string;
  name: string;
  consecutiveTruths: number; 
  suspensionCount: number; 
}

export interface Votes {
  [playerId: string]: 'like' | 'dislike';
}

export interface GameState {
  id: string;
  hostId: string;
  
  phase: 'LOBBY' | 'SPINNING' | 'CHOOSING' | 'ACTION' | 'VOTING' | 'VERDICT' | 'SUSPENDED';
  
  players: Player[];
  
  questionerPool: string[]; 

  spinnerId: string | null;
  questionerId: string | null;
  responderId: string | null;

  currentCard: Card | null;
  
  votes: Votes;

  usedCardIds: { [playerId: string]: number[] };
}
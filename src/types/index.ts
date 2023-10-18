export interface Deck {
  id?: string;
  cards: Flashcard[];
}

export interface Flashcard {
  id: string;
  question: string;
  options: string[];
  answer: string;
  interval: number;
  lastReviewed?: Date | null;
}

export type Rating = "easy" | "medium" | "hard";

export interface SessionBrief {
  sessionId: string;
  deckId: string;  
}

export interface Session {
  id?: string,
  data: SessionData[]
}

export interface SessionData {
  id: string;
  question: string;
  timeToAnswer: number;
  correct: boolean;
  rating: Rating;
}

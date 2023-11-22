export interface Deck {
  id?: string;
  cards: Flashcard[];
}

export interface Flashcard {
  id: string;
  title?: string;
  question: string;
  options: string[]; // For multi answer
  answer: string;
  flipSide?: string; // For flip cards
  interval: number;
  type: FlashcardTypes;
  lastReviewed?: Date | null;
  learningMaterialLink?: string;
}

export enum FlashcardTypes {
  Single = 1,
  Multi = 2,
  Flip = 3,
}

export type Rating = "easy" | "medium" | "hard";

export interface SessionBrief {
  sessionId: string;
  deckId: string;
}

export interface Session {
  id?: string;
  data: SessionData[];
}

export interface SessionData {
  id: string;
  question: string;
  timeToAnswer: number;
  correct: boolean;
  rating: Rating;
  learningMaterialLink?: string;
}

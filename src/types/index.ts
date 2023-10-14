export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  interval?: number;
  lastReviewed?: Date | null;
}

export type Rating = "easy" | "medium" | "hard";

export interface SessionBrief {
  sessionId: string;
  deckId: string;
}

export interface SessionData {
  question: string;
  timeToAnswer: number;
  correct: boolean;
  rating: Rating;
}

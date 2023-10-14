export interface Flashcard {
    id: string;
    question: string;
    answer: string;
    interval?: number; // Optional property for spaced repetition interval
  }
  
  export type Rating = 'easy' | 'medium' | 'hard';
  
  // ... you can add more types and interfaces as needed.
  
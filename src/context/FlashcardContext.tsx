import React, { createContext, ReactNode, useState } from "react";
import { Flashcard } from "../types";

interface FlashcardContextProps {
  flashcards: Flashcard[];
  updateFlashcard: (id: string, data: Partial<Flashcard>) => void;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(
  undefined
);

const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const updateFlashcard = (id: string, data: Partial<Flashcard>) => {
    setFlashcards((prev) =>
      prev.map((flashcard) =>
        flashcard.id === id ? { ...flashcard, ...data } : flashcard
      )
    );
  };

  return (
    <FlashcardContext.Provider value={{ flashcards, updateFlashcard }}>
      {children}
    </FlashcardContext.Provider>
  );
};

export { FlashcardContext, FlashcardProvider };

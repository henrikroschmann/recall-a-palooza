// import React, { ReactNode, createContext, useContext, useState } from 'react';

// // Type Definitions
// interface Flashcard {
//   id: string;
//   question: string;
//   answer: string;
//   interval?: number; // You can use this for the spaced repetition interval if needed
// }

// interface FlashcardContextProps {
//   flashcards: Flashcard[];
//   updateFlashcard: (flashcard: Flashcard) => void;
// }

// // Creating Context
// const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

// interface FlashcardProviderProps {
//     children: ReactNode;
//   }

// const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children }) => {
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

//   const updateFlashcard = (updatedFlashcard: Flashcard) => {
//     setFlashcards((prevFlashcards) =>
//       prevFlashcards.map((flashcard) =>
//         flashcard.id === updatedFlashcard.id ? updatedFlashcard : flashcard
//       )
//     );
//   };

//   return (
//     <FlashcardContext.Provider
//       value={{
//         flashcards,
//         updateFlashcard,
//       }}
//     >
//       {children}
//     </FlashcardContext.Provider>
//   );
// };

// // Custom Hook for easier usage of the context
// const useFlashcards = () => {
//   const context = useContext(FlashcardContext);
//   if (!context) {
//     throw new Error('useFlashcards must be used within a FlashcardProvider');
//   }
//   return context;
// };

// export { FlashcardProvider, useFlashcards };


import React, { createContext, ReactNode, useState } from "react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardContextProps {
  flashcards: Flashcard[];
  updateFlashcard: (id: string, data: Partial<Flashcard>) => void;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const updateFlashcard = (id: string, data: Partial<Flashcard>) => {
    setFlashcards((prev) =>
      prev.map((flashcard) => (flashcard.id === id ? { ...flashcard, ...data } : flashcard))
    );
  };

  return (
    <FlashcardContext.Provider value={{ flashcards, updateFlashcard }}>
      {children}
    </FlashcardContext.Provider>
  );
};

export { FlashcardContext, FlashcardProvider };

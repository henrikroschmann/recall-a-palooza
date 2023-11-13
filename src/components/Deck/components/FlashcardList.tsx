
import React from "react";
import { Flashcard, FlashcardTypes } from "../../../types";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDeleteCard: (cardId: string) => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards, onDeleteCard }) => {
  return (
    <ul className="flashcard-list">
      {flashcards.map((card, index) => (
        <li key={index}>
          Q: {card.question} <br />
          A:{" "}
          {card.type === FlashcardTypes.Flip
            ? card.answer
            : card.options.join(", ")}
          <br />
          <button onClick={() => onDeleteCard(card.id)}>Remove card</button>
        </li>
      ))}
    </ul>
  );
};

export default FlashcardList;

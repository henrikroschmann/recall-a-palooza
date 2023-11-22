import React from "react";
import { Flashcard, FlashcardTypes } from "../../../types";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDeleteCard: (cardId: string) => void;
  onEditCard: (cardId: string) => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcards,
  onDeleteCard,
  onEditCard,
}) => {
  return (
    <div className="flashcard-list-container">
      {flashcards.length === 0 ? (
        <p className="no-flashcards">No flashcards available.</p>
      ) : (
        <ul className="flashcard-list">
          {flashcards.map((card, index) => (
            <li key={index} className="flashcard-item">
              <div className="flashcard-content">
                <p className="flashcard-question">{card.question}</p>
                {card.type === FlashcardTypes.Multi ? (
                  <>
                    {card.options.map((option, optionIndex) => (
                      <p key={optionIndex} className="flashcard-options">
                        {option === card.answer ? (
                          <span className="correct-option">*</span>
                        ) : null}
                        {option}
                      </p>
                    ))}
                  </>
                ) : (
                  <p className="flashcard-answer">Answer: {card.answer}</p>
                )}
              </div>
              <button
                className="edit-button"
                onClick={() => onEditCard(card.id)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => onDeleteCard(card.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlashcardList;

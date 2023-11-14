import React from "react";
import Markdown from "react-markdown";
import { Flashcard, FlashcardTypes } from "../../../types";



interface FlashcardQuestionProps {
  currentCard: Flashcard | null;
  isCardFlipped: boolean;
}

const FlashcardQuestion: React.FC<FlashcardQuestionProps> = ({
  currentCard,
  isCardFlipped,
}) => {
  return (
    <div className="question-box">
      <Markdown>
        {!isCardFlipped
          ? currentCard?.question
          : currentCard?.type === FlashcardTypes.Flip
          ? currentCard.answer // flipside property?
          : currentCard?.answer}
      </Markdown>
    </div>
  );
};

export default FlashcardQuestion;

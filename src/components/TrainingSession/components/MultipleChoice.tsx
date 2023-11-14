import React from "react";
import Markdown from "react-markdown";
import { Flashcard } from "types";


interface MultipleChoiceProps {
  shuffledOptions: string[];
  isAnswerSubmitted: boolean;
  currentCard: Flashcard | null;
  userAnswer: string;
  submitAnswer: (answer: string) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  shuffledOptions,
  isAnswerSubmitted,
  currentCard,
  userAnswer,
  submitAnswer,
}) => {
  return (
    <div className="multiple-choice">
      {shuffledOptions.map((option, index) => (
        <button
          key={index}
          className={`${
            isAnswerSubmitted && option === currentCard?.answer
              ? "correct-answer"
              : ""
          } ${option === userAnswer ? "active" : ""}`}
          //disabled={isAnswerSubmitted}
          onClick={() => submitAnswer(option)}
        >
          <Markdown>{option}</Markdown>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoice;

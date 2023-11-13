import React from "react";

interface AnswerBoxProps {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  setHasAnswered: (hasAnswered: boolean) => void;
  //setCorrectAnswer: (correctAnswer: boolean) => void; // Uncomment if needed
}

const AnswerBox: React.FC<AnswerBoxProps> = ({
  userAnswer,
  setUserAnswer,
  setHasAnswered,
  //setCorrectAnswer, // Uncomment if needed
}) => {
  return (
    <div className="answer-box">
      <label>
        Your Answer:
        <textarea
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setHasAnswered(e.target.value.trim() !== "");
            //setCorrectAnswer(e.target.value.trim() !== ""); // Uncomment if needed
          }}
          rows={4}
        />
      </label>
    </div>
  );
};

export default AnswerBox;

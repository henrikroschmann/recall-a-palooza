import React from "react";
import { FlashcardTypes } from "../../../types";

interface FlashcardFormProps {
  flashcardType: FlashcardTypes;
  title: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number | null;
  flipSide: string;
  learningMaterialLink: string;
  onCardTypeChange: (selectedType: FlashcardTypes) => void;
  onQuestionChange: (question: string) => void;
  onAnswerChange: (index: number, answer: string) => void;
  onAddAnswer: () => void;
  onRemoveAnswer: (index: number) => void;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSelectedCorrectAnswer: (index: number) => void;
  onFlipSideChange: (flipSide: string) => void;
  onLearningMaterialLinkChange: (link: string) => void;
  inEdit: boolean;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  flashcardType,
  question,
  title,
  learningMaterialLink,
  answers,
  correctAnswerIndex,
  flipSide,
  onCardTypeChange,
  onQuestionChange,
  onAnswerChange,
  onAddAnswer,
  onRemoveAnswer,
  onTitleChange,
  onSubmit,
  onSelectedCorrectAnswer,
  onFlipSideChange,
  onLearningMaterialLinkChange,
  inEdit,
}) => {
  return (
    <div className="flashcard-form-container">
      <form onSubmit={(e) => onSubmit(e)}>
        {/* Title Field */}
        <div className="form-group">
          <label>Title</label>
          <input
            aria-label="title input"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        {/* Card type selection */}
        <div className="card-type-switch">
          <label className="card-type-label">Card Type:</label>
          <div className="card-type-options">
            <label className="card-type-option">
              <input
                type="radio"
                value={FlashcardTypes.Single}
                checked={flashcardType === FlashcardTypes.Single}
                onChange={() => onCardTypeChange(FlashcardTypes.Single)}
              />
              Single Answer
            </label>
            <label className="card-type-option">
              <input
                type="radio"
                value={FlashcardTypes.Multi}
                checked={flashcardType === FlashcardTypes.Multi}
                onChange={() => onCardTypeChange(FlashcardTypes.Multi)}
              />
              Multiple Choice
            </label>
            <label className="card-type-option">
              <input
                type="radio"
                value={FlashcardTypes.Flip}
                checked={flashcardType === FlashcardTypes.Flip}
                onChange={() => onCardTypeChange(FlashcardTypes.Flip)}
              />
              Flip Card
            </label>
          </div>
        </div>

        {/* Question Field */}
        <div className="form-group">
          <label>Question</label>
          <textarea
            title="question"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
          />
        </div>

        {/* Answer Fields based on Card Type */}
        {flashcardType === FlashcardTypes.Single && (
          <div className="form-group">
            <label>Answer</label>
            <textarea
              title="answer"
              value={answers[0]}
              onChange={(e) => onAnswerChange(0, e.target.value)}
            />
          </div>
        )}

        {flashcardType === FlashcardTypes.Multi &&
          answers.map((answer, idx) => (
            <div key={idx} className="form-group">
              <label>{`Option ${idx + 1}`}</label>
              <textarea
                title="answer"
                value={answer}
                onChange={(e) => onAnswerChange(idx, e.target.value)}
              />
              <button type="button" onClick={() => onRemoveAnswer(idx)}>
                Remove
              </button>
              <input
                aria-label="radio input"
                type="radio"
                name="correct-answer"
                value={idx}
                checked={correctAnswerIndex === idx}
                onChange={() => onSelectedCorrectAnswer(idx)}
              />{" "}
              Mark as Correct
            </div>
          ))}

        {flashcardType === FlashcardTypes.Multi && (
          <button type="button" onClick={onAddAnswer}>
            Add Option
          </button>
        )}

        {flashcardType === FlashcardTypes.Flip && (
          <div className="form-group">
            <label>Flip Side</label>
            <textarea
              title="flipside"
              value={flipSide}
              onChange={(e) => onFlipSideChange(e.target.value)}
            />
          </div>
        )}

        {flashcardType !== FlashcardTypes.Flip && ( // Assuming flip cards don't need a learning material link
          <div className="form-group">
            <label>Learning Material Link</label>
            <input
              aria-label="learning material"
              type="url"
              value={learningMaterialLink}
              onChange={(e) => onLearningMaterialLinkChange(e.target.value)}
            />
          </div>
        )}

        <button type="submit">
          {inEdit ? "Update Flashcard" : "Add Flashcard"}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;

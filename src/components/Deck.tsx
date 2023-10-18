import React, { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Flashcard } from "../types";
import "./Deck.css";
import { useCreatePostMutation } from "../utils/slices/DeckApi";

const Deck: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [deckId, setDeckId] = useState<string>("");
  const [isMultipleChoice, setIsMultipleChoice] = useState<boolean>(false);
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState<
    number | null
  >(null);

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = answers.filter((_, idx) => idx !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Check for single answer card
    if (!isMultipleChoice && question && answers.length === 1) {
      const newCard = {
        id: uuidv4(),
        question,
        options: [answers[0]],
        answer: answers[0],
        interval: 1,
      };

      setFlashcards((prevCards) => [...prevCards, newCard]);
      setQuestion("");
      setAnswers([]);
    }
    // Check for multiple choice card
    else if (
      isMultipleChoice &&
      question &&
      answers.length &&
      selectedCorrectAnswer !== null
    ) {
      const newCard = {
        id: uuidv4(),
        question,
        options: answers,
        answer: answers[selectedCorrectAnswer],
        interval: 1,
      };

      setFlashcards((prevCards) => [...prevCards, newCard]);
      setQuestion("");
      setAnswers([]);
      setSelectedCorrectAnswer(null); // Reset the selected answer
    }
  };

  const [createDeck] = useCreatePostMutation();
  const saveDeck = () => {
    const id = uuidv4();
    setDeckId(id);

    const create = async () => {
      try {
        await createDeck({
          id: id,
          cards: flashcards,
        });
      } catch (error) {
        console.error("Failed to create deck:", error);
      }
    };
    void create();
  };

  return (
    <div className="deck-container">
      <h2>Create a Deck</h2>
      {/* Toggle between Multiple Choice and Single Answer */}
      <button
        type="button"
        onClick={() => setIsMultipleChoice(!isMultipleChoice)}
      >
        {isMultipleChoice
          ? "Switch to Single Answer"
          : "Switch to Multiple Choice"}
      </button>

      {/* Flashcard Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question</label>
          <textarea
            aria-label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* Conditionally render input fields based on isMultipleChoice */}
        {isMultipleChoice ? (
          answers.map((answer, idx) => (
            <div key={idx} className="form-group">
              <label>Option {idx + 1}</label>
              <textarea
                aria-label="Options"
                value={answer}
                onChange={(e) => handleAnswerChange(e, idx)}
              />
              <button type="button" onClick={() => handleRemoveAnswer(idx)}>
                Remove
              </button>
              <input
                aria-label="select-option"
                type="radio"
                name="correct-answer"
                value={idx}
                checked={selectedCorrectAnswer === idx}
                onChange={(e) =>
                  setSelectedCorrectAnswer(parseInt(e.target.value))
                }
              />{" "}
              Mark as Correct
            </div>
          ))
        ) : (
          <div className="form-group">
            <label>Answer</label>
            <textarea
              aria-label="answer"
              value={answers[0] || ""}
              onChange={(e) => setAnswers([e.target.value])}
            />
          </div>
        )}

        {isMultipleChoice && (
          <button type="button" onClick={handleAddAnswer}>
            Add Option
          </button>
        )}

        <button type="submit">Add Flashcard</button>
      </form>
      <button className="save-btn" onClick={saveDeck}>
        Save Deck
      </button>
      {deckId && (
        <Link className="train-link" to={`/train/${deckId}`}>
          Train on this Deck
        </Link>
      )}

      <h3>Flashcards in this deck:</h3>
      <ul className="flashcard-list">
        {flashcards.map((card, index) => (
          <li key={index}>
            Q: {card.question} <br /> A: {card.options.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;

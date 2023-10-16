import React, { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Flashcard } from "../types";
import "./Deck.css";

const Deck: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [deckId, setDeckId] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (question && answer) {
      const newCard = {
        id: uuidv4(),
        question,
        answer,
        interval: 1,
      };

      setFlashcards((prevCards) => [...prevCards, newCard]);
      setQuestion("");
      setAnswer("");
    }
  };

  const saveDeck = () => {
    const id = uuidv4();
    setDeckId(id);
    localStorage.setItem(id, JSON.stringify(flashcards));
  };

  return (
    <div className="deck-container">
      <h2>Create a Deck</h2>
      <form className="flashcard-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the flashcard question"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <input
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the flashcard answer"
          />
        </div>
        <button className="submit-btn" type="submit">
          Add Flashcard
        </button>
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
            Q: {card.question} <br /> A: {card.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;

import React, { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

interface Flashcard {
  question: string;
  answer: string;
}

const Deck: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [deckId, setDeckId] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (question && answer) {
      const newCard = {
        id: uuidv4(), // This will generate a unique id for the card
        question,
        answer,
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
    <div>
      <h2>Create a Deck</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Question:
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Answer:
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Flashcard</button>
      </form>
      <button onClick={saveDeck}>Save Deck</button>
      {deckId && <Link to={`/train/${deckId}`}>Train on this Deck</Link>}

      <h3>Flashcards in this deck:</h3>
      <ul>
        {flashcards.map((card, index) => (
          <li key={index}>
            Q: {card.question} | A: {card.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;

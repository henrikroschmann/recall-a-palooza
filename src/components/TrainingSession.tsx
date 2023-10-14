import React, { useState, useEffect } from "react";
import { useFlashcards } from "../context/FlashcardContext";
import { Link, useParams, useNavigate } from "react-router-dom";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  interval: number; // Added an interval (in days) to each card.
  lastReviewed: Date | null; // Date the card was last reviewed.
}

interface SessionData {
  question: string;
  timeToAnswer: number;
  correct: boolean;
  rating: "easy" | "medium" | "hard";
}

const TrainingSession: React.FC = () => {
  // const { flashcards, updateFlashcard } = useFlashcards();
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { deckId } = useParams<{ deckId: string }>();
  const [deckFlashcards, setDeckFlashcards] = useState<Flashcard[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const initialDeckFlashcards: Flashcard[] = JSON.parse(
      localStorage.getItem(deckId) || "[]"
    )
      .filter((card: Flashcard) => !card.lastReviewed || (today.getDate() - new Date(card.lastReviewed).getDate()) >= card.interval)
      .sort((a: Flashcard, b: Flashcard) => a.interval - b.interval); // Sorting by interval ensures harder cards come first.

    setDeckFlashcards(initialDeckFlashcards);

    if (initialDeckFlashcards.length > 0) {
      setCurrentCard(initialDeckFlashcards[0]); // Start with the first card (lowest interval/hardest).
    }

    setSessionId(`${deckId}-session-${Date.now()}`);
  }, [deckId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      let updatedInterval;

      switch(rating) {
        case "easy":
          updatedInterval = currentCard.interval ? currentCard.interval * 2 : 2;
          break;
        case "medium":
          updatedInterval = currentCard.interval ? currentCard.interval + 1 : 2;
          break;
        case "hard":
          updatedInterval = 1;
          break;
      }

      // const updatedCard = {
      //   ...currentCard,
      //   interval: updatedInterval,
      //   lastReviewed: new Date() // Set the review date to today.
      // };

      //updateFlashcard(updatedCard);

      const remainingCards = deckFlashcards.filter(
        (card) => card.id !== currentCard.id
      );

      setDeckFlashcards(remainingCards);

      if (remainingCards.length > 0) {
        setCurrentCard(remainingCards[0]);
      } else {
        setCurrentCard(null);
      }

      const endTime = Date.now();
      const timeToAnswer = endTime - startTime;

      setSessionData([
        ...sessionData,
        {
          question: currentCard.question,
          timeToAnswer,
          correct: userAnswer === currentCard.answer,
          rating,
        },
      ]);

      setStartTime(endTime); // Reset the start time for the next card.
    }
  };

  const handleEndSession = () => {
    localStorage.setItem(sessionId, JSON.stringify(sessionData));
    navigate(`/training-report/${sessionId}`);
  };

  return (
    <div>
      <h2>Training Session</h2>
      {currentCard ? (
        <>
          <div>
            <p>Question: {currentCard.question}</p>
          </div>
          <div>
            <label>
              Your Answer:
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </label>
          </div>
          {userAnswer && (
            <div>
              <button onClick={() => handleRating("easy")}>Easy</button>
              <button onClick={() => handleRating("medium")}>Medium</button>
              <button onClick={() => handleRating("hard")}>Hard</button>
            </div>
          )}
        </>
      ) : (
        <>
          <p>No flashcards available for review today. Please come back later.</p>
          <button onClick={handleEndSession}>End Session</button>
        </>
      )}
    </div>
  );
};

export default TrainingSession;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Flashcard, SessionData } from "../types";

const TrainingSession: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { deckId } = useParams<{ deckId: string }>();
  const [deckFlashcards, setDeckFlashcards] = useState<Flashcard[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const initialDeckFlashcards: Flashcard[] = (
      JSON.parse(localStorage.getItem(deckId!) || "[]") as Flashcard[]
    )
      .filter(
        (card: Flashcard) =>
          !card.lastReviewed ||
          new Date().getDate() - new Date(card.lastReviewed).getDate() >=
            (card.interval || 0)
      )
      .sort(
        (a: Flashcard, b: Flashcard) => (a.interval || 0) - (b.interval || 0)
      );

    setDeckFlashcards(initialDeckFlashcards);

    if (initialDeckFlashcards.length > 0) {
      setCurrentCard(initialDeckFlashcards[0]); // Start with the first card (lowest interval/hardest).
    }

    setSessionId(`${deckId!}-session-${Date.now()}`);
  }, [deckId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
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
      setUserAnswer("");
      setStartTime(endTime);
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
          <p>
            No flashcards available for review today. Please come back later.
          </p>
          <button onClick={handleEndSession}>End Session</button>
        </>
      )}
    </div>
  );
};

export default TrainingSession;

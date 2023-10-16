import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Flashcard, SessionData } from "../types";
import "./TrainingSession.css";

const TrainingSession: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Flashcard[]>(
    JSON.parse(localStorage.getItem(deckId!) || "[]") as Flashcard[]
  );
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
      )
      .slice(0, 20);

    setDeckFlashcards(initialDeckFlashcards);

    if (initialDeckFlashcards.length > 0) {
      setCurrentCard(initialDeckFlashcards[0]); // Start with the first card (lowest interval/hardest).
    }

    setSessionId(`${deckId!}-session-${Date.now()}`);
  }, [deckId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      const correct = userAnswer === currentCard.answer
      let newInterval;
      if (correct)
        switch (rating) {
          case "easy":
            newInterval = (currentCard.interval || 1) * 2;
            break;
          case "medium":
            newInterval = (currentCard.interval || 1) * 1.5;
            break;
          case "hard":
            newInterval = 1;
            break;
      } else {
        newInterval = 1;
      }

      const updatedCard = {
        ...currentCard,
        interval: newInterval,
        lastReviewed: new Date(),
      };
      const newDeck = deck.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );
      setDeck(newDeck);

      const remainingCards = deckFlashcards.filter(
        (card) => card.id !== currentCard.id // Remove the current card
      );

      setDeckFlashcards(remainingCards);

      // Now you're grabbing the next card if available
      setCurrentCard(remainingCards.length > 0 ? remainingCards[0] : null);

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
    localStorage.setItem(deckId!, JSON.stringify(deck));
    navigate(`/training-report/${sessionId}`);
  };

  return (
    <div className="training-container">
      <h2>Training Session</h2>
      {currentCard ? (
        <>
          <div className="question-box">
            <p>{currentCard.question}</p>
          </div>
          <div className="answer-box">
            <label>
              Your Answer:
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={4}
              />
            </label>
          </div>
          {userAnswer && (
            <div className="rating-buttons">
              <button className="easy-btn" onClick={() => handleRating("easy")}>
                Easy
              </button>
              <button
                className="medium-btn"
                onClick={() => handleRating("medium")}
              >
                Medium
              </button>
              <button className="hard-btn" onClick={() => handleRating("hard")}>
                Hard
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="end-session">
          <p>
            No flashcards available for review today. Please come back later.
          </p>
          <button className="end-session-btn" onClick={handleEndSession}>
            End Session
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainingSession;

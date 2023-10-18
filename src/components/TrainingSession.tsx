import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Deck, Flashcard, SessionData } from "../types";
import "./TrainingSession.css";
import {
  useGetDeckByIdQuery,
  useUpdateDeckByIdMutation,
} from "../utils/slices/DeckApi";
import { useCreatePostMutation } from "../utils/slices/SessionApi";
import Markdown from "react-markdown";

const TrainingSession: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck>();
  const { data: deckQuery } = useGetDeckByIdQuery(deckId ?? "");
  const [deckFlashcards, setDeckFlashcards] = useState<Flashcard[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const navigate = useNavigate();
  const [hasAnswered, setHasAnswered] = useState<boolean>(false); // New state

  const submitAnswer = (answer: string) => {
    setUserAnswer(answer);
    if (currentCard) {
      if ("options" in currentCard && currentCard.options) {
        setHasAnswered(true);
      }
    }
  };

  useEffect(() => {
    setDeck(deckQuery);
  }, [deckId, deckQuery]);

  useEffect(() => {
    if (deck !== undefined) {
      const initialDeckFlashcards: Flashcard[] =
        deck?.cards
          .filter(
            (card: Flashcard) =>
              !card.lastReviewed ||
              new Date().getDate() - new Date(card.lastReviewed).getDate() >=
                (card.interval || 0)
          )
          .sort(
            (a: Flashcard, b: Flashcard) =>
              (a.interval || 0) - (b.interval || 0)
          )
          .slice(0, 20) ?? [];

      setDeckFlashcards(initialDeckFlashcards);

      if (initialDeckFlashcards.length > 0) {
        setCurrentCard(initialDeckFlashcards[0]); // Start with the first card (lowest interval/hardest).
      }

      setSessionId(`${deckId ?? ""}-session-${Date.now()}`);
    }
  }, [deck, deckId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      const correct = userAnswer === currentCard.answer;
      let newInterval = 1;
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
        }
      else {
        newInterval = 1;
      }

      const updatedCard = {
        ...currentCard,
        interval: newInterval,
        lastReviewed: new Date(),
      };
      const newDeck = deck?.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );

      if (newDeck) {
        setDeck({ ...deck, cards: newDeck });
      }

      const remainingCards = deckFlashcards.filter(
        (card) => card.id !== currentCard.id // Remove the current card
      );

      setDeckFlashcards(remainingCards);
      setCurrentCard(remainingCards.length > 0 ? remainingCards[0] : null);

      const endTime = Date.now();
      const timeToAnswer = endTime - startTime;

      setSessionData([
        ...sessionData,
        {
          id: sessionId,
          question: currentCard.question,
          timeToAnswer,
          correct: userAnswer === currentCard.answer,
          rating,
        },
      ]);
      setUserAnswer("");
      setStartTime(endTime);
    }
    if (sessionData.length === 20) {
      handleEndSession();
    }
  };

  const [updateDeck] = useUpdateDeckByIdMutation();
  const [createSession] = useCreatePostMutation();
  const handleEndSession = () => {
    if (deck) {
      const update = async () => {
        try {
          await updateDeck({ id: deckId ?? "", updates: deck });
        } catch (error) {
          console.error("Failed to update deck:", error);
        }
      };
      void update();

      const session = async () => {
        try {
          await createSession({
            id: sessionId,
            data: sessionData,
          });
        } catch (error) {
          console.error("Failed to save session:", error);
        }
      };
      void session();
    }

    navigate(`/training-report/${sessionId}`);
  };

  return (
    <div className="training-container">
      <h2>Training Session</h2>

      {currentCard ? (
        <>
          <div className="question-box">
            <Markdown>{currentCard.question}</Markdown>
          </div>

          {currentCard.options && currentCard.options.length > 1 ? (
            <div className="multiple-choice">
              {currentCard.options.map((option, index) => (
                <button key={index} onClick={() => submitAnswer(option)}>
                  <Markdown>{option}</Markdown>
                </button>
              ))}
            </div>
          ) : (
            <div className="answer-box">
              <label>
                Your Answer:
                <textarea
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setHasAnswered(e.target.value.trim() !== ""); // Set hasAnswered based on textarea content
                  }}
                  rows={4}
                />
              </label>
            </div>
          )}

          {hasAnswered && (
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

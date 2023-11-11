import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Deck, Flashcard, FlashcardTypes, SessionData } from "../../types";
import "./TrainingSession.css";
import {
  useCreatePostMutation,
  useGetDeckByIdQuery,
  useUpdateDeckByIdMutation,
} from "../../utils/api/DeckApi";

import { useCreatePostMutation } from "../../utils/api/SessionApi";

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
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false); // For flip card type
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const submitAnswer = (answer: string) => {
    setUserAnswer(answer);
    setIsAnswerSubmitted(true);
    if (currentCard) {
      if ("options" in currentCard && currentCard.options) {
        setHasAnswered(true);
      }
    }
  };

  useEffect(() => {
    if (currentCard?.options) {
      setShuffledOptions(
        [...currentCard.options].sort(() => Math.random() - 0.5)
      );
    }
  }, [currentCard]);

  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
    setHasAnswered(true);
  };

  useEffect(() => {
    setDeck(deckQuery);
  }, [deckId, deckQuery]);

  function shuffle(array: Flashcard[]): Flashcard[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    if (deck !== undefined) {
      // Filter cards based on lastReviewed and by interval 1
      const intervalOneCards = deck.cards.filter(
        (card) =>
          (!card.lastReviewed ||
            new Date(card.lastReviewed).getDate() - new Date().getDate() >=
              1) &&
          card.interval === 1
      );

      // Shuffle and then add cards with interval 2 and 3
      const intervalTwoThreeCards = shuffle(
        deck.cards.filter(
          (card) =>
            (!card.lastReviewed ||
              new Date(card.lastReviewed).getDate() - new Date().getDate() >=
                1) &&
            (card.interval === 2 || card.interval === 3)
        )
      );

      // Combine the interval one cards with the shuffled interval two and three cards
      let combinedCards = [...intervalOneCards, ...intervalTwoThreeCards];

      // If the combined total is less than 20, shuffle and add the remaining cards
      if (combinedCards.length < 20) {
        const remainingCards = shuffle(
          deck.cards.filter(
            (card) =>
              (!card.lastReviewed ||
                new Date(card.lastReviewed).getDate() - new Date().getDate() >=
                  1) &&
              ![1, 2, 3].includes(card.interval)
          )
        );

        combinedCards = [...combinedCards, ...remainingCards].slice(0, 20);
      } else {
        combinedCards = combinedCards.slice(0, 20);
      }

      // Update state with the new deck of flashcards
      setDeckFlashcards(combinedCards);

      // Set the current card if there are cards in the deck
      if (combinedCards.length > 0) {
        setCurrentCard(combinedCards[0]); // Start with the first card.
      }

      // Create a new session ID
      setSessionId(`${deckId ?? ""}-session-${Date.now()}`);
    }
  }, [deck, deckId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      setIsCardFlipped(false);
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
          correct:
            currentCard.type == FlashcardTypes.Flip
              ? true
              : userAnswer === currentCard.answer,
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
      void session().then(() => {
        // store training sessions locally
        const item = localStorage.getItem("session-cloud");
        const sessionCloud: { value: string; priority: number }[] =
          item && item !== ""
            ? (JSON.parse(item) as { value: string; priority: number }[])
            : [];

        // Find existing session with the same deckId
        const session = sessionCloud.find((s) => s.value === deckId);

        if (session) {
          // If found, increment priority
          session.priority = session.priority >= 9 ? 9 : session.priority + 1;
        } else {
          // If not found, push a new session with initial priority of 1
          sessionCloud.push({ value: deckId!, priority: 1 });
        }

        localStorage.setItem("session-cloud", JSON.stringify(sessionCloud));
        navigate(`/training-report/${sessionId}`);
      });
    }
  };

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>

      <div className="training-container">
        <h2>Training Session</h2>

        {currentCard ? (
          <>
            {isAnswerSubmitted && (
              <div
                className={`toast-notification ${
                  userAnswer === currentCard.answer ? "correct" : "incorrect"
                }`}
              >
                {userAnswer === currentCard.answer ? "Correct!" : "Incorrect!"}
              </div>
            )}

            {!isCardFlipped && (
              <div className="question-box">
                <Markdown>
                  {!isCardFlipped
                    ? currentCard.question
                    : currentCard.type == FlashcardTypes.Flip
                    ? currentCard.flipSide
                    : currentCard.question}
                </Markdown>
              </div>
            )}

            {currentCard.type == FlashcardTypes.Multi && shuffledOptions && (
              <div className="multiple-choice">
                {shuffledOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`${
                      isAnswerSubmitted && option === currentCard.answer
                        ? "correct-answer"
                        : ""
                    } ${option === userAnswer ? "active" : ""}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => submitAnswer(option)}
                  >
                    <Markdown>{option}</Markdown>
                  </button>
                ))}
              </div>
            )}

            {currentCard.type == FlashcardTypes.Single && (
              <div className="answer-box">
                <label>
                  Your Answer:
                  <textarea
                    disabled={isAnswerSubmitted}
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setHasAnswered(e.target.value.trim() !== "");
                    }}
                    rows={4}
                  />
                </label>
              </div>
            )}

            {isAnswerSubmitted && (
              <div className="answer-box">
                <Markdown>{currentCard.answer}</Markdown>
              </div>
            )}

            {isCardFlipped && (
              <div className="question-box">
                <Markdown>{currentCard.answer}</Markdown>
              </div>
            )}

            {currentCard.type == FlashcardTypes.Flip && (
              <button className="flip-btn" onClick={flipCard}>
                Flip Card
              </button>
            )}

            {hasAnswered && (
              <div className="rating-buttons">
                <button
                  className="easy-btn"
                  onClick={() => handleRating("easy")}
                >
                  Easy
                </button>
                <button
                  className="medium-btn"
                  onClick={() => handleRating("medium")}
                >
                  Medium
                </button>
                <button
                  className="hard-btn"
                  onClick={() => handleRating("hard")}
                >
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
        <Link className="edit-link" to={`/deck/${deckId!}`}>
          Edit this Deck
        </Link>
      </div>
    </>
  );
};

export default TrainingSession;

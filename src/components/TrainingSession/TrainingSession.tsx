// TrainingSession.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Deck, Flashcard, FlashcardTypes, SessionData } from "../../types";
import "./TrainingSession.css";
import {
  useGetDeckByIdQuery,
  useUpdateDeckByIdMutation,
} from "../../utils/api/DeckApi";
import { useCreatePostMutation } from "../../utils/api/SessionApi";
import Markdown from "react-markdown";
import AnswerBox from "./components/AnswerBox";
import EndSessionMessage from "./components/EndSessionMessage";
import FlashcardQuestion from "./components/FlashcardQuestion";
import MultipleChoice from "./components/MultipleChoice";
import RatingButtons from "./components/RatingButtons";

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
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [previousIncorrect, setPreviousIncorrect] = useState<boolean>(false);
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const submitAnswer = (answer: string) => {
    setUserAnswer(answer);
    setIsAnswerSubmitted(true);
    if (currentCard) {
      const isCorrect = answer === currentCard.answer;
      setHasAnswered(true);
      if (!isCorrect) {
        setPreviousIncorrect(true);
        setCorrectAnswer(false);
      } else {
        setCorrectAnswer(true);
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
    setCorrectAnswer(true);
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
      const reviewedCardIds = new Set(sessionData.map((data) => data.id));

      const selectedCards = deck.cards
        .filter((card) => !reviewedCardIds.has(card.id))
        .filter((card) => {
          const lastReviewedDate = card.lastReviewed
            ? new Date(card.lastReviewed)
            : null;
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          return (
            !lastReviewedDate ||
            lastReviewedDate < currentDate ||
            card.interval === 1
          );
        })
        .slice(0, 20);

      const shuffledCards = shuffle(selectedCards);

      setDeckFlashcards(shuffledCards);
      if (shuffledCards.length > 0) {
        setCurrentCard(shuffledCards[0]);
      }

      if (!sessionId) {
        setSessionId(`${deckId ?? ""}-session-${Date.now()}`);
      }
    }
  }, [deck, deckId, sessionData, sessionId]);

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      setIsCardFlipped(false);
      setIsAnswerSubmitted(false);
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

      if (previousIncorrect) {
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
        (card) => card.id !== currentCard.id
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
            currentCard.type === FlashcardTypes.Flip
              ? true
              : userAnswer === currentCard.answer,
          rating,
        },
      ]);
      setUserAnswer("");
      setStartTime(endTime);
      setCorrectAnswer(false);
    }
  };

  const [updateDeck] = useUpdateDeckByIdMutation();
  const [createSession] = useCreatePostMutation();

  const handleEndSession = useCallback(async () => {
    if (deck) {
      try {
        // Update deck
        await updateDeck({ id: deckId ?? "", updates: deck });

        // Save session
        await createSession({
          id: sessionId,
          data: sessionData,
        });

        // Update session cloud
        const item = localStorage.getItem("session-cloud");
        const sessionCloud: { value: string; priority: number }[] =
          item && item !== ""
            ? (JSON.parse(item) as { value: string; priority: number }[])
            : [];

        const session = sessionCloud.find((s) => s.value === deckId);

        if (session) {
          session.priority = session.priority >= 9 ? 9 : session.priority + 1;
        } else {
          sessionCloud.push({ value: deckId!, priority: 1 });
        }

        localStorage.setItem("session-cloud", JSON.stringify(sessionCloud));

        // Navigate to the training report
        navigate(`/training-report/${sessionId}`, { state: { sessionData } });
      } catch (error) {
        console.error("Failed to update deck or save session:", error);
      }
    }
  }, [
    createSession,
    deck,
    deckId,
    navigate,
    sessionData,
    sessionId,
    updateDeck,
  ]);

  useEffect(() => {
    if (
      sessionData.length === 20 ||
      (deck && deck.cards.length === sessionData.length)
    ) {
      void handleEndSession();
    }
  }, [deck, deckFlashcards.length, handleEndSession, sessionData]);

  // const hasAnswered = userAnswer.trim() !== "";

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
                {userAnswer === currentCard.answer ? (
                  <>
                    <span>Correct! The answer is: </span>
                    <Markdown>{currentCard.answer}</Markdown>
                  </>
                ) : (
                  "Incorrect! Please try again."
                )}
              </div>
            )}

            <FlashcardQuestion
              currentCard={currentCard}
              isCardFlipped={isCardFlipped}
            />

            {currentCard.type === FlashcardTypes.Multi && (
              <MultipleChoice
                shuffledOptions={shuffledOptions}
                isAnswerSubmitted={isAnswerSubmitted}
                currentCard={currentCard}
                userAnswer={userAnswer}
                submitAnswer={submitAnswer}
              />
            )}

            {currentCard.type === FlashcardTypes.Single && !correctAnswer && (
              <AnswerBox
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                setHasAnswered={setHasAnswered}
              />
            )}

            {isCardFlipped && (
              <FlashcardQuestion
                currentCard={currentCard}
                isCardFlipped={true}
              />
            )}

            {currentCard.type === FlashcardTypes.Flip && (
              <button className="flip-btn" onClick={flipCard}>
                Flip Card
              </button>
            )}

            {hasAnswered &&
              (correctAnswer || currentCard.type === FlashcardTypes.Single) && (
                <RatingButtons handleRating={handleRating} />
              )}
          </>
        ) : (
          <EndSessionMessage />
        )}
        <div className="edit-deck-container">
          <Link className="edit-link" to={`/deck/${deckId!}`}>
            Edit this Deck
          </Link>
        </div>
      </div>
    </>
  );
};

export default TrainingSession;

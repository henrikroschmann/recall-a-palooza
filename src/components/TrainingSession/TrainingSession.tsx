// TrainingSession.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Deck,
  Flashcard,
  FlashcardTypes,
  Rating,
  SessionData,
} from "../../types";
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
  const [isAnswerSide, setIsAnswerSide] = useState<boolean>(false);
  // const [reviewedCardIds, setReviewedCardIds] = useState<string[]>([]);
  const [correctedAnswer, setCorrectedAnswer] = useState(false);

  const submitAnswer = (answer: string) => {
    const isCorrect =
      currentCard && answer.toLowerCase() === currentCard.answer.toLowerCase();

    setUserAnswer(answer);
    setIsAnswerSubmitted(true);
    setHasAnswered(true);

    if (isCorrect) {
      setCorrectAnswer(true);
      if (previousIncorrect) setCorrectedAnswer(true);
    } else if (!correctedAnswer) {
      setPreviousIncorrect(true);
      setCorrectAnswer(false);
    }
  };

  useEffect(() => {
    if (currentCard?.options) {
      setShuffledOptions(
        [...currentCard.options].sort(() => Math.random() - 0.5)
      );
    }
  }, [currentCard]);

  useEffect(() => {
    setDeck(deckQuery);
  }, [deckId, deckQuery]);

  // function shuffle(array: Flashcard[]): Flashcard[] {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }

  const initialCardsSet = useRef(false);

  useEffect(() => {
    if (deck !== undefined && !initialCardsSet.current) {
      // Sort the cards by interval. Assuming a lower interval means the card should be reviewed sooner.
      const sortedCards = [...deck.cards].sort((a, b) => {
        const intervalA = a.interval || Number.MAX_SAFE_INTEGER;
        const intervalB = b.interval || Number.MAX_SAFE_INTEGER;
        return intervalA - intervalB;
      });

      // Filter out the reviewed cards and slice the first 20 cards
      const selectedCards = sortedCards
        // .filter((card) => !reviewedCardIds.includes(card.id))
        .slice(0, 20);

      setDeckFlashcards(selectedCards);
      if (selectedCards.length > 0) {
        setCurrentCard(selectedCards[0]);
      }

      if (!sessionId) {
        setSessionId(`${deckId ?? ""}-session-${Date.now()}`);
      }

      initialCardsSet.current = true;
    }
  }, [deck, deckId, sessionId]);

  const calculateNewInterval = (
    rating: "easy" | "medium" | "hard",
    correct: boolean,
    previousInterval: number,
    previousIncorrect: boolean
  ): number => {
    let newInterval = 1;
    if (correct) {
      switch (rating) {
        case "easy":
          newInterval = previousInterval * 2;
          break;
        case "medium":
          newInterval = previousInterval * 1.5;
          break;
        case "hard":
          newInterval = 1;
          break;
      }
    }
    if (previousIncorrect) {
      newInterval = 1;
    }
    return newInterval;
  };

  const updateCardAndDeck = (
    card: Flashcard,
    newInterval: number,
    deck: Deck
  ) => {
    const updatedCard = {
      ...card,
      interval: newInterval,
      lastReviewed: new Date(),
    };

    const newDeck = deck.cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );

    return newDeck;
  };

  const handleRating = (rating: "easy" | "medium" | "hard") => {
    if (currentCard) {
      const correct =
        userAnswer.toLowerCase() === currentCard.answer.toLowerCase();

      let isCorrect = correct;
      if (currentCard.type === FlashcardTypes.Flip) {
        isCorrect = true;
      }
      if (currentCard.type === FlashcardTypes.Multi) {
        isCorrect = correctedAnswer ? false : correct;
      }
      const newInterval = calculateNewInterval(
        rating,
        isCorrect,
        currentCard.interval || 1,
        previousIncorrect
      );

      const newDeck = updateCardAndDeck(currentCard, newInterval, deck!);
      setDeck({ ...deck, cards: newDeck });

      const remainingCards = deckFlashcards.filter(
        (card) => card.id !== currentCard.id
      );
      setDeckFlashcards(remainingCards);
      setCurrentCard(remainingCards.length > 0 ? remainingCards[0] : null);

      resetSessionState(isCorrect, rating, currentCard.learningMaterialLink);
    }
  };

  const resetSessionState = (
    correct: boolean,
    rating: Rating,
    learningMaterialLink?: string
  ) => {
    const endTime = Date.now();
    const timeToAnswer = endTime - startTime;
    setIsCardFlipped(false);
    setIsAnswerSubmitted(false);
    setUserAnswer("");
    setStartTime(endTime);
    setCorrectAnswer(false);
    setPreviousIncorrect(false);
    setCorrectedAnswer(false);
    setHasAnswered(false);

    setSessionData((prevSessionData) => [
      ...prevSessionData,
      {
        id: sessionId,
        question: currentCard!.question,
        timeToAnswer,
        correct,
        rating,
        learningMaterialLink,
      },
    ]);
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

  const handleFlipCardReveal = () => {
    setHasAnswered(true);
    setIsAnswerSide(!isAnswerSide);
  };

  useEffect(() => {
    if (sessionData.length > 0 && deckFlashcards.length <= 0) {
      void handleEndSession();
    }
  }, [deckFlashcards, handleEndSession, sessionData.length]);

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>

      <div className="training-container">
        <h2>
          Training Session{" "}
          {` - Question ${sessionData.length + 1} of ${
            deckFlashcards.length
          }`}
        </h2>

        {currentCard ? (
          <>
            {currentCard.title ? <h3>{currentCard.title}</h3> : ""}

            {isAnswerSubmitted && (
              <div
                className={`toast-notification ${
                  userAnswer === currentCard.answer ? "correct" : "incorrect"
                }`}
              >
                {userAnswer === currentCard.answer ? (
                  <div className="correct-response">
                    <div className="correct-text">Correct! The answer is:</div>
                    <Markdown>{currentCard.answer}</Markdown>
                  </div>
                ) : (
                  <div className="incorrect-text">
                    Incorrect! Please try again.
                  </div>
                )}
              </div>
            )}

            {isAnswerSide ? (
              // Render the answer side of the flip card
              <FlashcardQuestion
                currentCard={currentCard}
                isCardFlipped={true}
              />
            ) : (
              // Render the question side of the flip card
              <FlashcardQuestion
                currentCard={currentCard}
                isCardFlipped={false}
              />
            )}

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
              <button
                className="flip-btn"
                onClick={() => handleFlipCardReveal()}
              >
                {isAnswerSide ? "Show Question" : "Show Answer"}
              </button>
            )}

            {hasAnswered &&
              (correctAnswer ||
                currentCard.type === FlashcardTypes.Single ||
                currentCard.type === FlashcardTypes.Flip) && (
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

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Flashcard, FlashcardTypes } from "../../types";
import "./Deck.css";
import {
  useCreatePostMutation,
  useDeleteDeckByIdMutation,
  useGetDeckByIdQuery,
  useUpdateDeckByIdMutation,
} from "../../utils/api/DeckApi";
import { ToastContainer, toast } from "react-toastify";

const Deck: React.FC = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([""]); // Initialize with one empty string for the Single and Flip types
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState<
    number | null
  >(null);
  const [type, setType] = useState<FlashcardTypes>(FlashcardTypes.Single);
  const { deckId = "" } = useParams<{ deckId?: string }>();
  const [newDeckId, setNewDeckId] = useState<string>("");
  const [flipSide, setFlipSide] = useState<string>("");
  const { data: fetchedDeck, isLoading } = useGetDeckByIdQuery(deckId, {
    skip: !deckId,
  });

  useEffect(() => {
    if (fetchedDeck) {
      setFlashcards(fetchedDeck.cards);
    }
  }, [fetchedDeck]);

  const resetForm = () => {
    setQuestion("");
    setAnswers([""]);
    setSelectedCorrectAnswer(null);
    setFlipSide("");
  };

  const handleCardTypeChange = (selectedType: FlashcardTypes) => {
    setType(selectedType);
    resetForm(); // Reset the form when switching card types
  };

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers((prevAnswers) => prevAnswers.filter((_, idx) => idx !== index));
  };

  const handleRemoveCard = (cardId: string) => {
    if (window.confirm("Are you sure you want to remove this flashcard?")) {
      const updatedCards = flashcards.filter((card) => card.id !== cardId);
      setFlashcards(updatedCards);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (question && (answers[0] || flipSide)) {
      // Ensuring there's a question and at least one answer
      const newCard: Flashcard = {
        id: uuidv4(),
        question,
        options: type == FlashcardTypes.Multi ? answers : [],
        answer:
          type == FlashcardTypes.Flip
            ? flipSide
            : type == FlashcardTypes.Multi
            ? answers[selectedCorrectAnswer!]
            : answers[0],
        interval: 1,
        type,
      };
      setFlashcards((prev) => [...prev, newCard]);
      resetForm();
    }
  };

  const [createDeck] = useCreatePostMutation();
  const [updateDeck] = useUpdateDeckByIdMutation();
  const [deleteDeck] = useDeleteDeckByIdMutation();

  const saveDeck = () => {
    if (deckId) {
      // If deckId exists, update the deck
      const update = async () => {
        try {
          await updateDeck({
            id: deckId,
            updates: { cards: flashcards },
          }).then(() => {
            toast.success("Deck Updated", {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
        } catch (error) {
          toast.error("Failed to update deck", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //console.error("Failed to update deck:", error);
        }
      };
      void update();
    } else {
      // Create a new deck
      const id = uuidv4();
      setNewDeckId(id);

      const create = async () => {
        try {
          await createDeck({
            id: id,
            cards: flashcards,
          }).then(() => {
            toast.success("Deck created", {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
        } catch (error) {
          toast.error("Failed to create deck", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      };
      void create();
    }
  };

  const handleDeleteDeck = async () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck({ id: deckId });
        toast.success("Deck Deleted Successfully", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        // Get training sessions from local storage
        const item = localStorage.getItem("session-cloud");
        let sessionCloud: { value: string; priority: number }[] =
          item && item !== ""
            ? (JSON.parse(item) as { value: string; priority: number }[])
            : [];

        // Remove the session with the deleted deckId from the sessionCloud
        sessionCloud = sessionCloud.filter(
          (session) => session.value !== deckId
        );

        // Save the updated sessionCloud back to local storage
        localStorage.setItem("session-cloud", JSON.stringify(sessionCloud));

        navigate("/");
      } catch (error) {
        toast.error("Failed to delete deck", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const toFlashcardType = (value: string): FlashcardTypes => {
    switch (value) {
      case "1":
        return FlashcardTypes.Single;
      case "2":
        return FlashcardTypes.Multi;
      case "3":
        return FlashcardTypes.Flip;
      default:
        throw new Error("Invalid FlashcardTypes value: " + value);
    }
  };

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>
      <div className="deck-container">
        {/* Loading and Updating Indicators */}
        {isLoading && <p>Loading deck...</p>}

        <h2>Create a Deck</h2>

        {/* Card type selection */}
        <div>
          <label>Card Type: </label>
          <select
            title="card Type"
            onChange={(e) =>
              handleCardTypeChange(toFlashcardType(e.target.value))
            }
          >
            <option value={FlashcardTypes.Single}>Single Answer</option>
            <option value={FlashcardTypes.Multi}>Multiple Choice</option>
            <option value={FlashcardTypes.Flip}>Flip Card</option>
          </select>
        </div>

        {/* Flashcard Form */}
        <form onSubmit={handleSubmit}>
          {/* Question Field */}
          <div className="form-group">
            <label>Question</label>
            <textarea
              title="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Answer Fields based on Card Type */}
          {type == FlashcardTypes.Single && (
            <div className="form-group">
              <label>Answer</label>
              <textarea
                title="answer"
                value={answers[0]}
                onChange={(e) => handleAnswerChange(e, 0)}
              />
            </div>
          )}

          {type == FlashcardTypes.Multi &&
            answers.map((answer, idx) => (
              <div key={idx} className="form-group">
                <label>{`Option ${idx + 1}`}</label>
                <textarea
                  title="answer"
                  value={answer}
                  onChange={(e) => handleAnswerChange(e, idx)}
                />
                <button type="button" onClick={() => handleRemoveAnswer(idx)}>
                  Remove
                </button>
                <input
                  aria-label="radio input"
                  type="radio"
                  name="correct-answer"
                  value={idx}
                  checked={selectedCorrectAnswer === idx}
                  onChange={() => setSelectedCorrectAnswer(idx)}
                />{" "}
                Mark as Correct
              </div>
            ))}

          {type == FlashcardTypes.Multi && (
            <button type="button" onClick={handleAddAnswer}>
              Add Option
            </button>
          )}

          {type == FlashcardTypes.Flip && (
            <div className="form-group">
              <label>Flip Side</label>
              <textarea
                title="flipside"
                value={flipSide}
                onChange={(e) => setFlipSide(e.target.value)}
              />
            </div>
          )}

          <button type="submit">Add Flashcard</button>
        </form>

        <button className="save-btn" onClick={saveDeck}>
          {deckId ? "Update Deck" : "Save Deck"}
        </button>

        {(deckId || newDeckId) && (
          <div>
            <Link className="train-link" to={`/train/${deckId || newDeckId}`}>
              Train on this Deck
            </Link>
          </div>
        )}

        {deckId && (
          <button
            className="delete-btn"
            onClick={() => {
              void handleDeleteDeck();
            }}
          >
            Delete Deck
          </button>
        )}

        {/* Flashcards List */}
        <h3>Flashcards in this deck:</h3>
        <ul className="flashcard-list">
          {flashcards.map((card, index) => (
            <li key={index}>
              Q: {card.question} <br />
              A:{" "}
              {card.type == FlashcardTypes.Flip
                ? card.answer
                : card.options.join(", ")}
              <br />
              <button onClick={() => handleRemoveCard(card.id)}>
                Remove card
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Deck;

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
import FlashcardForm from "./components/FlashcardForm";
import FlashcardList from "./components/FlashcardList";

const Deck: React.FC = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([""]);
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
    resetForm();
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
    setAnswers(updatedAnswers);
    if (selectedCorrectAnswer === index) {
      setSelectedCorrectAnswer(null);
    }
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
      const newCard: Flashcard = {
        id: uuidv4(),
        question,
        options: type === FlashcardTypes.Multi ? answers : [],
        answer:
          type === FlashcardTypes.Flip
            ? flipSide
            : type === FlashcardTypes.Multi
            ? answers[selectedCorrectAnswer || 0]
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
      const update = async () => {
        try {
          await updateDeck({
            id: deckId,
            updates: { cards: flashcards },
          });
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
        }
      };
      void update();
    } else {
      const id = uuidv4();
      setNewDeckId(id);

      const create = async () => {
        try {
          await createDeck({
            id: id,
            cards: flashcards,
          });
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

        const item = localStorage.getItem("session-cloud");
        let sessionCloud: { value: string; priority: number }[] =
          item && item !== ""
            ? (JSON.parse(item) as { value: string; priority: number }[])
            : [];

        sessionCloud = sessionCloud.filter(
          (session) => session.value !== deckId
        );

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

 

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src="/palooza.png" alt="Recall a plooza" className="logo" />
        </Link>
      </div>
      <div className="deck-container">
        {isLoading && <p>Loading deck...</p>}

        <h2>Create a Deck</h2>

        <FlashcardForm
          flashcardType={type}
          question={question}
          answers={answers}
          correctAnswerIndex={selectedCorrectAnswer}
          flipSide={flipSide}
          onCardTypeChange={handleCardTypeChange}
          onQuestionChange={setQuestion}
          onAnswerChange={handleAnswerChange}
          onAddAnswer={handleAddAnswer}
          onRemoveAnswer={handleRemoveAnswer}
          onSubmit={handleSubmit}
          onSelectedCorrectAnswer={setSelectedCorrectAnswer}
          onFlipSideChange={setFlipSide}
        />

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

        <h3>Flashcards in this deck:</h3>
        <FlashcardList
          flashcards={flashcards}
          onDeleteCard={handleRemoveCard}
        />
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

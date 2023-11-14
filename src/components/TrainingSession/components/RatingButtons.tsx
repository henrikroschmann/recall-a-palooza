import React from "react";

interface RatingButtonsProps {
  handleRating: (rating: "easy" | "medium" | "hard") => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({ handleRating }) => {
  return (
    <div className="rating-buttons">
      <button className="easy-btn" onClick={() => handleRating("easy")}>
        Easy
      </button>
      <button className="medium-btn" onClick={() => handleRating("medium")}>
        Medium
      </button>
      <button className="hard-btn" onClick={() => handleRating("hard")}>
        Hard
      </button>
    </div>
  );
};

export default RatingButtons;

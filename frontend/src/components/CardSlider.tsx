import { useState } from "react";

interface Card {
  id: string;
  title: string;
}

interface CardSliderProps {
  cards: Card[];
}

const CardSlider = ({ cards }: CardSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < cards.length - 4.5;

  return (
    <div className="card-slider">
      <div
        className="slider-container"
        style={{ transform: `translateX(-${currentIndex * (100 / 4.5)}%)` }}
      >
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
      {showLeftArrow && (
        <button className="arrow left" onClick={slideLeft}>
          &lt;
        </button>
      )}
      {showRightArrow && (
        <button className="arrow right" onClick={slideRight}>
          &gt;
        </button>
      )}
    </div>
  );
};

export default CardSlider;

import { useState } from "react";

import { Left, Right } from "neetoicons";
import { Button } from "neetoui";

const Carousel = ({ imageUrls, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex(currentIndex => (currentIndex + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      currentIndex => (currentIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Left}
          style="text"
          onClick={handlePrev}
        />
        <img
          alt={title}
          className="h-56 w-56 object-cover"
          src={imageUrls[currentIndex]}
        />
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Right}
          style="text"
          onClick={handleNext}
        />
      </div>
      <div className="mt-3 flex space-x-1">
        {imageUrls.map((_, index) => {
          const defaultClasses =
            "border border-black rounded-full h-3 w-3 cursor-pointer";

          return (
            <span
              key={index}
              className={
                index === currentIndex
                  ? `${defaultClasses} bg-black`
                  : defaultClasses
              }
              onClick={() => setCurrentIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;

import { useState, useEffect, useRef } from "react";

import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Left, Right } from "neetoicons";
import { Button } from "neetoui";
import { append } from "ramda";
import { useParams } from "react-router-dom";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const { slug } = useParams();

  const { data: { imageUrl, imageUrls: partialImageUrls, title } = {} } =
    useShowProduct(slug);

  const imageUrls = append(imageUrl, partialImageUrls);

  const handleNext = () => {
    setCurrentIndex(currentIndex => (currentIndex + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      currentIndex => (currentIndex - 1 + imageUrls.length) % imageUrls.length
    );
    resetTimer();
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(handleNext, 3000);
  };

  useEffect(() => {
    timerRef.current = setInterval(handleNext, 3000);

    return () => clearInterval(timerRef.current);
  }, []);

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
          onClick={() => {
            handleNext();
            resetTimer();
          }}
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
              onClick={() => {
                setCurrentIndex(index);
                resetTimer();
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;

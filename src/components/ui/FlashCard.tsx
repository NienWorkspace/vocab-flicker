
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Vocabulary } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashCardProps {
  vocabularies: Vocabulary[];
  onComplete?: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ vocabularies, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentVocab = vocabularies[currentIndex];

  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;

  // Handle touch start event
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move event
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end event
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    } else {
      // If it's not a swipe, toggle flip
      handleFlip();
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setDirection('right');
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection(null);
      }, 300);
    }
  };

  // Reset touch states when current index changes
  useEffect(() => {
    setTouchStart(null);
    setTouchEnd(null);
  }, [currentIndex]);

  if (!currentVocab) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center">
        <p className="text-gray-500">No vocabulary items available.</p>
      </div>
    );
  }

  return (
    <div className="flashcard-container w-full max-w-lg mx-auto">
      <div className="relative mb-6">
        <div className="absolute left-0 -top-12 text-sm text-gray-500">
          Card {currentIndex + 1} of {vocabularies.length}
        </div>
      </div>
      
      <div 
        ref={cardRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={cn(
          "flashcard cursor-pointer h-72 mx-auto mb-6 relative",
          isFlipped ? "flipped" : "",
          direction === 'right' ? "animate-slide-out" : 
          direction === 'left' ? "animate-slide-in" : ""
        )}
        onClick={handleFlip}
      >
        <div className="flashcard-front glassmorphism rounded-2xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-3xl font-bold text-primary mb-4 text-center">
            {currentVocab.term}
          </h3>
          {currentVocab.example && (
            <p className="text-gray-600 mt-4 text-center italic">{currentVocab.example}</p>
          )}
          <div className="mt-6 text-gray-400 text-sm">Click to reveal definition</div>
        </div>
        
        <div className="flashcard-back glassmorphism rounded-2xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-medium text-gray-800 mb-4 text-center">
            {currentVocab.definition}
          </h3>
          {currentVocab.example && (
            <p className="text-gray-600 mt-4 text-center italic">{currentVocab.example}</p>
          )}
          <div className="mt-6 text-gray-400 text-sm">Click to see term</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          Swipe to navigate or tap to flip
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleNext}
          disabled={currentIndex === vocabularies.length - 1 && !onComplete}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashCard;


import React, { useState, useEffect } from 'react';
import { Vocabulary } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface MultipleChoiceProps {
  vocabularies: Vocabulary[];
  onComplete?: () => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ vocabularies, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionsComplete, setQuestionsComplete] = useState(0);

  const currentVocab = vocabularies[currentIndex];
  
  // Generate options including the correct answer and random distractors
  useEffect(() => {
    if (!vocabularies.length) return;
    
    // Get the correct definition
    const correctDefinition = currentVocab.definition;
    
    // Get 3 random definitions from other vocabulary items
    const distractors = vocabularies
      .filter(v => v.id !== currentVocab.id)
      .map(v => v.definition)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle all options
    const allOptions = [correctDefinition, ...distractors].sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [currentIndex, vocabularies]);

  const handleSelectOption = (option: string) => {
    if (selectedOption) return; // Prevent selecting after answer is chosen
    
    setSelectedOption(option);
    const correct = option === currentVocab.definition;
    setIsCorrect(correct);
    
    if (correct) {
      toast.success('Correct answer!');
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      setQuestionsComplete(questionsComplete + 1);
      
      if (currentIndex < vocabularies.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else if (onComplete) {
        onComplete();
      }
    } else {
      // If answer was wrong, just reset selection and let them try again
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  if (!currentVocab || !options.length) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center">
        <p className="text-gray-500">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative mb-8">
        <div className="absolute left-0 -top-10 text-sm text-gray-500">
          Question {questionsComplete + 1} of {vocabularies.length}
        </div>
      </div>
      
      <div className="glassmorphism rounded-2xl p-8 mb-8 animate-fade-in">
        <h3 className="text-2xl font-bold text-primary mb-6 text-center">
          {currentVocab.term}
        </h3>
        
        {currentVocab.example && (
          <p className="text-gray-600 mb-6 text-center italic">
            "{currentVocab.example}"
          </p>
        )}
        
        <p className="text-gray-700 mb-6 text-center">
          Select the correct definition:
        </p>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(option)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all duration-300",
                "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
                selectedOption === option && option === currentVocab.definition && "bg-green-50 border-green-500",
                selectedOption === option && option !== currentVocab.definition && "bg-red-50 border-red-500",
                !selectedOption && "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOption === option && (
                  <>
                    {option === currentVocab.definition ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          className={cn(
            "transition-all duration-300",
            isCorrect === false && "opacity-0"  // Hide button if answer is wrong
          )}
        >
          {isCorrect ? 'Next' : 'Try Again'}
          {isCorrect && <ChevronRight className="ml-1 w-4 h-4" />}
        </Button>
      </div>
      
      {isCorrect === false && (
        <p className="text-sm text-center mt-4 text-red-500 animate-fade-in">
          That's not correct. Try again!
        </p>
      )}
    </div>
  );
};

export default MultipleChoice;

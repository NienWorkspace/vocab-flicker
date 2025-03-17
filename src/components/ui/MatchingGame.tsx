
import React, { useState, useEffect } from 'react';
import { Vocabulary } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, Medal } from 'lucide-react';

interface Item {
  id: string;
  text: string;
  type: 'term' | 'definition';
  matched: boolean;
}

interface MatchingGameProps {
  vocabularies: Vocabulary[];
  onComplete?: () => void;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ vocabularies, onComplete }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  // Initialize game items
  useEffect(() => {
    if (!vocabularies.length) return;
    
    // Limit to 6 pairs for better UX
    const limitedVocab = vocabularies.slice(0, 6);
    
    // Create items from vocabulary for both terms and definitions
    const terms: Item[] = limitedVocab.map(vocab => ({
      id: `term-${vocab.id}`,
      text: vocab.term,
      type: 'term',
      matched: false
    }));
    
    const definitions: Item[] = limitedVocab.map(vocab => ({
      id: `def-${vocab.id}`,
      text: vocab.definition,
      type: 'definition',
      matched: false
    }));
    
    // Combine and shuffle all items
    const allItems = [...terms, ...definitions].sort(() => 0.5 - Math.random());
    
    setItems(allItems);
    setMatches(0);
    setGameCompleted(false);
  }, [vocabularies]);

  // Handle item selection
  const handleSelectItem = (item: Item) => {
    if (item.matched) return;
    
    if (!selectedItem) {
      // First selection
      setSelectedItem(item);
    } else {
      // Second selection - check if it's a match
      const isMatch = 
        (selectedItem.type === 'term' && item.type === 'definition' && 
         selectedItem.id.split('-')[1] === item.id.split('-')[1]) ||
        (selectedItem.type === 'definition' && item.type === 'term' && 
         selectedItem.id.split('-')[1] === item.id.split('-')[1]);
      
      if (isMatch) {
        // It's a match!
        const updatedItems = items.map(i => 
          (i.id === item.id || i.id === selectedItem.id) 
            ? { ...i, matched: true } 
            : i
        );
        
        setItems(updatedItems);
        setMatches(matches + 1);
        toast.success('Match found!');
        
        // Check if game is complete
        if (matches + 1 === vocabularies.slice(0, 6).length) {
          setGameCompleted(true);
          toast.success('Great job! All matches found!');
        }
      } else {
        // Not a match
        toast.error('Not a match. Try again!');
      }
      
      setSelectedItem(null);
    }
  };

  const handleReset = () => {
    // Re-shuffle the items
    setItems(prevItems => [...prevItems].sort(() => 0.5 - Math.random()).map(item => ({
      ...item,
      matched: false
    })));
    setMatches(0);
    setSelectedItem(null);
    setGameCompleted(false);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Match terms with definitions</h3>
        <div className="text-sm font-medium text-primary">
          Matches: {matches}/{vocabularies.slice(0, 6).length}
        </div>
      </div>
      
      {gameCompleted ? (
        <div className="glassmorphism rounded-2xl p-8 text-center animate-scale-in">
          <Medal className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-float" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-gray-600 mb-6">
            You've successfully matched all the terms with their definitions.
          </p>
          <div className="flex space-x-4 justify-center">
            <Button variant="outline" onClick={handleReset}>
              Play Again
            </Button>
            <Button onClick={handleComplete}>
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              disabled={item.matched}
              className={cn(
                "p-4 text-left rounded-lg transition-all duration-300 h-24 flex items-center overflow-hidden relative",
                item.matched 
                  ? "bg-green-50 border-green-200 border-2 cursor-default"
                  : selectedItem?.id === item.id
                    ? "glassmorphism border-primary border-2 shadow-md"
                    : "glassmorphism hover:border-primary hover:border-2",
              )}
            >
              <span className={cn(
                "transition-opacity duration-300",
                item.matched ? "text-green-700" : "text-gray-800"
              )}>
                {item.text}
              </span>
              
              {item.matched && (
                <div className="absolute right-3 top-3">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchingGame;

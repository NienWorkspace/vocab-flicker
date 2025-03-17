
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vocabulary } from '@/types';
import { BookOpen, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface EditVocabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vocabularies: Omit<Vocabulary, 'studySetId' | 'createdAt'>[]) => void;
  vocabularies: Omit<Vocabulary, 'studySetId' | 'createdAt'>[];
  studySetName: string;
}

const EditVocabModal: React.FC<EditVocabModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  vocabularies: initialVocabularies,
  studySetName
}) => {
  const [vocabularies, setVocabularies] = useState<Omit<Vocabulary, 'studySetId' | 'createdAt'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVocabularies(initialVocabularies.length > 0 
        ? [...initialVocabularies] 
        : [{ id: uuidv4(), term: '', definition: '', example: '' }]
      );
    }
  }, [isOpen, initialVocabularies]);

  const handleAddVocabulary = () => {
    setVocabularies([...vocabularies, { id: uuidv4(), term: '', definition: '', example: '' }]);
  };

  const handleRemoveVocabulary = (id: string) => {
    if (vocabularies.length === 1) {
      toast.error("You must have at least one vocabulary term");
      return;
    }
    setVocabularies(vocabularies.filter(vocab => vocab.id !== id));
  };

  const handleVocabularyChange = (id: string, field: keyof Omit<Vocabulary, 'id' | 'studySetId' | 'createdAt'>, value: string) => {
    setVocabularies(
      vocabularies.map(vocab => 
        vocab.id === id ? { ...vocab, [field]: value } : vocab
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one vocabulary with term and definition
    const valid = vocabularies.some(vocab => vocab.term.trim() && vocab.definition.trim());
    if (!valid) {
      toast.error('Please add at least one vocabulary with term and definition');
      return;
    }
    
    setIsSubmitting(true);
    
    // Filter out empty vocabulary entries
    const filteredVocabs = vocabularies.filter(vocab => 
      vocab.term.trim() && vocab.definition.trim()
    );
    
    onSubmit(filteredVocabs);
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism sm:max-w-3xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Edit Vocabulary for "{studySetName}"</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {vocabularies.map((vocab, index) => (
              <div 
                key={vocab.id} 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-white/50"
              >
                <div className="space-y-2">
                  <Label htmlFor={`term-${index}`}>Term {index + 1}</Label>
                  <Input 
                    id={`term-${index}`} 
                    placeholder="Enter term" 
                    value={vocab.term} 
                    onChange={(e) => handleVocabularyChange(vocab.id, 'term', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`definition-${index}`}>Definition</Label>
                  <Input 
                    id={`definition-${index}`} 
                    placeholder="Enter definition" 
                    value={vocab.definition} 
                    onChange={(e) => handleVocabularyChange(vocab.id, 'definition', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`example-${index}`}>Example (Optional)</Label>
                  <div className="flex">
                    <Input 
                      id={`example-${index}`} 
                      placeholder="Enter example sentence" 
                      value={vocab.example || ''} 
                      onChange={(e) => handleVocabularyChange(vocab.id, 'example', e.target.value)}
                      className="flex-1"
                      autoComplete="off"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveVocabulary(vocab.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1 mx-auto"
            onClick={handleAddVocabulary}
          >
            <Plus className="w-4 h-4" />
            Add Term
          </Button>
          
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !vocabularies.some(v => v.term && v.definition)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVocabModal;

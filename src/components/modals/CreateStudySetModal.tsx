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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FileUploader from '@/components/ui/FileUploader';
import { Folder, StudySet, Vocabulary } from '@/types';
import { BookOpen, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface CreateStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { studySet: Pick<StudySet, 'name' | 'description' | 'folderId'>, vocabularies: Omit<Vocabulary, 'id' | 'studySetId' | 'createdAt'>[] }) => void;
  defaultValues?: { 
    studySet: Pick<StudySet, 'name' | 'description' | 'folderId'>,
    vocabularies?: Omit<Vocabulary, 'studySetId' | 'createdAt'>[]
  };
  folders: Folder[];
  isEdit?: boolean;
}

const CreateStudySetModal: React.FC<CreateStudySetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  defaultValues,
  folders,
  isEdit = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [name, setName] = useState(defaultValues?.studySet.name || '');
  const [description, setDescription] = useState(defaultValues?.studySet.description || '');
  const [folderId, setFolderId] = useState(defaultValues?.studySet.folderId || '');
  const [vocabularies, setVocabularies] = useState<Omit<Vocabulary, 'studySetId' | 'createdAt'>[]>(
    defaultValues?.vocabularies || [{ id: uuidv4(), term: '', definition: '', example: '' }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(defaultValues?.studySet.name || '');
      setDescription(defaultValues?.studySet.description || '');
      setFolderId(defaultValues?.studySet.folderId || '');
      setVocabularies(defaultValues?.vocabularies || [{ id: uuidv4(), term: '', definition: '', example: '' }]);
    }
  }, [isOpen, defaultValues]);

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

  const handleFileUpload = (content: string) => {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      const parsedVocabs: Omit<Vocabulary, 'studySetId' | 'createdAt'>[] = [];
      
      lines.forEach(line => {
        const parts = line.split(':').map(part => part.trim());
        if (parts.length >= 2) {
          parsedVocabs.push({
            id: uuidv4(),
            term: parts[0],
            definition: parts[1],
            example: parts[2] || ''
          });
        }
      });
      
      if (parsedVocabs.length === 0) {
        toast.error('No valid vocabulary entries found in the file');
        return;
      }
      
      setVocabularies(parsedVocabs);
      toast.success(`Imported ${parsedVocabs.length} vocabulary ${parsedVocabs.length === 1 ? 'term' : 'terms'}`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error parsing file. Please check format.');
    }
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
    const filteredVocabs = vocabularies
      .filter(vocab => vocab.term.trim() && vocab.definition.trim())
      .map(({ id, ...rest }) => rest); // Remove id for new entries
    
    onSubmit({ 
      studySet: { name, description, folderId },
      vocabularies: filteredVocabs
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism sm:max-w-3xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>{isEdit ? 'Edit Study Set' : 'Create New Study Set'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Study Set Name</Label>
              <Input 
                id="name" 
                placeholder="Enter study set name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folder">Folder (Optional)</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent className="glassmorphism">
                  <SelectItem value="">None</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Enter a description for this study set" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="pt-2 border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="manual">
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="import">
                  Import from File
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
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
                            ×
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
              </TabsContent>
              
              <TabsContent value="import">
                <div className="space-y-4">
                  <FileUploader onFileContent={handleFileUpload} />
                  
                  {vocabularies.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Preview ({vocabularies.length} terms)</h4>
                      <div className="max-h-64 overflow-y-auto border rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Definition</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {vocabularies.map((vocab, i) => (
                              <tr key={i}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{vocab.term}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{vocab.definition}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{vocab.example}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || isSubmitting || !vocabularies.some(v => v.term && v.definition)}
            >
              {isEdit ? 'Save Changes' : 'Create Study Set'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudySetModal;

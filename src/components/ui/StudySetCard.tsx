
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Play, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { StudySet } from '@/types';
import { Link } from 'react-router-dom';

interface StudySetCardProps {
  studySet: StudySet;
  onEdit?: (studySet: StudySet) => void;
  onDelete?: (studySet: StudySet) => void;
}

const StudySetCard: React.FC<StudySetCardProps> = ({ studySet, onEdit, onDelete }) => {
  const formattedDate = new Date(studySet.createdAt).toLocaleDateString();
  
  return (
    <Card className="h-full glassmorphism hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold line-clamp-1">{studySet.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glassmorphism animate-scale-in">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEdit && onEdit(studySet)}
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-500"
                onClick={() => onDelete && onDelete(studySet)}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-gray-500 mb-2">
          {studySet.vocabularyCount} {studySet.vocabularyCount === 1 ? 'term' : 'terms'}
        </p>
        {studySet.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{studySet.description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <p className="text-xs text-gray-500">Created: {formattedDate}</p>
        <Button 
          className="flex items-center gap-1" 
          size="sm"
          asChild
        >
          <Link to={`/study/${studySet.id}`}>
            <Play className="h-4 w-4" />
            <span>Study</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudySetCard;

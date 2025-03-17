
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Folder } from '@/types';
import { Link } from 'react-router-dom';

interface FolderCardProps {
  folder: Folder;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onEdit, onDelete }) => {
  const formattedDate = new Date(folder.createdAt).toLocaleDateString();
  
  return (
    <Card className="h-full glassmorphism hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold line-clamp-1">{folder.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glassmorphism animate-scale-in">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEdit && onEdit(folder)}
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-500"
                onClick={() => onDelete && onDelete(folder)}
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
          {folder.studySetCount} {folder.studySetCount === 1 ? 'study set' : 'study sets'}
        </p>
        {folder.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{folder.description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <p className="text-xs text-gray-500">Created: {formattedDate}</p>
        <Button 
          variant="outline" 
          className="flex items-center gap-1" 
          size="sm"
          asChild
        >
          <Link to={`/folder/${folder.id}`}>
            <FolderOpen className="h-4 w-4" />
            <span>Open</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FolderCard;

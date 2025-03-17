
export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  example?: string;
  studySetId: string;
  createdAt: string;
}

export interface StudySet {
  id: string;
  name: string;
  description?: string;
  vocabularyCount: number;
  folderId?: string;
  userId: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  studySetCount: number;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}

export type StudyMode = 'flashcards' | 'multiplechoice' | 'matching';


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, FolderPlus, BookPlus } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { StudySet, Folder } from '@/types';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudySetCard from '@/components/ui/StudySetCard';
import FolderCard from '@/components/ui/FolderCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateFolderModal from '@/components/modals/CreateFolderModal';
import CreateStudySetModal from '@/components/modals/CreateStudySetModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('studysets');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateStudySetModal, setShowCreateStudySetModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editingStudySet, setEditingStudySet] = useState<StudySet | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  // Fetch study sets
  const {
    data: studySets = [],
    isLoading: isLoadingStudySets,
    refetch: refetchStudySets
  } = useQuery({
    queryKey: ['studySets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('study_sets')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });
      
      if (error) {
        toast.error('Failed to load study sets');
        throw error;
      }
      
      return data as StudySet[];
    },
    enabled: !!user
  });

  // Fetch folders
  const {
    data: folders = [],
    isLoading: isLoadingFolders,
    refetch: refetchFolders
  } = useQuery({
    queryKey: ['folders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });
      
      if (error) {
        toast.error('Failed to load folders');
        throw error;
      }
      
      return data as Folder[];
    },
    enabled: !!user
  });

  // Handle study set deletion
  const handleDeleteStudySet = async (studySet: StudySet) => {
    if (!confirm(`Are you sure you want to delete "${studySet.name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('study_sets')
        .delete()
        .eq('id', studySet.id);
      
      if (error) throw error;
      
      toast.success('Study set deleted successfully');
      refetchStudySets();
    } catch (error) {
      console.error('Error deleting study set:', error);
      toast.error('Failed to delete study set');
    }
  };

  // Handle folder deletion
  const handleDeleteFolder = async (folder: Folder) => {
    if (!confirm(`Are you sure you want to delete "${folder.name}"?`)) return;
    
    try {
      // First check if folder has study sets
      const { data, error: checkError } = await supabase
        .from('study_sets')
        .select('id')
        .eq('folderId', folder.id);
      
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        if (!confirm(`This folder contains ${data.length} study sets. These will be unlinked from the folder but not deleted. Continue?`)) return;
        
        // Update study sets to remove folderId
        const { error: updateError } = await supabase
          .from('study_sets')
          .update({ folderId: null })
          .eq('folderId', folder.id);
        
        if (updateError) throw updateError;
      }
      
      // Delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folder.id);
      
      if (error) throw error;
      
      toast.success('Folder deleted successfully');
      refetchFolders();
      refetchStudySets();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  // Handle edit folder
  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setShowCreateFolderModal(true);
  };

  // Handle edit study set
  const handleEditStudySet = (studySet: StudySet) => {
    setEditingStudySet(studySet);
    setShowCreateStudySetModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-gray-600">Manage your study sets and folders</p>
        </header>
        
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="studysets">Study Sets</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowCreateFolderModal(true)}
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowCreateStudySetModal(true)}
            >
              <BookPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Study Set</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="studysets" className="mt-0">
          {isLoadingStudySets ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="glassmorphism h-52 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : studySets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySets.map((studySet) => (
                <StudySetCard 
                  key={studySet.id} 
                  studySet={studySet}
                  onEdit={handleEditStudySet}
                  onDelete={handleDeleteStudySet}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No study sets yet</h3>
              <p className="text-gray-500 mb-6">Create your first study set to start learning</p>
              <Button 
                onClick={() => setShowCreateStudySetModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Study Set
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="folders" className="mt-0">
          {isLoadingFolders ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="glassmorphism h-52 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : folders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder}
                  onEdit={handleEditFolder}
                  onDelete={handleDeleteFolder}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No folders yet</h3>
              <p className="text-gray-500 mb-6">Organize your study sets with folders</p>
              <Button 
                onClick={() => setShowCreateFolderModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Folder
              </Button>
            </div>
          )}
        </TabsContent>
      </main>
      
      <Footer />
      
      {/* Modals */}
      <CreateFolderModal 
        isOpen={showCreateFolderModal} 
        onOpenChange={setShowCreateFolderModal}
        folder={editingFolder}
        onSuccess={() => {
          refetchFolders();
          setEditingFolder(null);
        }}
      />
      
      <CreateStudySetModal 
        isOpen={showCreateStudySetModal} 
        onOpenChange={setShowCreateStudySetModal}
        studySet={editingStudySet}
        folders={folders}
        onSuccess={() => {
          refetchStudySets();
          setEditingStudySet(null);
        }}
      />
    </div>
  );
};

export default Dashboard;

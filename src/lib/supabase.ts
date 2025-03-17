
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get the actual Supabase URL and anon key from environment variables
// or use default values for local development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.includes('.supabase.co')
  );
};

// Utility function to handle Supabase errors
export const handleSupabaseError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('Supabase error:', error);
  
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please add your Supabase URL and anon key to your environment variables.');
    return;
  }
  
  if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};

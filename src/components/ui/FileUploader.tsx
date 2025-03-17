
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileContent: (content: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check if file is a text file
    if (selectedFile.type !== 'text/plain') {
      toast.error('Please upload a .txt file');
      return;
    }
    
    setFileName(selectedFile.name);
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        onFileContent(content);
        setIsLoading(false);
        setIsSuccess(true);
        
        // Reset success status after a delay
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsLoading(false);
    };
    
    reader.readAsText(selectedFile);
  };

  const handleReset = () => {
    setFileName(null);
    setIsSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".txt"
        onChange={handleFileChange}
      />
      
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all duration-300 text-center cursor-pointer",
          fileName ? "border-gray-300 bg-gray-50" : "border-gray-200 hover:border-primary/50",
          isSuccess && "border-green-500 bg-green-50"
        )}
        onClick={fileName ? undefined : handleUploadClick}
      >
        {!fileName ? (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm font-medium">
              Click to upload or drag and drop
            </div>
            <div className="text-xs text-gray-500">
              Text file (.txt) with format: Vocabulary: Definition: Example (optional)
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <div className="text-sm font-medium">{fileName}</div>
                <div className="text-xs text-gray-500">
                  {isLoading ? 'Processing...' : isSuccess ? 'Successfully uploaded' : 'Ready'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isSuccess ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Each line should follow this format: Term: Definition: Example (optional)
      </div>
    </div>
  );
};

export default FileUploader;

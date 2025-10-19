import { Upload, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export const UploadZone = ({ onFileSelect, isUploading }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-secondary/30",
        isUploading && "pointer-events-none opacity-60"
      )}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center cursor-pointer"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg">
          {isUploading ? (
            <FileText className="w-10 h-10 text-primary-foreground animate-pulse" />
          ) : (
            <Upload className="w-10 h-10 text-primary-foreground" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {isUploading ? "Uploading..." : "Upload PDF Report"}
        </h3>
        
        <p className="text-muted-foreground text-center mb-4">
          Drag and drop your PDF file here, or click to browse
        </p>
        
        <p className="text-sm text-muted-foreground">
          Maximum file size: 20MB
        </p>
      </label>
    </div>
  );
};

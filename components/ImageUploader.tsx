
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onImageChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
      className="w-full aspect-square bg-black/30 p-2 border border-slate-800 rounded-md"
    >
        <div
            className="w-full h-full border-2 border-dashed border-slate-700 rounded-md flex items-center justify-center text-center p-4 cursor-pointer hover:border-teal-600/70 hover:bg-black/40 transition-all duration-300 relative"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            {previewUrl ? (
                <img src={previewUrl} alt="Image preview" className="max-w-full max-h-full object-contain rounded-md" />
            ) : (
                <div className="text-gray-500 flex flex-col items-center gap-2">
                <UploadIcon className="w-12 h-12" />
                <p className="font-semibold">Click to upload or drag & drop</p>
                <p className="text-sm">PNG, JPG or WEBP</p>
                </div>
            )}
        </div>
    </div>
  );
};

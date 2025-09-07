
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { generateStylePrompt, generateImage } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { CornerTopLeftIcon } from './components/icons/CornerTopLeftIcon';
import { CornerTopRightIcon } from './components/icons/CornerTopRightIcon';
import { CornerBottomLeftIcon } from './components/icons/CornerBottomLeftIcon';
import { CornerBottomRightIcon } from './components/icons/CornerBottomRightIcon';

type LoadingStep = 'idle' | 'prompt' | 'image';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('idle');
  const [promptError, setPromptError] = useState<string | null>(null);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);


  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedPrompt('');
      setPromptError(null);
      setGeneratedImageUrl(null);
      setImageGenerationError(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageFile || !imagePreview) {
      setPromptError('Please upload an image first.');
      return;
    }

    setLoadingStep('prompt');
    setPromptError(null);
    setGeneratedPrompt('');
    setGeneratedImageUrl(null);
    setImageGenerationError(null);

    try {
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imageFile.type;
      
      const prompt = await generateStylePrompt(base64Data, mimeType);
      setGeneratedPrompt(prompt);

      setLoadingStep('image');
      try {
          const imageUrl = await generateImage(prompt);
          setGeneratedImageUrl(imageUrl);
      } catch (e) {
          console.error(e);
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
          setImageGenerationError(`Failed to conjure image. ${errorMessage}`);
      }

    } catch (e) {
      console.error(e);
      setPromptError('Failed to generate prompt. Please check the API key and try again.');
    } finally {
      setLoadingStep('idle');
    }
  }, [imageFile, imagePreview]);
  
  const getButtonContent = () => {
    if (loadingStep === 'prompt') {
      return 'Conjuring Prompt...';
    }
    if (loadingStep === 'image') {
      return 'Conjuring Image...';
    }
    return 'Conjure Prompt';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl text-center mb-6">
          <h1 className="text-6xl sm:text-7xl font-creepster text-slate-200 tracking-widest text-shadow-glow">
            Prompt Weaver
          </h1>
        <p className="text-slate-500 text-lg">
          Upload an image to conjure a prompt for Imagen 4.0 that captures its unique style.
        </p>
      </header>

      {/* Main Framed Container */}
      <div className="relative w-full max-w-7xl bg-black/40 border-2 border-slate-800/70 p-6 sm:p-8 rounded-lg shadow-2xl shadow-teal-900/20">
        {/* Corner Decorations */}
        <CornerTopLeftIcon className="absolute -top-1 -left-1 w-16 h-16 text-slate-700" />
        <CornerTopRightIcon className="absolute -top-1 -right-1 w-16 h-16 text-slate-700" />
        <CornerBottomLeftIcon className="absolute -bottom-1 -left-1 w-16 h-16 text-slate-700" />
        <CornerBottomRightIcon className="absolute -bottom-1 -right-1 w-16 h-16 text-slate-700" />

        <header className="w-full text-center mb-8 border-b border-slate-800 pb-6">
            <div className="flex items-center justify-center gap-3">
                <SparklesIcon className="w-8 h-8 text-teal-500" />
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-200 tracking-wider">
                    Prompt Weaver
                </h2>
            </div>
            <p className="text-slate-500 text-md mt-1">
                Upload an image to conjure a prompt for Imagen 4.0 that captures its unique style.
            </p>
        </header>

        <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
            <ImageUploader onImageChange={handleImageChange} previewUrl={imagePreview} />
            
            <button
                onClick={handleGenerateClick}
                disabled={!imageFile || loadingStep !== 'idle'}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-teal-600/70 hover:bg-teal-600/10 hover:border-teal-500 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-teal-200 font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out"
            >
                {loadingStep !== 'idle' && (
                <div className="flex gap-1 items-center mr-2 pulse-dot-loader">
                    <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                </div>
                )}
                {getButtonContent()}
            </button>
            </div>
            
            <div className="flex flex-col">
            <PromptDisplay prompt={generatedPrompt} isLoading={loadingStep === 'prompt'} error={promptError} />
            </div>

            <div className="flex flex-col">
            <GeneratedImageDisplay
                imageUrl={generatedImageUrl}
                loadingStep={loadingStep}
                error={imageGenerationError}
                promptGenerated={!!generatedPrompt && !promptError}
            />
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
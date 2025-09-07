import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
  error: string | null;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prompt) {
      setCopied(false);
    }
  }, [prompt]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <SparklesIcon className="w-16 h-16 text-teal-500/50 animate-pulse" />
            <p className="mt-4 text-lg text-slate-500">Summoning inspiration...</p>
        </div>
      );
    }
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-red-500/80">
                <p className="font-semibold">A Shadowy Error Occurred</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }
    if (prompt) {
      return (
        <div className="animate-poof w-full text-center lg:text-left">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <CopyIcon className="w-5 h-5" />
          </button>
          {copied && (
            <span className="absolute top-3 right-14 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Copied!
            </span>
          )}
          <p className="text-slate-300 whitespace-pre-wrap font-mono text-base">
            {prompt}
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600">
          <p className="text-lg">Your conjured prompt will materialize here.</p>
      </div>
    );
  };
  
  return (
    <div className="w-full min-h-[200px] lg:h-full bg-black/30 border border-slate-800 rounded-lg p-6 relative flex items-center justify-center overflow-auto">
      {renderContent()}
    </div>
  );
};

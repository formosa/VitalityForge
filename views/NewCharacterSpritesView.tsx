import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Sparkles, Download, Upload, Dices } from 'lucide-react';
import { CreationWizardState } from '../types';
import * as gemini from '../services/geminiService';
import * as storage from '../services/storageService';
import WizardSteps from './WizardSteps';

interface Props {
  wizardState: CreationWizardState;
  updateWizard: (partial: Partial<CreationWizardState>) => void;
  onCancel: () => void;
  onNext: () => void;
  isEditing?: boolean;
}

const NewCharacterSpritesView: React.FC<Props> = ({ wizardState, updateWizard, onCancel, onNext, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSprites = async () => {
    if (!wizardState.referenceImage) return;
    setLoading(true);
    setError(null);
    try {
      const settings = storage.getSettings();

      // Check for API key if using Pro model
      if (settings.imageModel === 'gemini-3-pro-image-preview') {
         const hasKey = await gemini.checkApiKey();
         if (!hasKey) await gemini.requestApiKey();
      }

      const spriteSheet = await gemini.generateSpriteSheet(settings.spritesPrompt, wizardState.referenceImage, settings.imageModel);
      updateWizard({ spriteSheet });
    } catch (e: any) {
      setError(e.message || "Failed to generate sprites");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!wizardState.spriteSheet) return;
    const link = document.createElement('a');
    link.href = wizardState.spriteSheet;
    link.download = `vitality-sprites-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateWizard({ spriteSheet: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-cinzel font-bold text-stone-200">{isEditing ? 'Edit Vitality States' : 'Forge Vitality States'}</h1>
        <button onClick={onCancel} className="text-stone-500 hover:text-red-500 transition">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <WizardSteps currentStep={3} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 overflow-y-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center w-full">
          
          <div className="flex flex-col items-center">
            <h3 className="text-xs text-stone-500 mb-3 font-bold uppercase tracking-[0.2em]">Source Identity</h3>
            <div className="w-48 h-48 border border-stone-800 rounded-xl overflow-hidden shadow-xl opacity-60 bg-black">
               <img src={wizardState.referenceImage!} alt="Ref" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-stone-800 hidden lg:block">
            <ArrowRight className="w-10 h-10 opacity-20" />
          </div>

          <div className="flex flex-col items-center group">
             <h3 className="text-xs text-red-500 mb-3 font-bold uppercase tracking-[0.2em]">Evolution Grid</h3>
             <div className="w-[400px] h-[400px] bg-black/60 border-2 border-dashed border-stone-800 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl transition-all hover:border-stone-600">
                {loading ? (
                  <div className="text-center p-8">
                    <div className="relative mb-4 mx-auto w-12 h-12">
                      <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                      <Loader2 className="w-12 h-12 animate-spin text-red-600 relative z-10" />
                    </div>
                    <p className="text-sm font-bold text-stone-400 tracking-wide font-cinzel">Forging Damage States...</p>
                  </div>
                ) : wizardState.spriteSheet ? (
                  <>
                    <img src={wizardState.spriteSheet} alt="Sprites" className="w-full h-full object-contain" />
                    {/* Asset Controls Overlay */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={handleDownload}
                        className="dungeon-button p-2 rounded-full"
                        title="Download Sprite Sheet"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <label 
                        className="dungeon-button p-2 rounded-full cursor-pointer"
                        title="Upload Alternative"
                      >
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      </label>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={generateSprites}
                    className="flex flex-col items-center text-stone-600 hover:text-red-500 transition-all group-inner"
                  >
                    <div className="w-20 h-20 rounded-full bg-stone-900 group-inner-hover:bg-red-900/10 flex items-center justify-center mb-4 transition-colors border border-stone-800">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <span className="font-cinzel font-bold text-lg">Ignite Forge</span>
                  </button>
                )}
             </div>
             {error && <p className="text-red-400 mt-4 text-sm max-w-xs text-center bg-red-950/40 p-2 rounded border border-red-900/50">{error}</p>}
          </div>

        </div>

        <div className="flex gap-4">
           {wizardState.spriteSheet && (
             <button 
               onClick={generateSprites} 
               disabled={loading}
               className="dungeon-button px-6 py-3 rounded-lg font-bold flex items-center gap-2 group"
             >
               <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
               Reforge
             </button>
           )}
           
           <button 
            onClick={onNext}
            disabled={!wizardState.spriteSheet || loading}
            className="dungeon-button-primary py-3 px-12 rounded-lg shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
          >
            <span>Proceed</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCharacterSpritesView;
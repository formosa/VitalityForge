import React, { useState } from 'react';
import { X, Save, Loader2, PlayCircle, Key, Info, Image, Film, Dices } from 'lucide-react';
import { CreationWizardState } from '../types';
import * as gemini from '../services/geminiService';
import * as storage from '../services/storageService';
import WizardSteps from './WizardSteps';

interface Props {
  wizardState: CreationWizardState;
  updateWizard: (partial: Partial<CreationWizardState>) => void;
  onCancel: () => void;
  onSave: (mode: 'video' | 'sprite') => void;
  isEditing?: boolean;
}

const NewCharacterAnimationView: React.FC<Props> = ({ wizardState, updateWizard, onCancel, onSave, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = storage.getSettings();

  const handleUpdateKey = async () => {
    await gemini.requestApiKey();
  };

  const generateVideo = async () => {
    if (!wizardState.spriteSheet) return;

    const hasKey = await gemini.checkApiKey();
    if (!hasKey) {
        await gemini.requestApiKey();
    }

    setLoading(true);
    setError(null);
    try {
      const videoUri = await gemini.generateAnimationVideo(settings.videoPrompt, wizardState.spriteSheet);
      const authedUri = `${videoUri}&key=${process.env.API_KEY}`;
      updateWizard({ videoUri: authedUri });
    } catch (e: any) {
      setError(e.message || "Failed to generate video");
    } finally {
      setLoading(false);
    }
  };

  const isKeyError = error && error.includes("API key");

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-cinzel font-bold text-stone-200">{isEditing ? 'Edit Animation Ritual' : 'Animation Ritual'}</h1>
        <button onClick={onCancel} className="text-stone-500 hover:text-red-500 transition">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <WizardSteps currentStep={4} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 overflow-y-auto">
        {settings.isVeoEnabled ? (
            <div className="flex flex-col xl:flex-row gap-12 items-center justify-center w-full">
              <div className="flex flex-col items-center opacity-50 hover:opacity-100 transition duration-500">
                <h3 className="text-stone-500 mb-3 font-bold uppercase tracking-widest text-[10px]">Static Source</h3>
                <div className="w-64 h-64 border border-stone-700 rounded-xl overflow-hidden bg-black">
                   <img src={wizardState.spriteSheet!} alt="Sprites" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="hidden xl:block text-stone-800">
                <Film className="w-8 h-8 opacity-20" />
              </div>

              <div className="flex flex-col items-center">
                 <h3 className="text-amber-600 mb-3 font-bold uppercase tracking-widest text-[10px]">Veo Interpolation</h3>
                 <div className="w-[400px] h-[400px] bg-black border border-amber-900/30 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl ring-1 ring-amber-500/10">
                    {loading ? (
                      <div className="text-center p-6">
                        <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
                        <p className="text-amber-100 font-bold mb-2 font-cinzel">Weaving Frames...</p>
                        <p className="text-xs text-amber-700 max-w-xs text-center">
                          The ritual requires time (~60s).
                        </p>
                      </div>
                    ) : wizardState.videoUri ? (
                      <video 
                        src={wizardState.videoUri} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-6">
                        <button 
                          onClick={generateVideo}
                          className="group relative flex flex-col items-center"
                        >
                          <div className="w-20 h-20 bg-amber-900/10 rounded-full flex items-center justify-center group-hover:bg-amber-600 group-hover:text-black text-amber-600 transition-all duration-300 mb-3 border border-amber-800/50">
                            <PlayCircle className="w-10 h-10" />
                          </div>
                          <span className="font-bold text-amber-100 group-hover:text-white transition font-cinzel">Cast Animation</span>
                        </button>
                        
                        <div className="flex items-center gap-2 text-[10px] text-amber-700 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/30">
                          <Info className="w-3 h-3" />
                          <span>Paid Ritual Required</span>
                        </div>
                      </div>
                    )}
                 </div>
                 {error && (
                   <div className="mt-4 p-4 bg-red-950/50 border border-red-900 rounded-lg max-w-sm text-center">
                     <p className="text-red-400 text-sm mb-3">{error}</p>
                     {isKeyError && (
                       <button 
                         onClick={handleUpdateKey}
                         className="text-xs bg-red-900 hover:bg-red-800 text-white px-3 py-1.5 rounded flex items-center justify-center gap-2 mx-auto border border-red-700"
                       >
                         <Key className="w-3 h-3" />
                         Offer Tribute (API Key)
                       </button>
                     )}
                   </div>
                 )}
              </div>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                <h3 className="text-stone-500 mb-3 font-bold uppercase tracking-widest text-[10px]">Vitality Sheet</h3>
                <div className="w-96 h-96 border border-stone-700 rounded-xl overflow-hidden shadow-2xl bg-black">
                   <img src={wizardState.spriteSheet!} alt="Sprites" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-stone-500 mt-6 max-w-xs text-center">
                    Enable <span className="text-amber-600">Veo Video</span> in Settings for animated rituals.
                </p>
            </div>
        )}

        <div className="flex flex-col gap-4 items-center w-full max-w-md pt-8">
          {settings.isVeoEnabled ? (
            <>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => onSave('sprite')}
                  disabled={loading}
                  className="dungeon-button flex-1 py-4 rounded-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  {isEditing ? 'Update Sprites Only' : 'Save as Sprites'}
                </button>
                <button
                  onClick={() => onSave('video')}
                  disabled={!wizardState.videoUri || loading}
                  className="dungeon-button flex-1 border-amber-900 text-amber-200 hover:text-amber-100 hover:border-amber-600 py-4 rounded-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Update with Video' : 'Save with Video'}
                </button>
              </div>
               {wizardState.videoUri && !loading && (
                 <button
                   onClick={generateVideo}
                   className="dungeon-button px-6 py-2 text-xs flex items-center gap-2 rounded-full text-stone-500 hover:text-white transition group"
                 >
                   <Dices className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                   Recast Spell
                 </button>
               )}
            </>
          ) : (
             <button
              onClick={() => onSave('sprite')}
              className="dungeon-button-primary w-full py-4 px-6 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Entity' : 'Bind Soul (Save)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCharacterAnimationView;
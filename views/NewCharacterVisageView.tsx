
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Activity, ShieldCheck, Sparkles, FastForward, Info, Code, X, Copy, Edit3, Sliders, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { CreationWizardState } from '../types';
import { VISAGE_MODIFIERS, ABILITY_SCORES_DATA, STYLE_PRESETS } from '../constants';
import { RACE_DATA } from '../data/races';
import * as gemini from '../services/geminiService';
import * as storage from '../services/storageService';
import WizardSteps from './WizardSteps';

interface Props {
  wizardState: CreationWizardState;
  updateWizard: (partial: Partial<CreationWizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onJumpToStep?: (step: number) => void;
}

const VISAGE_LABELS: Record<string, string> = {
  STR: "Muscle-Mass",
  DEX: "Body Fat %",
  CON: "Skin Health",
  INT: "Are you retarded?",
  WIS: "Facial Gaunt",
  CHA: "Attractiveness"
};

const NewCharacterVisageView: React.FC<Props> = ({ wizardState, updateWizard, onBack, onNext, onJumpToStep }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manifestedPreview, setManifestedPreview] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'traits' | 'custom'>('traits');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Mobile Tab State
  const [activeMobileTab, setActiveMobileTab] = useState<'controls' | 'visage'>('controls');
  
  const settings = storage.getSettings();

  const getInitialScores = () => {
    const raceConfig = RACE_DATA.find(r => r.race === wizardState.race);
    const subraceConfig = raceConfig?.subraces.find(s => s.subrace === wizardState.subrace);

    const initial: Record<string, number> = {};
    ABILITY_SCORES_DATA.abilities.forEach(ability => {
        let score = wizardState.abilityScores[ability.id] || 10;
        if (wizardState.applyRaceModifiers) {
            const raceMod = (raceConfig?.modifiers || {})[ability.name] || 0;
            const subraceMod = (subraceConfig?.modifiers || {})[ability.name] || 0;
            score += raceMod + subraceMod;
        }
        initial[ability.id] = Math.max(1, Math.min(20, score));
    });
    return initial;
  };

  // Local state for visage scores
  const [visageScores, setVisageScores] = useState<Record<string, number>>(getInitialScores);

  const manifestedAttributes = useMemo(() => {
    return ABILITY_SCORES_DATA.abilities.map(ability => {
        const score = visageScores[ability.id];
        const description = VISAGE_MODIFIERS[ability.abbreviation]?.scale[score.toString()] || '';
        const customLabel = VISAGE_LABELS[ability.abbreviation] || ability.name;
        return { id: ability.id, abbr: ability.abbreviation, name: ability.name, label: customLabel, score, description };
    });
  }, [visageScores]);

  const constructVisagePrompt = () => {
    if (activeTab === 'custom') {
      return customPrompt || "Enhance and modify the character details.";
    }

    const stylePrompt = settings.stylePrompts?.[settings.artStyleId] || STYLE_PRESETS.find(s => s.id === settings.artStyleId)?.prompt || '';
    
    const getModifier = (abbr: string) => {
        if (!wizardState.applyAbilityVisage) return '';
        const attr = manifestedAttributes.find(a => a.abbr === abbr);
        return attr ? attr.description : '';
    };

    let p = settings.visagePrompt;
    p = p.replace('{STYLE}', stylePrompt);
    p = p.replace('{STR_VISAGE_MODIFIER}', getModifier('STR'));
    p = p.replace('{DEX_VISAGE_MODIFIER}', getModifier('DEX'));
    p = p.replace('{CON_VISAGE_MODIFIER}', getModifier('CON'));
    p = p.replace('{INT_VISAGE_MODIFIER}', getModifier('INT'));
    p = p.replace('{WIS_VISAGE_MODIFIER}', getModifier('WIS'));
    p = p.replace('{CHA_VISAGE_MODIFIER}', getModifier('CHA'));
    p = p.replace('{USER_INPUT}', '');

    return p.split('\n').filter(line => line.trim().length > 0).join('\n');
  };

  const handleManifest = async () => {
    if (!wizardState.referenceImage) return;
    setLoading(true);
    setLoadingMessage("Executing Ritual...");
    setError(null);
    setActiveMobileTab('visage'); // Auto switch on mobile

    const originalPrompt = constructVisagePrompt();

    try {
        try {
            const result = await gemini.generateCharacterImage(originalPrompt, wizardState.referenceImage, settings.imageModel);
            setManifestedPreview(result);
        } catch (initialError: any) {
            if (initialError.message === "No image generated from model response. The model may have returned text instead.") {
                setError(initialError.message);
                setLoadingMessage("No image generated. Attempting arcane optimization...");
                
                const optimizationPrompt = `**DO NOT GENERATE AN IMAGE**

Respond *only* with the updated text of the following prompt that is optimized for consumption by Gemini 3 image generation to achieve the desired modifications to an attached, AI generated character reference image without being refused for content moderation violations while resulting in a photographically accurate result (adhering to the original artistic style of the provided image attachment) of the character isolated against a pure black background and prioritizing visual enhancements based on perceptible visual prominence:
\`\`\`
${originalPrompt}
\`\`\``;

                const optimizedPrompt = await gemini.generateText(optimizationPrompt, 'gemini-3-pro-preview');
                
                if (!optimizedPrompt) {
                  throw new Error("Arcane optimization failed to return a result.");
                }

                setLoadingMessage("Optimization complete. Re-submitting refined ritual...");
                setError(null);

                const retryResult = await gemini.generateCharacterImage(optimizedPrompt, wizardState.referenceImage, settings.imageModel);
                setManifestedPreview(retryResult);
            } else {
                throw initialError;
            }
        }
    } catch (e: any) {
        setError(e.message || "Manifestation ritual failed.");
    } finally {
        setLoading(false);
        setLoadingMessage(null);
    }
  };

  const handleResetTraits = () => {
    setVisageScores(getInitialScores());
    setManifestedPreview(null);
    setError(null);
  };

  const handleResetCustom = () => {
    setManifestedPreview(null);
    setCustomPrompt('');
    setError(null);
  };

  const handleApplyPreview = () => {
    if (manifestedPreview) {
      updateWizard({ referenceImage: manifestedPreview });
      setManifestedPreview(null);
    }
  };

  const handleTabChange = (tab: 'traits' | 'custom') => {
    setActiveTab(tab);
    setManifestedPreview(null);
    setError(null);
  };

  const handleCommitAndNext = () => {
    if (manifestedPreview) {
      updateWizard({ referenceImage: manifestedPreview });
    }
    onNext();
  };

  const handleSliderChange = (id: string, value: number) => {
    setVisageScores(prev => ({ ...prev, [id]: value }));
  };

  const currentPrompt = useMemo(() => constructVisagePrompt(), [manifestedAttributes, wizardState.applyAbilityVisage, activeTab, customPrompt]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-stone-800 rounded-full text-stone-400 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-cinzel font-bold text-stone-200">Visage Manifestation</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!manifestedPreview && (
            <button 
              onClick={onNext} 
              className="text-stone-500 hover:text-stone-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 px-3 py-2 transition-colors border border-transparent hover:border-stone-800 rounded"
            >
              <FastForward className="w-4 h-4" />
              Skip
            </button>
          )}
          <button 
            onClick={handleCommitAndNext} 
            className="dungeon-button-primary px-6 py-2 rounded font-bold shadow-lg transition uppercase tracking-wider text-sm flex items-center gap-2"
          >
            {manifestedPreview ? "Accept & Proceed" : "Use Original Form"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4"><WizardSteps currentStep={3} onStepClick={onJumpToStep} /></div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-0 md:pb-6 px-0 md:px-6 gap-0 md:gap-6 relative">
        
        {/* Controls Panel (Ritual) */}
        <div className={`w-full md:w-[40%] dungeon-panel md:rounded-xl flex-col overflow-hidden ${activeMobileTab === 'controls' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex border-b border-stone-800 bg-black/40">
             <button 
                onClick={() => handleTabChange('traits')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'traits' ? 'text-red-500 border-red-500 bg-red-950/10' : 'text-stone-600 border-transparent hover:text-stone-400'}`}
             >
                <Sliders className="w-3 h-3" />
                Physical Traits
             </button>
             <button 
                onClick={() => handleTabChange('custom')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'custom' ? 'text-red-500 border-red-500 bg-red-950/10' : 'text-stone-600 border-transparent hover:text-stone-400'}`}
             >
                <Edit3 className="w-3 h-3" />
                Custom
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                      {activeTab === 'traits' ? <Activity className="w-4 h-4 text-red-700" /> : <Edit3 className="w-4 h-4 text-red-700" />}
                      {activeTab === 'traits' ? 'Manifest Identity' : 'Custom Ritual'}
                  </h3>
                  <button 
                    onClick={() => setIsPromptModalOpen(true)}
                    className="p-1 text-stone-600 hover:text-stone-300 transition-colors"
                    title="Inspect Arcane Formula (Prompt Preview)"
                  >
                    <Code className="w-3 h-3" />
                  </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={activeTab === 'traits' ? handleResetTraits : handleResetCustom}
                  className="p-1 text-stone-600 hover:text-red-500 transition-colors flex items-center gap-1"
                  title="Reset to Original Values"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Reset</span>
                </button>
                {activeTab === 'traits' && (
                  <label className="flex items-center gap-2 cursor-pointer group bg-stone-900/50 px-2 py-1 rounded border border-stone-800">
                    <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-400 uppercase tracking-tighter">Applied</span>
                    <input type="checkbox" checked={wizardState.applyAbilityVisage} onChange={(e) => updateWizard({ applyAbilityVisage: e.target.checked })} className="h-3 w-3 rounded border-stone-700 bg-stone-950 text-red-700 focus:ring-0 cursor-pointer" />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1">
              {activeTab === 'traits' ? (
                <div className="space-y-6 animate-fade-in">
                  {manifestedAttributes.map(attr => (
                    <div key={attr.id} className="group">
                      <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-stone-200 uppercase tracking-widest font-cinzel">{attr.label}</span>
                              <span className="text-[9px] font-bold text-red-900 uppercase">({attr.abbr})</span>
                          </div>
                          <span className="text-sm font-cinzel font-bold text-stone-200 bg-stone-900 px-2 rounded border border-stone-800 shadow-inner">{attr.score}</span>
                      </div>
                      
                      <div className="relative flex items-center mb-2">
                          <input 
                              type="range" 
                              min="1" 
                              max="20" 
                              value={attr.score} 
                              onChange={(e) => handleSliderChange(attr.id, parseInt(e.target.value))}
                              className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-red-700 border border-stone-800"
                              style={{
                                  backgroundImage: `linear-gradient(to right, #7f1d1d ${((attr.score - 1) / 19) * 100}%, #1c1917 ${((attr.score - 1) / 19) * 100}%)`
                              }}
                          />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in h-full flex flex-col">
                  <p className="text-[10px] text-stone-500 italic mb-4 leading-relaxed font-crimson">
                    Describe exactly how you wish to modify the character's appearance. 
                    Focus on visual details: lighting, equipment, physical features, or atmospheric changes.
                  </p>
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Enter manual modification instructions (e.g., 'Add glowing blue arcane tattoos to her forearms and make her eyes spark with electricity...')"
                    className="dungeon-input flex-1 w-full rounded-lg p-4 text-xs font-crimson min-h-[200px] resize-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={handleManifest} 
                  disabled={loading || (activeTab === 'traits' && !wizardState.applyAbilityVisage) || (activeTab === 'custom' && !customPrompt.trim())} 
                  className={`flex-1 py-4 rounded-lg flex justify-center items-center shadow-lg transition-all gap-2 group border-t-2 ${manifestedPreview ? 'dungeon-button border-amber-900/50 text-amber-500' : 'dungeon-button-primary border-red-900/50'}`}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  <span className="text-sm uppercase font-bold tracking-widest">
                      {loading ? "Evolving Form..." : manifestedPreview ? "Refine Manifestation" : "Manifest Physicality"}
                  </span>
                </button>
                {manifestedPreview && !loading && (
                  <button 
                    onClick={handleApplyPreview}
                    className="dungeon-button px-6 rounded-lg flex items-center justify-center text-green-500 hover:text-green-300 transition-all border-green-900/50"
                    title="Apply current manifested image as the new reference"
                  >
                    <Check className="w-5 h-5" />
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest">Apply</span>
                  </button>
                )}
                <button 
                  onClick={onNext}
                  disabled={loading}
                  className="dungeon-button px-6 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-300 transition-all"
                  title="Skip Manifestation and keep current Reference Image"
                >
                  <FastForward className="w-5 h-5" />
                </button>
              </div>
              
              {error && <div className="text-red-400 text-[10px] bg-red-950/40 p-2 rounded border border-red-900/50 leading-tight animate-fade-in">{error}</div>}
              
              <div className="p-3 bg-stone-900/30 rounded border border-stone-800 flex gap-3 items-start">
                 <Info className="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />
                 <p className="text-[10px] text-stone-500 italic leading-relaxed">
                   {activeTab === 'traits' 
                    ? "Adjust the sliders to see how each attribute affects the character's physical visage." 
                    : "Provide custom text instructions to manually steer the manifestation ritual."}
                   These changes only affect the preview; press Accept to commit.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel (Visage) */}
        <div className={`flex-1 dungeon-panel md:rounded-xl flex flex-col relative overflow-hidden bg-black/50 ${activeMobileTab === 'visage' ? 'flex' : 'hidden md:flex'}`}>
          <div className="absolute top-0 left-0 p-4 w-full bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest font-cinzel">
              {manifestedPreview ? 'Manifested Identity' : 'Base Identity'}
            </h3>
            {manifestedPreview && (
                <div className="bg-green-950/40 text-green-500 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-green-900 animate-pulse">
                    Essence Bound
                </div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-4 h-full">
            {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-2" />
                    <span className="font-cinzel font-bold text-red-400 uppercase tracking-widest text-xs">{loadingMessage || 'Transmuting Essence...'}</span>
                </div>
            )}
            <img 
                src={manifestedPreview || wizardState.referenceImage!} 
                alt="Identity" 
                className="w-auto h-auto max-w-full max-h-full object-contain rounded border-2 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-700"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest px-4">
              {manifestedPreview ? 'Manifestation Successful' : 'Awaiting Manifestation Ritual or Skip'}
            </p>
          </div>
          
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
             <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent animate-pulse"></div>
             <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {isPromptModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="dungeon-panel w-full max-w-2xl rounded-xl flex flex-col max-h-[80vh] animate-scale-up">
                <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-red-500" />
                        <h2 className="font-cinzel font-bold text-stone-200 tracking-wider">Arcane Formula</h2>
                    </div>
                    <button onClick={() => setIsPromptModalOpen(false)} className="text-stone-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="relative group">
                        <pre className="p-4 bg-stone-950 rounded border border-stone-800 text-[11px] font-mono text-stone-400 whitespace-pre-wrap leading-relaxed">
                            {currentPrompt}
                        </pre>
                        <button 
                          onClick={handleCopyPrompt}
                          className="absolute top-2 right-2 p-2 bg-stone-900 border border-stone-700 rounded hover:bg-stone-800 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copySuccess ? <span className="text-[9px] font-bold text-green-500 uppercase">Copied!</span> : <Copy className="w-4 h-4 text-stone-400" />}
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-red-950/10 border border-red-900/30 rounded-lg">
                        <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Ritual Context</h4>
                        <p className="text-[11px] text-stone-500 italic leading-relaxed">
                            {activeTab === 'traits' 
                                ? "This formula is woven from your attribute modifiers and selected art style." 
                                : "This formula consists strictly of your manual modification instructions."}
                            It will be submitted alongside the original Step 2 image to transmute its physical appearance.
                        </p>
                    </div>
                </div>
                <div className="p-4 border-t border-stone-800 flex justify-end">
                    <button onClick={() => setIsPromptModalOpen(false)} className="dungeon-button px-6 py-2 rounded font-bold text-xs">
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center bg-stone-950 border-t border-stone-800 shrink-0">
         <button 
           onClick={() => setActiveMobileTab('controls')}
           className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobileTab === 'controls' ? 'text-red-500 bg-stone-900' : 'text-stone-500'}`}
         >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Ritual</span>
         </button>
         <div className="w-[1px] h-8 bg-stone-800"></div>
         <button 
           onClick={() => setActiveMobileTab('visage')}
           className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobileTab === 'visage' ? 'text-red-500 bg-stone-900' : 'text-stone-500'}`}
         >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Visage</span>
         </button>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 2px;
          background: #7f1d1d;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0,0,0,0.8), inset 0 0 2px rgba(255,255,255,0.3);
          border: 1px solid #991b1b;
          margin-top: -6px;
        }
        input[type=range]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 2px;
          background: #7f1d1d;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0,0,0,0.8);
          border: 1px solid #991b1b;
        }
      `}</style>
    </div>
  );
};

export default NewCharacterVisageView;

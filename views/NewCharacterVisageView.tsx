
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Activity, ShieldCheck, Sparkles, FastForward, Info } from 'lucide-react';
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
}

const VISAGE_LABELS: Record<string, string> = {
  STR: "Posture",
  DEX: "Body-Mass",
  CON: "Skin Health",
  INT: "Are you retarded?",
  WIS: "Facial Gaunt",
  CHA: "Attractiveness"
};

const NewCharacterVisageView: React.FC<Props> = ({ wizardState, updateWizard, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manifestedPreview, setManifestedPreview] = useState<string | null>(null);
  const settings = storage.getSettings();

  // Local state for visage scores to allow tweaking visuals without necessarily altering base stats
  const [visageScores, setVisageScores] = useState<Record<string, number>>(() => {
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
  });

  const manifestedAttributes = useMemo(() => {
    return ABILITY_SCORES_DATA.abilities.map(ability => {
        const score = visageScores[ability.id];
        const description = VISAGE_MODIFIERS[ability.abbreviation]?.scale[score.toString()] || '';
        const customLabel = VISAGE_LABELS[ability.abbreviation] || ability.name;
        return { id: ability.id, abbr: ability.abbreviation, name: ability.name, label: customLabel, score, description };
    });
  }, [visageScores]);

  const constructVisagePrompt = () => {
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
    setError(null);
    try {
        const prompt = constructVisagePrompt();
        // Always use wizardState.referenceImage (Step 2 original) as the source for the ritual
        const result = await gemini.generateCharacterImage(prompt, wizardState.referenceImage, settings.imageModel);
        setManifestedPreview(result);
    } catch (e: any) {
        setError(e.message || "Manifestation ritual failed.");
    } finally {
        setLoading(false);
    }
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

      <div className="p-6"><WizardSteps currentStep={3} /></div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-6 px-6 gap-6">
        {/* Left Panel: Attribute Sliders */}
        <div className="w-full md:w-[40%] dungeon-panel rounded-xl p-6 overflow-y-auto flex flex-col custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
                <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-700" />
                    Physical Traits
                </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer group bg-stone-900/50 px-2 py-1 rounded border border-stone-800">
              <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-400 uppercase tracking-tighter">Applied to Prompt</span>
              <input type="checkbox" checked={wizardState.applyAbilityVisage} onChange={(e) => updateWizard({ applyAbilityVisage: e.target.checked })} className="h-3 w-3 rounded border-stone-700 bg-stone-950 text-red-700 focus:ring-0 cursor-pointer" />
            </label>
          </div>

          {/* Reference Thumbnail */}
          {wizardState.referenceImage && (
            <div className="mb-6 animate-fade-in">
              <div className="relative w-32 h-32 mx-auto rounded border border-stone-800 overflow-hidden shadow-xl bg-black group-inner">
                <img src={wizardState.referenceImage} alt="Reference" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-inner-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">Base Identity</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 flex-1">
            {manifestedAttributes.map(attr => (
              <div key={attr.id} className="animate-fade-in group">
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

          <div className="flex gap-2 mt-8">
            <button 
              onClick={handleManifest} 
              disabled={loading || !wizardState.applyAbilityVisage} 
              className={`flex-1 py-4 rounded-lg flex justify-center items-center shadow-lg transition-all gap-2 group border-t-2 ${manifestedPreview ? 'dungeon-button border-amber-900/50 text-amber-500' : 'dungeon-button-primary border-red-900/50'}`}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              <span className="text-sm uppercase font-bold tracking-widest">
                  {loading ? "Evolving Form..." : manifestedPreview ? "Refine Manifestation" : "Manifest Physicality"}
              </span>
            </button>
            <button 
              onClick={onNext}
              disabled={loading}
              className="dungeon-button px-6 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-300 transition-all"
              title="Skip Manifestation and keep Step 2 Image"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>
          
          {error && <div className="text-red-400 text-[10px] mt-2 bg-red-950/40 p-2 rounded border border-red-900/50">{error}</div>}
          
          <div className="mt-4 p-3 bg-stone-900/30 rounded border border-stone-800 flex gap-3 items-start">
             <Info className="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />
             <p className="text-[10px] text-stone-500 italic leading-relaxed">
               Adjust the sliders to see how each attribute affects the character's physical visage. These changes only affect the preview; press Accept to commit.
             </p>
          </div>
        </div>

        {/* Right Panel: Image Evolution */}
        <div className="flex-1 dungeon-panel rounded-xl flex flex-col relative overflow-hidden bg-black/50">
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
          <div className="flex-1 flex items-center justify-center p-4">
            {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-2" />
                    <span className="font-cinzel font-bold text-red-400 uppercase tracking-widest text-xs">Transmuting Essence...</span>
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
          
          {/* Subtle decorative background effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
             <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent animate-pulse"></div>
             <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent animate-pulse delay-1000"></div>
          </div>
        </div>
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

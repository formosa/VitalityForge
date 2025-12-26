
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, Wand2, ImagePlus, Loader2, Download, Dices, Palette, Ban, Image as ImageIcon, Settings2 } from 'lucide-react';
import { CreationWizardState, InputMethod, CharacterProfile } from '../types';
import { MODELS, STYLE_PRESETS } from '../constants';
import { RACE_DATA } from '../data/races';
import * as gemini from '../services/geminiService';
import * as storage from '../services/storageService';
import * as randomizer from '../services/randomizerService';
import WizardSteps from './WizardSteps';

interface Props {
  wizardState: CreationWizardState;
  updateWizard: (partial: Partial<CreationWizardState>) => void;
  profiles: CharacterProfile[];
  onBack: () => void;
  onNext: () => void;
  onJumpToStep?: (step: number) => void;
  isEditing?: boolean;
}

const NewCharacterReferenceView: React.FC<Props> = ({ wizardState, updateWizard, profiles, onBack, onNext, onJumpToStep, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [option, setOption] = useState<InputMethod>(InputMethod.UPLOAD);
  const [error, setError] = useState<string | null>(null);
  
  // Mobile Tab State
  const [activeMobileTab, setActiveMobileTab] = useState<'configure' | 'identity'>('configure');
  
  const settings = storage.getSettings();
  const isProModel = settings.imageModel === MODELS.IMAGE_PRO;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string>(settings.artStyleId || 'realistic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!wizardState.description) {
       if (!wizardState.name && !wizardState.race) {
           updateWizard({ description: randomizer.getRandom(randomizer.FANTASY_DESCRIPTIONS) });
       }
    }
  }, []);

  const handleRandomizeDescription = () => {
    updateWizard({ description: randomizer.getRandom(randomizer.FANTASY_DESCRIPTIONS) });
  };

  const constructPrompt = (rawTemplate: string, styleId: string, customInput: string) => {
    const raceConfig = RACE_DATA.find(r => r.race === wizardState.race);
    const subraceConfig = raceConfig?.subraces.find(s => s.subrace === wizardState.subrace);
    const availableGenders = subraceConfig?.genders || raceConfig?.genders || [];
    const genderConfig = availableGenders.find(g => g.gender === wizardState.gender);

    const stylePrompt = (styleId !== 'none') 
      ? (settings.stylePrompts?.[styleId] || STYLE_PRESETS.find(s => s.id === styleId)?.prompt || '')
      : '';

    let p = rawTemplate;

    p = p.replace('{GENDER}', wizardState.gender || 'Entity');
    p = p.replace('{RACE}', wizardState.race || 'Creature');
    p = p.replace('{SUBRACE}', wizardState.subrace || '');
    p = p.replace('{STYLE}', stylePrompt);
    p = p.replace('{RACE_VISAGE}', raceConfig?.visage || '');
    p = p.replace('{SUBRACE_VISAGE}', subraceConfig?.visage || '');
    p = p.replace('{GENDER_VISAGE}', genderConfig?.visage || '');
    
    p = p.replace('{USER_INPUT}', customInput ? `Additional details: ${customInput}` : '');

    return p.split('\n').filter(line => line.trim().length > 0).join('\n');
  };

  const triggerStyleTransfer = async (sourceImage: string, styleId: string) => {
    setLoading(true);
    setError(null);
    setActiveMobileTab('identity'); // Auto switch to preview on mobile
    try {
        const fullPrompt = constructPrompt(settings.prePrompt, styleId, "Identity portrait.");
        const result = await gemini.generateCharacterImage(fullPrompt, sourceImage, 'gemini-2.5-flash-image');
        updateWizard({ referenceImage: result });
    } catch (e: any) {
        setError(e.message || "Style transfer failed");
    } finally {
        setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);
        triggerStyleTransfer(base64, activeStyle);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleLocalArtifactClick = () => {
    setOption(InputMethod.UPLOAD);
    fileInputRef.current?.click();
  };

  const handleStyleSelect = (styleId: string) => {
    setActiveStyle(styleId);
    if (uploadedImage && option === InputMethod.UPLOAD) {
        triggerStyleTransfer(uploadedImage, styleId);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setActiveMobileTab('identity'); // Auto switch to preview on mobile
    try {
      if (isProModel) {
         const hasKey = await gemini.checkApiKey();
         if (!hasKey) await gemini.requestApiKey();
      }

      const fullPrompt = constructPrompt(settings.prePrompt, activeStyle, wizardState.description);

      let imageBase64: string;
      if (option === InputMethod.TEXT_TO_IMAGE) {
        imageBase64 = await gemini.generateCharacterImage(fullPrompt, undefined, settings.imageModel);
      }
      else if (option === InputMethod.IMAGE_TO_IMAGE) {
        const profile = profiles.find(p => p.id === selectedProfileId);
        if (!profile || !profile.referenceImageBase64) throw new Error("Select a valid profile with an image.");
        imageBase64 = await gemini.generateCharacterImage(fullPrompt, profile.referenceImageBase64, settings.imageModel);
      } else {
        throw new Error("Invalid selection");
      }
      
      updateWizard({ referenceImage: imageBase64 });
    } catch (e: any) {
      setError(e.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!wizardState.referenceImage) return;
    const link = document.createElement('a');
    link.href = wizardState.referenceImage;
    link.download = `base-identity-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-stone-800 rounded-full text-stone-400 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-cinzel font-bold text-stone-200">Identity Rite</h1>
        </div>
        {wizardState.referenceImage && (
          <button onClick={onNext} className="dungeon-button-primary px-6 py-2 rounded font-bold shadow-lg transition uppercase tracking-wider text-sm">
            Proceed
          </button>
        )}
      </div>

      <div className="p-4 flex-shrink-0">
        <WizardSteps currentStep={2} onStepClick={onJumpToStep} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-0 md:pb-6 px-0 md:px-6 gap-0 md:gap-6 relative">
        
        {/* Method Selection & Inputs (Config Panel) */}
        <div className={`w-full md:w-1/3 dungeon-panel md:rounded-xl p-6 overflow-y-auto flex-col custom-scrollbar ${activeMobileTab === 'configure' ? 'flex' : 'hidden md:flex'}`}>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Summoning Method</h3>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            <button onClick={handleLocalArtifactClick} className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.UPLOAD ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}>
              <Upload className={`mr-3 ${option === InputMethod.UPLOAD ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel text-xs uppercase tracking-wider">Local Artifact</div>
                <div className="text-[10px] text-stone-500 font-crimson uppercase">External Source</div>
              </div>
            </button>
            <button onClick={() => setOption(InputMethod.TEXT_TO_IMAGE)} className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.TEXT_TO_IMAGE ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}>
              <Wand2 className={`mr-3 ${option === InputMethod.TEXT_TO_IMAGE ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel text-xs uppercase tracking-wider">Arcane Synthesis</div>
                <div className="text-[10px] text-stone-500 font-crimson uppercase">Prompt-Driven</div>
              </div>
            </button>
            <button onClick={() => setOption(InputMethod.IMAGE_TO_IMAGE)} className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.IMAGE_TO_IMAGE ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}>
              <ImagePlus className={`mr-3 ${option === InputMethod.IMAGE_TO_IMAGE ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel text-xs uppercase tracking-wider">Transmutation</div>
                <div className="text-[10px] text-stone-500 font-crimson uppercase">Existing Core</div>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            {option === InputMethod.TEXT_TO_IMAGE && (
              <div className="flex flex-col h-full animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Identity Description</label>
                   <button onClick={handleRandomizeDescription} className="flex items-center gap-1 text-[10px] font-bold text-red-900 hover:text-red-500 transition-colors group">
                     <Dices className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                     <span>RANDOMIZE</span>
                   </button>
                </div>
                <textarea 
                  value={wizardState.description} 
                  onChange={(e) => updateWizard({ description: e.target.value })} 
                  className="dungeon-input w-full min-h-[100px] rounded-lg p-3 text-stone-300 resize-none text-xs" 
                  placeholder="Manifest the character's base look..." 
                />
                <button onClick={handleGenerate} disabled={loading} className="dungeon-button-primary mt-4 w-full py-3 rounded-lg flex justify-center items-center shadow-lg transition-all gap-2">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Dices className="w-4 h-4" />}
                  <span className="text-xs uppercase font-bold tracking-widest">Forge Identity</span>
                </button>
              </div>
            )}
            {option === InputMethod.UPLOAD && (
               <div className="animate-fade-in">
                 <div onClick={handleLocalArtifactClick} className="min-h-[150px] border-2 border-dashed border-stone-700 rounded-xl p-4 text-center hover:border-red-800 hover:bg-stone-900/50 transition-all cursor-pointer flex flex-col items-center justify-center bg-black/40 relative overflow-hidden">
                    {uploadedImage ? <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-contain p-2" /> : <><Upload className="w-8 h-8 text-stone-600 mb-2" /><p className="text-stone-400 font-bold font-cinzel text-xs uppercase">Select Image</p></>}
                 </div>
               </div>
            )}
            {error && <div className="text-red-400 text-[10px] mt-2 bg-red-950/40 p-2 rounded border border-red-900/50 leading-tight">{error}</div>}
          </div>
        </div>

        {/* Preview & Style Selection (Identity Panel) */}
        <div className={`flex-1 flex flex-col min-w-0 h-full p-4 md:p-0 ${activeMobileTab === 'identity' ? 'flex' : 'hidden md:flex'}`}>
            {/* Style Selector - Scrollable Horizontal */}
            <div className="dungeon-panel mb-4 p-2 rounded-lg flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
                <div className="flex items-center px-2 text-stone-500 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap"><Palette className="w-4 h-4 mr-2" /> Style</div>
                <button onClick={() => handleStyleSelect('none')} className={`px-3 py-1.5 rounded text-[10px] font-bold font-cinzel whitespace-nowrap transition-all flex items-center gap-2 uppercase tracking-tighter ${activeStyle === 'none' ? 'bg-stone-100 text-stone-900 border border-stone-300' : 'bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-300 hover:bg-stone-800'}`}><Ban className="w-3 h-3" /> Raw</button>
                {STYLE_PRESETS.map(style => (
                    <button key={style.id} onClick={() => handleStyleSelect(style.id)} className={`px-3 py-1.5 rounded text-[10px] font-bold font-cinzel whitespace-nowrap transition-all uppercase tracking-tighter ${activeStyle === style.id ? 'bg-red-900 text-red-100 border border-red-700 shadow-[0_0_10px_rgba(153,27,27,0.4)]' : 'bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-300 hover:bg-stone-800'}`}>{style.label}</button>
                ))}
            </div>

            <div className="flex-1 dungeon-panel rounded-xl flex flex-col relative overflow-hidden group bg-black/50 min-h-[300px] md:min-h-0">
              <div className="flex-1 flex items-center justify-center relative p-4 h-full w-full">
                {wizardState.referenceImage ? (
                    <div className="relative z-10 animate-scale-up w-full h-full flex items-center justify-center">
                    <img src={wizardState.referenceImage} alt="Generated Identity" className="w-auto h-auto max-w-full max-h-full object-contain rounded border-2 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <button onClick={handleDownload} className="dungeon-button p-2 rounded-full" title="Download Base Identity"><Download className="w-5 h-5" /></button>
                    </div>
                    </div>
                ) : (
                    <div className="text-stone-700 text-lg font-cinzel tracking-widest opacity-50 flex flex-col items-center gap-2 text-center p-4">
                        {loading ? <><Loader2 className="w-12 h-12 animate-spin text-red-800" /><span className="animate-pulse text-xs uppercase tracking-widest font-bold">Synthesizing Base Form...</span></> : <><Wand2 className="w-8 h-8 opacity-20" /><span className="text-xs uppercase tracking-widest font-bold">Awaiting Identity Rite</span><p className="text-[10px] font-sans text-stone-600 max-w-[200px]">Use the Configure tab to set parameters.</p></>}
                    </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center bg-stone-950 border-t border-stone-800 shrink-0">
         <button 
           onClick={() => setActiveMobileTab('configure')}
           className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobileTab === 'configure' ? 'text-red-500 bg-stone-900' : 'text-stone-500'}`}
         >
            <Settings2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Configure</span>
         </button>
         <div className="w-[1px] h-8 bg-stone-800"></div>
         <button 
           onClick={() => setActiveMobileTab('identity')}
           className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobileTab === 'identity' ? 'text-red-500 bg-stone-900' : 'text-stone-500'}`}
         >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Identity</span>
         </button>
      </div>
    </div>
  );
};

export default NewCharacterReferenceView;

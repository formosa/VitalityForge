import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, Wand2, ImagePlus, Loader2, Download, Dices, Palette, Ban } from 'lucide-react';
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
  isEditing?: boolean;
}

const NewCharacterReferenceView: React.FC<Props> = ({ wizardState, updateWizard, profiles, onBack, onNext, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [option, setOption] = useState<InputMethod>(InputMethod.UPLOAD);
  const [error, setError] = useState<string | null>(null);
  
  const settings = storage.getSettings();
  const isProModel = settings.imageModel === MODELS.IMAGE_PRO;

  // New State for Upload & Styles
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string>(settings.artStyleId || 'realistic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with seed based on Details if available, else random
  useEffect(() => {
    if (!inputText) {
       if (wizardState.name || wizardState.race) {
           // Construct a rich description based on the structured selection
           const raceConfig = RACE_DATA.find(r => r.race === wizardState.race);
           const subraceConfig = raceConfig?.subraces.find(s => s.subrace === wizardState.subrace);
           
           // Find gender config (can be on subrace or race)
           const availableGenders = subraceConfig?.genders || raceConfig?.genders || [];
           const genderConfig = availableGenders.find(g => g.gender === wizardState.gender);

           // Build the prompt parts
           const genderStr = wizardState.gender || 'entity';
           const subraceStr = wizardState.subrace ? `${wizardState.subrace} ` : '';
           const raceStr = wizardState.race || 'unknown being';
           const nameStr = wizardState.name ? `named ${wizardState.name}` : '';
           
           let visageDetails = "";
           if (genderConfig?.visage) visageDetails += `${genderConfig.visage}. `;
           if (subraceConfig?.visage) visageDetails += `${subraceConfig.visage}. `;
           if (raceConfig?.visage) visageDetails += `${raceConfig.visage}. `;

           const fullDescription = `A detailed portrait of a ${genderStr} ${subraceStr}${raceStr} ${nameStr}. ${visageDetails}`.trim();

           setInputText(fullDescription);
       } else {
           setInputText(randomizer.getRandom(randomizer.FANTASY_DESCRIPTIONS));
       }
    }
  }, []);

  const handleRandomizeDescription = () => {
    setInputText(randomizer.getRandom(randomizer.FANTASY_DESCRIPTIONS));
  };

  const triggerStyleTransfer = async (sourceImage: string, styleId: string) => {
    if (styleId === 'none') {
        updateWizard({ referenceImage: sourceImage });
        return;
    }

    setLoading(true);
    setError(null);
    try {
        const stylePrompt = settings.stylePrompts?.[styleId] || STYLE_PRESETS.find(s => s.id === styleId)?.prompt || '';
        
        // Construct prompt similar to handleGenerate but adapted for upload-based transfer.
        // We replace user input text with a generic reference to the image to avoid conflict.
        const basePrompt = settings.prePrompt.replace('{user input text}', "the character depicted in the attached reference image");
        const fullPrompt = `${basePrompt}\n\nStyle Instructions:\n${stylePrompt}`;
        
        // Always use Nano Banana (Flash Image) for this flow as requested for speed/cost.
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
        // Automatically trigger style transfer using current style
        triggerStyleTransfer(base64, activeStyle);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be selected again
    e.target.value = '';
  };

  const handleLocalArtifactClick = () => {
    setOption(InputMethod.UPLOAD);
    fileInputRef.current?.click();
  };

  const handleStyleSelect = (styleId: string) => {
    setActiveStyle(styleId);
    // Only trigger auto-generation if we have an uploaded image AND we are in the upload mode
    // forcing the context of the style selector to apply immediately to the upload preview.
    if (uploadedImage && option === InputMethod.UPLOAD) {
        triggerStyleTransfer(uploadedImage, styleId);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isProModel) {
         const hasKey = await gemini.checkApiKey();
         if (!hasKey) await gemini.requestApiKey();
      }

      let imageBase64: string;
      const stylePrompt = (activeStyle !== 'none') 
        ? (settings.stylePrompts?.[activeStyle] || STYLE_PRESETS.find(s => s.id === activeStyle)?.prompt || '')
        : '';

      if (option === InputMethod.TEXT_TO_IMAGE) {
        const basePrompt = settings.prePrompt.replace('{user input text}', inputText);
        const fullPrompt = stylePrompt ? `${basePrompt}\n\n${stylePrompt}` : basePrompt;
        imageBase64 = await gemini.generateCharacterImage(fullPrompt, undefined, settings.imageModel);
      }
      else if (option === InputMethod.IMAGE_TO_IMAGE) {
        const profile = profiles.find(p => p.id === selectedProfileId);
        if (!profile || !profile.referenceImageBase64) throw new Error("Select a valid profile with an image.");
        
        const basePrompt = settings.prePrompt.replace('{user input text}', inputText) + " Modify the attached image.";
        const fullPrompt = stylePrompt ? `${basePrompt}\n\n${stylePrompt}` : basePrompt;
        imageBase64 = await gemini.generateCharacterImage(fullPrompt, profile.referenceImageBase64, settings.imageModel);
      } else {
        throw new Error("Invalid generation option selected");
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
    link.download = `vitality-reference-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Header */}
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-stone-800 rounded-full text-stone-400 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-cinzel font-bold text-stone-200">
            {isEditing ? 'Edit Entity Reference' : 'Summon New Entity'}
          </h1>
        </div>
        {wizardState.referenceImage && (
          <button onClick={onNext} className="dungeon-button-primary px-6 py-2 rounded font-bold shadow-lg transition animate-fade-in uppercase tracking-wider text-sm">
            Proceed
          </button>
        )}
      </div>

      <div className="p-6">
        <WizardSteps currentStep={2} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-6 px-6 gap-6">
        {/* Sidebar Controls */}
        <div className="w-full md:w-1/3 dungeon-panel rounded-xl p-6 overflow-y-auto flex flex-col custom-scrollbar">
          
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Summoning Method</h3>
          
          <div className="space-y-3 mb-8">
            <button 
              onClick={handleLocalArtifactClick} 
              className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.UPLOAD ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}
            >
              <Upload className={`mr-3 ${option === InputMethod.UPLOAD ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel">Local Artifact</div>
                <div className="text-xs text-stone-500 font-crimson">Upload Image</div>
              </div>
            </button>

            <button 
              onClick={() => setOption(InputMethod.TEXT_TO_IMAGE)} 
              className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.TEXT_TO_IMAGE ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}
            >
              <Wand2 className={`mr-3 ${option === InputMethod.TEXT_TO_IMAGE ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel">Arcane Synthesis</div>
                <div className="text-xs text-stone-500 font-crimson">Text Generation ({isProModel ? 'Pro' : 'Flash'})</div>
              </div>
            </button>

            <button 
              onClick={() => setOption(InputMethod.IMAGE_TO_IMAGE)} 
              className={`w-full p-4 rounded-lg border text-left flex items-center transition-all ${option === InputMethod.IMAGE_TO_IMAGE ? 'border-red-900 bg-red-950/20' : 'border-stone-800 bg-stone-900/30 hover:bg-stone-800 hover:border-stone-600'}`}
            >
              <ImagePlus className={`mr-3 ${option === InputMethod.IMAGE_TO_IMAGE ? 'text-red-500' : 'text-stone-500'}`} />
              <div>
                <div className="font-bold text-stone-200 font-cinzel">Transmutation</div>
                <div className="text-xs text-stone-500 font-crimson">Evolve Existing</div>
              </div>
            </button>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            {option === InputMethod.UPLOAD && (
              <div className="h-full flex flex-col">
                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Present Artifact (Source)</label>
                 <div className="flex-1 min-h-[150px] border-2 border-dashed border-stone-700 rounded-xl p-4 text-center hover:border-red-800 hover:bg-stone-900/50 transition-all group flex flex-col items-center justify-center bg-black/40 relative overflow-hidden">
                    {uploadedImage ? (
                        <>
                          <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-contain p-2 z-0" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                              <button onClick={handleLocalArtifactClick} className="dungeon-button px-4 py-2 rounded shadow-lg text-xs">
                                  Replace Artifact
                              </button>
                          </div>
                        </>
                    ) : (
                        <div onClick={handleLocalArtifactClick} className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                            <Upload className="w-10 h-10 text-stone-600 group-hover:text-red-500 mb-2 transition-colors" />
                            <p className="text-stone-400 font-bold font-cinzel text-sm">Select Image</p>
                        </div>
                    )}
                 </div>
              </div>
            )}

            {option === InputMethod.TEXT_TO_IMAGE && (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Incantation</label>
                   <button 
                    onClick={handleRandomizeDescription}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors group"
                    title="Randomize Concept"
                   >
                     <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                     <span>Randomize</span>
                   </button>
                </div>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="dungeon-input w-full flex-1 min-h-[100px] rounded-lg p-4 text-stone-300 resize-none"
                  placeholder="Describe the entity..."
                />
                <button 
                  onClick={handleGenerate} 
                  disabled={loading || !inputText}
                  className="dungeon-button-primary mt-4 w-full py-4 rounded-lg flex justify-center items-center shadow-lg transition-all gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Dices className="w-5 h-5" />}
                  <span>{loading ? "Synthesizing..." : "Synthesize Entity"}</span>
                </button>
              </div>
            )}

            {option === InputMethod.IMAGE_TO_IMAGE && (
              <div className="flex flex-col h-full">
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">Base Essence</label>
                <select 
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="dungeon-input w-full rounded-lg p-3 text-stone-300 mb-4"
                >
                  <option value="">-- Select Entity --</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                
                <div className="flex justify-between items-center mb-2">
                   <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Mutation Sigils</label>
                   <button 
                    onClick={() => setInputText("Mutate with " + randomizer.getRandom(randomizer.FANTASY_DESCRIPTIONS))}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors group"
                    title="Randomize Mutation"
                   >
                     <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                     <span>Randomize</span>
                   </button>
                </div>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="dungeon-input w-full flex-1 min-h-[100px] rounded-lg p-4 text-stone-300 resize-none"
                  placeholder="Describe the transmutation..."
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !inputText || !selectedProfileId}
                  className="dungeon-button-primary mt-4 w-full py-4 rounded-lg flex justify-center items-center shadow-lg transition-all gap-2"
                >
                   {loading ? <Loader2 className="animate-spin" /> : <Dices className="w-5 h-5" />}
                   <span>{loading ? "Mutating..." : "Mutate Entity"}</span>
                </button>
              </div>
            )}
            
            {error && <div className="text-red-400 text-xs mt-2 bg-red-950/40 p-3 rounded border border-red-900 leading-tight">{error}</div>}
          </div>

        </div>

        {/* Preview Area - Fixed Flex Layout for Image Scaling */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Style Selector Toolbar */}
            <div className="dungeon-panel mb-4 p-2 rounded-lg flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
                <div className="flex items-center px-2 text-stone-500 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap">
                    <Palette className="w-4 h-4 mr-2" /> Style
                </div>
                <div className="h-4 w-px bg-stone-800 mx-1"></div>
                
                <button
                    onClick={() => handleStyleSelect('none')}
                    className={`px-3 py-1.5 rounded text-xs font-bold font-cinzel whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeStyle === 'none'
                        ? 'bg-stone-100 text-stone-900 border border-stone-300'
                        : 'bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-300 hover:bg-stone-800'
                    }`}
                >
                    <Ban className="w-3 h-3" /> None
                </button>

                {STYLE_PRESETS.map(style => (
                    <button
                        key={style.id}
                        onClick={() => handleStyleSelect(style.id)}
                        className={`px-3 py-1.5 rounded text-xs font-bold font-cinzel whitespace-nowrap transition-all ${
                            activeStyle === style.id 
                            ? 'bg-red-900 text-red-100 border border-red-700 shadow-[0_0_10px_rgba(153,27,27,0.4)]' 
                            : 'bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-300 hover:bg-stone-800'
                        }`}
                    >
                        {style.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 dungeon-panel rounded-xl flex flex-col relative overflow-hidden group bg-black/50 min-h-0">
              <div className="absolute top-0 left-0 p-4 w-full bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest font-cinzel text-center">
                    {isEditing ? 'Current Reference' : 'Awaiting Summoning (Result)'}
                  </h3>
              </div>
              <div className="flex-1 flex items-center justify-center relative p-4 h-full w-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900/20 via-transparent to-transparent opacity-50"></div>
                {wizardState.referenceImage ? (
                    <div className="relative z-10 animate-scale-up w-full h-full flex items-center justify-center">
                    {loading && (
                        <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm rounded">
                            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-2" />
                            <span className="font-cinzel font-bold text-red-400">Forging...</span>
                        </div>
                    )}
                    <img 
                        src={wizardState.referenceImage} 
                        alt="Generated Reference" 
                        className="w-auto h-auto max-w-full max-h-full object-contain rounded border-2 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    />
                    
                    {/* Asset Controls Overlay */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <button 
                        onClick={handleDownload}
                        className="dungeon-button p-2 rounded-full"
                        title="Download Image"
                        >
                        <Download className="w-5 h-5" />
                        </button>
                        <label 
                        className="dungeon-button p-2 rounded-full cursor-pointer"
                        title="Upload Alternative"
                        >
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                    </div>
                ) : (
                    <div className="text-stone-700 text-lg font-cinzel tracking-widest opacity-50 flex flex-col items-center gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-12 h-12 animate-spin text-red-800" />
                                <span className="animate-pulse">Synthesizing Form...</span>
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-8 h-8 opacity-20" />
                                <span>Awaiting Summoning...</span>
                            </>
                        )}
                    </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewCharacterReferenceView;
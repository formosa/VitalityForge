
import React, { useMemo } from 'react';
import { X, ArrowRight, Dices, Info } from 'lucide-react';
import { CreationWizardState, GenderData } from '../types';
import * as randomizer from '../services/randomizerService';
import * as storage from '../services/storageService';
import { DEFAULT_DAMAGE_CONFIG, ABILITY_SCORES_DATA } from '../constants';
import { RACE_DATA } from '../data/races';
import WizardSteps from './WizardSteps';
import AffinityManager from '../components/AffinityManager';

interface Props {
  wizardState: CreationWizardState;
  updateWizard: (partial: Partial<CreationWizardState>) => void;
  onCancel: () => void;
  onNext: () => void;
  isEditing?: boolean;
}

const NewCharacterDetailsView: React.FC<Props> = ({ wizardState, updateWizard, onCancel, onNext, isEditing = false }) => {
  // Determine if subrace is required based on race selection
  const selectedRaceConfig = useMemo(() => RACE_DATA.find(r => r.race === wizardState.race), [wizardState.race]);
  const hasSubraces = selectedRaceConfig ? selectedRaceConfig.subraces.length > 0 : false;
  
  // Determine available genders based on selected race/subrace
  const selectedSubraceConfig = useMemo(() => 
    selectedRaceConfig?.subraces.find(s => s.subrace === wizardState.subrace), 
  [selectedRaceConfig, wizardState.subrace]);

  const availableGenders = useMemo(() => {
    if (selectedSubraceConfig && selectedSubraceConfig.genders && selectedSubraceConfig.genders.length > 0) {
      return selectedSubraceConfig.genders;
    }
    return selectedRaceConfig?.genders || [];
  }, [selectedRaceConfig, selectedSubraceConfig]);

  const isComplete = useMemo(() => {
    const nameValid = !!wizardState.name && wizardState.name.trim().length > 0;
    const raceValid = !!wizardState.race;
    const hpValid = (wizardState.totalHp || 0) > 0;
    const genderValid = !!wizardState.gender;
    const subraceValid = !hasSubraces || (hasSubraces && !!wizardState.subrace);

    return nameValid && raceValid && hpValid && genderValid && subraceValid;
  }, [wizardState.name, wizardState.race, wizardState.totalHp, wizardState.gender, wizardState.subrace, hasSubraces]);

  // Calculate current modifiers based on Race and Subrace
  const currentModifiers = useMemo(() => {
    const raceMods = selectedRaceConfig?.modifiers || {};
    const subraceMods = selectedSubraceConfig?.modifiers || {};
    return { ...raceMods, ...subraceMods };
  }, [selectedRaceConfig, selectedSubraceConfig]);

  const getModifierForAbility = (abilityName: string) => {
      return currentModifiers[abilityName] || 0;
  };

  const currentRaceDesc = selectedRaceConfig?.description;
  const currentSubraceDesc = selectedSubraceConfig?.description;
  const currentGenderDesc = availableGenders.find(g => g.gender === wizardState.gender)?.description;

  const randomizeName = () => updateWizard({ name: randomizer.getRandom(randomizer.FANTASY_NAMES) });
  
  const randomizeIdentity = () => {
    const config = randomizer.getRandomRaceConfiguration();
    updateWizard({
        race: config.race,
        subrace: config.subrace,
        gender: config.gender
    });
  };

  const randomizeHp = () => updateWizard({ totalHp: randomizer.getRandomInt(100, 5000) });

  const handleHpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
        updateWizard({ totalHp: 0 });
    } else {
        const parsed = parseInt(val);
        if (!isNaN(parsed)) {
            updateWizard({ totalHp: parsed });
        }
    }
  };

  const handleAffinityChange = (type: 'resistances' | 'immunities' | 'vulnerabilities', values: string[]) => {
      updateWizard({ [type]: values });
  };

  const handleRaceChange = (newRace: string) => {
    const newRaceConfig = RACE_DATA.find(r => r.race === newRace);
    const newHasSubraces = newRaceConfig ? newRaceConfig.subraces.length > 0 : false;
    
    // Check if the current gender is still a valid option for the new race
    const newAvailableGenders = newRaceConfig?.genders || [];
    const isGenderStillValid = newAvailableGenders.some(g => g.gender === wizardState.gender);

    updateWizard({ 
        race: newRace, 
        subrace: undefined, 
        gender: isGenderStillValid ? wizardState.gender : '' 
    });
  };

  const handleSubraceChange = (newSubrace: string) => {
      const newSubraceConfig = selectedRaceConfig?.subraces.find(s => s.subrace === newSubrace);
      
      // Check if subrace specifies unique genders, otherwise fall back to race
      const newAvailableGenders = (newSubraceConfig?.genders && newSubraceConfig.genders.length > 0) 
        ? newSubraceConfig.genders 
        : (selectedRaceConfig?.genders || []);
        
      const isGenderStillValid = newAvailableGenders.some(g => g.gender === wizardState.gender);

      updateWizard({
          subrace: newSubrace,
          gender: isGenderStillValid ? wizardState.gender : ''
      });
  };

  const handleScoreChange = (id: string, val: string) => {
      const parsed = parseInt(val);
      const newScores = { ...wizardState.abilityScores };
      
      if (val === '') {
          newScores[id] = 0;
      } else if (!isNaN(parsed)) {
          newScores[id] = parsed;
      }
      
      updateWizard({ abilityScores: newScores });
  };

  const randomizeScore = (id: string) => {
      const roll = randomizer.rollAbilityScore();
      const newScores = { ...wizardState.abilityScores, [id]: roll };
      updateWizard({ abilityScores: newScores });
  };

  const randomizeAllScores = () => {
      const newScores: Record<string, number> = {};
      ABILITY_SCORES_DATA.abilities.forEach(ability => {
          newScores[ability.id] = randomizer.rollAbilityScore();
      });
      updateWizard({ abilityScores: newScores });
  };

  const toggleRaceModifiers = () => {
      updateWizard({ applyRaceModifiers: !wizardState.applyRaceModifiers });
  };

  const availableTypes = useMemo(() => {
    const settings = storage.getSettings();
    const config = settings.damageConfig || DEFAULT_DAMAGE_CONFIG;
    let types: string[] = [];
    Object.values(config).forEach(cat => {
        types = [...types, ...cat.damage_types.map(t => t.id)];
    });
    return types;
  }, []);

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-cinzel font-bold text-stone-200">{isEditing ? 'Edit Details' : 'Entity Details'}</h1>
        <button onClick={onCancel} className="text-stone-500 hover:text-red-500 transition">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <WizardSteps currentStep={1} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-start justify-center p-8 gap-12 overflow-y-auto custom-scrollbar">
        
        {wizardState.referenceImage && (
          <div className="relative group sticky top-8 self-start hidden md:block">
            <div className="absolute -inset-1 bg-red-900/30 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded border-2 border-stone-700 shadow-2xl bg-black">
              <img src={wizardState.referenceImage} alt="Reference" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        )}

        <div className="w-full max-w-lg space-y-8 dungeon-panel p-8 rounded-xl border border-stone-800 backdrop-blur-sm">
          
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest font-cinzel">True Name</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={wizardState.name}
                onChange={(e) => updateWizard({ name: e.target.value })}
                className="dungeon-input w-full rounded-lg p-4 text-xl font-cinzel text-stone-200"
                placeholder="e.g. Malakor"
                />
                <button onClick={randomizeName} className="dungeon-button px-4 rounded-lg group" title="Randomize Name" type="button">
                    <Dices className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>
          </div>

          <div className="space-y-4 border-t border-stone-800 pt-6">
            <div className="flex justify-between items-center">
                 <label className="block text-xs font-bold text-red-500 uppercase tracking-widest font-cinzel">Lineage (Race)</label>
                 <button onClick={randomizeIdentity} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 transition group" title="Randomize Race/Subrace/Gender" type="button">
                    <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Randomize
                 </button>
            </div>
            
            <div>
                <select 
                    value={wizardState.race}
                    onChange={(e) => handleRaceChange(e.target.value)}
                    className="dungeon-input w-full rounded-lg p-3 text-stone-300 font-cinzel"
                >
                    <option value="">-- Select Race --</option>
                    {RACE_DATA.map(r => (
                        <option key={r.race} value={r.race}>{r.race}</option>
                    ))}
                </select>
                {currentRaceDesc && (
                    <div className="mt-2 text-xs text-stone-500 italic bg-stone-900/40 p-2 rounded border-l-2 border-stone-700">
                        {currentRaceDesc}
                    </div>
                )}
            </div>

            {hasSubraces && (
                <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest font-cinzel">Heritage (Subrace)</label>
                    <select 
                        value={wizardState.subrace || ''}
                        onChange={(e) => handleSubraceChange(e.target.value)}
                        className="dungeon-input w-full rounded-lg p-3 text-stone-300 font-cinzel"
                    >
                        <option value="">-- Select Subrace --</option>
                        {selectedRaceConfig?.subraces.map(s => (
                            <option key={s.subrace} value={s.subrace}>{s.subrace}</option>
                        ))}
                    </select>
                    {currentSubraceDesc && (
                        <div className="mt-2 text-xs text-stone-500 italic bg-stone-900/40 p-2 rounded border-l-2 border-stone-700">
                            {currentSubraceDesc}
                        </div>
                    )}
                </div>
            )}

            <div className="animate-fade-in">
                <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest font-cinzel">Form (Gender)</label>
                <select 
                    value={wizardState.gender || ''}
                    onChange={(e) => updateWizard({ gender: e.target.value })}
                    className="dungeon-input w-full rounded-lg p-3 text-stone-300 font-cinzel"
                    disabled={!wizardState.race || (hasSubraces && !wizardState.subrace)}
                >
                    <option value="">-- Select Gender --</option>
                    {availableGenders.map(g => (
                        <option key={g.gender} value={g.gender}>{g.gender}</option>
                    ))}
                </select>
                {currentGenderDesc && (
                    <div className="mt-2 text-xs text-stone-500 italic bg-stone-900/40 p-2 rounded border-l-2 border-stone-700">
                        {currentGenderDesc}
                    </div>
                )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest font-cinzel">Ability Scores</label>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-[10px] text-stone-400 font-bold uppercase tracking-wide bg-stone-900/50 px-2 py-1 rounded border border-stone-800 hover:border-stone-600 transition">
                        <input 
                            type="checkbox" 
                            checked={wizardState.applyRaceModifiers}
                            onChange={toggleRaceModifiers}
                            className="h-3 w-3 bg-stone-950 border-stone-700 rounded text-red-700 focus:ring-0 cursor-pointer"
                        />
                        <span>Apply Racial Bonuses</span>
                    </label>
                    <button onClick={randomizeAllScores} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 transition group" type="button">
                        <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Randomize All
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ABILITY_SCORES_DATA.abilities.map((ability) => {
                    const baseScore = wizardState.abilityScores[ability.id] || 10;
                    const racialMod = getModifierForAbility(ability.name);
                    const hasMod = racialMod !== 0;
                    const finalScore = wizardState.applyRaceModifiers ? baseScore + racialMod : baseScore;
                    
                    return (
                        <div key={ability.id} className="bg-stone-900/50 p-2 rounded border border-stone-800 flex flex-col gap-1 relative overflow-hidden">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{ability.abbreviation}</span>
                                <button 
                                    onClick={() => randomizeScore(ability.id)} 
                                    className="text-stone-600 hover:text-stone-300 transition"
                                    title={`Randomize ${ability.name}`}
                                    type="button"
                                >
                                    <Dices className="w-3 h-3" />
                                </button>
                            </div>
                            
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={baseScore}
                                    onChange={(e) => handleScoreChange(ability.id, e.target.value)}
                                    className={`dungeon-input w-full text-center text-lg font-bold p-1 rounded transition-all ${
                                        wizardState.applyRaceModifiers && hasMod ? 'text-stone-500 text-sm pb-4 pt-1 border-stone-800' : ''
                                    }`}
                                    placeholder="10"
                                />
                                {wizardState.applyRaceModifiers && hasMod && (
                                    <div className="absolute bottom-0.5 right-0 left-0 text-center pointer-events-none flex items-center justify-center gap-1">
                                        <span className="text-[10px] text-stone-500 font-mono">
                                            {baseScore} {racialMod > 0 ? '+' : ''}{racialMod} = 
                                        </span>
                                        <span className="text-sm font-bold text-green-500 font-cinzel">
                                            {finalScore}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {wizardState.applyRaceModifiers && hasMod && (
                                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-bl-full opacity-50"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            {wizardState.applyRaceModifiers && (
                 <div className="mt-2 flex items-center gap-1 text-[10px] text-stone-500 italic">
                     <Info className="w-3 h-3" />
                     <span>Racial bonuses shown in green. Base score is input.</span>
                 </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-800">
            <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest font-cinzel">Vital Essence (HP)</label>
             <div className="flex gap-2">
                <input 
                type="number" 
                value={wizardState.totalHp || ''}
                onChange={handleHpChange}
                className="dungeon-input w-full rounded-lg p-3 text-stone-300 font-mono"
                placeholder="100"
                />
                <button onClick={randomizeHp} className="dungeon-button px-3 rounded-lg group" title="Randomize HP" type="button">
                    <Dices className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>
          </div>
          
          <div>
              <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest font-cinzel">Affinity & Weakness</label>
              <AffinityManager 
                  resistances={wizardState.resistances}
                  immunities={wizardState.immunities}
                  vulnerabilities={wizardState.vulnerabilities}
                  onChange={handleAffinityChange}
                  isEditable={true}
                  availableTypes={availableTypes}
              />
          </div>

          <button 
            onClick={() => onNext()}
            disabled={!isComplete}
            type="button"
            className={`dungeon-button-primary w-full mt-4 py-4 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 transform ${isComplete ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'}`}
          >
            <span>{isEditing ? 'Continue' : 'Proceed to Visuals'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default NewCharacterDetailsView;

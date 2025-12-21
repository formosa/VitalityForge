import React, { useState, useEffect } from 'react';
import { ViewState, CharacterProfile, CreationWizardState } from './types';
import MainView from './views/MainView';
import SettingsView from './views/SettingsView';
import NewCharacterReferenceView from './views/NewCharacterReferenceView';
import NewCharacterDetailsView from './views/NewCharacterDetailsView';
import NewCharacterSpritesView from './views/NewCharacterSpritesView';
import NewCharacterAnimationView from './views/NewCharacterAnimationView';
import CharacterProfileView from './views/CharacterProfileView';
import * as storage from './services/storageService';
import * as randomizer from './services/randomizerService';
import { ABILITY_SCORES_DATA } from './constants';
import { RACE_DATA } from './data/races';

const getDefaultAbilityScores = () => {
  return ABILITY_SCORES_DATA.abilities.reduce((acc, ability) => {
    acc[ability.id] = 10;
    return acc;
  }, {} as Record<string, number>);
};

const getInitialWizardState = (): CreationWizardState => {
  const settings = storage.getSettings();
  return {
    referenceImage: null,
    name: '',
    race: 'Human',
    subrace: undefined,
    gender: 'Female',
    totalHp: 100,
    spriteSheet: null,
    videoUri: null,
    resistances: [],
    immunities: [],
    vulnerabilities: [],
    abilityScores: getDefaultAbilityScores(),
    applyRaceModifiers: settings.defaultApplyRaceModifiers // Default from settings
  };
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MAIN);
  const [activeProfile, setActiveProfile] = useState<CharacterProfile | null>(null);
  const [profiles, setProfiles] = useState<CharacterProfile[]>([]);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  
  // Wizard State
  const [wizardState, setWizardState] = useState<CreationWizardState>(getInitialWizardState());

  useEffect(() => {
    const load = async () => {
      const data = await storage.getProfiles();
      // Ensure existing profiles have default affinity arrays and ability scores if loaded from old DB
      const patchedData = data.map(p => ({
        ...p,
        resistances: p.resistances || [],
        immunities: p.immunities || [],
        vulnerabilities: p.vulnerabilities || [],
        abilityScores: p.abilityScores || getDefaultAbilityScores()
      }));
      setProfiles(patchedData);
    };
    load();
  }, []);

  const resetWizard = () => {
    setWizardState({
      ...getInitialWizardState(),
      name: randomizer.getRandom(randomizer.FANTASY_NAMES),
    });
    setEditingProfileId(null);
  };

  const updateWizard = (partial: Partial<CreationWizardState>) => {
    setWizardState(prev => ({ ...prev, ...partial }));
  };

  const handleEditProfile = (profile: CharacterProfile) => {
    setWizardState({
      referenceImage: profile.referenceImageBase64,
      name: profile.name,
      race: profile.race,
      subrace: profile.subrace,
      gender: profile.gender,
      totalHp: profile.totalHp,
      spriteSheet: profile.spriteSheetBase64,
      videoUri: profile.animationVideoUri,
      resistances: profile.resistances || [],
      immunities: profile.immunities || [],
      vulnerabilities: profile.vulnerabilities || [],
      abilityScores: profile.abilityScores || getDefaultAbilityScores(),
      applyRaceModifiers: false // Disable auto-modifiers on edit to preserve saved values exactly
    });
    setEditingProfileId(profile.id);
    setView(ViewState.NEW_DETAILS); // Start at Details for consistency
  };

  const handleSaveProfile = async (mode: 'video' | 'sprite') => {
    if (!wizardState.name || !wizardState.spriteSheet) return;

    // Calculate final scores if modifiers are enabled
    const finalAbilityScores = { ...wizardState.abilityScores };
    
    if (wizardState.applyRaceModifiers) {
        const raceConfig = RACE_DATA.find(r => r.race === wizardState.race);
        const subraceConfig = raceConfig?.subraces.find(s => s.subrace === wizardState.subrace);

        const raceMods = raceConfig?.modifiers || {};
        const subraceMods = subraceConfig?.modifiers || {};
        const allMods = { ...raceMods, ...subraceMods };

        Object.entries(allMods).forEach(([key, val]) => {
            const lowerKey = key.toLowerCase();
            // Handle standard abilities (strength, dexterity, etc.)
            // We need to map capitalized Race keys to lowercase State keys if they match
            // Keys in ABILITY_SCORES_DATA are like 'strength', 'dexterity'
            // Keys in RACE_DATA modifiers are like 'Strength', 'Dexterity'
            const matchedAbilityId = ABILITY_SCORES_DATA.abilities.find(a => a.name === key)?.id;
            
            if (matchedAbilityId) {
                finalAbilityScores[matchedAbilityId] = (finalAbilityScores[matchedAbilityId] || 10) + val;
            }
        });
    }

    let profileToSave: CharacterProfile;

    if (editingProfileId) {
        // Update existing profile
        const existingProfile = profiles.find(p => p.id === editingProfileId);
        if (existingProfile) {
            profileToSave = {
                ...existingProfile,
                name: wizardState.name,
                race: wizardState.race,
                subrace: wizardState.subrace,
                gender: wizardState.gender,
                totalHp: wizardState.totalHp,
                referenceImageBase64: wizardState.referenceImage,
                spriteSheetBase64: wizardState.spriteSheet,
                animationMode: mode,
                // Persist video URI if present in wizard or existing profile
                animationVideoUri: wizardState.videoUri || existingProfile.animationVideoUri || null,
                // Clamp current HP to new total if needed
                currentHp: Math.min(existingProfile.currentHp, wizardState.totalHp),
                resistances: wizardState.resistances,
                immunities: wizardState.immunities,
                vulnerabilities: wizardState.vulnerabilities,
                abilityScores: finalAbilityScores
            };
            
            await storage.saveProfile(profileToSave);
            
            setProfiles(prev => prev.map(p => p.id === profileToSave.id ? profileToSave : p));
            if (activeProfile?.id === profileToSave.id) {
                setActiveProfile(profileToSave);
            }
        } else {
            return; // Should not happen
        }
    } else {
        // Create new profile
        profileToSave = {
            id: crypto.randomUUID(),
            name: wizardState.name,
            race: wizardState.race,
            subrace: wizardState.subrace,
            gender: wizardState.gender,
            totalHp: wizardState.totalHp,
            currentHp: wizardState.totalHp,
            referenceImageBase64: wizardState.referenceImage,
            spriteSheetBase64: wizardState.spriteSheet,
            animationMode: mode,
            animationVideoUri: wizardState.videoUri,
            createdAt: Date.now(),
            logs: [],
            // Affinities
            resistances: wizardState.resistances,
            immunities: wizardState.immunities,
            vulnerabilities: wizardState.vulnerabilities,
            abilityScores: finalAbilityScores,
            // Default Visibility Settings
            isHpVisible: false,
            isHpBarVisible: false, 
            isStatusVisible: false,
            isQuickActionsVisible: false,
            isManualInputVisible: true, 
            isEventLogVisible: false,
            isAffinityVisible: false,
            isAbilityScoresVisible: false,
            // Default Log Details Visibility
            isLogTimeVisible: true,
            isLogTypeVisible: true,
            isLogDeltaVisible: true,
            isLogCalculationVisible: true,
            isLogRemainingHpVisible: true,
        };
        
        await storage.saveProfile(profileToSave);
        setProfiles(prev => [profileToSave, ...prev]);
    }

    resetWizard();
    setView(ViewState.MAIN);
  };
  
  const handleDeleteProfile = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently banish this character?")) {
      await storage.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (activeProfile?.id === id) {
        setActiveProfile(null);
        setView(ViewState.MAIN);
      }
    }
  };

  return (
    <div className="h-full w-full bg-transparent text-gray-100 flex flex-col font-sans">
      {view === ViewState.MAIN && (
        <MainView 
          profiles={profiles}
          onNavigateSettings={() => setView(ViewState.SETTINGS)}
          onNavigateNew={() => { resetWizard(); setView(ViewState.NEW_DETAILS); }}
          onSelectProfile={(profile) => { setActiveProfile(profile); setView(ViewState.PROFILE); }}
          onEditProfile={handleEditProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}

      {view === ViewState.SETTINGS && (
        <SettingsView onBack={() => setView(ViewState.MAIN)} />
      )}

      {/* Step 1: Details */}
      {view === ViewState.NEW_DETAILS && (
        <NewCharacterDetailsView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          onCancel={() => { resetWizard(); setView(ViewState.MAIN); }}
          onNext={() => setView(ViewState.NEW_REF)}
          isEditing={!!editingProfileId}
        />
      )}

      {/* Step 2: Reference/Identity */}
      {view === ViewState.NEW_REF && (
        <NewCharacterReferenceView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          profiles={profiles}
          onBack={() => { 
             // If creating new, go back to Details. If editing, we still go to Details as per flow.
             setView(ViewState.NEW_DETAILS); 
          }}
          onNext={() => setView(ViewState.NEW_SPRITES)}
          isEditing={!!editingProfileId}
        />
      )}

      {/* Step 3: Sprites */}
      {view === ViewState.NEW_SPRITES && (
        <NewCharacterSpritesView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          onCancel={() => { resetWizard(); setView(ViewState.MAIN); }}
          onNext={() => setView(ViewState.NEW_ANIMATION)}
          isEditing={!!editingProfileId}
        />
      )}

      {/* Step 4: Animation/Save */}
      {view === ViewState.NEW_ANIMATION && (
        <NewCharacterAnimationView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          onCancel={() => { resetWizard(); setView(ViewState.MAIN); }}
          onSave={handleSaveProfile}
          isEditing={!!editingProfileId}
        />
      )}

      {view === ViewState.PROFILE && activeProfile && (
        <CharacterProfileView 
          profile={activeProfile}
          onBack={() => setView(ViewState.MAIN)}
          onUpdateProfile={async (updated) => {
             // Save to DB (async/background)
             storage.saveProfile(updated);
             // Update local state immediately for UI responsiveness
             setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
             setActiveProfile(updated);
          }}
        />
      )}
    </div>
  );
};

export default App;
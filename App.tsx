
import React, { useState, useEffect } from 'react';
import { ViewState, CharacterProfile, CreationWizardState } from './types';
import MainView from './views/MainView';
import SettingsView from './views/SettingsView';
import NewCharacterReferenceView from './views/NewCharacterReferenceView';
import NewCharacterDetailsView from './views/NewCharacterDetailsView';
import NewCharacterVisageView from './views/NewCharacterVisageView';
import NewCharacterSpritesView from './views/NewCharacterSpritesView';
import NewCharacterAnimationView from './views/NewCharacterAnimationView';
import CharacterProfileView from './views/CharacterProfileView';
import * as storage from './services/storageService';
import * as randomizer from './services/randomizerService';
import { ABILITY_SCORES_DATA } from './constants';

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
    description: '',
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
    applyRaceModifiers: settings.defaultApplyRaceModifiers,
    applyAbilityVisage: true
  };
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MAIN);
  const [activeProfile, setActiveProfile] = useState<CharacterProfile | null>(null);
  const [profiles, setProfiles] = useState<CharacterProfile[]>([]);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  
  const [wizardState, setWizardState] = useState<CreationWizardState>(getInitialWizardState());

  useEffect(() => {
    const load = async () => {
      const data = await storage.getProfiles();
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
      description: '', // Reset on edit
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
      applyRaceModifiers: false,
      applyAbilityVisage: true
    });
    setEditingProfileId(profile.id);
    setView(ViewState.NEW_DETAILS);
  };

  const handleSaveProfile = async (mode: 'video' | 'sprite') => {
    if (!wizardState.name || !wizardState.spriteSheet) return;

    const finalAbilityScores = { ...wizardState.abilityScores };
    
    // Save logic unchanged - permanently applies racial mods if checked
    let profileToSave: CharacterProfile;

    if (editingProfileId) {
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
                animationVideoUri: wizardState.videoUri || existingProfile.animationVideoUri || null,
                currentHp: Math.min(existingProfile.currentHp, wizardState.totalHp),
                resistances: wizardState.resistances,
                immunities: wizardState.immunities,
                vulnerabilities: wizardState.vulnerabilities,
                abilityScores: finalAbilityScores
            };
            await storage.saveProfile(profileToSave);
            setProfiles(prev => prev.map(p => p.id === profileToSave.id ? profileToSave : p));
            if (activeProfile?.id === profileToSave.id) setActiveProfile(profileToSave);
        }
    } else {
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
            resistances: wizardState.resistances,
            immunities: wizardState.immunities,
            vulnerabilities: wizardState.vulnerabilities,
            abilityScores: finalAbilityScores,
            isHpVisible: false,
            isHpBarVisible: false, 
            isStatusVisible: false,
            isQuickActionsVisible: false,
            isManualInputVisible: true, 
            isEventLogVisible: false,
            isAffinityVisible: false,
            isAbilityScoresVisible: false,
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
    if (window.confirm("Banish this character permanently?")) {
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

      {view === ViewState.NEW_DETAILS && (
        <NewCharacterDetailsView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          onCancel={() => { resetWizard(); setView(ViewState.MAIN); }}
          onNext={() => setView(ViewState.NEW_REF)}
          isEditing={!!editingProfileId}
        />
      )}

      {view === ViewState.NEW_REF && (
        <NewCharacterReferenceView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          profiles={profiles}
          onBack={() => setView(ViewState.NEW_DETAILS)}
          onNext={() => setView(ViewState.NEW_VISAGE)}
          isEditing={!!editingProfileId}
        />
      )}

      {view === ViewState.NEW_VISAGE && (
        <NewCharacterVisageView
          wizardState={wizardState}
          updateWizard={updateWizard}
          onBack={() => setView(ViewState.NEW_REF)}
          onNext={() => setView(ViewState.NEW_SPRITES)}
        />
      )}

      {view === ViewState.NEW_SPRITES && (
        <NewCharacterSpritesView 
          wizardState={wizardState}
          updateWizard={updateWizard}
          onCancel={() => { resetWizard(); setView(ViewState.MAIN); }}
          onNext={() => setView(ViewState.NEW_ANIMATION)}
          isEditing={!!editingProfileId}
        />
      )}

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
             storage.saveProfile(updated);
             setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
             setActiveProfile(updated);
          }}
        />
      )}
    </div>
  );
};

export default App;

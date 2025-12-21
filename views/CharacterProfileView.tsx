import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Monitor, Eye, EyeOff } from 'lucide-react';
import { CharacterProfile, EventLogEntry, FloatingText, DamageConfig, DamageCategoryConfig } from '../types';
import Visualizer from '../components/Visualizer';
import VitalityStatus from '../components/VitalityStatus';
import CombatControls from '../components/CombatControls';
import CombatLog from '../components/CombatLog';
import AffinityManager from '../components/AffinityManager';
import AbilityScoreDisplay from '../components/AbilityScoreDisplay';
import * as storage from '../services/storageService';
import { DEFAULT_DAMAGE_CONFIG } from '../constants';
import { calculateDamage, createCombatLog } from '../services/combatService';

interface Props {
  profile: CharacterProfile;
  onBack: () => void;
  onUpdateProfile: (p: CharacterProfile) => void;
}

const CharacterProfileView: React.FC<Props> = ({ profile, onBack, onUpdateProfile }) => {
  const [isDmView, setIsDmView] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [damageConfig, setDamageConfig] = useState<DamageConfig>(DEFAULT_DAMAGE_CONFIG);
  
  const isDead = profile.currentHp <= 0;
  
  // Two separate states for visualization:
  // 1. spriteHp: Delayed to allow impact animation to play on the "old" sprite state before switching.
  // 2. barHp: Updates immediately via props (profile.currentHp) for responsiveness.
  const [spriteHp, setSpriteHp] = useState(profile.currentHp);
  
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  
  const prevHpRef = useRef(profile.currentHp);
  const lastActionTypeRef = useRef<string>('Generic');

  // Load Settings for Damage Config
  useEffect(() => {
    const settings = storage.getSettings();
    if (settings && settings.damageConfig) {
        setDamageConfig(settings.damageConfig);
    }
  }, []);

  const getFlashColor = (subType: string = '') => {
      // Find the color from config based on ID
      for (const cat of Object.values(damageConfig) as DamageCategoryConfig[]) {
          const typeConfig = cat.damage_types.find(t => t.id === subType);
          if (typeConfig) return typeConfig.color;
      }
      return '#dc2626'; // Default red
  };

  const getEffectForSubType = (subType: string): string => {
      // Map ID to Effect Category ID
      for (const [catId, cat] of Object.entries(damageConfig) as [string, DamageCategoryConfig][]) {
          if (cat.damage_types.some(t => t.id === subType)) return catId;
      }
      // Fallback for defaults if not found
      if (['Healing', 'Restoration'].includes(subType)) return 'healing';
      return 'physical'; 
  };
  
  // Collect all available types for affinity manager
  const getAllDamageTypeIds = () => {
      let types: string[] = [];
      Object.values(damageConfig).forEach((cat: DamageCategoryConfig) => {
          types = [...types, ...cat.damage_types.map(t => t.id)];
      });
      return types;
  };

  // Logic to handle Hit Animation & Sprite Update Delay
  useEffect(() => {
    const prevHp = prevHpRef.current;
    const currentHp = profile.currentHp;
    const subType = lastActionTypeRef.current;

    // Detect change direction
    if (currentHp !== prevHp) {
        if (currentHp < prevHp) {
            // Damage Taken
            const effect = getEffectForSubType(subType);
            setActiveEffect(effect);
            setFlashColor(getFlashColor(subType));

            // Delay sprite update to allow shake/flash to be perceived
            const timer = setTimeout(() => {
                setActiveEffect(null);
                setFlashColor(null);
                setSpriteHp(currentHp);
            }, 600); // 600ms matches typical animation duration
            return () => clearTimeout(timer);
        } else {
            // Healing Received
            setActiveEffect('healing');
            setFlashColor('#16a34a');

            const timer = setTimeout(() => {
                setActiveEffect(null);
                setFlashColor(null);
                setSpriteHp(currentHp);
            }, 800);
            return () => clearTimeout(timer);
        }
    } else {
        // Initial load or no change (just in case)
        setSpriteHp(currentHp);
        setActiveEffect(null);
        setFlashColor(null);
    }
    prevHpRef.current = currentHp;
  }, [profile.currentHp]);

  // Calculations for Visuals
  const spriteHpPercentage = (spriteHp / profile.totalHp) * 100;
  const barHpPercentage = (profile.currentHp / profile.totalHp) * 100;

  const handleReset = () => {
    lastActionTypeRef.current = 'Restoration';
    // Use the service to create log for consistency even if logic is simple
    const newLog = createCombatLog(
        profile.currentHp,
        profile.totalHp,
        profile.totalHp - profile.currentHp,
        profile.totalHp - profile.currentHp,
        'Restoration',
        'normal'
    );
    
    onUpdateProfile({ 
        ...profile, 
        currentHp: profile.totalHp,
        logs: [...(profile.logs || []), newLog] 
    });
  };

  const handleUndo = () => {
    if (profile.logs.length === 0) return;
    
    // Get last log entry
    const lastLog = profile.logs[profile.logs.length - 1];
    // Create new logs array excluding the last one
    const newLogs = profile.logs.slice(0, -1);
    
    onUpdateProfile({
        ...profile,
        currentHp: lastLog.prevHp, // Revert to previous HP stored in log
        logs: newLogs
    });
  };

  const handleDeltaHp = (delta: number, subType: string = 'Generic') => {
    lastActionTypeRef.current = subType;
    
    // Delegate Math to Service
    const { finalDelta, newHp, modifier, originalAmount } = calculateDamage(
      profile.currentHp, 
      profile.totalHp, 
      delta, 
      subType, 
      profile
    );
    
    // Delegate Log Creation to Service
    const newLog = createCombatLog(
      profile.currentHp,
      newHp,
      finalDelta,
      originalAmount,
      subType,
      modifier
    );

    onUpdateProfile({ 
        ...profile, 
        currentHp: newHp,
        logs: [...(profile.logs || []), newLog]
    });

    // Floating Text Logic (UI Concern)
    const isImmune = modifier === 'immune';
    const isFullyResisted = modifier === 'resistant' && finalDelta === 0 && originalAmount > 0;
    const hasChange = finalDelta !== 0;

    if ((isDmView || profile.isManualInputVisible) && (hasChange || isImmune || isFullyResisted)) {
      const id = Date.now().toString() + Math.random().toString();
      
      let text = '';
      let color = '';

      if (isImmune) {
          text = 'IMMUNE';
          color = 'text-stone-400';
      } else if (isFullyResisted) {
          text = 'RESISTED';
          color = 'text-blue-400';
      } else {
          text = finalDelta < 0 ? `${finalDelta}` : `+${finalDelta}`;
          color = finalDelta < 0 ? 'text-red-500' : 'text-green-500';
      }
      
      setFloatingTexts(prev => [
        ...prev,
        {
          id,
          text,
          color,
          left: 50 + (Math.random() * 20 - 10), // Random jitter +/- 10%
          top: 40 + (Math.random() * 20 - 10)  // Random jitter +/- 10%
        }
      ]);

      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
      }, 3000); 
    }
  };

  const toggleVisibility = (key: keyof CharacterProfile) => {
    onUpdateProfile({ ...profile, [key]: !profile[key] });
  };

  const handleAffinityChange = (type: 'resistances' | 'immunities' | 'vulnerabilities', values: string[]) => {
      onUpdateProfile({ ...profile, [type]: values });
  };

  return (
    <div className="flex flex-col h-full bg-black/95">
      {/* Top Navigation & Status Bar */}
      <div className="dungeon-panel border-b border-stone-800 p-2 z-10 sticky top-0 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center text-stone-400 hover:text-white transition-colors mr-6 group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-cinzel font-bold tracking-widest text-sm">Return</span>
                </button>
                
                <div className="flex items-center bg-stone-950 rounded-lg p-1 border border-stone-800 shadow-inner">
                    <button 
                    onClick={() => setIsDmView(true)}
                    className={`px-4 py-1.5 rounded text-xs font-bold transition-all font-cinzel tracking-wider ${isDmView ? 'bg-red-900/40 text-red-200 shadow-sm border border-red-900/30' : 'text-stone-600 hover:text-stone-400'}`}
                    >
                        Master
                    </button>
                    <button 
                    onClick={() => setIsDmView(false)}
                    className={`px-4 py-1.5 rounded text-xs font-bold transition-all font-cinzel tracking-wider flex items-center gap-2 ${!isDmView ? 'bg-blue-900/30 text-blue-200 shadow-sm border border-blue-900/30' : 'text-stone-600 hover:text-stone-400'}`}
                    >
                        <Monitor className="w-3 h-3" />
                        Player
                    </button>
                </div>
            </div>

            {isDmView ? (
                <button 
                    onClick={handleReset} 
                    className="dungeon-button px-4 py-1.5 rounded flex items-center text-xs text-green-500 border-stone-800 hover:border-green-800"
                >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Restore
                </button>
            ) : (
                <div className="w-24"></div> 
            )}
        </div>
        
        {/* Name & Race Centered */}
        <div className="flex flex-col items-center justify-center -mt-1 pb-1">
             <h1 className="text-xl font-cinzel font-black text-stone-200 uppercase tracking-widest leading-none drop-shadow-md">{profile.name}</h1>
             <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">
                <span>{profile.gender}</span>
                {profile.subrace && <span>{profile.subrace}</span>}
                <span>{profile.race}</span>
             </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel: Visualizer */}
        <div className="h-[40vh] md:h-auto md:flex-1 border-r border-stone-800 overflow-hidden bg-[#050505] relative flex flex-col flex-shrink-0 md:flex-shrink">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-stone-700 z-10 opacity-50 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-stone-700 z-10 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-stone-700 z-10 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-stone-700 z-10 opacity-50 pointer-events-none"></div>

            <div className="flex-1 relative overflow-hidden">
                <Visualizer 
                   mode={profile.animationMode === 'sprite' ? 'sprite' : 'video'}
                   src={profile.animationMode === 'sprite' ? profile.spriteSheetBase64 : profile.animationVideoUri}
                   isDead={isDead}
                   // Use delayed sprite HP for visualizer to sync with impact animation
                   visualHpPercentage={spriteHpPercentage}
                   effectType={activeEffect}
                   flashColor={flashColor}
                   floatingTexts={floatingTexts}
                />
            </div>

            {/* Health Bar Overlay */}
            {(isDmView || profile.isHpBarVisible || profile.isHpVisible) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <div className="flex items-center gap-4">
                             <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] font-cinzel drop-shadow-md">Vital Essence</span>
                             
                             {isDmView && (
                                 <div className="flex gap-2">
                                      <label className="flex items-center gap-1 cursor-pointer group" title="Toggle HP Text">
                                          <span className="text-[9px] text-stone-600 uppercase group-hover:text-stone-400 font-bold">Values</span>
                                          <input 
                                          type="checkbox" 
                                          checked={profile.isHpVisible}
                                          onChange={() => toggleVisibility('isHpVisible')}
                                          className="hidden"
                                          />
                                          <div className={`p-0.5 rounded ${profile.isHpVisible ? 'text-green-500' : 'text-stone-600 group-hover:text-stone-400'}`}>
                                              {profile.isHpVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                          </div>
                                      </label>
            
                                      <label className="flex items-center gap-1 cursor-pointer group" title="Toggle Bar">
                                          <span className="text-[9px] text-stone-600 uppercase group-hover:text-stone-400 font-bold">Bar</span>
                                          <input 
                                          type="checkbox" 
                                          checked={profile.isHpBarVisible}
                                          onChange={() => toggleVisibility('isHpBarVisible')}
                                          className="hidden"
                                          />
                                          <div className={`p-0.5 rounded ${profile.isHpBarVisible ? 'text-green-500' : 'text-stone-600 group-hover:text-stone-400'}`}>
                                              {profile.isHpBarVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                          </div>
                                      </label>
                                 </div>
                             )}
                        </div>
                        
                        {(isDmView || profile.isHpVisible) && (
                             <div className={`text-2xl font-black font-cinzel drop-shadow-md ${isDead ? 'text-stone-500' : barHpPercentage < 30 ? 'text-red-500 animate-pulse' : 'text-stone-200'}`}>
                                 {profile.currentHp} <span className="text-sm text-stone-500 font-serif italic">/ {profile.totalHp}</span>
                             </div>
                        )}
                    </div>

                    {(isDmView || profile.isHpBarVisible) && (
                        <div className="relative h-3 md:h-5 w-full bg-stone-950/80 rounded-full border border-stone-800 shadow-2xl overflow-hidden backdrop-blur-sm">
                             <div 
                                className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden ${
                                  barHpPercentage > 50 ? 'bg-gradient-to-r from-red-900 to-red-600' : 
                                  barHpPercentage > 25 ? 'bg-gradient-to-r from-red-950 to-red-800' : 'bg-gradient-to-r from-stone-900 to-red-900'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, barHpPercentage))}%` }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/10 rounded-t-full"></div>
                                <div className="absolute inset-0 bg-red-500/10 animate-pulse-slow"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Right Panel: Controls */}
        <div className="flex-1 md:flex-none w-full md:w-[450px] bg-stone-950/95 flex flex-col overflow-hidden border-t border-stone-800 md:border-t-0 shadow-2xl relative">
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-stone-800 via-stone-700 to-stone-800 opacity-50"></div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <VitalityStatus 
                currentHp={profile.currentHp}
                totalHp={profile.totalHp}
                isDead={isDead}
                isVisibleHp={profile.isHpVisible}
                isVisibleBar={profile.isHpBarVisible}
                isVisibleStatus={profile.isStatusVisible}
                onToggle={toggleVisibility}
                isDmView={isDmView}
            />

            <AbilityScoreDisplay
                abilityScores={profile.abilityScores || {}}
                isVisible={profile.isAbilityScoresVisible ?? true}
                onToggle={toggleVisibility}
                isDmView={isDmView}
            />

            {/* Affinity Manager (Only if DM or Visible) */}
            <AffinityManager 
                resistances={profile.resistances || []}
                immunities={profile.immunities || []}
                vulnerabilities={profile.vulnerabilities || []}
                onChange={handleAffinityChange}
                isEditable={isDmView}
                isVisible={profile.isAffinityVisible}
                onToggleVisibility={() => toggleVisibility('isAffinityVisible')}
                availableTypes={getAllDamageTypeIds()}
            />

            <CombatControls 
                onDeltaHp={handleDeltaHp}
                onUndo={handleUndo}
                canUndo={profile.logs.length > 0}
                isVisibleManual={profile.isManualInputVisible}
                onToggle={toggleVisibility}
                isDmView={isDmView}
                damageConfig={damageConfig}
            />
          </div>

          <CombatLog 
             logs={profile.logs}
             isVisible={profile.isEventLogVisible}
             showTime={profile.isLogTimeVisible ?? true}
             showType={profile.isLogTypeVisible ?? true}
             showDelta={profile.isLogDeltaVisible ?? true}
             showCalculation={profile.isLogCalculationVisible ?? true}
             showRemaining={profile.isLogRemainingHpVisible ?? true}
             onToggle={toggleVisibility}
             isDmView={isDmView}
          />

        </div>
      </div>
    </div>
  );
};

export default CharacterProfileView;
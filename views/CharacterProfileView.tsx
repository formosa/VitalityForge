
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Monitor, Eye, EyeOff, Shield, Swords, ScrollText, Image as ImageIcon } from 'lucide-react';
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

type MobileTab = 'visual' | 'combat' | 'log';

const CharacterProfileView: React.FC<Props> = ({ profile, onBack, onUpdateProfile }) => {
  const [isDmView, setIsDmView] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [damageConfig, setDamageConfig] = useState<DamageConfig>(DEFAULT_DAMAGE_CONFIG);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('visual');
  
  const isDead = profile.currentHp <= 0;
  
  const [spriteHp, setSpriteHp] = useState(profile.currentHp);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  
  const prevHpRef = useRef(profile.currentHp);
  const lastActionTypeRef = useRef<string>('Generic');

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings && settings.damageConfig) {
        setDamageConfig(settings.damageConfig);
    }
  }, []);

  const getFlashColor = (subType: string = '') => {
      for (const cat of Object.values(damageConfig) as DamageCategoryConfig[]) {
          const typeConfig = cat.damage_types.find(t => t.id === subType);
          if (typeConfig) return typeConfig.color;
      }
      return '#dc2626';
  };

  const getEffectForSubType = (subType: string): string => {
      for (const [catId, cat] of Object.entries(damageConfig) as [string, DamageCategoryConfig][]) {
          if (cat.damage_types.some(t => t.id === subType)) return catId;
      }
      if (['Healing', 'Restoration'].includes(subType)) return 'healing';
      return 'physical'; 
  };
  
  const getAllDamageTypeIds = () => {
      let types: string[] = [];
      Object.values(damageConfig).forEach((cat: DamageCategoryConfig) => {
          types = [...types, ...cat.damage_types.map(t => t.id)];
      });
      return types;
  };

  useEffect(() => {
    const prevHp = prevHpRef.current;
    const currentHp = profile.currentHp;
    const subType = lastActionTypeRef.current;

    if (currentHp !== prevHp) {
        if (currentHp < prevHp) {
            const effect = getEffectForSubType(subType);
            setActiveEffect(effect);
            setFlashColor(getFlashColor(subType));

            const timer = setTimeout(() => {
                setActiveEffect(null);
                setFlashColor(null);
                setSpriteHp(currentHp);
            }, 600);
            return () => clearTimeout(timer);
        } else {
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
        setSpriteHp(currentHp);
        setActiveEffect(null);
        setFlashColor(null);
    }
    prevHpRef.current = currentHp;
  }, [profile.currentHp]);

  const spriteHpPercentage = (spriteHp / profile.totalHp) * 100;
  const barHpPercentage = (profile.currentHp / profile.totalHp) * 100;

  const handleReset = () => {
    lastActionTypeRef.current = 'Restoration';
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
    const lastLog = profile.logs[profile.logs.length - 1];
    const newLogs = profile.logs.slice(0, -1);
    
    onUpdateProfile({
        ...profile,
        currentHp: lastLog.prevHp,
        logs: newLogs
    });
  };

  const handleDeltaHp = (delta: number, subType: string = 'Generic') => {
    lastActionTypeRef.current = subType;
    const { finalDelta, newHp, modifier, originalAmount } = calculateDamage(
      profile.currentHp, 
      profile.totalHp, 
      delta, 
      subType, 
      profile
    );
    
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
          left: 50 + (Math.random() * 20 - 10),
          top: 40 + (Math.random() * 20 - 10)
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

  // --- COMPONENT SECTIONS ---

  const Header = () => (
    <div className="bg-stone-950/95 border-b border-stone-800 p-2 md:p-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 text-stone-400 hover:text-white transition-colors rounded-full hover:bg-stone-900">
           <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-lg md:text-xl font-cinzel font-black text-stone-200 uppercase tracking-wide leading-none">{profile.name}</h1>
           <div className="flex items-center gap-2 text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">
               <span className="text-red-600">{profile.race}</span>
               {profile.subrace && <span>• {profile.subrace}</span>}
               <span className="hidden md:inline">• {profile.gender}</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
         {/* Desktop View Toggles */}
         <div className="hidden md:flex items-center bg-stone-900 rounded-lg p-1 border border-stone-800">
             <button 
             onClick={() => setIsDmView(true)}
             className={`px-3 py-1 rounded text-[10px] font-bold transition-all uppercase ${isDmView ? 'bg-red-900/40 text-red-200' : 'text-stone-600 hover:text-stone-400'}`}
             >
                 Master
             </button>
             <button 
             onClick={() => setIsDmView(false)}
             className={`px-3 py-1 rounded text-[10px] font-bold transition-all uppercase flex items-center gap-1 ${!isDmView ? 'bg-blue-900/30 text-blue-200' : 'text-stone-600 hover:text-stone-400'}`}
             >
                 <Monitor className="w-3 h-3" />
                 Player
             </button>
         </div>

         {/* Mobile View Toggle (Simplified) */}
         <button 
           onClick={() => setIsDmView(!isDmView)}
           className={`md:hidden p-2 rounded-lg border ${isDmView ? 'border-red-900 bg-red-900/20 text-red-400' : 'border-stone-800 bg-stone-900 text-stone-500'}`}
         >
            {isDmView ? <Shield className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
         </button>

         {isDmView && (
             <button 
                 onClick={handleReset} 
                 className="p-2 rounded bg-stone-900 text-green-600 border border-stone-800 hover:border-green-800"
                 title="Restore Full Health"
             >
                 <RefreshCw className="w-4 h-4" />
             </button>
         )}
      </div>
    </div>
  );

  const VisualizerPanel = () => (
    <div className="w-full h-full relative flex flex-col">
        <div className="flex-1 relative overflow-hidden bg-black/50">
            <Visualizer 
                mode={profile.animationMode === 'sprite' ? 'sprite' : 'video'}
                src={profile.animationMode === 'sprite' ? profile.spriteSheetBase64 : profile.animationVideoUri}
                isDead={isDead}
                visualHpPercentage={spriteHpPercentage}
                effectType={activeEffect}
                flashColor={flashColor}
                floatingTexts={floatingTexts}
            />
        </div>
        
        {/* HP Overlay */}
        {(isDmView || profile.isHpVisible || profile.isHpBarVisible) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-[0.2em] font-cinzel drop-shadow-md">Vital Essence</span>
                    {(isDmView || profile.isHpVisible) && (
                        <div className={`text-xl md:text-2xl font-black font-cinzel drop-shadow-md ${isDead ? 'text-stone-500' : barHpPercentage < 30 ? 'text-red-500 animate-pulse' : 'text-stone-200'}`}>
                            {profile.currentHp} <span className="text-xs md:text-sm text-stone-500 font-serif italic">/ {profile.totalHp}</span>
                        </div>
                    )}
                </div>
                {(isDmView || profile.isHpBarVisible) && (
                    <div className="relative h-2 md:h-4 w-full bg-stone-950/80 rounded-full border border-stone-800 shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div 
                        className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden ${
                            barHpPercentage > 50 ? 'bg-gradient-to-r from-red-900 to-red-600' : 
                            barHpPercentage > 25 ? 'bg-gradient-to-r from-red-950 to-red-800' : 'bg-gradient-to-r from-stone-900 to-red-900'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, barHpPercentage))}%` }}
                        >
                             <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/10 rounded-t-full"></div>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );

  const StatsAndControls = () => (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">
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
  );

  const LogPanel = () => (
      <div className="h-full overflow-y-auto custom-scrollbar bg-black/40">
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
  );

  // --- MAIN RENDER ---

  return (
    <div className="flex flex-col h-full bg-black">
      <Header />

      {/* --- DESKTOP LAYOUT (Split Screen) --- */}
      <div className="hidden md:flex flex-1 overflow-hidden">
         <div className="flex-[4] border-r border-stone-800 relative bg-[#050505]">
            <VisualizerPanel />
         </div>
         <div className="flex-[3] max-w-md bg-stone-950 flex flex-col border-l border-stone-800">
             <div className="flex-1 overflow-hidden relative">
                 <StatsAndControls />
             </div>
             <div className="h-1/3 min-h-[200px] border-t border-stone-800">
                 <LogPanel />
             </div>
         </div>
      </div>

      {/* --- MOBILE LAYOUT (Tabs) --- */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-hidden relative">
             {/* We keep Visualizer mounted but hidden to preserve video state/animations if possible, 
                 or we just unmount. For cleaner DOM, we conditionally render. */}
             {activeMobileTab === 'visual' && <VisualizerPanel />}
             {activeMobileTab === 'combat' && <StatsAndControls />}
             {activeMobileTab === 'log' && <LogPanel />}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="h-16 bg-stone-950 border-t border-stone-800 flex items-stretch justify-around z-50">
             <button 
               onClick={() => setActiveMobileTab('visual')}
               className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeMobileTab === 'visual' ? 'text-red-500 bg-red-950/10' : 'text-stone-500'}`}
             >
                <ImageIcon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Visual</span>
             </button>
             <button 
               onClick={() => setActiveMobileTab('combat')}
               className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeMobileTab === 'combat' ? 'text-red-500 bg-red-950/10' : 'text-stone-500'}`}
             >
                <Swords className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Combat</span>
             </button>
             <button 
               onClick={() => setActiveMobileTab('log')}
               className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeMobileTab === 'log' ? 'text-red-500 bg-red-950/10' : 'text-stone-500'}`}
             >
                <ScrollText className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Log</span>
             </button>
          </div>
      </div>
    </div>
  );
};

export default CharacterProfileView;

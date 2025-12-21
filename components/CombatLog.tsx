import React, { useEffect, useRef, useState } from 'react';
import { History, Eye, EyeOff, Clock, Settings, ArrowRight, Shield, ShieldOff, Skull, ShieldAlert } from 'lucide-react';
import { CharacterProfile, EventLogEntry } from '../types';

interface Props {
  logs: EventLogEntry[];
  isVisible: boolean;
  showTime: boolean;
  showType: boolean;
  showDelta: boolean;
  showCalculation: boolean;
  showRemaining: boolean;
  onToggle: (field: keyof CharacterProfile) => void;
  isDmView: boolean;
}

const CombatLog: React.FC<Props> = ({ 
    logs, isVisible, 
    showTime, showType, showDelta, showCalculation, showRemaining,
    onToggle, isDmView 
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Scroll logs to bottom on update
  useEffect(() => {
    if (logsEndRef.current && (isDmView || isVisible)) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isDmView, isVisible]);

  if (!isDmView && !isVisible) return null;

  return (
    <div className="border-t border-stone-800 bg-black/60 p-4 max-h-48 overflow-y-auto relative group custom-scrollbar">
       <div className="flex justify-between items-start mb-3 sticky top-0 bg-stone-950/90 backdrop-blur-sm z-10 py-1 -mt-1 border-b border-stone-900">
           <div className="flex items-center gap-2">
              <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2 font-cinzel">
                  <History className="w-3 h-3" /> Chronicle
              </h3>
           </div>

           {isDmView && (
              <div className="flex items-center gap-2">
                 {/* Settings Toggle */}
                 <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`p-1 rounded transition-all ${isSettingsOpen ? 'bg-stone-800 text-stone-300' : 'text-stone-600 hover:text-stone-400'}`}
                    title="Configure Log Details"
                 >
                    <Settings className="w-3 h-3" />
                 </button>

                 {/* Main Visibility Toggle */}
                 <label className="flex items-center gap-1 cursor-pointer" title="Toggle visibility">
                      <input 
                        type="checkbox" 
                        checked={isVisible}
                        onChange={() => onToggle('isEventLogVisible')}
                        className="hidden"
                      />
                      <div className={`p-1 rounded ${isVisible ? 'text-green-600' : 'text-stone-700 hover:text-stone-500'}`}>
                          {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </div>
                 </label>
              </div>
           )}
       </div>
       
       {/* Settings Menu */}
       {isDmView && isSettingsOpen && (
           <div className="mb-4 bg-stone-900 border border-stone-800 rounded p-3 text-xs animate-fade-in shadow-xl">
               <h4 className="font-bold text-stone-400 mb-2 uppercase tracking-wide text-[10px] font-cinzel">Visibility Filters</h4>
               <div className="grid grid-cols-2 gap-2">
                   <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200">
                       <input type="checkbox" checked={showTime} onChange={() => onToggle('isLogTimeVisible')} className="rounded border-stone-700 bg-stone-950 text-red-900 focus:ring-0" />
                       <span>Time Sigil</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200">
                       <input type="checkbox" checked={showType} onChange={() => onToggle('isLogTypeVisible')} className="rounded border-stone-700 bg-stone-950 text-red-900 focus:ring-0" />
                       <span>Damage Type</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200">
                       <input type="checkbox" checked={showDelta} onChange={() => onToggle('isLogDeltaVisible')} className="rounded border-stone-700 bg-stone-950 text-red-900 focus:ring-0" />
                       <span>Magnitude</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200">
                       <input type="checkbox" checked={showCalculation} onChange={() => onToggle('isLogCalculationVisible')} className="rounded border-stone-700 bg-stone-950 text-red-900 focus:ring-0" />
                       <span>Math & Modifiers</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200">
                       <input type="checkbox" checked={showRemaining} onChange={() => onToggle('isLogRemainingHpVisible')} className="rounded border-stone-700 bg-stone-950 text-red-900 focus:ring-0" />
                       <span>Resulting Essence</span>
                   </label>
               </div>
           </div>
       )}
       
       <div className="space-y-1 text-xs font-crimson">
          {(!logs || logs.length === 0) && (
              <div className="text-stone-700 italic text-center py-2 font-serif">The chronicle is empty.</div>
          )}
          {logs?.map(log => {
              // Determine Color based on subType/Type
              let typeColor = 'text-stone-400';
              if (log.type === 'heal' || log.type === 'restore') typeColor = 'text-green-600';
              else if (['Fire', 'Force'].includes(log.subType || '')) typeColor = 'text-red-600';
              else if (['Cold'].includes(log.subType || '')) typeColor = 'text-blue-500';
              else if (['Lightning', 'Radiant'].includes(log.subType || '')) typeColor = 'text-yellow-500';
              else if (['Acid', 'Poison'].includes(log.subType || '')) typeColor = 'text-lime-500';
              else if (['Thunder', 'Psychic', 'Necrotic'].includes(log.subType || '')) typeColor = 'text-purple-500';
              else if (['Bludgeoning', 'Piercing', 'Slashing'].includes(log.subType || '')) typeColor = 'text-stone-300';
              else typeColor = 'text-red-400'; // Default damage

              // Modifiers
              const mod = log.modifier || 'normal';
              const original = log.originalAmount !== undefined ? log.originalAmount : log.amount;

              // Check if we should render each part
              const displayTime = showTime;
              const displayType = showType;
              const displayDelta = showDelta;
              const displayCalc = showCalculation;
              const displayRem = showRemaining;

              return (
                  <div key={log.id} className="flex flex-col border-b border-stone-900/50 pb-1 last:border-0 hover:bg-white/5 px-1 rounded transition">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {displayTime && (
                                <span className="text-stone-600 font-mono text-[10px]"><Clock className="w-2.5 h-2.5 inline mr-1" />{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            )}
                            {displayType && (
                                <span className={`font-bold font-cinzel text-[10px] uppercase tracking-wide ${typeColor}`}>{log.subType}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                            {displayDelta && (
                                <span className={`font-bold ${log.type === 'damage' ? 'text-red-500' : 'text-green-600'}`}>
                                    {log.type === 'damage' ? '-' : '+'}{log.amount}
                                </span>
                            )}
                            
                            {displayRem && (
                                <span className="text-stone-500 text-[10px]">
                                    [{log.newHp}]
                                </span>
                            )}
                        </div>
                      </div>

                      {/* Detailed Calculations Line */}
                      {displayCalc && (mod !== 'normal' || displayRem) && (
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] pl-2 opacity-80">
                            <span className="text-stone-600 transform rotate-90 scale-75"><ArrowRight className="w-3 h-3" /></span>
                            
                            {mod === 'immune' && (
                                <span className="text-stone-400 font-bold flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-stone-500" />
                                    IMMUNE (0 dmg)
                                </span>
                            )}
                            {mod === 'resistant' && (
                                <span className="text-blue-400 font-bold flex items-center gap-1">
                                    <ShieldOff className="w-3 h-3 text-blue-500" />
                                    RESISTED ({original} &rarr; {log.amount})
                                </span>
                            )}
                            {mod === 'vulnerable' && (
                                <span className="text-red-400 font-bold flex items-center gap-1">
                                    <Skull className="w-3 h-3 text-red-500" />
                                    VULNERABLE ({original} &rarr; {log.amount})
                                </span>
                            )}
                            {mod === 'normal' && log.type === 'damage' && (
                                <span className="text-stone-500">
                                    {original} applied
                                </span>
                            )}

                            {displayRem && (
                                <span className="text-stone-500 ml-auto font-mono">
                                    {log.prevHp} &rarr; {log.newHp}
                                </span>
                            )}
                        </div>
                      )}
                  </div>
              );
          })}
          <div ref={logsEndRef} />
       </div>
    </div>
  );
};

export default CombatLog;
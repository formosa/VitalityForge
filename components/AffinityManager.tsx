
import React, { useState } from 'react';
import { Shield, ShieldOff, Skull, X, Plus, Eye, EyeOff } from 'lucide-react';

interface Props {
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];
  onChange: (type: 'resistances' | 'immunities' | 'vulnerabilities', values: string[]) => void;
  isEditable: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  availableTypes?: string[];
}

const AffinityManager: React.FC<Props> = ({ 
  resistances, immunities, vulnerabilities, 
  onChange, isEditable, isVisible = true, onToggleVisibility,
  availableTypes = []
}) => {
  const [activeTab, setActiveTab] = useState<'resistances' | 'immunities' | 'vulnerabilities'>('resistances');
  const [isAdding, setIsAdding] = useState(false);

  const getAvailableTypes = (currentList: string[]) => {
    // A type can only be in one list at a time to prevent conflicts
    const allUsed = [...resistances, ...immunities, ...vulnerabilities];
    return availableTypes.filter(t => !allUsed.includes(t));
  };

  const handleAdd = (type: string) => {
    let list: string[] = [];
    if (activeTab === 'resistances') list = resistances;
    else if (activeTab === 'immunities') list = immunities;
    else list = vulnerabilities;

    onChange(activeTab, [...list, type]);
    setIsAdding(false);
  };

  const handleRemove = (type: string, category: 'resistances' | 'immunities' | 'vulnerabilities') => {
    let list: string[] = [];
    if (category === 'resistances') list = resistances;
    else if (category === 'immunities') list = immunities;
    else list = vulnerabilities;

    onChange(category, list.filter(t => t !== type));
  };

  const showContent = isVisible || isEditable;

  if (!showContent) return null;

  return (
    <div className="dungeon-panel rounded-xl p-4 border border-stone-800 bg-stone-900/40 animate-fade-in flex flex-col transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em] font-cinzel">Affinity & Weakness</h3>
         {onToggleVisibility && isEditable && (
            <label className="flex items-center gap-1 cursor-pointer group" title="Toggle visibility">
                <input 
                type="checkbox" 
                checked={isVisible}
                onChange={onToggleVisibility}
                className="hidden"
                />
                <div className={`p-1 rounded ${isVisible ? 'text-green-600' : 'text-stone-700 group-hover:text-stone-500'}`}>
                    {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </div>
            </label>
         )}
      </div>

      {showContent && (
        <>
            <div className="flex gap-2 mb-3 border-b border-stone-800/50 pb-2 overflow-x-auto custom-scrollbar">
                <button 
                onClick={() => setActiveTab('immunities')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'immunities' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'text-stone-600 hover:text-stone-400'}`}
                >
                <Shield className="w-3 h-3" /> Immunity ({immunities.length})
                </button>
                <button 
                onClick={() => setActiveTab('resistances')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'resistances' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' : 'text-stone-600 hover:text-stone-400'}`}
                >
                <ShieldOff className="w-3 h-3" /> Resistance ({resistances.length})
                </button>
                <button 
                onClick={() => setActiveTab('vulnerabilities')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'vulnerabilities' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'text-stone-600 hover:text-stone-400'}`}
                >
                <Skull className="w-3 h-3" /> Vulnerability ({vulnerabilities.length})
                </button>
            </div>

            <div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(activeTab === 'resistances' ? resistances : activeTab === 'immunities' ? immunities : vulnerabilities).map(type => (
                        <div 
                            key={type} 
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-cinzel font-bold shadow-sm animate-scale-up ${
                                activeTab === 'immunities' ? 'bg-green-950/40 border-green-900 text-green-300' :
                                activeTab === 'resistances' ? 'bg-blue-950/40 border-blue-900 text-blue-300' :
                                'bg-red-950/40 border-red-900 text-red-300'
                            }`}
                        >
                            <span>{type}</span>
                            {isEditable && (
                                <button 
                                onClick={() => handleRemove(type, activeTab)}
                                className="hover:text-white transition-colors"
                                >
                                <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}

                    {(activeTab === 'resistances' ? resistances : activeTab === 'immunities' ? immunities : vulnerabilities).length === 0 && !isAdding && (
                        <div className="text-stone-700 text-xs italic p-1">None detected.</div>
                    )}
                    
                    {isEditable && !isAdding && (
                        <button 
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-800 border-dashed text-stone-600 hover:text-stone-300 hover:border-stone-600 text-xs font-bold transition-all"
                        >
                        <Plus className="w-3 h-3" /> Add
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div className="animate-fade-in bg-black p-2 rounded border border-stone-800 mt-2">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] uppercase font-bold text-stone-500">Select Type</span>
                            <button onClick={() => setIsAdding(false)} className="text-stone-500 hover:text-stone-300"><X className="w-3 h-3"/></button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                            {getAvailableTypes([...resistances, ...immunities, ...vulnerabilities]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleAdd(t)}
                                    className="px-2 py-1 text-xs text-left hover:bg-stone-800 rounded text-stone-400 hover:text-stone-200 truncate"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default AffinityManager;

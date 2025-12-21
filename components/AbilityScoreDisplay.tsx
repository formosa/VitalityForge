
import React from 'react';
import { CharacterProfile } from '../types';
import { ABILITY_SCORES_DATA } from '../constants';
import SectionHeader from './SectionHeader';

interface Props {
  abilityScores: Record<string, number>;
  isVisible: boolean;
  onToggle: (field: keyof CharacterProfile) => void;
  isDmView: boolean;
}

const AbilityScoreDisplay: React.FC<Props> = ({ abilityScores, isVisible, onToggle, isDmView }) => {
  if (!isDmView && !isVisible) return null;

  return (
    <div className="animate-fade-in">
        <SectionHeader 
            label="Ability Scores" 
            field="isAbilityScoresVisible" 
            isVisible={isVisible} 
            onToggle={onToggle} 
            isDmView={isDmView} 
        />
        
        <div className="grid grid-cols-3 gap-2">
            {ABILITY_SCORES_DATA.abilities.map((ability) => {
                const score = abilityScores[ability.id] || 10;
                const modifier = Math.floor((score - 10) / 2);
                const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                
                return (
                    <div key={ability.id} className="bg-stone-900/40 border border-stone-800 rounded p-2 flex flex-col items-center justify-center group relative cursor-help">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">{ability.abbreviation}</span>
                        <span className="text-xl font-cinzel font-bold text-stone-200 leading-none">{score}</span>
                        <div className="mt-1 text-[10px] font-mono text-stone-400 bg-black/30 px-1.5 rounded border border-stone-800">
                            {modString}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-stone-700 p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <h4 className="font-cinzel font-bold text-red-400 text-xs mb-1">{ability.name}</h4>
                            <p className="text-[10px] text-stone-400 leading-tight mb-2">{ability.description}</p>
                            <div className="text-[9px] text-stone-500 border-t border-stone-800 pt-1">
                                <span className="block font-bold mb-0.5">Impacts:</span>
                                {ability.mechanics_impact.slice(0, 3).map((impact, idx) => (
                                    <div key={idx} className="truncate">• {impact}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default AbilityScoreDisplay;

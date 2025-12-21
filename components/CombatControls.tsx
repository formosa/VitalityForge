import React, { useState } from 'react';
import { Skull, Hammer, Swords, Axe, Beaker, Snowflake, Flame, CloudLightning, Move, FlaskRound, Brain, Sun, Plus, Zap, Heart, Sparkles, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { CharacterProfile, DamageConfig, DamageCategoryConfig } from '../types';

interface Props {
  onDeltaHp: (amount: number, subType?: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  isVisibleManual: boolean;
  onToggle: (field: keyof CharacterProfile) => void;
  isDmView: boolean;
  damageConfig: DamageConfig;
}

// Icon Mapping with fallback capability
const ICON_MAP: Record<string, React.ReactNode> = {
  'Bludgeoning': <Hammer className="w-6 h-6" />,
  'Piercing': <Swords className="w-6 h-6" />,
  'Slashing': <Axe className="w-6 h-6" />,
  'Cold': <Snowflake className="w-5 h-5" />,
  'Fire': <Flame className="w-5 h-5" />,
  'Lightning': <Zap className="w-5 h-5" />,
  'Thunder': <CloudLightning className="w-5 h-5" />,
  'Force': <Move className="w-5 h-5" />,
  'Radiant': <Sun className="w-5 h-5" />,
  'Necrotic': <Skull className="w-5 h-5" />,
  'Psychic': <Brain className="w-5 h-5" />,
  'Acid': <Beaker className="w-5 h-5" />,
  'Poison': <FlaskRound className="w-5 h-5" />,
};

const getIconForType = (typeId: string): React.ReactNode => {
  return ICON_MAP[typeId] || <Sparkles className="w-5 h-5" />;
};

interface CombatButtonProps {
    onClick: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    icon: React.ReactNode;
    className?: string;
    borderColor: string;
    accentColor: string;
    useColoredIcon: boolean;
}

const CombatButton: React.FC<CombatButtonProps> = ({ 
  onClick, 
  onMouseEnter,
  onMouseLeave,
  icon, 
  className = '',
  borderColor,
  accentColor,
  useColoredIcon
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseOut = () => {
      setIsPressed(false);
      if (onMouseLeave) onMouseLeave();
  };

  // Dynamic Styles for Pressed/Normal states
  const btnStyle: React.CSSProperties = {
      borderColor: isPressed ? accentColor : borderColor,
      backgroundColor: isPressed ? accentColor : undefined,
      boxShadow: isPressed ? `0 0 15px ${accentColor}` : undefined, // Glow effect on press
      transform: isPressed ? 'translateY(1px)' : 'none',
  };

  const iconStyle: React.CSSProperties = {};
  if (isPressed) {
      // Dark Grey (stone-950) for contrast against active color when pressed
      iconStyle.color = '#0c0a09'; 
  } else if (useColoredIcon) {
      // Use the specific type color for the label icon if requested
      iconStyle.color = accentColor;
  }

  return (
    <button 
        onClick={onClick} 
        onMouseEnter={onMouseEnter}
        onMouseLeave={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={btnStyle}
        className={`dungeon-button relative group ${className} 
            hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] 
            transition-all duration-100 
            flex items-center justify-center border`}
    >
        <div 
            className={`transition-colors duration-100 flex items-center justify-center
                ${(!isPressed && !useColoredIcon) ? 'text-stone-400 group-hover:text-stone-200' : ''}`}
            style={iconStyle}
        >
            {icon || <Heart className="w-5 h-5"/>}
        </div>
    </button>
  );
};

const CombatControls: React.FC<Props> = ({ onDeltaHp, onUndo, canUndo, isVisibleManual, onToggle, isDmView, damageConfig }) => {
  const [damageInput, setDamageInput] = useState<string>('');
  const [hoverState, setHoverState] = useState<{ categoryId: string; typeId: string; typeName: string; typeColor: string } | null>(null);

  const handleAction = (subType: string, isHeal: boolean = false) => {
    const inputVal = parseInt(damageInput);
    if (isNaN(inputVal) || inputVal <= 0) return;
    
    const delta = isHeal ? inputVal : -inputVal;
    onDeltaHp(delta, subType);
    setDamageInput('');
  };

  const handleMouseEnter = (categoryId: string, typeId: string, typeName: string, typeColor: string) => {
    setHoverState({ categoryId, typeId, typeName, typeColor });
  };

  const handleMouseLeave = () => {
    setHoverState(null);
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-outer-spin-button,
        .no-scrollbar::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          -moz-appearance: textfield; /* Firefox number input */
        }
        
        @keyframes icon-pulse-grow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px currentColor); }
          50% { transform: scale(1.2); filter: drop-shadow(0 0 15px currentColor); }
        }
      `}</style>
      
      {/* Manual Action */}
      <div className="animate-fade-in space-y-3">
          <div className="flex items-center justify-between mb-3">
             <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest font-cinzel">
               Grimoire (Manual)
             </label>
             <div className="flex items-center gap-2">
                 {/* Undo Button */}
                 <button 
                     onClick={onUndo}
                     disabled={!canUndo}
                     className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-cinzel px-2 py-0.5 rounded border transition-all
                         ${canUndo 
                             ? 'border-stone-800 bg-stone-900/50 text-stone-400 hover:text-red-300 hover:border-red-900 hover:bg-red-950/20' 
                             : 'border-transparent bg-transparent text-stone-800 cursor-not-allowed'
                         }`}
                     title="Revert last action"
                 >
                     <RotateCcw className="w-3 h-3" />
                     <span>Revert</span>
                 </button>

                 {/* Visibility Toggle (DM Only) */}
                 {isDmView && (
                    <label className="flex items-center gap-1 cursor-pointer group ml-1" title="Toggle visibility">
                      <input 
                        type="checkbox" 
                        checked={isVisibleManual}
                        onChange={() => onToggle('isManualInputVisible')}
                        className="hidden"
                      />
                      <div className={`p-1 rounded ${isVisibleManual ? 'text-green-600' : 'text-stone-700 group-hover:text-stone-500'}`}>
                         {isVisibleManual ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </div>
                    </label>
                 )}
             </div>
          </div>
          
          <div className="flex items-center justify-between mb-4 gap-2 min-h-[4.5rem]">
             {/* Dynamic Labels Container (Left) */}
             <div className="flex flex-col justify-center items-start flex-1 min-w-0 pr-2">
                 {hoverState && damageConfig[hoverState.categoryId] ? (
                   <div className="flex flex-col items-start w-full animate-fade-in">
                     <span 
                       className="font-bold uppercase font-cinzel text-[10px] tracking-[0.2em] leading-tight mb-1.5"
                       style={{ color: damageConfig[hoverState.categoryId].primary_color.hex }}
                     >
                       {damageConfig[hoverState.categoryId].category_name}
                     </span>
                     
                     <div className="h-px w-full max-w-[120px] bg-gradient-to-r from-stone-700 to-transparent mb-1.5 opacity-50"></div>
                     
                     <span 
                       className="font-bold uppercase font-cinzel text-lg tracking-widest leading-none truncate w-full"
                       style={{ color: hoverState.typeColor }} 
                     >
                       {hoverState.typeName}
                     </span>
                   </div>
                 ) : (
                   <div className="flex flex-col items-start gap-1.5 opacity-20 select-none w-full">
                     <span className="font-bold uppercase font-cinzel text-[10px] tracking-[0.2em] text-stone-500">Classification</span>
                     <div className="h-px w-12 bg-stone-800"></div>
                     <span className="font-bold uppercase font-cinzel text-lg tracking-widest text-stone-500">Damage Type</span>
                   </div>
                 )}
             </div>

             {/* Animated Icon (Center/Right) */}
             <div className="flex items-center justify-center w-12 h-12 flex-shrink-0 mr-1">
               {hoverState && (
                 <div 
                   className="w-10 h-10 transition-all duration-300 ease-out"
                   style={{ 
                     color: hoverState.typeColor,
                     animation: 'icon-pulse-grow 2s infinite ease-in-out'
                   }}
                 >
                   {React.cloneElement(getIconForType(hoverState.typeId) as React.ReactElement<{ className?: string }>, { className: "w-full h-full" })}
                 </div>
               )}
             </div>

             {/* Input Field (Right, ~33% width) */}
             <input 
                  type="number" 
                  value={damageInput}
                  onChange={(e) => setDamageInput(e.target.value)}
                  placeholder="Magnitude"
                  style={{
                    borderColor: hoverState?.typeColor || undefined,
                    boxShadow: hoverState ? `0 0 10px ${hoverState.typeColor}20` : undefined, // Transparent glow based on type color
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  className="dungeon-input w-[32.5%] rounded p-3 text-white text-2xl font-bold text-center focus:ring-0 overflow-hidden no-scrollbar"
              />
          </div>

          {/* Dynamic Categories */}
          {Object.entries(damageConfig).map(([catId, category]: [string, DamageCategoryConfig]) => {
             // Only color the icons for specific categories (Elemental, Energy, Chemical) as requested
             const shouldColorIcon = ['elemental', 'energy', 'chemical'].includes(catId);
             
             return (
                <div key={catId} className="mb-2">
                   <div className={`grid grid-cols-${category.damage_types.length > 3 ? 4 : category.damage_types.length > 2 ? 3 : 2} gap-1.5`}>
                      {category.damage_types.map(type => (
                         <CombatButton 
                            key={type.id}
                            onClick={() => handleAction(type.id)}
                            onMouseEnter={() => handleMouseEnter(catId, type.id, type.name, type.color || category.accent_colors[0].hex)}
                            onMouseLeave={handleMouseLeave}
                            icon={getIconForType(type.id)}
                            borderColor={category.primary_color.hex}
                            accentColor={type.color || category.accent_colors[0].hex}
                            useColoredIcon={shouldColorIcon}
                            className="h-12 rounded"
                         />
                      ))}
                   </div>
                </div>
             );
          })}

          {/* Generic Healing */}
          <div className="mt-4">
            <CombatButton 
              onClick={() => handleAction('Healing', true)} 
              icon={<div className="flex items-center gap-2"><Plus className="w-5 h-5" /><span className="font-bold">HEAL</span></div>}
              borderColor="#16a34a"
              accentColor="#22c55e"
              useColoredIcon={true}
              className="w-full h-14 rounded border-green-900/50 hover:border-green-500"
            />
          </div>
      </div>
    </>
  );
};

export default CombatControls;
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CharacterProfile } from '../types';

interface Props {
  label: string;
  field: keyof CharacterProfile;
  isVisible: boolean;
  onToggle: (field: keyof CharacterProfile) => void;
  isDmView: boolean;
}

const SectionHeader: React.FC<Props> = ({ label, field, isVisible, onToggle, isDmView }) => {
  if (!isDmView) {
    return (
      <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-3 font-cinzel">
        {label}
      </label>
    );
  }

  return (
    <div className="flex items-center justify-between mb-3">
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest font-cinzel">
        {label}
      </label>
      <label className="flex items-center gap-1 cursor-pointer group" title="Toggle visibility">
        <input 
          type="checkbox" 
          checked={isVisible}
          onChange={() => onToggle(field)}
          className="hidden"
        />
        <div className={`p-1 rounded ${isVisible ? 'text-green-600' : 'text-stone-700 group-hover:text-stone-500'}`}>
           {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </div>
      </label>
    </div>
  );
};

export default SectionHeader;

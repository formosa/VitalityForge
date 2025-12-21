import React from 'react';
import { Skull, ShieldAlert } from 'lucide-react';
import { CharacterProfile } from '../types';
import SectionHeader from './SectionHeader';

interface Props {
  currentHp: number;
  totalHp: number;
  isDead: boolean;
  isVisibleHp: boolean;
  isVisibleBar: boolean;
  isVisibleStatus: boolean;
  onToggle: (field: keyof CharacterProfile) => void;
  isDmView: boolean;
}

const VitalityStatus: React.FC<Props> = ({ 
  currentHp, totalHp, isDead, 
  isVisibleStatus,
  onToggle, isDmView 
}) => {
  const hpPercentage = (currentHp / totalHp) * 100;

  return (
    <>
      {/* Status Card */}
      {(isDmView || isVisibleStatus) && (
          <div className="animate-fade-in">
              <SectionHeader 
                label="Condition" 
                field="isStatusVisible" 
                isVisible={isVisibleStatus} 
                onToggle={onToggle} 
                isDmView={isDmView} 
              />
              <div className={`p-4 rounded border flex items-center gap-4 transition-colors ${
              isDead ? 'bg-stone-900 border-stone-800' :
              hpPercentage < 25 ? 'bg-red-950/20 border-red-900/40' : 
              'bg-stone-900/30 border-stone-800'
              }`}>
              <div className={`p-3 rounded-full border ${isDead ? 'bg-stone-950 border-stone-800 text-stone-700' : hpPercentage < 25 ? 'bg-red-950 border-red-900 text-red-600' : 'bg-stone-950 border-green-900/30 text-green-700'}`}>
                  {isDead ? <Skull className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div>
                  <h4 className="text-sm font-bold text-stone-300 uppercase tracking-wide font-cinzel">Physiology</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-tight font-serif italic">
                  {isDead ? 'Life force extinguished.' : 
                  hpPercentage < 25 ? 'Critically wounded. Mortal peril.' :
                  hpPercentage < 50 ? 'Significantly damaged.' :
                  'Peak combat efficiency.'}
                  </p>
              </div>
              </div>
          </div>
      )}
    </>
  );
};

export default VitalityStatus;
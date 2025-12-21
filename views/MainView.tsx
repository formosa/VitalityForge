import React, { useState, useMemo } from 'react';
import { CharacterProfile } from '../types';
import { Settings, Plus, Search, Trash2, Users, Ghost, Pencil } from 'lucide-react';
import { RACE_DATA } from '../data/races';

interface Props {
  profiles: CharacterProfile[];
  onNavigateSettings: () => void;
  onNavigateNew: () => void;
  onSelectProfile: (p: CharacterProfile) => void;
  onDeleteProfile: (id: string) => void;
  onEditProfile: (p: CharacterProfile) => void;
}

const MainView: React.FC<Props> = ({ profiles, onNavigateSettings, onNavigateNew, onSelectProfile, onDeleteProfile, onEditProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRace, setFilterRace] = useState('');

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRace = filterRace ? p.race === filterRace : true;
      return matchesSearch && matchesRace;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [profiles, searchTerm, filterRace]);

  const uniqueRaces = useMemo(() => {
    // Use the comprehensive race list from constants or just used races? 
    // Using predefined list makes it cleaner if profiles have valid data.
    return RACE_DATA.map(r => r.race).sort();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Command Deck (Unified Header) */}
      <div className="sticky top-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="dungeon-panel rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-red-950/40 p-2.5 rounded-lg border border-red-900/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
               <Users className="w-6 h-6 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-cinzel font-black tracking-widest text-stone-200 uppercase leading-none drop-shadow-md">Vitality Forge</h1>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.3em] pl-0.5">Entity Archives</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search archives..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dungeon-input w-full rounded-lg py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
            
            <select 
              value={filterRace} 
              onChange={(e) => setFilterRace(e.target.value)}
              className="dungeon-input rounded-lg py-2.5 px-3 text-sm"
            >
              <option value="">All Races</option>
              {uniqueRaces.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <button 
              onClick={onNavigateSettings} 
              className="dungeon-button p-2.5 rounded-lg"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
          
          {/* New Character Card */}
          <button 
            onClick={onNavigateNew}
            className="group relative h-full min-h-[300px] rounded-xl border-2 border-dashed border-stone-800 hover:border-red-900 hover:bg-red-950/5 transition-all flex flex-col items-center justify-center gap-4 overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-stone-900 group-hover:bg-red-900/50 group-hover:scale-110 transition-all flex items-center justify-center shadow-lg border border-stone-800 group-hover:border-red-700">
              <Plus className="w-8 h-8 text-stone-600 group-hover:text-red-200" />
            </div>
            <span className="font-cinzel font-bold text-stone-500 group-hover:text-red-400 tracking-wider uppercase text-sm">New Entity</span>
          </button>

          {filteredProfiles.map(profile => (
            <div 
              key={profile.id} 
              onClick={() => onSelectProfile(profile)}
              className="group relative bg-stone-900 rounded-xl overflow-hidden border border-stone-800 cursor-pointer hover:border-red-900 transition-all hover:shadow-[0_0_20px_rgba(127,29,29,0.2)] transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="aspect-square w-full overflow-hidden bg-black relative">
                {profile.referenceImageBase64 ? (
                  <img 
                    src={profile.referenceImageBase64} 
                    alt={profile.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-800 bg-black">
                     <span className="text-4xl opacity-20 font-cinzel">?</span>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90"></div>
                
                {/* Actions (Visible on Hover) */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                    onClick={(e) => { e.stopPropagation(); onEditProfile(profile); }}
                    className="p-2 bg-black/60 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white backdrop-blur-sm border border-transparent hover:border-stone-600 transition-all"
                    title="Edit Entity"
                    >
                    <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProfile(profile.id); }}
                    className="p-2 bg-black/60 hover:bg-red-900 rounded-full text-stone-400 hover:text-white backdrop-blur-sm border border-transparent hover:border-red-700 transition-all"
                    title="Delete Character"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
              
              {/* Info Card */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent">
                <h3 className="text-lg font-cinzel font-bold text-stone-300 group-hover:text-red-100 leading-tight truncate drop-shadow-sm">{profile.name}</h3>
                <div className="flex flex-col mt-2 gap-0.5">
                   <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold border border-stone-800 px-2 py-0.5 rounded-sm bg-black/30">
                          {profile.race}
                      </span>
                      {profile.subrace && (
                          <span className="text-[10px] text-stone-600 uppercase tracking-widest font-bold px-1">
                             {profile.subrace}
                          </span>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProfiles.length === 0 && profiles.length > 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-12 text-stone-700 opacity-60">
                <Ghost className="w-12 h-12 mb-4" />
                <p className="font-cinzel text-lg">No entities found in the archives.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainView;
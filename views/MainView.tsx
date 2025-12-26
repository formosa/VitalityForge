
import React, { useState, useMemo } from 'react';
import { CharacterProfile } from '../types';
import { Settings, Plus, Search, Trash2, Users, Ghost, Pencil, Menu, X } from 'lucide-react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRace = filterRace ? p.race === filterRace : true;
      return matchesSearch && matchesRace;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [profiles, searchTerm, filterRace]);

  const uniqueRaces = useMemo(() => {
    return RACE_DATA.map(r => r.race).sort();
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      {/* --- DESKTOP COMMAND DECK (Hidden on Mobile) --- */}
      <div className="hidden md:block sticky top-0 z-20 p-4 bg-gradient-to-b from-black/90 to-transparent">
        <div className="dungeon-panel rounded-xl p-4 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-red-950/40 p-2.5 rounded-lg border border-red-900/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
               <Users className="w-6 h-6 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-cinzel font-black tracking-widest text-stone-200 uppercase leading-none drop-shadow-md">Vitality Forge</h1>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.3em] pl-0.5">Entity Archives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
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
              className="dungeon-button p-2.5 rounded-lg hover:text-amber-500 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onNavigateNew}
              className="dungeon-button-primary px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>New Entity</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER (Hidden on Desktop) --- */}
      <div className="md:hidden sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
        <div className="px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-900 to-stone-900 flex items-center justify-center border border-stone-700">
                <Users className="w-4 h-4 text-red-400" />
              </div>
              <h1 className="font-cinzel font-bold text-stone-200 tracking-wider">Vitality Forge</h1>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 rounded-full transition-colors ${isMobileSearchOpen ? 'bg-stone-800 text-stone-200' : 'text-stone-400'}`}
              >
                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <button onClick={onNavigateSettings} className="p-2 text-stone-400">
                <Settings className="w-5 h-5" />
              </button>
           </div>
        </div>
        
        {/* Mobile Search & Filter Drawer */}
        {isMobileSearchOpen && (
          <div className="px-4 pb-4 animate-fade-in space-y-3 border-b border-stone-800/50 bg-stone-900/50">
            <input 
              type="text" 
              placeholder="Search entities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dungeon-input w-full rounded-lg py-3 px-4 text-sm"
              autoFocus
            />
            <select 
              value={filterRace} 
              onChange={(e) => setFilterRace(e.target.value)}
              className="dungeon-input w-full rounded-lg py-3 px-4 text-sm"
            >
              <option value="">All Races</option>
              {uniqueRaces.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20 md:pb-12">
          
          {filteredProfiles.map(profile => (
            <div 
              key={profile.id} 
              onClick={() => onSelectProfile(profile)}
              className="group relative bg-stone-900 rounded-xl overflow-hidden border border-stone-800 cursor-pointer active:scale-95 md:hover:border-red-900 md:hover:-translate-y-1 transition-all shadow-lg"
            >
              {/* Image Container */}
              <div className="aspect-square w-full overflow-hidden bg-black relative">
                {profile.referenceImageBase64 ? (
                  <img 
                    src={profile.referenceImageBase64} 
                    alt={profile.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110 opacity-80 md:group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-800 bg-black">
                     <span className="text-4xl opacity-20 font-cinzel">?</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90"></div>
                
                {/* Desktop Hover Actions */}
                <div className="hidden md:flex absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                    onClick={(e) => { e.stopPropagation(); onEditProfile(profile); }}
                    className="p-2 bg-black/60 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white backdrop-blur-sm transition-all"
                    >
                    <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProfile(profile.id); }}
                    className="p-2 bg-black/60 hover:bg-red-900 rounded-full text-stone-400 hover:text-white backdrop-blur-sm transition-all"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Tap Actions (Always visible edit icon) */}
                 <button 
                  onClick={(e) => { e.stopPropagation(); onEditProfile(profile); }}
                  className="md:hidden absolute top-2 right-2 p-2 bg-black/40 rounded-full text-stone-300 backdrop-blur-sm"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              
              {/* Info Card */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent">
                <div className="flex justify-between items-end">
                   <div className="min-w-0">
                      <h3 className="text-lg font-cinzel font-bold text-stone-200 leading-tight truncate drop-shadow-sm">{profile.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold border border-stone-800 px-2 py-0.5 rounded-sm bg-black/30">
                              {profile.race}
                          </span>
                      </div>
                   </div>
                   {/* Mobile Delete */}
                   <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteProfile(profile.id); }}
                      className="md:hidden text-stone-600 active:text-red-500 p-2"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProfiles.length === 0 && profiles.length > 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-12 text-stone-700 opacity-60">
                <Ghost className="w-12 h-12 mb-4" />
                <p className="font-cinzel text-lg">No entities found.</p>
             </div>
          )}

          {/* Empty State / Prompt */}
          {profiles.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center h-64 text-stone-600">
               <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mb-4 border border-stone-800">
                  <Plus className="w-8 h-8" />
               </div>
               <p className="font-cinzel text-lg font-bold text-stone-500">The Archives are Empty</p>
               <p className="text-sm text-stone-700 mt-2">Forge your first entity to begin.</p>
             </div>
          )}
        </div>
      </div>

      {/* --- MOBILE FLOATING ACTION BUTTON (FAB) --- */}
      <button 
        onClick={onNavigateNew}
        className="md:hidden absolute bottom-6 right-6 w-14 h-14 bg-red-800 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center text-white z-50 active:scale-95 transition-transform border border-red-600"
        title="Create New Entity"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default MainView;

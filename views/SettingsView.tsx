import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, RotateCcw, Film, ChevronDown, ChevronUp, Zap, Sparkles, Save, Palette, BookOpen } from 'lucide-react';
import * as storage from '../services/storageService';
import { CharacterProperty, PromptSettings, DamageConfig, DamageCategoryConfig } from '../types';
import { DEFAULT_PRE_PROMPT, DEFAULT_SPRITES_PROMPT, DEFAULT_VIDEO_PROMPT, STYLE_PRESETS, DEFAULT_DAMAGE_CONFIG } from '../constants';

interface Props {
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ onBack }) => {
  const [properties, setProperties] = useState<CharacterProperty[]>([]);
  const [prompts, setPrompts] = useState<PromptSettings>(storage.getSettings());
  const [newPropName, setNewPropName] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeStyleTab, setActiveStyleTab] = useState<string>('realistic');

  useEffect(() => {
    setProperties(storage.getProperties());
    setPrompts(storage.getSettings());
  }, []);

  const handleSaveProperties = (updated: CharacterProperty[]) => {
    setProperties(updated);
    storage.saveProperties(updated);
  };

  const handleAddProperty = () => {
    if (!newPropName.trim()) return;
    const newProp: CharacterProperty = {
      id: crypto.randomUUID(),
      name: newPropName,
      isActive: true,
      isSystem: false
    };
    handleSaveProperties([...properties, newProp]);
    setNewPropName('');
  };

  const handleDeleteProperty = (id: string) => {
    handleSaveProperties(properties.filter(p => p.id !== id));
  };

  const handleToggleActive = (id: string) => {
    handleSaveProperties(properties.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleSavePrompts = () => {
    storage.saveSettings(prompts);
    onBack();
  };

  const handleRestoreDefaults = () => {
    if (!window.confirm("Restore all settings, prompts, and damage rules to default?")) return;

    const defaultStyles: Record<string, string> = {};
    STYLE_PRESETS.forEach(s => defaultStyles[s.id] = s.prompt);

    const defaults: PromptSettings = {
      prePrompt: DEFAULT_PRE_PROMPT,
      spritesPrompt: DEFAULT_SPRITES_PROMPT,
      videoPrompt: DEFAULT_VIDEO_PROMPT,
      isVeoEnabled: false,
      imageModel: 'gemini-2.5-flash-image',
      artStyleId: 'realistic',
      stylePrompts: defaultStyles,
      damageConfig: DEFAULT_DAMAGE_CONFIG,
      defaultApplyRaceModifiers: true
    };
    setPrompts(defaults);
    storage.saveSettings(defaults);
  };
  
  const handleVeoToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    const updatedPrompts = { ...prompts, isVeoEnabled: isEnabled };
    setPrompts(updatedPrompts);
    storage.saveSettings(updatedPrompts);
  };

  const handleRaceModToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    const updatedPrompts = { ...prompts, defaultApplyRaceModifiers: isEnabled };
    setPrompts(updatedPrompts);
    storage.saveSettings(updatedPrompts);
  };

  const handleImageModelChange = (model: string) => {
    const updatedPrompts = { ...prompts, imageModel: model };
    setPrompts(updatedPrompts);
    storage.saveSettings(updatedPrompts);
  };

  const handleArtStyleChange = (styleId: string) => {
    const updatedPrompts = { ...prompts, artStyleId: styleId };
    setPrompts(updatedPrompts);
    storage.saveSettings(updatedPrompts);
  };

  // Damage Config Handlers
  const handleCategoryChange = (catId: string, field: 'category_name' | 'primary_color', value: any) => {
      const newConfig = { ...prompts.damageConfig };
      if (field === 'primary_color') {
          newConfig[catId] = {
              ...newConfig[catId],
              primary_color: { ...newConfig[catId].primary_color, hex: value }
          };
      } else {
          newConfig[catId] = {
              ...newConfig[catId],
              category_name: value
          };
      }
      setPrompts({ ...prompts, damageConfig: newConfig });
  };

  const handleTypeChange = (catId: string, typeId: string, field: 'name' | 'color', value: string) => {
      const newConfig = { ...prompts.damageConfig };
      const typeIndex = newConfig[catId].damage_types.findIndex(t => t.id === typeId);
      if (typeIndex >= 0) {
          const updatedTypes = [...newConfig[catId].damage_types];
          updatedTypes[typeIndex] = { ...updatedTypes[typeIndex], [field]: value };
          newConfig[catId] = {
              ...newConfig[catId],
              damage_types: updatedTypes
          };
          setPrompts({ ...prompts, damageConfig: newConfig });
      }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="mr-6 flex items-center text-stone-500 hover:text-red-400 transition group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel font-bold text-sm uppercase tracking-widest">Return</span>
        </button>
        <div className="h-6 w-px bg-stone-800 mr-6"></div>
        <h1 className="text-xl font-cinzel font-bold text-stone-200 tracking-wide">System Arcana</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-8 custom-scrollbar">
        
        {/* Properties Section */}
        <section className="dungeon-panel rounded-xl p-6">
          <h2 className="text-lg font-cinzel font-bold text-red-500 mb-6 border-b border-stone-800 pb-2">Entity Properties</h2>
          
          <div className="flex items-center gap-2 mb-6">
            <input 
              type="text" 
              value={newPropName}
              onChange={(e) => setNewPropName(e.target.value)}
              placeholder="Add new property (e.g. Mana, Stamina)"
              className="dungeon-input flex-1 rounded-lg p-3 text-sm"
            />
            <button onClick={handleAddProperty} className="dungeon-button px-4 rounded-lg text-green-600 hover:text-green-500 border-green-900/30">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {properties.map(prop => (
              <div key={prop.id} className="flex items-center justify-between bg-stone-900/50 border border-stone-800/50 p-3 rounded-lg">
                <span className={`font-medium text-sm font-cinzel ${!prop.isActive ? 'text-stone-600 line-through' : 'text-stone-300'}`}>
                  {prop.name} {prop.isSystem && <span className="text-[10px] text-red-500 ml-2 uppercase tracking-wide border border-red-900/50 px-1 rounded">System</span>}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleToggleActive(prop.id)} className="text-stone-500 hover:text-stone-300 p-2 hover:bg-stone-800 rounded transition">
                    {prop.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  {!prop.isSystem && (
                    <button onClick={() => handleDeleteProperty(prop.id)} className="text-red-900 hover:text-red-600 p-2 hover:bg-red-950/30 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creation Rules */}
        <section className="dungeon-panel rounded-xl p-6">
           <h2 className="text-lg font-cinzel font-bold text-red-500 mb-6 border-b border-stone-800 pb-2">Creation Rules</h2>
           <div className="space-y-4">
              <div className="flex items-start bg-stone-900/30 p-4 rounded-lg border border-stone-800">
                  <BookOpen className="w-6 h-6 mr-4 text-stone-500 flex-shrink-0" />
                  <div className="flex-1">
                      <h3 className="font-bold text-stone-200 text-sm font-cinzel">Racial Ability Modifiers</h3>
                      <p className="text-xs text-stone-500 mt-1">Automatically apply race and subrace attribute bonuses during character creation.</p>
                      <div className="mt-4 pt-4 border-t border-stone-800/50">
                          <label className="flex items-center cursor-pointer group">
                              <input 
                                  type="checkbox"
                                  checked={prompts.defaultApplyRaceModifiers}
                                  onChange={handleRaceModToggle}
                                  className="h-4 w-4 text-red-700 bg-stone-900 border-stone-700 rounded focus:ring-red-900 cursor-pointer"
                              />
                              <span className="ml-3 text-sm font-medium text-stone-400 group-hover:text-stone-200 transition">Enable by Default</span>
                          </label>
                      </div>
                  </div>
              </div>
           </div>
        </section>

        {/* Combat Mechanics Section */}
        <section className="dungeon-panel rounded-xl p-6">
             <h2 className="text-lg font-cinzel font-bold text-red-500 mb-6 border-b border-stone-800 pb-2">Combat Mechanics</h2>
             <div className="space-y-4">
                 {Object.entries(prompts.damageConfig).map(([catId, category]: [string, DamageCategoryConfig]) => (
                     <div key={catId} className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
                         <button 
                            onClick={() => toggleSection(catId)}
                            className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"
                            style={{ borderLeft: `4px solid ${category.primary_color.hex}` }}
                         >
                            <span className="text-sm font-bold text-stone-300 font-cinzel uppercase tracking-wide">{category.category_name}</span>
                            {openSection === catId ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
                         </button>
                         {openSection === catId && (
                             <div className="p-4 bg-black/20 space-y-4 animate-fade-in">
                                 {/* Category Edit */}
                                 <div className="flex gap-4 items-end mb-4 pb-4 border-b border-stone-800/50">
                                     <div className="flex-1">
                                         <label className="text-[10px] uppercase text-stone-500 font-bold mb-1 block">Category Name</label>
                                         <input 
                                            type="text" 
                                            value={category.category_name}
                                            onChange={(e) => handleCategoryChange(catId, 'category_name', e.target.value)}
                                            className="dungeon-input w-full p-2 rounded text-sm"
                                         />
                                     </div>
                                     <div>
                                         <label className="text-[10px] uppercase text-stone-500 font-bold mb-1 block">Primary Color</label>
                                         <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded border border-stone-700">
                                            <input 
                                                type="color" 
                                                value={category.primary_color.hex}
                                                onChange={(e) => handleCategoryChange(catId, 'primary_color', e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                                            />
                                            <span className="text-xs font-mono text-stone-400">{category.primary_color.hex}</span>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Types Edit */}
                                 <div>
                                     <label className="text-[10px] uppercase text-stone-500 font-bold mb-2 block">Damage Types</label>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                         {category.damage_types.map(type => (
                                             <div key={type.id} className="flex items-center gap-3 bg-stone-900/50 p-2 rounded border border-stone-800/50">
                                                 <input 
                                                    type="color" 
                                                    value={type.color}
                                                    onChange={(e) => handleTypeChange(catId, type.id, 'color', e.target.value)}
                                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0 flex-shrink-0"
                                                 />
                                                 <input 
                                                    type="text"
                                                    value={type.name}
                                                    onChange={(e) => handleTypeChange(catId, type.id, 'name', e.target.value)}
                                                    className="dungeon-input w-full p-1 text-sm bg-transparent border-transparent focus:border-stone-700"
                                                 />
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         )}
                     </div>
                 ))}
             </div>
        </section>

        {/* Model Info */}
        <section className="dungeon-panel rounded-xl p-6">
          <h2 className="text-lg font-cinzel font-bold text-red-500 mb-6 border-b border-stone-800 pb-2">Generative Rituals</h2>
          
          <div className="space-y-6">
            
            {/* Image Model Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Synthesis Model</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleImageModelChange('gemini-2.5-flash-image')}
                  className={`relative p-4 rounded-xl border flex items-start gap-4 text-left transition-all ${
                    prompts.imageModel === 'gemini-2.5-flash-image' 
                      ? 'bg-blue-950/20 border-blue-800 ring-1 ring-blue-500/20' 
                      : 'bg-stone-900/30 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${prompts.imageModel === 'gemini-2.5-flash-image' ? 'bg-blue-900 text-blue-200' : 'bg-stone-800 text-stone-600'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm font-cinzel ${prompts.imageModel === 'gemini-2.5-flash-image' ? 'text-blue-200' : 'text-stone-400'}`}>Gemini 2.5 Flash</h3>
                    <p className="text-xs text-stone-500 mt-1">High-speed evocation. Best for rapid visualization.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleImageModelChange('gemini-3-pro-image-preview')}
                  className={`relative p-4 rounded-xl border flex items-start gap-4 text-left transition-all ${
                    prompts.imageModel === 'gemini-3-pro-image-preview' 
                      ? 'bg-purple-950/20 border-purple-800 ring-1 ring-purple-500/20' 
                      : 'bg-stone-900/30 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${prompts.imageModel === 'gemini-3-pro-image-preview' ? 'bg-purple-900 text-purple-200' : 'bg-stone-800 text-stone-600'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm font-cinzel ${prompts.imageModel === 'gemini-3-pro-image-preview' ? 'text-purple-200' : 'text-stone-400'}`}>Gemini 3 Pro</h3>
                    <p className="text-xs text-stone-500 mt-1">Advanced conjuration. <span className="text-yellow-600 font-bold">Requires Tribute</span>.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Art Style Selection */}
            <div>
               <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Artistic Direction (Style)</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {STYLE_PRESETS.map(style => (
                   <button
                     key={style.id}
                     onClick={() => handleArtStyleChange(style.id)}
                     className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                       prompts.artStyleId === style.id
                       ? 'bg-red-950/30 border-red-800 ring-1 ring-red-500/20'
                       : 'bg-stone-900/30 border-stone-800 hover:border-stone-600'
                     }`}
                   >
                     <div className={`p-1.5 rounded-full ${prompts.artStyleId === style.id ? 'bg-red-900 text-red-200' : 'bg-stone-800 text-stone-500'}`}>
                       <Palette className="w-4 h-4" />
                     </div>
                     <div>
                       <div className={`font-bold text-xs font-cinzel ${prompts.artStyleId === style.id ? 'text-red-200' : 'text-stone-400'}`}>{style.label}</div>
                       <div className="text-[10px] text-stone-600 leading-tight mt-0.5">{style.description}</div>
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            {/* Video Model Toggle */}
            <div className="flex items-start bg-amber-950/10 p-4 rounded-lg border border-amber-900/30">
              <Film className="w-6 h-6 mr-4 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-100 text-sm font-cinzel">Google Veo 3.1</h3>
                <p className="text-xs text-amber-700 mt-1">Premium animation ritual. Requires billing-enabled project.</p>
                <div className="mt-4 pt-4 border-t border-amber-900/20">
                    <label className="flex items-center cursor-pointer group">
                        <input 
                            type="checkbox"
                            checked={prompts.isVeoEnabled}
                            onChange={handleVeoToggle}
                            className="h-4 w-4 text-red-700 bg-stone-900 border-stone-700 rounded focus:ring-red-900 cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-stone-400 group-hover:text-stone-200 transition">Enable Animation</span>
                    </label>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Prompts Accordion */}
        <section className="dungeon-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-2">
            <h2 className="text-lg font-cinzel font-bold text-red-500">Ancient Texts (Prompts)</h2>
            <button onClick={handleRestoreDefaults} className="flex items-center text-xs text-amber-600 hover:text-amber-400 transition">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset to Lore
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Character Prompt */}
            <div className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
              <button 
                onClick={() => toggleSection('character')}
                className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"
              >
                <span className="text-sm font-bold text-stone-400 font-cinzel">Identity Generation</span>
                {openSection === 'character' ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
              </button>
              {openSection === 'character' && (
                <div className="p-4">
                   <textarea 
                    value={prompts.prePrompt}
                    onChange={(e) => setPrompts({...prompts, prePrompt: e.target.value})}
                    className="dungeon-input w-full h-48 rounded p-3 text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Sprites Prompt */}
            <div className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
              <button 
                onClick={() => toggleSection('sprites')}
                className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"
              >
                <span className="text-sm font-bold text-stone-400 font-cinzel">Sprite Sheet Instructions</span>
                {openSection === 'sprites' ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
              </button>
              {openSection === 'sprites' && (
                <div className="p-4">
                   <textarea 
                    value={prompts.spritesPrompt}
                    onChange={(e) => setPrompts({...prompts, spritesPrompt: e.target.value})}
                    className="dungeon-input w-full h-48 rounded p-3 text-xs font-mono"
                  />
                </div>
              )}
            </div>
            
            {/* Style Descriptors */}
            <div className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
              <button 
                onClick={() => toggleSection('styles')}
                className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"
              >
                <span className="text-sm font-bold text-stone-400 font-cinzel">Style Descriptors</span>
                {openSection === 'styles' ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
              </button>
              {openSection === 'styles' && (
                <div className="p-4">
                  {/* Tabs for styles */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                    {STYLE_PRESETS.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setActiveStyleTab(style.id)}
                        className={`px-3 py-1.5 rounded text-xs font-bold font-cinzel whitespace-nowrap transition-colors ${
                          activeStyleTab === style.id 
                            ? 'bg-red-900/50 text-red-200 border border-red-900' 
                            : 'bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-300'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                  
                  <textarea 
                    value={prompts.stylePrompts[activeStyleTab] || ''}
                    onChange={(e) => setPrompts({
                        ...prompts, 
                        stylePrompts: {
                            ...prompts.stylePrompts,
                            [activeStyleTab]: e.target.value
                        }
                    })}
                    className="dungeon-input w-full h-48 rounded p-3 text-xs font-mono"
                    placeholder={`Enter prompt for ${activeStyleTab} style...`}
                  />
                </div>
              )}
            </div>

            {/* Video Prompt */}
            <div className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
              <button 
                onClick={() => toggleSection('video')}
                className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"
              >
                <span className="text-sm font-bold text-stone-400 font-cinzel">Veo Animation Script</span>
                {openSection === 'video' ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
              </button>
              {openSection === 'video' && (
                <div className="p-4">
                   <textarea 
                    value={prompts.videoPrompt}
                    onChange={(e) => setPrompts({...prompts, videoPrompt: e.target.value})}
                    className="dungeon-input w-full h-48 rounded p-3 text-xs font-mono"
                  />
                </div>
              )}
            </div>

          </div>

          <button onClick={handleSavePrompts} className="dungeon-button-primary mt-8 w-full py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2 font-bold">
            <Save className="w-5 h-5" />
            <span>Scribe Configuration</span>
          </button>
        </section>

      </div>
    </div>
  );
};

export default SettingsView;
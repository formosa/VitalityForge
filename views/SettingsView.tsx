
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, RotateCcw, Film, ChevronDown, ChevronUp, Zap, Sparkles, Save, Palette, BookOpen } from 'lucide-react';
import * as storage from '../services/storageService';
import { CharacterProperty, PromptSettings, DamageConfig, DamageCategoryConfig } from '../types';
import { DEFAULT_PRE_PROMPT, DEFAULT_VISAGE_PROMPT, DEFAULT_SPRITES_PROMPT, DEFAULT_VIDEO_PROMPT, STYLE_PRESETS, DEFAULT_DAMAGE_CONFIG } from '../constants';

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
    const newProp: CharacterProperty = { id: crypto.randomUUID(), name: newPropName, isActive: true, isSystem: false };
    handleSaveProperties([...properties, newProp]);
    setNewPropName('');
  };

  const handleDeleteProperty = (id: string) => handleSaveProperties(properties.filter(p => p.id !== id));
  const handleToggleActive = (id: string) => handleSaveProperties(properties.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));

  const handleSavePrompts = () => {
    storage.saveSettings(prompts);
    onBack();
  };

  const handleRestoreDefaults = () => {
    if (!window.confirm("Restore all defaults?")) return;
    const defaultStyles: Record<string, string> = {};
    STYLE_PRESETS.forEach(s => defaultStyles[s.id] = s.prompt);
    const defaults: PromptSettings = {
      prePrompt: DEFAULT_PRE_PROMPT,
      visagePrompt: DEFAULT_VISAGE_PROMPT,
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
    const updated = { ...prompts, isVeoEnabled: e.target.checked };
    setPrompts(updated);
    storage.saveSettings(updated);
  };

  const handleRaceModToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...prompts, defaultApplyRaceModifiers: e.target.checked };
    setPrompts(updated);
    storage.saveSettings(updated);
  };

  const handleImageModelChange = (model: string) => {
    const updated = { ...prompts, imageModel: model };
    setPrompts(updated);
    storage.saveSettings(updated);
  };

  const handleArtStyleChange = (styleId: string) => {
    const updated = { ...prompts, artStyleId: styleId };
    setPrompts(updated);
    storage.saveSettings(updated);
  };

  const handleCategoryChange = (catId: string, field: string, value: any) => {
      const newConfig = { ...prompts.damageConfig };
      if (field === 'primary_color') newConfig[catId].primary_color.hex = value;
      else newConfig[catId].category_name = value;
      setPrompts({ ...prompts, damageConfig: newConfig });
  };

  const handleTypeChange = (catId: string, typeId: string, field: string, value: string) => {
      const newConfig = { ...prompts.damageConfig };
      const idx = newConfig[catId].damage_types.findIndex(t => t.id === typeId);
      if (idx >= 0) {
          (newConfig[catId].damage_types[idx] as any)[field] = value;
          setPrompts({ ...prompts, damageConfig: newConfig });
      }
  };

  const toggleSection = (section: string) => setOpenSection(openSection === section ? null : section);

  return (
    <div className="flex flex-col h-full bg-stone-950/80">
      <div className="dungeon-panel border-b border-stone-800 p-4 flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="mr-6 flex items-center text-stone-500 hover:text-red-400 transition group"><ArrowLeft className="w-5 h-5 mr-2" /><span className="font-cinzel font-bold text-sm uppercase">Return</span></button>
        <h1 className="text-xl font-cinzel font-bold text-stone-200">System Arcana</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-8 custom-scrollbar">
        <section className="dungeon-panel rounded-xl p-6">
          <h2 className="text-lg font-cinzel font-bold text-red-500 mb-6 border-b border-stone-800 pb-2">Properties & Rules</h2>
          <div className="space-y-4">
            <div className="flex items-start bg-stone-900/30 p-4 rounded-lg border border-stone-800">
              <BookOpen className="w-6 h-6 mr-4 text-stone-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-stone-200 text-sm font-cinzel">Racial Ability Modifiers</h3>
                <label className="flex items-center cursor-pointer group mt-4"><input type="checkbox" checked={prompts.defaultApplyRaceModifiers} onChange={handleRaceModToggle} className="h-4 w-4 bg-stone-900 border-stone-700 text-red-700" /><span className="ml-3 text-sm text-stone-400">Enable by Default</span></label>
              </div>
            </div>
          </div>
        </section>

        <section className="dungeon-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-2"><h2 className="text-lg font-cinzel font-bold text-red-500">Ancient Texts (Prompts)</h2><button onClick={handleRestoreDefaults} className="flex items-center text-xs text-amber-600"><RotateCcw className="w-3 h-3 mr-1" /> Reset All</button></div>
          <div className="space-y-4">
            {[
              { id: 'character', label: 'Identity Ritual (Step 2)', field: 'prePrompt' },
              { id: 'visage', label: 'Visage Manifestation (Step 3)', field: 'visagePrompt' },
              { id: 'sprites', label: 'Sprite Forge (Step 4)', field: 'spritesPrompt' },
              { id: 'video', label: 'Veo Script (Step 5)', field: 'videoPrompt' }
            ].map(item => (
              <div key={item.id} className="border border-stone-800 rounded-lg bg-stone-950/30 overflow-hidden">
                <button onClick={() => toggleSection(item.id)} className="w-full p-4 flex justify-between items-center bg-stone-900/50 hover:bg-stone-800 transition"><span className="text-sm font-bold text-stone-400 font-cinzel">{item.label}</span>{openSection === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                {openSection === item.id && <div className="p-4"><textarea value={(prompts as any)[item.field]} onChange={(e) => setPrompts({...prompts, [item.field]: e.target.value})} className="dungeon-input w-full h-48 rounded p-3 text-xs font-mono" /></div>}
              </div>
            ))}
          </div>
          <button onClick={handleSavePrompts} className="dungeon-button-primary mt-8 w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold"><Save className="w-5 h-5" /><span>Scribe Configuration</span></button>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;

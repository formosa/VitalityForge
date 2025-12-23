
import { CharacterProfile, PromptSettings, CharacterProperty } from '../types';
import { DEFAULT_PRE_PROMPT, DEFAULT_VISAGE_PROMPT, DEFAULT_SPRITES_PROMPT, DEFAULT_VIDEO_PROMPT, MODELS, STYLE_PRESETS, DEFAULT_DAMAGE_CONFIG } from '../constants';

const DB_NAME = 'VitalityForgeDB';
const DB_VERSION = 1;
const STORE_PROFILES = 'profiles';
const SETTINGS_KEY = 'vf_settings';
const PROPERTIES_KEY = 'vf_properties';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported."));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROFILES)) {
        db.createObjectStore(STORE_PROFILES, { keyPath: 'id' });
      }
    };
  });
};

export const getProfiles = async (): Promise<CharacterProfile[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROFILES, 'readonly');
      const store = tx.objectStore(STORE_PROFILES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to load profiles", e);
    return [];
  }
};

export const saveProfile = async (profile: CharacterProfile): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILES, 'readwrite');
    const store = tx.objectStore(STORE_PROFILES);
    store.put(profile);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const deleteProfile = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILES, 'readwrite');
    const store = tx.objectStore(STORE_PROFILES);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const defaultProperties: CharacterProperty[] = [
  { id: '1', name: 'Character Name', isActive: true, isSystem: true },
  { id: '2', name: 'Race', isActive: true, isSystem: true },
  { id: '3', name: 'Total HP', isActive: true, isSystem: true },
];

const defaultStylePrompts: Record<string, string> = {};
STYLE_PRESETS.forEach(preset => {
  defaultStylePrompts[preset.id] = preset.prompt;
});

const defaultSettings: PromptSettings = {
  prePrompt: DEFAULT_PRE_PROMPT,
  visagePrompt: DEFAULT_VISAGE_PROMPT,
  spritesPrompt: DEFAULT_SPRITES_PROMPT,
  videoPrompt: DEFAULT_VIDEO_PROMPT,
  isVeoEnabled: false,
  imageModel: MODELS.IMAGE_DEFAULT,
  artStyleId: 'realistic',
  stylePrompts: defaultStylePrompts,
  damageConfig: DEFAULT_DAMAGE_CONFIG,
  defaultApplyRaceModifiers: true
};

export const getSettings = (): PromptSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const merged = { ...defaultSettings, ...parsed };
      if (!merged.visagePrompt) merged.visagePrompt = DEFAULT_VISAGE_PROMPT;
      return merged;
    }
  } catch (e) {
    console.error("Failed to load settings", e);
  }
  return defaultSettings;
};

export const saveSettings = (settings: PromptSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const getProperties = (): CharacterProperty[] => {
  try {
    const data = localStorage.getItem(PROPERTIES_KEY);
    return data ? JSON.parse(data) : defaultProperties;
  } catch (e) {
     return defaultProperties;
  }
};

export const saveProperties = (props: CharacterProperty[]): void => {
  try {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));
  } catch (e) {
    console.error("Failed to save properties", e);
  }
};

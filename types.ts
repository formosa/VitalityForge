
export enum ViewState {
  MAIN = 'MAIN',
  SETTINGS = 'SETTINGS',
  NEW_REF = 'NEW_REF',
  NEW_DETAILS = 'NEW_DETAILS',
  NEW_VISAGE = 'NEW_VISAGE', // New Step
  NEW_SPRITES = 'NEW_SPRITES',
  NEW_ANIMATION = 'NEW_ANIMATION',
  PROFILE = 'PROFILE',
}

export enum InputMethod {
  UPLOAD = 1,
  TEXT_TO_IMAGE = 2,
  IMAGE_TO_IMAGE = 3
}

export interface EventLogEntry {
  id: string;
  timestamp: number;
  type: 'damage' | 'heal' | 'restore';
  subType?: string; // e.g., 'fire', 'slashing', 'healing'
  amount: number;
  prevHp: number;
  newHp: number;
  originalAmount?: number;
  modifier?: 'immune' | 'resistant' | 'vulnerable' | 'normal';
}

export interface CharacterProfile {
  id: string;
  name: string;
  race: string;
  subrace?: string;
  gender?: string;
  totalHp: number;
  currentHp: number;
  referenceImageBase64: string | null;
  spriteSheetBase64: string | null;
  animationMode: 'video' | 'sprite';
  animationVideoUri: string | null;
  createdAt: number;
  logs: EventLogEntry[];
  
  // Affinities
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];

  // Ability Scores
  abilityScores: Record<string, number>;

  // View Settings
  isHpVisible: boolean;
  isHpBarVisible: boolean;
  isStatusVisible: boolean;
  isQuickActionsVisible: boolean;
  isManualInputVisible: boolean;
  isEventLogVisible: boolean;
  isAffinityVisible: boolean;
  isAbilityScoresVisible?: boolean;
  
  // Log Details Visibility
  isLogTimeVisible?: boolean;
  isLogTypeVisible?: boolean;
  isLogDeltaVisible?: boolean;
  isLogCalculationVisible?: boolean;
  isLogRemainingHpVisible?: boolean;
}

export interface CreationWizardState {
  referenceImage: string | null;
  description: string; // Persistent prompt/description
  name: string;
  race: string;
  subrace?: string;
  gender?: string;
  totalHp: number;
  spriteSheet: string | null;
  videoUri: string | null;
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];
  abilityScores: Record<string, number>;
  applyRaceModifiers: boolean;
  applyAbilityVisage: boolean;
}

export interface CharacterProperty {
  id: string;
  name: string;
  isActive: boolean;
  isSystem: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  left: number;
  top: number;
}

// Damage Configuration Types
export interface ColorDef {
  name: string;
  hex: string;
}

export interface DamageTypeConfig {
  id: string;
  name: string;
  color: string;
}

export interface DamageCategoryConfig {
  id: string;
  category_name: string;
  primary_color: ColorDef;
  accent_colors: ColorDef[];
  damage_types: DamageTypeConfig[];
}

export interface DamageConfig {
  physical: DamageCategoryConfig;
  elemental: DamageCategoryConfig;
  energy: DamageCategoryConfig;
  chemical: DamageCategoryConfig;
  [key: string]: DamageCategoryConfig;
}

export interface PromptSettings {
  prePrompt: string;
  visagePrompt: string; // New field
  spritesPrompt: string;
  videoPrompt: string;
  isVeoEnabled: boolean;
  imageModel: string;
  artStyleId: string;
  stylePrompts: Record<string, string>;
  damageConfig: DamageConfig;
  defaultApplyRaceModifiers: boolean;
}

// Race Data Types
export interface GenderData {
  gender: string;
  description: string;
  visage: string;
}

export interface SubraceData {
  subrace: string;
  description: string;
  visage: string;
  genders?: GenderData[];
  modifiers?: Record<string, number>;
}

export interface RaceData {
  race: string;
  description: string;
  visage: string;
  subraces: SubraceData[];
  genders?: GenderData[];
  modifiers?: Record<string, number>;
}

// Ability Score Types
export interface AbilityScoreDefinition {
  id: string;
  name: string;
  abbreviation: string;
  sort_order: number;
  category: "Physical" | "Mental";
  description: string;
  mechanics_impact: string[];
}

export interface AbilityScoreSystem {
  system_context: string;
  data_type: string;
  abilities: AbilityScoreDefinition[];
}

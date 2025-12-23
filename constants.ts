
import { DamageConfig, AbilityScoreSystem } from "./types";

export const ABILITY_SCORES_DATA: AbilityScoreSystem = {
  "system_context": "Dungeons & Dragons 5th Edition",
  "data_type": "Ability Scores",
  "abilities": [
    {
      "id": "strength",
      "name": "Strength",
      "abbreviation": "STR",
      "sort_order": 1,
      "category": "Physical",
      "description": "Measures bodily power, athletic training, and the extent to which you can exert raw physical force.",
      "mechanics_impact": ["Melee attack rolls", "Melee damage rolls", "Athletics skill checks", "Carrying capacity", "Push/Drag/Lift limits"]
    },
    {
      "id": "dexterity",
      "name": "Dexterity",
      "abbreviation": "DEX",
      "sort_order": 2,
      "category": "Physical",
      "description": "Measures agility, reflexes, balance, and hand-eye coordination.",
      "mechanics_impact": ["Ranged attack rolls", "Finesse melee attack rolls", "Armor Class (AC) bonuses", "Initiative rolls", "Dexterity saving throws", "Acrobatics, Sleight of Hand, and Stealth skill checks"]
    },
    {
      "id": "constitution",
      "name": "Constitution",
      "abbreviation": "CON",
      "sort_order": 3,
      "category": "Physical",
      "description": "Measures health, stamina, and vital force.",
      "mechanics_impact": ["Hit Point (HP) maximum", "Hit Dice healing", "Concentration checks (for spellcasters)", "Constitution saving throws (resisting poison, cold, etc.)"]
    },
    {
      "id": "intelligence",
      "name": "Intelligence",
      "abbreviation": "INT",
      "sort_order": 4,
      "category": "Mental",
      "description": "Measures mental acuity, accuracy of recall, and the ability to reason.",
      "mechanics_impact": ["Spellcasting ability for Wizards, Artificers, and some subclasses", "Arcana, History, Investigation, Nature, and Religion skill checks"]
    },
    {
      "id": "wisdom",
      "name": "Wisdom",
      "abbreviation": "WIS",
      "sort_order": 5,
      "category": "Mental",
      "description": "Measures how attuned you are to the world around you and represents perceptiveness and intuition.",
      "mechanics_impact": ["Spellcasting ability for Clerics, Druids, and Rangers", "Perception, Insight, Medicine, Survival, and Animal Handling skill checks"]
    },
    {
      "id": "charisma",
      "name": "Charisma",
      "abbreviation": "CHA",
      "sort_order": 6,
      "category": "Mental",
      "description": "Measures your ability to interact effectively with others, including confidence and eloquence.",
      "mechanics_impact": ["Spellcasting ability for Bards, Paladins, Sorcerers, and Warlocks", "Persuasion, Deception, Intimidation, and Performance skill checks"]
    }
  ]
};

export const VISAGE_MODIFIERS: Record<string, { scale: Record<string, string> }> = {
  "STR": {
    "scale": {
      "1": `
- extreme indications of *Camptocormia* in posture (extremely uneven shoulders, extreme forward bending of the torso)

- extreme *Cachexia* (represented by a 90% decrease in muscle mass in torso and limbs)`,
      "2": `
- extreme indications of *Camptocormia* in posture (extremely uneven shoulders, extreme forward bending of the torso)

- extreme *Cachexia* (80% decrease in muscle mass in torso and limbs)`,
      "3": `
- extreme indications of *Camptocormia* in posture (severely uneven shoulders, severe forward bending of the torso)

- extreme *Cachexia* (70% decrease in muscle mass in torso and limbs)`,
      "4": `
- severe indications of*Camptocormia* in posture (severely uneven shoulders, severe forward bending of the torso)

- severe *Cachexia* (60% decrease in muscle mass in torso and limbs)`,
      "5": `
- severe indications of *Camptocormia* in posture (uneven shoulders, forward bending of the torso)

- severe *Cachexia* (a 50% decrease in muscle mass in torso and limbs)`,
      "6": `
- severe indications of *Camptocormia* in posture (uneven shoulders, forward bending of the torso)

- severe *Cachexia* (a 40% decrease in muscle mass in torso and limbs)`,
      "7": `
- indications of *Camptocormia* in posture (uneven shoulders, forward bending of the torso)

- indications of *Cachexia* (a 30% decrease in muscle mass in torso and limbs)`,
      "8": `
- minor indications of *Camptocormia* in posture (slightly uneven shoulders, subtly forward bending of the torso)

- minor *Cachexia* (a 20% decrease in muscle mass in torso and limbs)`,
      "9": `
- minor indications of *Camptocormia* in posture (slightly uneven shoulders, subtly forward bending of the torso)

- minor *Cachexia* (a 10% decrease in muscle mass in torso and limbs)`,
      "10": ``,
      "11": `
- *Myostatin-related muscle hypertrophy* (represented by a 10% increase in muscle mass in torso and limbs)`,
      "12": `
- *Myostatin-related muscle hypertrophy* (represented by a 20% increase in muscle mass in torso and limbs)`,
      "13": `
- *Myostatin-related muscle hypertrophy* (represented by a 30% increase in muscle mass in torso and limbs)`,
      "14": `
- *Myostatin-related muscle hypertrophy* (represented by a 40% increase in muscle mass in torso and limbs)`,
      "15": `
- *Myostatin-related muscle hypertrophy* (represented by a 50% increase in muscle mass in torso and limbs)`,
      "16": `
- extreme *Myostatin-related muscle hypertrophy* (represented by a 60% increase in muscle mass in torso and limbs)`,
      "17": `
- extreme *Myostatin-related muscle hypertrophy* (represented by a 70% increase in muscle mass in torso and limbs)`,
      "18": `
- extreme *Myostatin-related muscle hypertrophy* (represented by a 80% increase in muscle mass in torso and limbs)`,
      "19": `
- extreme *Myostatin-related muscle hypertrophy* (represented by a 90% increase in muscle mass in torso and limbs)`,
      "20": `
- extreme *Myostatin-related muscle hypertrophy* (represented by a 100% increase in muscle mass in torso and limbs)`
    }
  },
  "DEX": {
    "scale": {
      "1": `
- extreme *Class 3 obesity* (extremely significant excess body fat, skin folds, swollen limbs and facial features)`,
      "2": `
- extreme *Class 3 obesity* (extremely significant excess body fat, skin folds, swollen limbs and facial features)`,
      "3": `
- severe *Class 2 obesity* (severely significant excess body fat, skin folds, swollen limbs and facial features)`,
      "4": `
- severe *Class 2 obesity* (severely significant excess body fat, skin folds, swollen limbs and facial features)`,
      "5": `
- *Class 2 obesity* (significant excess body fat, skin folds, swollen limbs and facial features)`,
      "6": `
- *Class 2 obesity* (significant excess body fat, skin folds, swollen limbs and facial features)`,
      "7": `
- borderline *Class 2 obesity* (excess body fat, swollen limbs and facial features)`,
      "8": `
- borderline *Class 2 obesity* (excess body fat, swollen limbs and facial features)`,
      "9": `
- *Class 1 obesity* (excess body fat, swollen limbs and facial features)`,
      "10": ``,
      "11": `
- *Lipodystrophy* (represented by a 5% decrease in body fat mass in torso and limbs)`,
      "12": `
- *Lipodystrophy* (represented by a 10% decrease in body fat mass in torso and limbs)`,
      "13": `
- *Lipodystrophy* (represented by a 15% decrease in body fat mass in torso and limbs)`,
      "14": `
- *Lipodystrophy* (represented by a 20% decrease in body fat mass in torso and limbs)`,
      "15": `
- *Lipodystrophy* (represented by a 25% decrease in body fat mass in torso and limbs)`,
      "16": `
- extreme *Lipodystrophy* (represented by a 30% decrease in body fat mass in torso and limbs)`,
      "17": `
- extreme *Lipodystrophy* (represented by a 35% decrease in body fat mass in torso and limbs)`,
      "18": `
- extreme *Lipodystrophy* (represented by a 40% decrease in body fat mass in torso and limbs)`,
      "19": `
- extreme *Lipodystrophy* (represented by a 45% decrease in body fat mass in torso and limbs)`,
      "20": `
- extreme *Lipodystrophy* (represented by a 50% decrease in body fat mass in torso and limbs)`
    }
  },
  "CON": {
    "scale": {
      "1": `
- extreme *psoriasis* visible on face and body (large patches of red, inflamed skin with flaky plaque)

- extreme *paucibacillary leprosy* visible on face and body (large and severe hypopigmented skin patches with well-defined borders and red inflammation)`,
      "2": `
- extreme *psoriasis* visible on face and body (large patches of red, inflamed skin with flaky plaque)

- extreme *paucibacillary leprosy* visible on face and body (large and severe hypopigmented skin patches with well-defined borders and red inflammation)`,
      "3": `
- severe *psoriasis* visible on face and body (large, dispersed patches of red, inflamed skin with flaky plaque)

- severe *paucibacillary leprosy* visible on face and body (large and severe hypopigmented skin patches with well-defined borders and red inflammation)`,
      "4": `
- severe *psoriasis* visible on face and body (large, dispersed patches of red, inflamed skin with flaky plaque)

- severe *paucibacillary leprosy* visible on face and body (large and severe hypopigmented skin patches with well-defined borders and red inflammation)`,
      "5": `
- indications of *psoriasis* visible on face and body (patches of red, inflamed skin with flaky plaque)

- indications *paucibacillary leprosy* visible on face and body (hypopigmented skin patches with well-defined borders and red inflammation)`,
      "6": `
- indications of *psoriasis* visible on face and body (patches of red, inflamed skin with flaky plaque)

- indications *paucibacillary leprosy* visible on face and body (hypopigmented skin patches with well-defined borders and red inflammation)`,
      "7":`
- minor indications of *psoriasis* visible on face and body (small patches of red, inflamed skin with flaky plaque)

- indications *paucibacillary leprosy* visible on face and body (hypopigmented skin patches with well-defined borders and red inflammation)`,
      "8":`
- minor indications of *psoriasis* visible on face and body (small patches of red, inflamed skin with flaky plaque)

- indications *paucibacillary leprosy* visible on face and body (hypopigmented skin patches with well-defined borders and red inflammation)`,
      "9":`
- indications *paucibacillary leprosy* visible on face and body (hypopigmented skin patches with well-defined borders and red inflammation)`,
      "10":``
    }
  },
  "INT": {
    "scale": {
      "1": `
 - extreme indications of *Down syndrome* in facial details (extremely flat facial profile, extreme upward-slanting eye shape, and extremely shrunken eyes, ears, and mouth)

- extreme *Exotropia* (inward turning of eyes toward nose)`,
      "2": `
- extreme indications of *Down syndrome* in facial details (extremely flat facial profile, extreme upward-slanting eye shape, and extremely shrunken eyes, ears, and mouth)

- extreme *Exotropia* (inward turning of eyes toward nose)`,
      "3": `
- severe indications of *Down syndrome* in facial details (severely flat facial profile, severe upward-slanting eye shape, and severely shrunken eyes, ears, and mouth)

- extreme *Exotropia* (inward turning of eyes toward nose)`,
      "4": `
- severe indications of *Down syndrome* in facial details (severely flat facial profile, severe upward-slanting eye shape, and severely shrunken eyes, ears, and mouth)

- extreme *Exotropia* (inward turning of eyes toward nose)`,
      "5": `
- indications of *Down syndrome* in facial details (flat facial profile, upward-slanting eye shape, and shrunken eyes, ears, and mouth)

- severe *Exotropia* (inward turning of eyes toward nose)`,
      "6": `
- indications of *Down syndrome* in facial details (flat facial profile, upward-slanting eye shape, and shrunken eyes, ears, and mouth)

- severe *Exotropia* (inward turning of eyes toward nose)`,
      "7":  `
- indications of *Down syndrome* in facial details (flat facial profile, upward-slanting eye shape, and shrunken eyes, ears, and mouth)

- *Exotropia* (inward turning of eyes toward nose)`,
      "8":  `
- indications of *Down syndrome* in facial details (flat facial profile, upward-slanting eye shape, and shrunken eyes, ears, and mouth)

- *Exotropia* (inward turning of eyes toward nose)`,
      "9":  `
- indications of *Down syndrome* in facial details (flat facial profile, upward-slanting eye shape, and shrunken eyes, ears, and mouth)

- minor *Exotropia* (inward turning of eyes toward nose)`,
      "10":  `
- minor indications of *Down syndrome* in facial details (slightly shrunken eyes, ears, and mouth)`,
      "11":  `
- minor indications of *Down syndrome* in facial details (slightly shrunken eyes, ears, and mouth)`,
      "12":  `
- trace indications of *Down syndrome* in facial details`,
      "13":  `
- trace indications of *Down syndrome* in facial details`
    }
  },
  "WIS": {
    "scale": {
      "1": `
- extreme indications *Parry-Romberg Syndrome* in facial details (extremely pale skin and sunken features)

- extreme *Hypertropia* of the right eye (upward turning of the eye)`,
      "2": `
- extreme indications *Parry-Romberg Syndrome* in facial details (extremely pale skin and sunken features)

- extreme *Hypertropia* of the right eye (upward turning of the eye)`,
      "3": `
- severe indications *Parry-Romberg Syndrome* in facial details (severely pale skin and sunken features)

- severe *Hypertropia* of the right eye (upward turning of the eye)`,
      "4": `
- severe indications *Parry-Romberg Syndrome* in facial details (severely pale skin and sunken features)

- severe *Hypertropia* of the right eye (upward turning of the eye)`,
      "5": `
- indications *Parry-Romberg Syndrome* in facial details (pale skin and sunken features)

- *Hypertropia* of the right eye (upward turning of the eye)`,
      "6": `
- indications *Parry-Romberg Syndrome* in facial details (pale skin and sunken features)

- *Hypertropia* of the right eye (upward turning of the eye)`,
      "7": `
- indications *Parry-Romberg Syndrome* in facial details (pale skin and sunken features)

- minor *Hypertropia* of the right eye (upward turning of the eye)`,
      "8": `
- indications *Parry-Romberg Syndrome* in facial details (pale skin and sunken features)

- minor *Hypertropia* of the right eye (upward turning of the eye)`,
      "9": `
- minor indications *Parry-Romberg Syndrome* in facial details (slightly pale skin and slightly sunken features`,
      "10": `
- minor indications *Parry-Romberg Syndrome* in facial details (slightly pale skin and slightly sunken features`,
      "11": `
- minor indications *Parry-Romberg Syndrome* in facial details`,
      "12": `
- trace indications *Parry-Romberg Syndrome* in facial details`,
      "13": `
- trace indications *Parry-Romberg Syndrome* in facial details`
    }
  },
  "CHA": {
    "scale": {
      "1": `
- extreme *Rubinstein-Taybi* syndrome (maximally downward-slanting eyes and an extremely prominent and grotesquely misshapen nose)

- extreme *Exotropia* of the left eye (upward turning)`,
      "2": `
- extreme *Rubinstein-Taybi* syndrome (maximally downward-slanting eyes and an extremely prominent and grotesquely misshapen nose)

- extreme *Exotropia* of the left eye (upward turning)`,
      "3": `
- extreme *Rubinstein-Taybi* syndrome (extreme downward-slanting eyes and an extremely prominent and grotesquely misshapen nose)

- extreme *Exotropia* of the left eye (upward turning)`,
      "4": `
- severe *Rubinstein-Taybi* syndrome (severe downward-slanting eyes and a severely prominent and grotesquely misshapen nose)

- severe *Exotropia* of the left eye (upward turning)`,
      "5":  `
- severe *Rubinstein-Taybi* syndrome (severe downward-slanting eyes and a severely prominent and grotesquely misshapen nose)

- severe *Exotropia* of the left eye (upward turning)`,
      "6":  `
- indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and grotesquely misshapen nose)

- severe *Exotropia* of the left eye (upward turning)`,
      "7": `
- indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and grotesquely misshapen nose)

- severe *Exotropia* of the left eye (upward turning)`,
      "8": `
- indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and grotesquely misshapen nose)

- *Exotropia* of the left eye (upward turning)`,
      "9":  `
- minor indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and misshapen nose)

- *Exotropia* of the left eye (upward turning)`,
      "10":  `
- minor indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and misshapen nose)

- minor *Exotropia* of the left eye (upward turning)`,
      "11":  `
- minor indications of *Rubinstein-Taybi* syndrome (downward-slanting eyes and a prominent and misshapen nose)

- minor *Exotropia* of the left eye (upward turning)`,
      "12": `
- trace indications of *Rubinstein-Taybi* syndrome`,
      "13": `
- trace indications of *Rubinstein-Taybi* syndrome`,
    }
  }
};

export const DEFAULT_PRE_PROMPT = `OBJECTIVE:
Create a high-fidelity, medium close-up character portrait of a 
{GENDER} {SUBRACE} {RACE}.

{STYLE}


ENHANCE:

Enhance the clarifying description contained between the following curly braces to apply an adult erotic power-fantasy aesthetic intended for a mature audience (18+ only), embellishing sensuality through visual implication.



ENHANCEMENTS:

- Maximally optimize physical appeal using confident posture, expressive eyes, subtle facial tension, and intimate body language.

- Accentuate form through tailored clothing, strategic fabric tension, cut lines, high-end materials, and elegant silhouettes.

- Favor suggestive elements such as exposed shoulders, neckline depth, fitted (form-fitting) garments, bare arms or legs, suggestively exposed skin, soft skin highlights, and deliberate posing — without nudity.

- Convey allure through cinematic lighting (rim light, soft key light, warm highlights), shallow depth of field, and rich color contrast.

- Maintain a cohesive “adult fantasy” visual identity: polished, sensual, confident, powerful, and suggestive.

- Use realistic, idealized anatomy, premium character-art rendering, and a stylized yet believable and photographic finish.



HARD_CONSTRAINTS (must not appear):

- No explicit sexual acts or sexual interaction

- No visible genitalia or explicit nudity

- No pornographic framing or overt sexual behavior


SUBJECT_DESCRIPTION: 
{
{RACE_VISAGE}

{SUBRACE_VISAGE}

{GENDER_VISAGE}

{USER_INPUT}
}


BACKGROUND: #000000


FRAME: none


OUTPUT: Square image dimensions with subject *only* isolated against a pure black background.
`;

export const DEFAULT_VISAGE_PROMPT = `Produce a high-quality, professional medical image intended for an advanced anatomy textbook targeting an adult audience (18+ years of age) adhering to the depicting of the attached reference image. The figure demonstrates specific clinical features in a respectful and schematic manner:

{STR_VISAGE_MODIFIER}{DEX_VISAGE_MODIFIER}{CON_VISAGE_MODIFIER}{INT_VISAGE_MODIFIER}{WIS_VISAGE_MODIFIER}{CHA_VISAGE_MODIFIER}

*Photographically identical style and quality as attached image inspiration with combined visual indications of conditions.*

**Retain unique visual features: tattoos, scars, makeup, hairstyle, clothing, props, etc..)**

**black background**

**no text or overlays**
`;

export const DEFAULT_SPRITES_PROMPT = `Prompt: Character vitality sprite sheet
OBJECTIVE: Image Generation for an asset of an adult (18+ years of age) video game.

2x2 grid layout, four equal square cells, sequential character evolution sheet, RPG sprite sheet style. 

STRICT LAYOUT RULES:
- NO borders, NO grid lines, NO white lines, and NO gaps between cells.
- Each character portrait must fill the entire square cell, maximized for size.
- Maintain consistent lighting and camera angle across all four cells.

CELL DEFINITIONS:
[Top-Left]: 100% vitality. Source character reference, pristine condition.
[Top-Right]: 75% vitality.  Same character, confident excitment, battle-worn look with minor injuries, slight grime.
[Bottom-Left]: 50% vitality. Same character, enraged frenzy, significant injury and bleeding, mid-battle fatigue.
[Bottom-Right]: 25% vitality. Same character, enraged blood-lust, near-death state, critical physical trauma and bleeding, extreme gore.

Technical specifications: hyper-detailed, character identity provided by reference image.`;

export const DEFAULT_VIDEO_PROMPT = `TASK: Image-to-Video Generation (Google Veo) INPUT IMAGE FORMAT (STRICT): - The input image is a single 2×2 quadrant sprite sheet. - All four quadrants depict the SAME character at different vitality states. - Quadrant semantics are FIXED: Top-Left=100%, Top-Right=75%, Bottom-Left=50%, Bottom-Right=25%. OUTPUT VIDEO: 100 frames smooth linear interpolation from Frame 1 (100%) to Frame 100 (Tombstone). Camera locked, no movement.`;

export const TOMBSTONE_IMAGE_URL = "https://storage.googleapis.com/gemini-codelab-images/tombstone.png";

export const MODELS = {
  IMAGE_DEFAULT: 'gemini-2.5-flash-image',
  IMAGE_PRO: 'gemini-3-pro-image-preview',
  VIDEO_VEO: 'veo-3.1-fast-generate-preview'
};

export const GRID_CONFIG = {
  ROWS: 2,
  COLS: 2
};

export const DEFAULT_DAMAGE_CONFIG: DamageConfig = {
  physical: {
    id: "physical",
    category_name: "Physical",
    primary_color: { name: "Gunmetal Gray", hex: "#5F646B" },
    accent_colors: [{ name: "Dark Steel", hex: "#3F444A" }, { name: "Iron Highlight", hex: "#8A9098" }],
    damage_types: [
      { id: "Bludgeoning", name: "Bludgeoning", color: "#dc2626" },
      { id: "Piercing", name: "Piercing", color: "#dc2626" },
      { id: "Slashing", name: "Slashing", color: "#dc2626" }
    ]
  },
  elemental: {
    id: "elemental",
    category_name: "Elemental",
    primary_color: { name: "Deep Teal", hex: "#1FA4A9" },
    accent_colors: [{ name: "Frosted Cyan", hex: "#4ED1D4" }, { name: "Storm Teal", hex: "#14787C" }],
    damage_types: [
      { id: "Cold", name: "Cold", color: "#3b82f6" },
      { id: "Fire", name: "Fire", color: "#ef4444" },
      { id: "Lightning", name: "Lightning", color: "#eab308" },
      { id: "Thunder", name: "Thunder", color: "#a855f7" }
    ]
  },
  energy: {
    id: "energy",
    category_name: "Energy",
    primary_color: { name: "Luminous Violet", hex: "#9B5CFF" },
    accent_colors: [{ name: "Astral Purple", hex: "#6E3BCF" }, { name: "Radiant Magenta", hex: "#C27CFF" }],
    damage_types: [
      { id: "Force", name: "Force", color: "#7f1d1d" },
      { id: "Radiant", name: "Radiant", color: "#fef08a" },
      { id: "Necrotic", name: "Necrotic", color: "#581c87" },
      { id: "Psychic", name: "Psychic", color: "#d946ef" }
    ]
  },
  chemical: {
    id: "chemical",
    category_name: "Chemical",
    primary_color: { name: "Toxic Green", hex: "#3DFF6A" },
    accent_colors: [{ name: "Acid Green", hex: "#00C853" }, { name: "Corrosive Lime", hex: "#7CFF00" }],
    damage_types: [
      { id: "Acid", name: "Acid", color: "#84cc16" },
      { id: "Poison", name: "Poison", color: "#22c55e" }
    ]
  }
};

export const STYLE_PRESETS = [
  { id: 'realistic', label: 'Realistic', description: 'Hyperrealistic digital fantasy photography', prompt: `
PHOTOREALISM_MANDATE: {absolute photographic authenticity, DSLR/mirrorless capture quality, zero illustration or digital art artifacts, indistinguishable from professional studio photography}

LIGHTING_SETUP: {
  key_light: warm golden (3200K) positioned upper-right 45deg, creates strong specular highlights on metallics and skin
  rim_light: cool blue (6500-7000K) edge separation, contours subject silhouette from background
  fill_light: soft diffused neutral (5000K) at camera axis, lifts shadows preserving detail without flattening form
  lighting_ratio: 4:1 key-to-fill for dramatic dimensionality with retained shadow information
  technique: three-point studio setup, editorial fashion photography principles applied to fantasy subjects
  special_source: backlit stained glass providing colored practical light and architectural framing
  character: chiaroscuro effect with strong directional shadows enhancing three-dimensional form
  constraint: Subject *only*
}

COLOR_SCIENCE: {
  palette: cinematic—warm golds/amber/bronze/oranges contrasted with deep blacks and cool midnight blues/teals
  grading: high dynamic range professional color correction, warm-teal cinematic look
  skin_tones: calibrated natural rendering with professional retouching, enhanced contrast without loss of realism
  saturation: elevated 15-20% while maintaining photographic believability
  curves: film-like color response, avoiding digital flatness
  constraint: Subject *only*
}

OPTICAL_CHARACTERISTICS: {
  lens: 70-100mm equivalent prime lens rendering
  aperture: f/1.8-f/2.8 for shallow depth of field
  focus: critical sharpness on subject, smooth controlled bokeh on background
  bokeh_quality: prime lens characteristics—smooth circular out-of-focus areas
  optical_quality: sharp resolving power, no chromatic aberration, professional glass rendering
  constraint: Subject *only*
}

SKIN_RENDERING: {
  detail_level: photorealistic micropore texture, fine hair detail, natural imperfections
  lighting_interaction: subsurface scattering creating translucent quality in thin-skin areas (ears, nose, fingers)
  tone: calibrated natural color with professional beauty retouching maintaining texture
  finish: natural oil sheen, accurate Fresnel reflections at grazing angles
  constraint: Subject *only*
}

MATERIAL_RENDERING_PBR: {
  metals: accurate specular highlights, environment reflections, Fresnel effect at edges, patina/weathering detail
  metal_ornament: intricate engraving patterns, jewel embellishments with internal refraction
  leather: grain texture visible, worn creases, matte-to-satin finish variation, realistic aging
  fabric: weave structure detail, drape physics, light interaction per material density
  polished_surfaces: mirror-like reflections with environmental detail
  principle: physically-based rendering (PBR) accuracy for all materials
  constraint: Subject *only*
}

ATMOSPHERIC_ELEMENTS: {
  haze: subtle volumetric atmospheric fog creating depth stratification and mood
  light_interaction: volumetric light rays where appropriate (stained glass transmission)
  constraint: Subject *only*
}

COMPOSITION: {
  framing: rule of thirds placement, cinematic aspect ratio
  subject_positioning: editorial portrait conventions
  depth_cues: foreground sharp, background controlled bokeh separation
  constraint: Subject *only*
}

POST_PROCESSING: {
  workflow: professional studio retouching maintaining photographic integrity
  contrast: enhanced while preserving natural tonal relationships
  sharpening: applied to detail frequencies without artifacts
  color_correction: calibrated professional color science
  finish: museum-quality archival presentation standards
  constraint: Subject *only*
}

TECHNICAL_QUALITY: {
  resolution: equivalent to 42-50MP full-frame sensor capture
  bit_depth: 14-bit color depth for smooth gradations
  dynamic_range: 12+ stops captured and preserved
  noise: clean high-ISO equivalent performance where applicable
  constraint: Subject *only*
}

STYLE_SYNTHESIS: {
  foundation: glamour/beauty photography lighting merged with fantasy genre aesthetics
  influence: editorial fashion photography technique applied to character/costume subjects
  realism_priority: photographic authenticity supersedes fantasy illustration conventions
  constraint: Subject *only*
}

AESTHETIC_REFERENCES: {Annie Leibovitz editorial portraiture, Peter Lindbergh dramatic lighting, high-end fantasy cosplay photography, Paolo Roversi beauty lighting}

FINAL_ASSERTION: **MUST BE COMPLETELY INDISTINGUISHABLE FROM HIGH-END EDITORIAL/FASHION PHOTOGRAPHY SHOT IN PROFESSIONAL STUDIO WITH MEDIUM FORMAT CAMERA - ABSOLUTE ZERO DIGITAL ART, ILLUSTRATION, OR CGI QUALITIES**
` },
  { id: 'tolkien', label: 'Tolkien', description: 'European graphic novel & line art style', prompt: `
STYLE_FOUNDATION: {european graphic novel, bande dessinée aesthetic, french-belgian comic tradition, traditional ink-and-watercolor media}

INK_LINE_WORK: {
  technique: heavy confident ink linework, variable line weight (thin-to-thick modulation)
  line_quality: expressive gestural hand-drawn, organic imperfections preserved
  contours: bold thick outlines defining major forms and silhouettes
  hatching: extensive cross-hatching, parallel hatching, directional stippling for shadows and texture
  mark_making: sketchy energetic strokes, visible construction lines, under-drawing partially visible
  dimensional_rendering: form created through line weight variation alone, not tonal gradation
  constraint: character *only*
}

COLOR_APPLICATION: {
  medium: transparent watercolor washes over ink foundation
  palette: limited—teal/cyan, warm orange, peachy flesh tones, earth browns (complementary harmony)
  saturation: muted sophisticated tones, avoiding garish oversaturation
  technique: loose flat color areas, minimal gradation, embracing graphic design principles
  characteristics: organic edge bleeding, color wash transparency allows ink and white paper to show through
  application: visible directional brushwork, watercolor media authenticity with happy accidents
  strategy: split complementary color scheme for vibrant visual interest
  constraint: character *only*
}

VALUE_STRUCTURE: {
  contrast: strong black ink areas anchor composition against lighter watercolor zones
  highlights: strategic white paper preservation for luminosity and focal emphasis
  depth: atmospheric perspective through line density variation (dense foreground, sparse background)
}

COMPOSITION_APPROACH: {
  perspective: dramatic upward angle with exaggerated foreshortening, heroic monumental framing
  dynamism: diagonal thrust composition, action-oriented camera angles, cinematic impact
  hierarchy: clear readable silhouettes, bold graphic shapes prioritizing visual impact over detail
  constraint: character *only*
}

CHARACTER_DESIGN: {
  proportions: expressive cartoonish with exaggerated features serving personality over anatomy
  gesture: dynamic poses with exaggerated body language conveying attitude and motion
  readability: clear silhouette design, comic book storytelling conventions
}

TEXTURAL_RENDERING: {
  surfaces: dense line patterns suggesting metal, leather, fabric, stone, organic materials
  weathering: crosshatching patterns for wear, damage, rust, patina effects
  variety: stippling, scribbling, diverse mark-making creating rich visual surface
  constraint: subject *only*
}

BACKGROUND_TREATMENT: {
  pure black
}

MEDIA_AUTHENTICITY: {
  paper_texture: visible throughout composition
  imperfections: organic irregularities and accidents embraced as aesthetic features
  analog_quality: traditional media appearance, hand-drawn character over digital precision
  constraint: subject *only*
}

TECHNICAL_CHARACTERISTICS: {
  linework_foundation: ink establishes all structure before color application
  color_overlay: transparent washes over ink, maintaining underlying linework visibility
  edge_quality: organic hand-drawn curves and ellipses, avoiding perfect digital geometry
  mark_visibility: brushwork direction and media characteristics visible
  constraint: character *only*
}

AESTHETIC_REFERENCES: {moebius, european adventure comics, polished graphic novel album quality, all-ages adventure storytelling sophistication}

FINAL_ASSERTION: **MUST RESEMBLE TRADITIONAL INK-AND-WATERCOLOR COMIC BOOK ILLUSTRATION WITH HAND-DRAWN EUROPEAN BANDE DESSINÉE CHARACTER - NOT DIGITAL ART OR AMERICAN SUPERHERO COMIC STYLE**
`},
  { id: 'dark', label: 'Dark', description: 'Renaissance oil painting & chiaroscuro', prompt: `
STYLE_FOUNDATION: {dark renaissance oil painting, old master technique, baroque dramatic aesthetic, classical portrait merged with dark fantasy}

PAINT_APPLICATION: {
  technique: heavy impasto brushwork, thick tactile paint buildup on highlights
  brushwork: loose gestural strokes, visible directional marks, expressionistic application
  method: alla prima wet-into-wet mixing, organic color transitions
  texture: visible brush texture, rough canvas weave showing through thin layers
  pentimenti: reworked areas and underlying layers visible, contributing to historical layered appearance
  ground: thick dark underlayer showing through in recessed shadow areas
}

LIGHTING_SYSTEM: {
  approach: extreme tenebrism, chiaroscuro with near-total darkness
  source: single warm light (2700K candlelight quality), Rembrandt-style positioning
  distribution: selective illumination on focal areas only, majority of composition in deep shadow
  character: golden luminosity against oppressive void-like darkness
  style_reference: Caravaggio-inspired dramatic spotlighting from darkness
}

COLOR_PALETTE: {
  restriction: severely limited—deep umber, burnt sienna, raw umber, yellow ochre, black dominant
  saturation: heavily muted desaturated, no pure hues, earth tones and neutrals only
  harmony: monochromatic tendencies, narrow spectrum of warm earth tones
  atmosphere: somber melancholic, avoiding any contemporary vibrancy
}

VALUE_STRUCTURE: {
  contrast: extreme dramatic with deep shadow masses occupying majority of composition
  range: compressed middle-to-dark spectrum, minimal highlights reserved for focal sculpture
  distribution: sculptural dimensional form revealed through selective light only
  shadows: transparent thin glazes creating depth through layered transparency
  highlights: thick textural paint buildup contrasting with shadow thinness
}

SURFACE_AGING: {
  patina: aged centuries-old varnish appearance with craquelure cracking patterns
  deterioration: simulated historical artifact weathering and distress
  varnish_layer: unified tonal envelope creating cohesive aged surface
  texture: canvas texture visible, contributing to vintage painting authenticity
}

ATMOSPHERIC_TECHNIQUE: {
  depth: heavy atmospheric perspective through multiple transparent glazing layers
  edges: sfumato softening creating mysterious ambiguous form transitions
  focus: selective sharpness in illuminated zones, atmospheric diffusion in periphery
  negative_space: mysterious void-like backgrounds with minimal compositional detail in shadows
}

COMPOSITIONAL_APPROACH: {
  structure: baroque dramatic with strong diagonal movement and dynamic tension
  focus_strategy: light placement dictates hierarchy, shadow regions maintain minimal detail
  classical_foundation: academic drawing underlayer with loose painterly execution preserving gestural energy
}

MATERIAL_RENDERING: {
  metals: muted oxidized dulled surfaces, no bright specular highlights
  finish: avoiding contemporary glossy appearance, weathered distressed quality throughout
  unity: all materials maintain overall compressed tonal harmony
}

TECHNICAL_CHARACTERISTICS: {
  transparency: thin paint in darks allows ground and canvas to contribute
  opacity: thick impasto in lights creates tactile dimensional buildup
  layering: multiple glaze layers creating depth and richness in shadows
  authenticity: painterly surface maintaining visible hand and tool marks
}

AESTHETIC_REFERENCES: {Rembrandt lighting, Caravaggio tenebrism, classical baroque portraiture, museum-quality old master surface characteristics}

FINAL_ASSERTION: **MUST RESEMBLE AUTHENTIC 17TH CENTURY OLD MASTER OIL PAINTING WITH AGED PATINA AND EXTREME TENEBRISM - NOT CLEAN DIGITAL RENDERING OR CONTEMPORARY PAINTING STYLE**
` },
  { id: 'eastern', label: 'Eastern', description: 'Vibrant watercolor & anime aesthetic', prompt: `
STYLE_FOUNDATION: {traditional watercolor illustration, anime/manga aesthetic merged with western painting, romantic fantasy art, vintage storybook quality}

WATERCOLOR_TECHNIQUE: {
  medium: soft delicate transparent washes, luminous translucent layering
  application: wet-on-wet technique with gentle organic color bleeding at edges
  brushwork: loose painterly visible strokes, flowing directional marks
  paper_interaction: white paper preservation for highlights creating natural luminosity
  texture: visible paper grain throughout contributing to handcrafted traditional media authenticity
  edges: soft gradient transitions, avoiding hard boundaries
  constraint: Subject *only*
}

COLOR_PALETTE: {
  range: pastel—warm golds, soft oranges, creamy yellows, pale blues, subtle lavenders
  undertone: warm peachy beige establishing nostalgic romantic atmosphere throughout
  harmony: complementary warm relationships, vintage illustration color theory
  saturation: gentle muted, avoiding intense saturation
  temperature: warm-dominant with cool accents for depth
  constraint: Subject *only*
}

LINE_ART: {
  technique: confident painted ink outlines defining major forms
  quality: organic hand-drawn character, slight line weight variation for dimensionality
  style: anime/manga conventions—clean readable silhouettes
  integration: lines work with color washes rather than overpowering them
  constraint: Subject *only*
}

LIGHTING_SYSTEM: {
  quality: soft diffused natural light, dreamy ethereal without harsh shadows
  character: golden hour suggestion without dramatic contrast
  distribution: even gentle illumination maintaining light airy composition
  shadows: minimal, suggested through temperature shifts rather than stark value contrast
  constraint: Subject *only*
}

CHARACTER_RENDERING: {
  proportions: idealized anime aesthetic—exaggerated large expressive eyes
  skin: smooth minimal texture, subtle color temperature modulation for form
  hair: flowing directional brushstrokes, volume through color variation not heavy shading
  features: simplified planes, form suggested through warm-cool color shifts
  constraint: Subject *only*
}

MATERIAL_RENDERING: {
  metals: warm reflective tones, soft specularity maintaining overall gentle aesthetic
  fabrics: color shifts and minimal shading, light airy quality preserved
  glass: jewel-like transparent colors with dark leading lines, stained glass aesthetic
  approach: materials suggested through color rather than precise realism
  constraint: Subject *only*
}

DECORATIVE_ELEMENTS: {
  influence: art nouveau ornamental design sensibilities
  integration: decorative patterns rendered in suggestive washes not precise detail
  geometry: softened rigid forms through watercolor bleeding and atmospheric treatment
  constraint: Subject *only*
}

ATMOSPHERIC_DEPTH: {
  perspective: gentle through color temperature cooling and value softening with distance
  focus: soft throughout, avoiding photographic sharp-to-blur gradients
  mood: romantic dreamy maintained consistently across composition
  constraint: Subject *only*
}

VALUE_STRUCTURE: {
  contrast: low, avoiding stark darks—compressed gentle value range
  form: revealed through color temperature modulation not dramatic shadows
  overall_key: high-key luminous, light and airy throughout
  constraint: Subject *only*
}

COMPOSITIONAL_APPROACH: {
  aesthetic: illustration over photorealism, embracing visible traditional media characteristics
  detail_level: suggestive painterly elements rather than precise rendering
  hierarchy: clear readable through color emphasis and decorative framing (stained glass elements)
  constraint: Subject *only*
}

TECHNICAL_CHARACTERISTICS: {
  media_authenticity: visible brushwork, organic watercolor bleeding, paper texture
  edge_quality: soft transitions, wet-on-wet blending visible
  layering: translucent color buildups creating depth through transparency
  whites: strategic paper preservation functioning as highlights and luminosity source
  constraint: Subject *only*
}

AESTHETIC_REFERENCES: {anime/manga character design, art nouveau decorative arts, vintage children's book illustration, contemporary fantasy anime art direction}

FINAL_ASSERTION: **MUST RESEMBLE AUTHENTIC TRADITIONAL WATERCOLOR ILLUSTRATION WITH ANIME CHARACTER DESIGN AND SOFT ROMANTIC AESTHETIC - NOT DIGITAL PAINTING OR HARD-EDGED VECTOR ART**
` }
];

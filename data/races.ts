
import { RaceData } from "../types";

export const RACE_DATA: RaceData[] = [
  {
    "race": "Aarakocra",
    "description": "Avian folk from the Elemental Plane of Air who cherish the freedom of the winds and high altitudes.",
    "visage": "Humanoid bird hybrid, large feathered wings from back, three-clawed taloned hands and feet, sharp beak, large avian eyes, plumage-covered body",
    "modifiers": {
      "Dexterity": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male aarakocra often display brighter plumage and larger wingspans to attract mates during aerial displays.",
        "visage": "Brighter feather colors, larger wings, broader chest, slightly taller stature"
      },
      {
        "gender": "Female",
        "description": "Female aarakocra tend to have more subdued plumage for camouflage while nesting.",
        "visage": "Subdued feather tones, slimmer build, softer beak contours"
      }
    ]
  },
  {
    "race": "Aasimar",
    "description": "Mortals carrying a divine spark from the Upper Planes, often guided by an angelic deva.",
    "visage": "Beautiful humanoid, glowing eyes, metallic skin sheen, unnatural symmetry, ethereal presence, subtle light radiance",
    "modifiers": {
      "Charisma": 2
    },
    "subraces": [
      {
        "subrace": "Protector",
        "description": "Aasimar charged by the powers of good to protect the weak and strike at evil.",
        "visage": "Luminous incorporeal wings from back, eyes shining pure white light, radiant aura",
        "modifiers": {
          "Wisdom": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male protectors exhibit a commanding presence with broader ethereal forms.",
            "visage": "Broader shoulders, stronger jawline, taller average height"
          },
          {
            "gender": "Female",
            "description": "Female protectors radiate a nurturing glow with more graceful features.",
            "visage": "Softer facial contours, curvier silhouette, slightly shorter stature"
          }
        ]
      },
      {
        "subrace": "Scourge",
        "description": "Aasimar who harbor a burning, intense desire to destroy evil with searing light.",
        "visage": "Burning light from eyes and mouth, searing radiance, intense heat-shimmer aura, bright mask-like features",
        "modifiers": {
          "Constitution": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male scourges channel intense energy through a more robust physique.",
            "visage": "Broader build, prominent brow ridges, taller frame"
          },
          {
            "gender": "Female",
            "description": "Female scourges focus their radiance with elegant precision.",
            "visage": "Sleeker form, defined cheekbones, narrower shoulders"
          }
        ]
      },
      {
        "subrace": "Fallen",
        "description": "Aasimar who have been touched by dark powers or turned away from the light.",
        "visage": "Skeletal or shadowy wings, dimmed light, necrotic shroud, haunting features, darkened eyes",
        "modifiers": {
          "Strength": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male fallen aasimar bear a brooding intensity in their shadowed forms.",
            "visage": "Angular jaw, broader shadowed wings, muscular limbs"
          },
          {
            "gender": "Female",
            "description": "Female fallen aasimar exude a haunting allure with subtle darkness.",
            "visage": "Delicate bone structure, flowing shadowy tendrils, slimmer build"
          }
        ]
      }
    ]
  },
  {
    "race": "Bugbear",
    "description": "Bulky goblinoids born for stealth and ambush despite their large, hulking size.",
    "visage": "Large hairy humanoid, goblinoid features, long limbs, bear-like nose, large pointed ears, thick fur covering body",
    "modifiers": {
      "Strength": 2,
      "Dexterity": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male bugbears are typically larger and more imposing to dominate in ambushes.",
        "visage": "Thicker fur, broader shoulders, longer limbs, prominent snout"
      },
      {
        "gender": "Female",
        "description": "Female bugbears use cunning stealth with a slightly leaner frame.",
        "visage": "Sleeker fur patterns, narrower hips, subtler ear size"
      }
    ]
  },
  {
    "race": "Centaur",
    "description": "Nomadic wanderers with the upper bodies of elves or humans and the lower bodies of horses.",
    "visage": "Humanoid torso merging into horse body at waist, four equine legs, hooves, tail, nature-adorned hair",
    "modifiers": {
      "Strength": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male centaurs often lead herds with stronger equine builds for endurance.",
        "visage": "Muscular torso, thicker mane, broader horse shoulders, larger hooves"
      },
      {
        "gender": "Female",
        "description": "Female centaurs nurture the group with more agile forms for swift movement.",
        "visage": "Sleeker equine body, finer tail, softer facial features"
      }
    ]
  },
  {
    "race": "Changeling",
    "description": "Shapeshifters from the Feywild who wear different faces like masks to blend into any society.",
    "visage": "Pale gray skin, white hair, blank features, large dark eyes, undefined facial structure, fluid form, androgynous",
    "modifiers": {
      "Charisma": 2,
      "Choice": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Amorphous",
        "description": "Changelings have fluid physiology allowing them to change biological sex at will, often choosing a default in adolescence.",
        "visage": "Mutable sex traits, androgynous base form, shiftable reproductive features"
      }
    ]
  },
  {
    "race": "Dragonborn",
    "description": "Proud warriors born from dragons, valuing clan and honor above all else.",
    "visage": "Tall humanoid, dragon head, scaled skin, snout, clawed hands, no tail, no wings, reptilian eyes, heavy build",
    "modifiers": {
      "Strength": 2,
      "Charisma": 1
    },
    "subraces": [
      {
        "subrace": "Chromatic",
        "description": "Dragonborn with ancestry linked to the elemental chromatic dragons (black, blue, green, red, white).",
        "visage": "Vibrant red, blue, green, black, or white scales, elemental energy crackling in mouth, sharp aggressive features",
        "modifiers": {},
        "genders": [
          {
            "gender": "Male",
            "description": "Male chromatic dragonborn have nearly identical builds to females with minimal dimorphism.",
            "visage": "Slightly bulkier scales, broader snout, thick neck ridges"
          },
          {
            "gender": "Female",
            "description": "Female chromatic dragonborn lay eggs but nurse young, often having a softer scale texture.",
            "visage": "Smoother scale texture, slightly softer torso contours, similar reptilian build"
          }
        ]
      },
      {
        "subrace": "Metallic",
        "description": "Dragonborn with ancestry linked to the noble metallic dragons (brass, bronze, copper, gold, silver).",
        "visage": "Gleaming gold, silver, bronze, brass, or copper scales, metallic shine, regal bearing",
        "modifiers": {},
        "genders": [
          {
            "gender": "Male",
            "description": "Male metallic dragonborn exhibit regal poise with subtle bulk.",
            "visage": "Heavier scale plating, wider jaw, thick crests"
          },
          {
            "gender": "Female",
            "description": "Female metallic dragonborn maintain elegant forms with brilliant sheen.",
            "visage": "Finer scale sheen, softer torso definition, equivalent stature"
          }
        ]
      },
      {
        "subrace": "Gem",
        "description": "Dragonborn with ancestry linked to the psionic gem dragons (amethyst, crystal, emerald, sapphire, topaz).",
        "visage": "Translucent crystal scales, amethyst, sapphire, emerald, topaz, or crystal hues, floating telekinetic energy points",
        "modifiers": {},
        "genders": [
          {
            "gender": "Male",
            "description": "Male gem dragonborn channel psionic energy through robust crystalline structures.",
            "visage": "Thicker crystal facets, broader crest, minimal dimorphism"
          },
          {
            "gender": "Female",
            "description": "Female gem dragonborn focus telekinesis with sleek gem-like forms.",
            "visage": "Smoother crystal surfaces, softer facets, similar build"
          }
        ]
      }
    ]
  },
  {
    "race": "Dwarf",
    "description": "Short, stout, and hardy folk who carve kingdoms from the roots of mountains and love gold and craft.",
    "visage": "Short stocky humanoid, broad shoulders, thick beard or braided hair, weathered skin, stern expression, hardy thick legs",
    "modifiers": {
      "Constitution": 2
    },
    "subraces": [
      {
        "subrace": "Hill Dwarf",
        "description": "Dwarves with deep intuition and remarkable resilience who live in rolling hills.",
        "visage": "Ruddier skin, deep-set eyes, air of resilience, slightly softer features",
        "modifiers": {
          "Wisdom": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male hill dwarves are resilient craftsmen with traditional bearded appearances.",
            "visage": "Thicker beards, broader shoulders, stockier build"
          },
          {
            "gender": "Female",
            "description": "Female hill dwarves share hardy traits and can grow facial hair, though beard length varies.",
            "visage": "Possible facial hair of varying length, slightly softer cheeks, curvier stocky form"
          }
        ]
      },
      {
        "subrace": "Mountain Dwarf",
        "description": "Strong and martial dwarves who live in high peaks and wear heavy armor.",
        "visage": "Lighter skin, taller than hill cousins, muscular build, warrior braids, calloused hands",
        "modifiers": {
          "Strength": 2
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male mountain dwarves embody martial prowess with imposing physiques.",
            "visage": "Full beards, muscular arms, taller stature"
          },
          {
            "gender": "Female",
            "description": "Female mountain dwarves are fierce warriors who can sport beards.",
            "visage": "Possible beards, strong jawlines, athletic build"
          }
        ]
      },
      {
        "subrace": "Duergar",
        "description": "Grim dwarves of the Underdark, twisted by ancient mind flayer enslavement.",
        "visage": "Ash-gray skin, white hair, enlarged size option, gloomy demeanor, lack of emotion",
        "modifiers": {
          "Strength": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male duergar maintain grim vigilance with sturdy frames.",
            "visage": "Sparse beards, broader gray shoulders, enlarged form"
          },
          {
            "gender": "Female",
            "description": "Female duergar exhibit twisted resilience and may have faint facial hair.",
            "visage": "Rare thin beards, paler skin tones, slimmer enlarged build"
          }
        ]
      }
    ]
  },
  {
    "race": "Elf",
    "description": "Magical people of otherworldly grace, living in the world but not entirely of it.",
    "visage": "Slender tall humanoid, long pointed ears, angular features, high cheekbones, graceful posture, ageless appearance",
    "modifiers": {
      "Dexterity": 2
    },
    "subraces": [
      {
        "subrace": "High Elf",
        "description": "Elves with a keen mind and mastery of wizardry who dwell in magical cities.",
        "visage": "Gold, silver, or pale skin, eyes of blue or green, air of superiority, pristine condition",
        "modifiers": {
          "Intelligence": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male high elves project arcane authority with taller elegant forms.",
            "visage": "Sharper angles, taller height, narrower hips"
          },
          {
            "gender": "Female",
            "description": "Female high elves embody mystical grace with fluid movements.",
            "visage": "Softer curves, high cheekbones, slightly shorter stature"
          }
        ]
      },
      {
        "subrace": "Wood Elf",
        "description": "Elves with keen senses and intuition who live in harmony with the wild forests.",
        "visage": "Copper or tanned skin, hair of brown or green, wilder appearance, rougher texture",
        "modifiers": {
          "Wisdom": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male wood elves are agile hunters with lean muscular builds.",
            "visage": "Broader shoulders, rugged jaw, taller frame"
          },
          {
            "gender": "Female",
            "description": "Female wood elves blend seamlessly with nature's curves.",
            "visage": "Graceful silhouette, softer facial lines, agile form"
          }
        ]
      },
      {
        "subrace": "Drow",
        "description": "Elves banished to the Underdark, known for their adaptation to deep darkness.",
        "visage": "Obsidian black skin, white or pale yellow hair, red or pale purple eyes, sharp predatory features",
        "modifiers": {
          "Charisma": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male drow navigate matriarchal societies with cunning and smaller statures.",
            "visage": "Shorter height, slimmer build, finer features"
          },
          {
            "gender": "Female",
            "description": "Female drow dominate with larger, more imposing physiques in their society.",
            "visage": "Taller stature, stronger frame, broader shoulders"
          }
        ]
      },
      {
        "subrace": "Eladrin",
        "description": "Elves native to the Feywild who change their physical aspect with the seasons.",
        "visage": "Seasonal aspect, shifting colors of autumn leaves, winter frost, spring flowers, or summer sun, vibrant fey energy",
        "modifiers": {
          "Charisma": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male eladrin shift seasons with bold, dynamic expressions.",
            "visage": "Angular jaw, taller seasonal forms, prominent energy auras"
          },
          {
            "gender": "Female",
            "description": "Female eladrin embody seasonal changes with elegant fluidity.",
            "visage": "Curved silhouettes, softer color shifts, graceful postures"
          }
        ]
      },
      {
        "subrace": "Shadar-kai",
        "description": "Elves bound to the Shadowfell and the Raven Queen, often appearing drab and withered.",
        "visage": "Pale gray skin, piercings, tattoos, raven feathers, gloomy shadow aura, mask-like indifference",
        "modifiers": {
          "Constitution": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male shadar-kai endure shadows with stoic, wiry builds.",
            "visage": "Lean muscle, sharp chin, taller withered frame"
          },
          {
            "gender": "Female",
            "description": "Female shadar-kai channel Raven Queen's will with subtle grace.",
            "visage": "Sleek form, defined cheekbones, slightly curvier shadows"
          }
        ]
      },
      {
        "subrace": "Sea Elf",
        "description": "Elves who fell in love with the wild beauty of the ocean.",
        "visage": "Blue or green skin, gills on neck, webbed fingers and toes, fin-like ears",
        "modifiers": {
          "Constitution": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male sea elves patrol depths with powerful swims.",
            "visage": "Broader fins, muscular arms, larger gills"
          },
          {
            "gender": "Female",
            "description": "Female sea elves explore oceans with agile forms.",
            "visage": "Sleeker webbing, softer fin curves, nimble build"
          }
        ]
      },
      {
        "subrace": "Astral Elf",
        "description": "Elves who ventured from the Feywild to the Astral Plane to be closer to their gods.",
        "visage": "Starry gleam in eyes, pale skin, silver hair, subtle divine glow",
        "modifiers": {
          "Choice (Intelligence, Wisdom, Charisma)": 2
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male astral elves seek divine connection with steadfast presence.",
            "visage": "Taller stature, broader starry shoulders, angular features"
          },
          {
            "gender": "Female",
            "description": "Female astral elves commune with gods through ethereal grace.",
            "visage": "Curvier silhouette, softer glow, high cheekbones"
          }
        ]
      }
    ]
  },
  {
    "race": "Fairy",
    "description": "Small folk from the Feywild with insect-like wings and a penchant for trickery.",
    "visage": "Small size, insect wings like butterfly or moth, colorful skin, iridescent glitter, magical aura, floating",
    "modifiers": {
      "Choice1": 2,
      "Choice2": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male fairies flaunt vibrant wings in playful displays.",
        "visage": "Brighter wing patterns, slightly larger wings, bolder colors"
      },
      {
        "gender": "Female",
        "description": "Female fairies weave tricks with delicate iridescence.",
        "visage": "Subtler glitter, sleeker wing shapes, softer hues"
      }
    ]
  },
  {
    "race": "Firbolg",
    "description": "Gentle giant-kin of the forests who prefer to remain unseen guardians of nature.",
    "visage": "Large humanoid, cow-like ears, broad pink nose, gray-blue furred skin, gentle eyes, serene",
    "modifiers": {
      "Wisdom": 2,
      "Strength": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male firbolgs guard forests with imposing yet gentle strength.",
        "visage": "Thicker fur, broader nose, larger ears, muscular frame"
      },
      {
        "gender": "Female",
        "description": "Female firbolgs nurture nature with compassionate forms.",
        "visage": "Softer fur texture, gentler eye shape, curvier build"
      }
    ]
  },
  {
    "race": "Genasi",
    "description": "Humans with an elemental spark passed down from genie heritage.",
    "visage": "Humanoid shape, elemental markings, skin tone reflecting element, glowing lines or texture, exotic features",
    "modifiers": {},
    "subraces": [
      {
        "subrace": "Air Genasi",
        "description": "Genasi descended from the djinn of the Elemental Plane of Air.",
        "visage": "Light blue skin, hair constantly moving as if in breeze, breathy voice hints, swirling patterns",
        "modifiers": {
          "Constitution": 2,
          "Dexterity": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male air genasi flow with winds in sturdy forms.",
            "visage": "Broader swirling patterns, taller height, stronger jaw"
          },
          {
            "gender": "Female",
            "description": "Female air genasi dance on breezes with elegant grace.",
            "visage": "Sleeker hair movement, curvier lines, softer features"
          }
        ]
      },
      {
        "subrace": "Earth Genasi",
        "description": "Genasi descended from the dao of the Elemental Plane of Earth.",
        "visage": "Rocky skin texture, dust or crystal embedded, solid build, deep earth tones, stone-like flesh",
        "modifiers": {
          "Constitution": 2,
          "Strength": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male earth genasi stand firm like mountains with robust builds.",
            "visage": "Thicker crystal embeds, broader stone shoulders, heavier frame"
          },
          {
            "gender": "Female",
            "description": "Female earth genasi embody enduring earth with grounded grace.",
            "visage": "Smoother rocky texture, defined curves, stable posture"
          }
        ]
      },
      {
        "subrace": "Fire Genasi",
        "description": "Genasi descended from the efreet of the Elemental Plane of Fire.",
        "visage": "Red or coal-black skin, hair resembling flames, heat radiating, eyes of fire, brimstone scent",
        "modifiers": {
          "Constitution": 2,
          "Intelligence": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male fire genasi burn fiercely with intense physiques.",
            "visage": "Larger flame hair, broader heat aura, muscular build"
          },
          {
            "gender": "Female",
            "description": "Female fire genasi ignite passions with smoldering elegance.",
            "visage": "Finer flame tendrils, curvier silhouette, radiant eyes"
          }
        ]
      },
      {
        "subrace": "Water Genasi",
        "description": "Genasi descended from the marid of the Elemental Plane of Water.",
        "visage": "Blue or green skin, wet texture, hair floating as if underwater, large black eyes, barnacle accents",
        "modifiers": {
          "Constitution": 2,
          "Wisdom": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male water genasi surge like tides with powerful forms.",
            "visage": "Broader barnacles, larger floating hair, sturdy build"
          },
          {
            "gender": "Female",
            "description": "Female water genasi flow gracefully like ocean currents.",
            "visage": "Sleeker wet texture, softer eye shape, fluid curves"
          }
        ]
      }
    ]
  },
  {
    "race": "Gith",
    "description": "Psionic warriors who rebelled against mind flayer enslavement millennia ago.",
    "visage": "Gaunt humanoid, yellow-green skin, speckled spots, long skull, flat nose, pointed ears, lean muscle",
    "modifiers": {},
    "subraces": [
      {
        "subrace": "Githyanki",
        "description": "Martial gith who reside in the Astral Plane and raid other worlds.",
        "visage": "Aggressive stance, intricate hair braids, lean muscularity, sharp gaze",
        "modifiers": {
          "Strength": 2,
          "Intelligence": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male githyanki raid with psionic might in lean warrior forms.",
            "visage": "Sharper skull elongation, broader speckled shoulders, taller stature"
          },
          {
            "gender": "Female",
            "description": "Female githyanki command raids with focused grace.",
            "visage": "Sleeker pointed ears, curvier lean build, intense eyes"
          }
        ]
      },
      {
        "subrace": "Githzerai",
        "description": "Monastic gith who reside in the chaos of Limbo and discipline their minds.",
        "visage": "Calm demeanor, focused eyes, ascetic appearance, perfectly still posture",
        "modifiers": {
          "Wisdom": 2,
          "Intelligence": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male githzerai meditate in disciplined, wiry bodies.",
            "visage": "Angular flat nose, muscular arms, gaunt frame"
          },
          {
            "gender": "Female",
            "description": "Female githzerai achieve balance with serene forms.",
            "visage": "Softer speckles, graceful posture, slimmer muscles"
          }
        ]
      }
    ]
  },
  {
    "race": "Gnome",
    "description": "Tiny, energetic inventors and tricksters who live underground or in hidden burrows.",
    "visage": "Small humanoid, large head relative to body, pointed ears, wild hair, bright eyes, expressive face, 3 feet tall",
    "modifiers": {
      "Intelligence": 2
    },
    "subraces": [
      {
        "subrace": "Forest Gnome",
        "description": "Gnomes who have a knack for illusion and communicating with small animals.",
        "visage": "Bark-colored skin, hair like leaves or wood, friendly smile, hiding in shadows",
        "modifiers": {
          "Dexterity": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male forest gnomes tinker illusions with curious builds.",
            "visage": "Bushier wild hair, broader ears, stockier small frame"
          },
          {
            "gender": "Female",
            "description": "Female forest gnomes commune with nature in whimsical forms.",
            "visage": "Flowing leaf hair, softer expressive face, curvier proportions"
          }
        ]
      },
      {
        "subrace": "Rock Gnome",
        "description": "Gnomes with a natural inventiveness and hardiness akin to dwarves.",
        "visage": "Hardy build, soot smudges on skin, curious expression, calloused fingers",
        "modifiers": {
          "Constitution": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male rock gnomes invent with sturdy enthusiasm.",
            "visage": "Thicker eyebrows, broader head, muscular arms"
          },
          {
            "gender": "Female",
            "description": "Female rock gnomes craft cleverly with agile hands.",
            "visage": "Finer wild hair, rounder cheeks, sleeker build"
          }
        ]
      },
      {
        "subrace": "Deep Gnome (Svirfneblin)",
        "description": "Guarded gnomes of the Underdark, wary of outsiders and skilled in stealth.",
        "visage": "Gray stone skin, bald head, wiry build, large eyes for darkvision",
        "modifiers": {
          "Dexterity": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male deep gnomes scout Underdark with vigilant frames.",
            "visage": "Wiry muscles, larger darkvision eyes, bald or sparse hair"
          },
          {
            "gender": "Female",
            "description": "Female deep gnomes guard secrets with subtle stealth.",
            "visage": "Smoother gray skin, softer wiry form, minimal hair"
          }
        ]
      }
    ]
  },
  {
    "race": "Goblin",
    "description": "Small, scrappy humanoids who survive by their wits, speed, and numbers.",
    "visage": "Small size, green or yellow skin, large pointed ears, sharp teeth, flat face, wide eyes",
    "modifiers": {
      "Dexterity": 2,
      "Constitution": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male goblins lead scrappy packs with aggressive builds.",
        "visage": "Larger ears, broader flat face, sharper teeth"
      },
      {
        "gender": "Female",
        "description": "Female goblins thrive in numbers with cunning agility.",
        "visage": "Sleeker skin, narrower shoulders, subtler fangs"
      }
    ]
  },
  {
    "race": "Goliath",
    "description": "Strong mountain folk who compete to outdo one another in feats of strength.",
    "visage": "Tall muscular humanoid, gray skin, stone-like lithoderm growths, bald or simple hair, tribal tattoos, 7 feet tall",
    "modifiers": {
      "Strength": 2,
      "Constitution": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male goliaths compete fiercely with massive builds.",
        "visage": "Denser lithoderms, broader shoulders, taller height"
      },
      {
        "gender": "Female",
        "description": "Female goliaths match strength with enduring grace.",
        "visage": "Finer lithoderm patterns, muscular curves, strong jaw"
      }
    ]
  },
  {
    "race": "Grung",
    "description": "Small, poisonous frog-like humanoids who live in strict caste societies.",
    "visage": "Small humanoid frog, sticky skin, large black eyes, webbed hands and feet, bright warning colors",
    "modifiers": {
      "Dexterity": 2,
      "Constitution": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male grung enforce castes with vibrant toxic displays.",
        "visage": "Brighter colors, larger webbed feet, broader throat sac"
      },
      {
        "gender": "Female",
        "description": "Female grung maintain society with subtle poison hues.",
        "visage": "Subtler patterns, sleeker sticky skin, smaller eyes"
      }
    ]
  },
  {
    "race": "Half-Elf",
    "description": "Walkers of two worlds, combining human ambition with elven grace and longevity.",
    "visage": "Humanoid, slightly pointed ears, blends human and elf features, expressive eyes, versatile build, charming",
    "modifiers": {
      "Charisma": 2,
      "Choice of two different": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male half-elves blend heritage with ambitious strength.",
        "visage": "Sharper ear points, broader jaw, taller stature"
      },
      {
        "gender": "Female",
        "description": "Female half-elves harmonize worlds with graceful charm.",
        "visage": "Softer blended features, curvier form, expressive curves"
      }
    ]
  },
  {
    "race": "Half-Orc",
    "description": "Fierce warriors combining orcish strength with human adaptability.",
    "visage": "Tall muscular humanoid, grayish skin, prominent tusks, jutting jaw, scars, intense gaze, savage armor",
    "modifiers": {
      "Strength": 2,
      "Constitution": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male half-orcs charge battles with raw power.",
        "visage": "Larger tusks, broader jutting jaw, muscular bulk"
      },
      {
        "gender": "Female",
        "description": "Female half-orcs fight fiercely with adaptive might.",
        "visage": "Smaller tusks, strong curves, intense build"
      }
    ]
  },
  {
    "race": "Halfling",
    "description": "Small, comfort-loving folk who blend into the background and enjoy simple pleasures.",
    "visage": "Small humanoid, immature proportions, hairy feet, curly hair, friendly round face, 3 feet tall",
    "modifiers": {
      "Dexterity": 2
    },
    "subraces": [
      {
        "subrace": "Lightfoot Halfling",
        "description": "Halflings who can easily hide behind others and are prone to wanderlust.",
        "visage": "Slender build, hiding in shadows, charismatic grin, blending in",
        "modifiers": {
          "Charisma": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male lightfoot halflings wander with charismatic boldness.",
            "visage": "Long sideburns, possibly short beard, broader shoulders"
          },
          {
            "gender": "Female",
            "description": "Female lightfoot halflings blend seamlessly with clever grace.",
            "visage": "Smooth cheeks, no facial hair, softer contours, curvier hips"
          }
        ]
      },
      {
        "subrace": "Stout Halfling",
        "description": "Halflings with dwarven blood, making them sturdier and resistant to poison.",
        "visage": "Broader build, hints of dwarven toughness, ruddy cheeks, thicker hair",
        "modifiers": {
          "Constitution": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male stout halflings endure with dwarven-like resilience.",
            "visage": "Thicker sideburns, stockier frame, ruddy skin"
          },
          {
            "gender": "Female",
            "description": "Female stout halflings thrive comfortably with hardy grace.",
            "visage": "Softer ruddy cheeks, curvier broad build, no beards"
          }
        ]
      },
      {
        "subrace": "Ghostwise Halfling",
        "description": "Rare halflings who speak telepathically and live in isolated clans.",
        "visage": "Intense silent gaze, rare and wild look, sharp awareness",
        "modifiers": {
          "Wisdom": 1
        },
        "genders": [
          {
            "gender": "Male",
            "description": "Male ghostwise halflings communicate silently with vigilant minds.",
            "visage": "Wilder hair, broader round face, muscular small limbs"
          },
          {
            "gender": "Female",
            "description": "Female ghostwise halflings bond clans with intuitive presence.",
            "visage": "Softer gaze, curvier proportions, flowing curls"
          }
        ]
      }
    ]
  },
  {
    "race": "Harengon",
    "description": "Rabbit-folk from the Feywild who embody freedom and travel.",
    "visage": "Humanoid rabbit, long ears, twitching nose, fur covered, powerful legs for jumping, alert posture",
    "modifiers": {
      "Choice1": 2,
      "Choice2": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male harengons hop freely with bold adventures.",
        "visage": "Longer ears, thicker fur, stronger leg muscles"
      },
      {
        "gender": "Female",
        "description": "Female harengons travel swiftly with agile grace.",
        "visage": "Sleeker fur, softer nose twitch, curvier form"
      }
    ]
  },
  {
    "race": "Hobgoblin",
    "description": "Disciplined and martial goblinoids who prize honor and strategic hierarchy.",
    "visage": "Humanoid, orange or red skin, blue nose, sharp teeth, military posture, topknot hair",
    "modifiers": {
      "Constitution": 2,
      "Intelligence": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male hobgoblins lead legions with strategic might.",
        "visage": "Larger blue nose, broader shoulders, sharper fangs"
      },
      {
        "gender": "Female",
        "description": "Female hobgoblins enforce order with disciplined grace.",
        "visage": "Sleeker topknot, narrower build, intense eyes"
      }
    ]
  },
  {
    "race": "Human",
    "description": "The most adaptable and ambitious people, capable of great good or terrible evil.",
    "visage": "Medium humanoid, varied skin tones from dark to pale, varied hair textures, round ears, distinct lack of monstrous features",
    "modifiers": {
      "Strength": 1,
      "Dexterity": 1,
      "Constitution": 1,
      "Intelligence": 1,
      "Wisdom": 1,
      "Charisma": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male humans pursue ambitions with versatile strength.",
        "visage": "Broader shoulders, facial hair possible, taller average height"
      },
      {
        "gender": "Female",
        "description": "Female humans adapt worlds with resilient grace.",
        "visage": "Softer contours, curvier figure, no facial hair"
      }
    ]
  },
  {
    "race": "Kalashtar",
    "description": "Compound beings bound to spirits from the plane of dreams, hunting the Dreaming Dark.",
    "visage": "Humanoid, symmetrical features, glowing psychic eyes, serene expression, subtle telepathic aura, otherworldly grace",
    "modifiers": {
      "Wisdom": 2,
      "Charisma": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male kalashtar bond spirits with steadfast minds.",
        "visage": "Angular symmetry, broader jaw, taller frame"
      },
      {
        "gender": "Female",
        "description": "Female kalashtar harmonize dreams with intuitive presence.",
        "visage": "Softer glowing eyes, curvier silhouette, graceful aura"
      }
    ]
  },
  {
    "race": "Kenku",
    "description": "Flightless bird-folk cursed to speak only in mimicry and devoid of creativity.",
    "visage": "Humanoid raven, black feathers, beak, clawed hands and feet, no wings, hunched posture",
    "modifiers": {
      "Dexterity": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male kenku mimic sounds with vigilant forms.",
        "visage": "Thicker feathers, larger beak, broader clawed shoulders"
      },
      {
        "gender": "Female",
        "description": "Female kenku echo curses with subtle agility.",
        "visage": "Sleeker plumage, smaller claws, softer hunch"
      }
    ]
  },
  {
    "race": "Kobold",
    "description": "Small reptilian trap-makers who claim kinship with dragons and serve them.",
    "visage": "Small lizard-like humanoid, scaled skin, snout, long tail, small horns, wide eyes",
    "modifiers": {
      "Dexterity": 2,
      "Strength": -2
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male kobolds set traps with draconic cunning, showing little difference from females.",
        "visage": "Slightly larger horns, broader snout, minimal dimorphism"
      },
      {
        "gender": "Female",
        "description": "Female kobolds serve dragons with reptilian agility, nearly identical to males.",
        "visage": "Subtler scale patterns, similar build, egg-laying physiology"
      }
    ]
  },
  {
    "race": "Leonin",
    "description": "Proud lion-folk who wander the plains in close-knit prides.",
    "visage": "Humanoid lion, golden fur, mane (if male), feline face, sharp claws, muscular build, regal stance",
    "modifiers": {
      "Constitution": 2,
      "Strength": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male leonin lead prides with majestic roars.",
        "visage": "Full thick mane, broader muscular chest, larger claws"
      },
      {
        "gender": "Female",
        "description": "Female leonin hunt swiftly in unified groups.",
        "visage": "No mane or small, sleeker fur, agile build"
      }
    ]
  },
  {
    "race": "Lizardfolk",
    "description": "Cold and calculating reptilian survivalists from the swamps who consume what they kill.",
    "visage": "Humanoid lizard, green or brown scales, frills or spikes, toothy maw, unblinking yellow eyes, tail",
    "modifiers": {
      "Constitution": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male lizardfolk hunt swamps with primal instinct, hard to distinguish from females.",
        "visage": "Slightly larger spikes, broader tail base, minimal differences"
      },
      {
        "gender": "Female",
        "description": "Female lizardfolk are egg-layers with near-identical appearance to males, showing minimal sexual dimorphism.",
        "visage": "Subtle scale color variations, slightly broader hip structure, similar build"
      }
    ]
  },
  {
    "race": "Loxodon",
    "description": "Serene elephant-folk known for their wisdom and stone-working skills.",
    "visage": "Large humanoid elephant, leathery gray skin, trunk, large tusks, wide flapping ears, thick limbs",
    "modifiers": {
      "Constitution": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male loxodons craft stone with wise strength.",
        "visage": "Larger curved tusks, broader trunk, thicker ears"
      },
      {
        "gender": "Female",
        "description": "Female loxodons embody serenity with gentle might.",
        "visage": "Smaller straight tusks, sleeker leathery skin, curvier limbs"
      }
    ]
  },
  {
    "race": "Minotaur",
    "description": "Strong bull-headed navigators of labyrinths and seas.",
    "visage": "Large humanoid, bull head, horns, furred neck, hooves, muscular torso, looming presence",
    "modifiers": {
      "Strength": 2,
      "Constitution": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male minotaurs charge labyrinths with brute force.",
        "visage": "Larger spiraled horns, thicker furred neck, bulkier torso"
      },
      {
        "gender": "Female",
        "description": "Female minotaurs navigate seas with enduring power.",
        "visage": "Smaller straight horns, sleeker fur, muscular curves"
      }
    ]
  },
  {
    "race": "Orc",
    "description": "Powerful tribal warriors who live by their strength and passion.",
    "visage": "Large muscular humanoid, gray or green skin, prominent tusks, pig-like nose, coarse hair, battle scars",
    "modifiers": {
      "Strength": 2,
      "Constitution": 1,
      "Intelligence": -2
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male orcs raid tribes with ferocious might.",
        "visage": "Larger tusks, broader pig nose, heavier muscle mass"
      },
      {
        "gender": "Female",
        "description": "Female orcs fight passionately with tribal resilience.",
        "visage": "Smaller tusks, strong curves, coarse hair patterns"
      }
    ]
  },
  {
    "race": "Satyr",
    "description": "Fey revelers who resemble men with the legs and horns of goats.",
    "visage": "Humanoid upper body, goat legs, hooves, curved horns, pointed ears, prominent cheekbones",
    "modifiers": {
      "Charisma": 2,
      "Dexterity": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male satyrs revel wildly with boisterous energy.",
        "visage": "Larger curved horns, thicker goat fur, muscular upper body"
      },
      {
        "gender": "Female",
        "description": "Female satyrs dance fey parties with enchanting grace.",
        "visage": "Smaller horns, sleeker legs, curvier torso"
      }
    ]
  },
  {
    "race": "Shifter",
    "description": "Humans with a bestial aspect capable of shifting into a more feral state.",
    "visage": "Humanoid, animalistic features, sideburns, pointed ears, wide eyes, sharp teeth, wild hair",
    "modifiers": {},
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male shifters embrace beast forms with raw power.",
        "visage": "Bushier sideburns, larger sharp teeth, broader animalistic build"
      },
      {
        "gender": "Female",
        "description": "Female shifters shift ferally with instinctive agility.",
        "visage": "Sleeker wild hair, softer pointed ears, curvier features"
      }
    ]
  },
  {
    "race": "Tabaxi",
    "description": "Cat-like humanoids driven by curiosity and a desire for interesting artifacts.",
    "visage": "Humanoid jaguar or leopard, spotted or striped fur, cat head, tail, retractable claws, agile build",
    "modifiers": {
      "Dexterity": 2,
      "Charisma": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male tabaxi prowl curiously with bold strides.",
        "visage": "Thicker striped fur, larger retractable claws, muscular agility"
      },
      {
        "gender": "Female",
        "description": "Female tabaxi hunt artifacts with sleek grace.",
        "visage": "Finer spotted patterns, softer cat features, curvier build"
      }
    ]
  },
  {
    "race": "Tiefling",
    "description": "Humanoids bearing the horns and tail of an infernal legacy.",
    "visage": "Humanoid, horns (ram, gazelle, or bull), thick tail, red or purple skin, solid colored eyes, sharp teeth",
    "modifiers": {
      "Intelligence": 1,
      "Charisma": 2
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male tieflings defy infernal fates with defiant strength.",
        "visage": "Larger bull horns, thicker tail, broader infernal build"
      },
      {
        "gender": "Female",
        "description": "Female tieflings embrace legacies with cunning allure.",
        "visage": "Curved gazelle horns, sleeker skin, curvier figure"
      }
    ]
  },
  {
    "race": "Tortle",
    "description": "Turtle-like adventurers who carry their heavy shell homes on their backs.",
    "visage": "Humanoid turtle, large shell on back, leathery skin, beak-like mouth, claws, thick legs",
    "modifiers": {
      "Strength": 2,
      "Wisdom": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male tortles adventure steadily with protective shells.",
        "visage": "Thicker shell ridges, broader beak, stronger claws"
      },
      {
        "gender": "Female",
        "description": "Female tortles wander wisely with enduring forms.",
        "visage": "Smoother leathery skin, curvier shell, subtler features"
      }
    ]
  },
  {
    "race": "Triton",
    "description": "Aquatic guardians of the deep ocean trenches who fight underwater threats.",
    "visage": "Humanoid, blue or silver skin, fins on calves and forearms, webbed hands, flowing hair with kelp-like texture",
    "modifiers": {
      "Strength": 1,
      "Constitution": 1,
      "Charisma": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male tritons guard depths with vigilant power.",
        "visage": "Larger fins, broader webbed hands, muscular build"
      },
      {
        "gender": "Female",
        "description": "Female tritons defend oceans with graceful might.",
        "visage": "Sleeker kelp hair, curvier fins, agile form"
      }
    ]
  },
  {
    "race": "Warforged",
    "description": "Living constructs built for war, now seeking a purpose in peace.",
    "visage": "Humanoid construct, wood and metal plating, embedded crystal or rune markings, glowing eyes, hinged jaw, reinforced joints",
    "modifiers": {
      "Constitution": 2,
      "Choice": 1
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Asexual",
        "description": "Warforged lack biological sex and may adopt gender identities socially without physical distinctions.",
        "visage": "No dimorphic traits, uniform construct body, absent reproductive features"
      }
    ]
  },
  {
    "race": "Yuan-ti",
    "description": "Serpent-folk who underwent rituals to become more like their snake gods.",
    "visage": "Humanoid, patches of scales, snake-like eyes, forked tongue, serpentine neck or limbs, emotionless gaze",
    "modifiers": {
      "Intelligence": 1,
      "Charisma": 2
    },
    "subraces": [],
    "genders": [
      {
        "gender": "Male",
        "description": "Male yuan-ti scheme coldly with serpentine cunning, showing minimal differences.",
        "visage": "Slightly larger scale patches, broader forked tongue, subtle build variance"
      },
      {
        "gender": "Female",
        "description": "Female yuan-ti are egg-layers nearly identical to males with minimal sexual dimorphism.",
        "visage": "Finer serpentine limbs, slightly narrower scale patterns, similar emotionless facial structure"
      }
    ]
  }
];


import { RACE_DATA } from "../data/races";

export const FANTASY_NAMES = [
  "Voragath the World-Ender",
  "Malakor of the Void",
  "Sylas Soul-Drinker",
  "Kaelthas the Corrupted",
  "Morgorg the Bone-Crusher",
  "Lilith, Mother of Night",
  "Azrael, Angel of Ruin",
  "Nyx Shadow-Weaver",
  "Tharizdun's Avatar",
  "Ignis the Flame-Wreathed",
  "Zarok the Necromancer",
  "Grommash Hellscream",
  "Varian the Undying",
  "Xal'atath the Black Blade"
];

export const FANTASY_DESCRIPTIONS = [
  "A colossal obsidian golem with veins of flowing magma, wielding a jagged greatsword that radiates heat.",
  "A spectral figure cloaked in living shadows, eyes burning with cold blue necrotic fire, levitating above the ground.",
  "A cybernetic necromancer adorned with skulls and neon tubes, fused with ancient dark technology.",
  "A demonic warrior with crimson skin, curved horns, and armor made of dragon bones, surrounded by hellfire.",
  "An angelic justiciar with blackened wings and a halo of broken swords, weeping tears of blood.",
  "A swarm of nanobots forming a muscular humanoid shape, pulsing with malevolent red energy and holding a plasma scythe.",
  "A rotting giant clad in rusted plate armor, wielding a ship's anchor as a flail, surrounded by a cloud of flies.",
  "A beautiful vampire lord in elegant victorian velvet armor, holding a chalice of glowing blood, with bat-like wings folded behind.",
  "A hooded assassin whose body is composed of shifting smoke and daggers, eyes glowing like embers in the dark."
];

export const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomRaceConfiguration = () => {
  const raceEntry = RACE_DATA[Math.floor(Math.random() * RACE_DATA.length)];
  
  let subraceEntry = undefined;
  if (raceEntry.subraces && raceEntry.subraces.length > 0) {
    subraceEntry = raceEntry.subraces[Math.floor(Math.random() * raceEntry.subraces.length)];
  }

  // Determine available genders based on whether a subrace is selected and if it overrides genders
  const availableGenders = subraceEntry?.genders || raceEntry.genders || [];
  let genderEntry = undefined;
  
  if (availableGenders.length > 0) {
    genderEntry = availableGenders[Math.floor(Math.random() * availableGenders.length)];
  }

  return {
    race: raceEntry.race,
    subrace: subraceEntry?.subrace,
    gender: genderEntry?.gender
  };
};

export const rollAbilityScore = (): number => {
  // Generates a value between 1 and 20 (d20 roll)
  return getRandomInt(1, 20);
};

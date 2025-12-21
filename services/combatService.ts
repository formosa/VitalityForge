import { EventLogEntry, CharacterProfile } from '../types';

interface DamageResult {
  finalDelta: number;
  newHp: number;
  modifier: 'immune' | 'resistant' | 'vulnerable' | 'normal';
  originalAmount: number;
}

export const calculateDamage = (
  currentHp: number,
  totalHp: number,
  delta: number,
  subType: string,
  profile: CharacterProfile
): DamageResult => {
  let finalDelta = delta;
  let modifier: 'immune' | 'resistant' | 'vulnerable' | 'normal' = 'normal';
  const originalAmount = Math.abs(delta);

  // Damage Calculation (Standard RPG/D&D 5e Rules)
  if (delta < 0) {
    let dmg = Math.abs(delta);

    if (profile.immunities?.includes(subType)) {
      dmg = 0;
      modifier = 'immune';
    } else {
      if (profile.resistances?.includes(subType)) {
        dmg = Math.floor(dmg / 2);
        modifier = 'resistant';
      }
      if (profile.vulnerabilities?.includes(subType)) {
        dmg = dmg * 2;
        modifier = 'vulnerable';
      }
    }
    finalDelta = -dmg;
  }

  const newHp = Math.max(0, Math.min(totalHp, currentHp + finalDelta));

  return {
    finalDelta,
    newHp,
    modifier,
    originalAmount
  };
};

export const createCombatLog = (
  prevHp: number,
  newHp: number,
  finalDelta: number,
  originalAmount: number,
  subType: string,
  modifier: 'immune' | 'resistant' | 'vulnerable' | 'normal'
): EventLogEntry => {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type: finalDelta > 0 ? 'heal' : 'damage',
    subType: subType,
    amount: Math.abs(finalDelta),
    prevHp: prevHp,
    newHp: newHp,
    originalAmount: originalAmount,
    modifier: modifier
  };
};

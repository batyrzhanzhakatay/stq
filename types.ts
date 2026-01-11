
export type SolubilityStatus = 'Р' | 'М' | 'Н' | '–' | '?' | '';

export interface SolubilityData {
  anion: string;
  results: Record<string, SolubilityStatus>;
}

export interface IonInfo {
  formula: string;
  charge: string;
}

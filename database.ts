import { SolubilityStatus } from './types';

export const LEGEND_DATA: { status: SolubilityStatus; label: string; description: string }[] = [
  { status: 'Р', label: 'Ериді', description: '(>1г/100г)' },
  { status: 'М', label: 'Аз ериді', description: '(0.01-1г/100г)' },
  { status: 'Н', label: 'Ерімейді', description: '(<0.01г/100г)' },
  { status: '–', label: 'Ыдырайды', description: 'Сулы ортада тұрақсыз' },
  { status: '?', label: 'Деректер жоқ', description: 'Сенімді мәлімет жоқ' },
];

export interface SaltDetail {
  name: string;
  formula: string;
  image: string;
  method: string;
  reaction: string;
  description: string;
}

// База данных деталей солей (Н - нерастворимые)
export const SALT_DETAILS_DB: Record<string, SaltDetail> = {
  'Li+PO4 3-': {
    name: 'Литий фосфаты',
    formula: 'Li3PO4',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Литий тұзының ерітіндісін фосфат иондарымен әрекеттестіру:',
    reaction: '3LiCl + Na3PO4 → Li3PO4↓ + 3NaCl',
    description: 'Ақ түсті кристалдық ұнтақ. Суда нашар ериді, бірақ қышқылдарда жақсы ериді.'
  },
  'Ba2+SO4 2-': {
    name: 'Барий сульфаты',
    formula: 'BaSO4',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Барий иондары мен сульфат иондарының реакциясы:',
    reaction: 'BaCl2 + Na2SO4 → BaSO4↓ + 2NaCl',
    description: 'Ақ түсті, ауыр кристалдық зат. Қышқылдар мен суда мүлдем ерімейді деуге болады.',
  },
  'Ag+Cl-': {
    name: 'Күміс хлориді',
    formula: 'AgCl',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Күміс нитраты мен хлоридтердің әрекеттесуі:',
    reaction: 'AgNO3 + NaCl → AgCl↓ + NaNO3',
    description: 'Ақ түсті ірімшік тәрізді тұнба. Жарық әсерінен қараяды.',
  },
  'Pb2+I-': {
    name: 'Қорғасын (II) иодиді',
    formula: 'PbI2',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Қорғасын тұздары мен калий иодидінің реакциясы:',
    reaction: 'Pb(NO3)2 + 2KI → PbI2↓ + 2KNO3',
    description: 'Ашық сары түсті кристалдар. "Алтын жаңбыр" реакциясы ретінде белгілі.',
  },
  'Mg2+OH-': {
    name: 'Магний гидроксиді',
    formula: 'Mg(OH)2',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Магний тұздарының сілтілермен әрекеттесуі:',
    reaction: 'MgCl2 + 2NaOH → Mg(OH)2↓ + 2NaCl',
    description: 'Ақ түсті тұнба. Антиацидтік қасиеттері бар.',
  },
  'Ca2+CO3 2-': {
    name: 'Кальций карбонаты',
    formula: 'CaCO3',
    image: 'https://images2.imgbox.com/71/6a/949ArOXg_o.jpg',
    method: 'Әк суы арқылы көмірқышқыл газын жіберу:',
    reaction: 'Ca(OH)2 + CO2 → CaCO3↓ + H2O',
    description: 'Ақ түсті бор немесе мәрмәрдің негізгі құрамдас бөлігі.',
  }
};

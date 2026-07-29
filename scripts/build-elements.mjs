// Builds src/data/elements.json from:
//  - scripts/raw/bowserinator.json  (Periodic-Table-JSON, CC-BY-SA)
//  - scripts/raw/pubchem.json       (PubChem periodic table, public domain)
//  - SUPPLEMENTAL below             (hand-compiled mechanical/transport data)
// Run: npm run data

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Per atomic number: [thermalConductivity W/(m·K), electricalConductivity MS/m,
// Mohs hardness, Young's modulus GPa, covalent radius pm]. null = unknown.
const SUPPLEMENTAL = {
  1: [0.1805, null, null, null, 31],
  2: [0.1513, null, null, null, 28],
  3: [84.8, 10.8, 0.6, 4.9, 128],
  4: [200, 25, 5.5, 287, 96],
  5: [27.4, null, 9.3, null, 84],
  6: [140, null, 10, null, 76],
  7: [0.02583, null, null, null, 71],
  8: [0.02658, null, null, null, 66],
  9: [0.0277, null, null, null, 57],
  10: [0.0491, null, null, null, 58],
  11: [142, 21, 0.5, 10, 166],
  12: [156, 22.7, 2.5, 45, 141],
  13: [237, 37.7, 2.75, 70, 121],
  14: [149, null, 6.5, null, 111],
  15: [0.236, null, null, null, 107],
  16: [0.205, null, 2.0, null, 105],
  17: [0.0089, null, null, null, 102],
  18: [0.01772, null, null, null, 106],
  19: [102.5, 13.9, 0.4, 3.5, 203],
  20: [201, 29.8, 1.75, 20, 176],
  21: [15.8, 1.8, null, 74.4, 170],
  22: [21.9, 2.38, 6.0, 116, 160],
  23: [30.7, 5.0, 6.7, 128, 153],
  24: [93.9, 7.9, 8.5, 279, 139],
  25: [7.81, 0.62, 6.0, 198, 139],
  26: [80.4, 10.0, 4.0, 211, 132],
  27: [100, 17.2, 5.0, 209, 126],
  28: [90.9, 14.3, 4.0, 200, 124],
  29: [401, 59.6, 3.0, 130, 132],
  30: [116, 16.9, 2.5, 108, 122],
  31: [40.6, 7.1, 1.5, 9.8, 122],
  32: [60.2, null, 6.0, 103, 120],
  33: [50.2, 3.3, 3.5, 8, 119],
  34: [0.519, null, 2.0, 10, 120],
  35: [0.122, null, null, null, 120],
  36: [0.00943, null, null, null, 116],
  37: [58.2, 8.3, 0.3, 2.4, 220],
  38: [35.4, 7.7, 1.5, 15.7, 195],
  39: [17.2, 1.8, null, 63.5, 190],
  40: [22.6, 2.4, 5.0, 88, 175],
  41: [53.7, 6.7, 6.0, 105, 164],
  42: [138, 18.7, 5.5, 329, 154],
  43: [50.6, null, null, null, 147],
  44: [117, 13.7, 6.5, 447, 146],
  45: [150, 21.1, 6.0, 380, 142],
  46: [71.8, 9.26, 4.75, 121, 139],
  47: [429, 63.0, 2.5, 83, 145],
  48: [96.6, 13.8, 2.0, 50, 144],
  49: [81.8, 11.6, 1.2, 11, 142],
  50: [66.8, 9.17, 1.5, 50, 139],
  51: [24.4, 2.5, 3.0, 55, 139],
  52: [3.0, null, 2.25, 43, 138],
  53: [0.449, null, null, null, 139],
  54: [0.00565, null, null, null, 140],
  55: [35.9, 5.0, 0.2, 1.7, 244],
  56: [18.4, 2.9, 1.25, 13, 215],
  57: [13.4, 1.6, 2.5, 36.6, 207],
  58: [11.3, 1.15, 2.5, 33.6, 204],
  59: [12.5, 1.4, null, 37.3, 203],
  60: [16.5, 1.6, null, 41.4, 201],
  61: [17.9, null, null, null, 199],
  62: [13.3, 1.06, null, 49.7, 198],
  63: [13.9, 1.1, null, 18.2, 198],
  64: [10.6, 0.77, null, 54.8, 196],
  65: [11.1, 0.87, null, 55.7, 194],
  66: [10.7, 1.08, null, 61.4, 192],
  67: [16.2, 1.1, null, 64.8, 192],
  68: [14.5, 1.17, null, 69.9, 189],
  69: [16.9, 1.4, null, 74.0, 190],
  70: [38.5, 3.6, null, 23.9, 187],
  71: [16.4, 1.85, null, 68.6, 187],
  72: [23.0, 3.0, 5.5, 78, 175],
  73: [57.5, 7.6, 6.5, 186, 170],
  74: [173, 18.9, 7.5, 411, 162],
  75: [48.0, 5.2, 7.0, 463, 151],
  76: [87.6, 12.3, 7.0, 550, 144],
  77: [147, 21.3, 6.5, 528, 141],
  78: [71.6, 9.43, 3.5, 168, 136],
  79: [318, 45.2, 2.5, 78, 136],
  80: [8.3, 1.04, null, null, 132],
  81: [46.1, 6.7, 1.2, 8, 145],
  82: [35.3, 4.8, 1.5, 16, 146],
  83: [7.97, 0.77, 2.25, 32, 148],
  84: [20, null, null, null, 140],
  85: [null, null, null, null, 150],
  86: [0.00361, null, null, null, 150],
  87: [null, null, null, null, 260],
  88: [18.6, null, null, null, 221],
  89: [12, null, null, null, 215],
  90: [54.0, 6.5, 3.0, 79, 206],
  91: [47, null, null, null, 200],
  92: [27.5, 3.6, 6.0, 208, 196],
  93: [6.3, 0.82, null, null, 190],
  94: [6.74, 0.67, null, 96, 187],
  95: [10, null, null, null, 180],
  96: [null, null, null, null, 169],
};

const CATEGORY_MAP = [
  ['alkali metal', 'alkali'],
  ['alkaline earth metal', 'alkaline'],
  ['transition metal', 'transition'],
  ['post-transition metal', 'postTransition'],
  ['metalloid', 'metalloid'],
  ['diatomic nonmetal', 'nonmetal'],
  ['polyatomic nonmetal', 'nonmetal'],
  ['noble gas', 'nobleGas'],
  ['lanthanide', 'lanthanide'],
  ['actinide', 'actinide'],
];
const HALOGENS = new Set(['F', 'Cl', 'Br', 'I', 'At']);

function categoryKey(raw, symbol) {
  if (HALOGENS.has(symbol)) return 'halogen';
  for (const [needle, key] of CATEGORY_MAP) {
    if (raw === needle) return key;
  }
  return 'unknown';
}

const bows = JSON.parse(readFileSync(join(root, 'scripts/raw/bowserinator.json'), 'utf8')).elements;
const pub = JSON.parse(readFileSync(join(root, 'scripts/raw/pubchem.json'), 'utf8')).Table;
const pubCols = pub.Columns.Column;
const pubByZ = new Map(
  pub.Row.map((r) => {
    const o = {};
    pubCols.forEach((c, i) => (o[c] = r.Cell[i]));
    return [Number(o.AtomicNumber), o];
  })
);

const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const out = bows
  .filter((e) => e.number >= 1 && e.number <= 118)
  .map((e) => {
    const p = pubByZ.get(e.number) ?? {};
    const s = SUPPLEMENTAL[e.number] ?? [null, null, null, null, null];
    const mass = num(e.atomic_mass);
    const neutrons = mass !== null ? Math.round(mass) - e.number : null;
    return {
      z: e.number,
      symbol: e.symbol,
      name: e.name,
      category: categoryKey(e.category, e.symbol),
      period: e.period ?? null,
      group: e.group ?? null,
      xpos: e.xpos,
      ypos: e.ypos,
      phase: e.phase ?? null,
      summary: e.summary ?? null,
      discoveredBy: e.discovered_by ?? null,
      yearDiscovered: p.YearDiscovered ?? null,
      mass,
      neutrons,
      shells: e.shells ?? [],
      ecFull: e.electron_configuration ?? null,
      ecSemantic: e.electron_configuration_semantic ?? null,
      electronegativity: num(e.electronegativity_pauling),
      ionizationEnergy: num(e.ionization_energies?.[0]),
      electronAffinity: num(e.electron_affinity),
      oxidationStates: p.OxidationStates || null,
      atomicRadius: num(p.AtomicRadius),
      covalentRadius: s[4],
      density: num(e.density),
      densityUnit: e.phase === 'Gas' ? 'g/L' : 'g/cm³',
      melt: num(e.melt),
      boil: num(e.boil),
      molarHeat: num(e.molar_heat),
      thermalConductivity: s[0],
      electricalConductivity: s[1],
      mohs: s[2],
      youngs: s[3],
    };
  })
  .sort((a, b) => a.z - b.z);

if (out.length !== 118) throw new Error(`expected 118 elements, got ${out.length}`);
for (const el of out) {
  if (!el.shells.length) throw new Error(`element ${el.symbol} has no shells`);
  if (el.shells.reduce((a, b) => a + b, 0) !== el.z)
    throw new Error(`element ${el.symbol}: shell sum != Z`);
  if (!el.xpos || !el.ypos) throw new Error(`element ${el.symbol} missing table position`);
}

mkdirSync(join(root, 'src/data'), { recursive: true });
writeFileSync(join(root, 'src/data/elements.json'), JSON.stringify(out));
console.log(`wrote src/data/elements.json (${out.length} elements)`);

import type { CategoryKey } from './types';

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  alkali: 'Alkali metal',
  alkaline: 'Alkaline earth metal',
  transition: 'Transition metal',
  postTransition: 'Post-transition metal',
  metalloid: 'Metalloid',
  nonmetal: 'Reactive nonmetal',
  halogen: 'Halogen',
  nobleGas: 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Unknown properties',
};

export const CATEGORY_COLOR: Record<CategoryKey, number> = {
  alkali: 0xff6b6b,
  alkaline: 0xffa94d,
  transition: 0xffd43b,
  postTransition: 0x63e6be,
  metalloid: 0xa9e34b,
  nonmetal: 0x51cf66,
  halogen: 0x66d9e8,
  nobleGas: 0x74c0fc,
  lanthanide: 0xb197fc,
  actinide: 0xf783ac,
  unknown: 0xadb5bd,
};

export const MONO_TILE_COLOR = 0xd6d6dc;
export const MONO_ACCENT = 0x7fd4ff;

import { CATEGORY_COLOR } from './categories';
import type { CategoryKey } from './types';

/** Shorter than CATEGORY_LABEL: these have to fit inside a legend column. */
const LEGEND_LABEL: Record<CategoryKey, string> = {
  alkali: 'Alkali metal',
  alkaline: 'Alkaline earth',
  transition: 'Transition metal',
  postTransition: 'Post-transition',
  metalloid: 'Metalloid',
  nonmetal: 'Reactive nonmetal',
  halogen: 'Halogen',
  nobleGas: 'Noble gas',
  lanthanide: 'Lanthanoid',
  actinide: 'Actinoid',
  unknown: 'Unknown',
};

interface LegendGroup {
  title: string;
  /** each entry is one column; an array of keys stacks them in that column */
  columns: Array<CategoryKey | CategoryKey[]>;
}

const GROUPS: LegendGroup[] = [
  {
    title: 'Metals',
    columns: ['alkali', 'alkaline', ['lanthanide', 'actinide'], 'transition', 'postTransition'],
  },
  { title: 'Metalloids', columns: ['metalloid'] },
  { title: 'Nonmetals', columns: ['nonmetal', 'halogen', 'nobleGas'] },
];

const hex = (key: CategoryKey) => `#${CATEGORY_COLOR[key].toString(16).padStart(6, '0')}`;

/**
 * Category key, grouped the way the periodic table itself is grouped. Built
 * from CATEGORY_COLOR so the swatches can never drift from the tile colours.
 */
export function buildLegend(container: HTMLElement): void {
  container.innerHTML = GROUPS.map((group) => {
    const columns = group.columns
      .map((col) => {
        if (Array.isArray(col)) {
          const cells = col
            .map(
              (key) =>
                `<div class="lg-cat" style="background:${hex(key)}"><span>${
                  LEGEND_LABEL[key]
                }</span></div>`
            )
            .join('');
          return `<div class="lg-stack">${cells}</div>`;
        }
        return `<div class="lg-cat" style="background:${hex(col)}"><span>${
          LEGEND_LABEL[col]
        }</span></div>`;
      })
      .join('');
    return `<div class="lg-group"><div class="lg-title">${group.title}</div><div class="lg-row">${columns}</div></div>`;
  }).join('');
}

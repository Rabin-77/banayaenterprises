import type { Product } from '../types';

export const CANONICAL_PRODUCT_ORDER: readonly string[] = [
  'pure-honey',
  'magarantha-thean',
  'malai-thean',
  'mixed-nuts',
  'honey-amla',
  'gulkand',
  'karuppukavani-kanji',
  'mudavatukal-soup',
  'murungai-leaf-powder',
  'curry-leaf-powder',
  'natural-soap',
  'desi-cow-ghee',
  'abc-malt'
];

const ORDER_INDEX_MAP = new Map<string, number>(
  CANONICAL_PRODUCT_ORDER.map((id, idx) => [id, idx])
);

/**
 * Sorts products so any newly added custom admin products stay first (in their array order),
 * while the 13 core catalog products always follow the exact canonical catalog order.
 */
export function sortCatalogByCanonicalOrder<T extends Pick<Product, 'id'>>(items: T[]): T[] {
  return items
    .map((item, originalIdx) => ({ item, originalIdx }))
    .sort((a, b) => {
      const rankA = ORDER_INDEX_MAP.get(a.item.id);
      const rankB = ORDER_INDEX_MAP.get(b.item.id);

      if (rankA !== undefined && rankB !== undefined) {
        return rankA - rankB;
      }
      // Custom admin-added products stay ahead of standard catalog items in original order
      if (rankA === undefined && rankB !== undefined) return -1;
      if (rankA !== undefined && rankB === undefined) return 1;
      return a.originalIdx - b.originalIdx;
    })
    .map(({ item }) => item);
}

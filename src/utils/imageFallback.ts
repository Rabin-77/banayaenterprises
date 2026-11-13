import React from 'react';
import { Product } from '../types';

const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  'pure-honey': '/images/banaya_honey.jpg',
  'magarantha-thean': '/images/natural_honey_jar.jpg',
  'malai-thean': '/images/malai_thean_bottle.jpg',
  'gulkand': '/images/banaya_rose_gulkand.jpg',
  'honey-amla': '/images/banaya_amla.webp',
  'mixed-nuts': '/assets/aistudio/3_de51924a.png',
  'abc-malt': '/images/abc_malt_front.jpg',
  'desi-cow-ghee': '/assets/aistudio/2_4b4979ee.png',
  'natural-soap': '/assets/aistudio/3_2e9e6c51.png',
  'mudavatukal-soup': '/images/mudavatukal_soup_front.jpeg',
  'karuppukavani-kanji': '/images/karuppu_kavuni_kanji_front.jpg',
  'curry-leaf-powder': '/images/curry_leaf_pouch_front.jpg',
  'murungai-leaf-powder': '/images/murungai_pouch_front.jpg'
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'honey-sweeteners': '/images/banaya_honey.jpg',
  'health-drinks': '/images/abc_malt_front.jpg',
  'herbal-powders': '/images/murungai_pouch_front.jpg',
  'ghee-foods': '/assets/aistudio/2_4b4979ee.png',
  'nuts-dryfruits': '/assets/aistudio/3_de51924a.png',
  'traditional-wellness': '/images/banaya_amla.webp',
  'herbal-products': '/assets/aistudio/3_2e9e6c51.png'
};

export function getFallbackProductImage(
  product?: Pick<Product, 'id' | 'categorySlug'> | null
): string {
  if (!product) return '/images/banaya_logo.png';
  return (
    PRODUCT_FALLBACK_IMAGES[product.id] ||
    CATEGORY_FALLBACK_IMAGES[product.categorySlug] ||
    '/images/banaya_logo.png'
  );
}

export function isLocalAssetImage(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith('/images/') ||
    src.startsWith('/assets/') ||
    src.startsWith('/uploads/') ||
    src.startsWith('data:image/')
  );
}

export function handleProductImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  product?: Pick<Product, 'id' | 'categorySlug'> | null
): void {
  const img = event.currentTarget;
  const fallback = getFallbackProductImage(product);

  if (img.dataset.fallbackStage === 'done') {
    return;
  }

  if (img.dataset.fallbackStage !== 'primary' && img.getAttribute('src') !== fallback) {
    img.dataset.fallbackStage = 'primary';
    img.src = fallback;
    return;
  }

  img.dataset.fallbackStage = 'done';
  img.src = '/images/banaya_logo.png';
}

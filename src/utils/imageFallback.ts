import React from 'react';
import { Product } from '../types';

const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  'pure-honey': '/images/banaya_honey.jpg',
  'magarantha-thean': '/images/natural_honey_jar.jpg',
  'malai-thean': '/images/malai_thean_bottle.jpg',
  'mixed-nuts': '/assets/aistudio/2_6b73aea0.png',
  'honey-amla': '/images/banaya_amla.webp',
  'gulkand': '/assets/aistudio/3_6493340b.png',
  'karuppukavani-kanji': '/images/karuppu_kavuni_kanji_front.jpg',
  'mudavatukal-soup': '/images/mudavatukal_soup_front.jpeg',
  'murungai-leaf-powder': '/images/murungai_pouch_front.jpg',
  'curry-leaf-powder': '/images/curry_leaf_pouch_front.jpg',
  'natural-soap': '/assets/aistudio/3_2e9e6c51.png',
  'desi-cow-ghee': '/assets/aistudio/2_4b4979ee.png',
  'abc-malt': '/images/abc_malt_front.jpg'
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'honey-sweeteners': '/images/banaya_honey.jpg',
  'health-drinks': '/images/abc_malt_front.jpg',
  'herbal-powders': '/images/murungai_pouch_front.jpg',
  'ghee-foods': '/assets/aistudio/2_4b4979ee.png',
  'nuts-dryfruits': '/assets/aistudio/2_6b73aea0.png',
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

export function isBrokenLegacyUpload(src?: string): boolean {
  if (!src || typeof src !== 'string') return true;
  const trimmed = src.trim();
  if (!trimmed) return true;
  // Previous wiped /uploads/1-179456* files no longer exist on disk
  return trimmed.startsWith('/uploads/1-179456');
}

export function healLegacyProductImages(product: Product): Product {
  const fallbackImg = getFallbackProductImage(product);
  const healedImage = isBrokenLegacyUpload(product.image) ? fallbackImg : product.image;

  const rawGallery = Array.isArray(product.gallery) ? product.gallery : [];
  const validGallery = rawGallery
    .filter((img) => typeof img === 'string' && !isBrokenLegacyUpload(img))
    .map((img) => img.trim());

  const mergedGallery = validGallery.includes(healedImage)
    ? [healedImage, ...validGallery.filter((img) => img !== healedImage)]
    : [healedImage, ...validGallery];

  if (
    healedImage === product.image &&
    mergedGallery.length === rawGallery.length &&
    mergedGallery.every((img, idx) => img === rawGallery[idx])
  ) {
    return product;
  }

  return {
    ...product,
    image: healedImage,
    gallery: mergedGallery
  };
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

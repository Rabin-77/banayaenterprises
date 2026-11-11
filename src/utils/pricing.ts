import { Product } from '../types';

export function getPriceForProductWeight(product: Product, selectedWeight?: string) {
  const targetWeight = selectedWeight || product.defaultWeight;

  if (targetWeight === product.defaultWeight) {
    return {
      price: product.price,
      original: product.originalPrice
    };
  }

  let multiplier = 1;

  if (product.defaultWeight === '500g' || product.defaultWeight === '500ml') {
    if (targetWeight === '250g' || targetWeight === '250ml') multiplier = 0.55;
    else if (targetWeight === '1kg' || targetWeight === '1 Litre') multiplier = 1.9;
  } else if (product.defaultWeight === '250g') {
    if (targetWeight === '500g') multiplier = 1.9;
    else if (targetWeight === '1kg') multiplier = 3.6;
    else if (targetWeight === '100g') multiplier = 0.5;
  } else if (product.defaultWeight === '100g') {
    if (targetWeight === '200g' || targetWeight === '250g' || targetWeight.includes('Pack of 2')) multiplier = 1.9;
    else if (targetWeight === '500g' || targetWeight.includes('Pack of 5')) multiplier = 4.5;
    else if (targetWeight.includes('Pack of 3')) multiplier = 2.8;
  } else if (product.defaultWeight === '400ml') {
    if (targetWeight === '1 Litre' || targetWeight === '1L') multiplier = 2.35;
    else if (targetWeight === '200ml' || targetWeight === '250ml') multiplier = 0.65;
  } else {
    if (targetWeight.includes('1kg') || targetWeight.includes('1 Litre')) multiplier = 1.9;
    else if (targetWeight.includes('250g') || targetWeight.includes('100g')) multiplier = 0.55;
    else if (targetWeight.includes('Pack of 3')) multiplier = 2.7;
    else if (targetWeight.includes('Pack of 5')) multiplier = 4.2;
  }

  return {
    price: Math.round(product.price * multiplier),
    original: Math.round(product.originalPrice * multiplier)
  };
}

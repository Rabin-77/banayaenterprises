import { Ingredient } from '../types';

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'honey',
    name: 'Raw Forest Honey',
    tamilName: 'சுத்தமான மலைத்தேன்',
    description: 'Directly sourced from high-altitude wild bee hives in deep Western Ghats forests without heat processing or micro-filtration.',
    benefits: ['Rich in living active enzymes', 'Natural antiviral & antibacterial', 'Zero artificial invert syrups'],
    image: '/images/banaya_honey.jpg',
    featuredIn: ['Honey', 'Magarantha Thean', 'Malai Thean', 'Gulkand', 'Honey Amla']
  },
  {
    id: 'amla',
    name: 'Mountain Amla',
    tamilName: 'காட்டு நெல்லிக்காய்',
    description: 'Hand-harvested wild Indian gooseberries with twenty times more natural Vitamin C than citrus fruits.',
    benefits: ['Highest natural Vitamin C', 'Potent hair & skin tonic', 'Deep cellular rejuvenator'],
    image: '/images/banaya_amla.webp',
    featuredIn: ['Honey Amla']
  },
  {
    id: 'rose',
    name: 'Damask Rose & Gulkand',
    tamilName: 'பன்னீர் ரோஜா இதழ்கள்',
    description: 'Fragrant indigenous Chaiti Gulab petals sun-cured with forest honey for deep Pitta pacification and cooling.',
    benefits: ['Natural body coolant', 'Soothes acidity & acid reflux', 'Nourishes youthful skin glow'],
    image: '/images/banaya_rose_gulkand.jpg',
    featuredIn: ['Rose Gulkand']
  },
  {
    id: 'nuts',
    name: 'Royal Nuts & Seeds',
    tamilName: 'ராயல் பருப்புகள்',
    description: 'Crisp Kashmiri almonds, Goan jumbo cashews, and rich walnuts brimming with heart-protective omega fatty acids.',
    benefits: ['Clean plant protein', 'Brain-nourishing Omega-3s', 'Zero trans fat & zero sodium'],
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=500&q=80',
    featuredIn: ['Mixed Nuts', 'ABC Malt']
  },
  {
    id: 'dates',
    name: 'Natural Dates & Palms',
    tamilName: 'பேரீச்சம்பழம் & பனை வெல்லம்',
    description: 'Sun-dried premium Arabian dates and wood-boiled country palm jaggery used as wholesome natural sweeteners.',
    benefits: ['Abundant natural iron', 'Smooth digestive fiber', 'Zero refined chemicals'],
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=500&q=80',
    featuredIn: ['ABC Malt', 'Karupppukavani Kanji']
  },
  {
    id: 'traditional-grains',
    name: 'Traditional Grains',
    tamilName: 'பாரம்பரிய சிறுதானியங்கள்',
    description: 'Ancient heirloom black rice (Karuppu Kavuni) and sprouted finger millets (Ragi) revered for unmatched nutritional density.',
    benefits: ['Anthocyanin rich antioxidants', 'Low glycemic index', 'High bone-building calcium'],
    image: '/images/karuppu_kavuni_kanji_front.jpg',
    featuredIn: ['Karupppukavani Kanji', 'ABC Malt']
  },
  {
    id: 'herbs',
    name: 'Sacred Herbs & Roots',
    tamilName: 'அரிய மூலிகைகள்',
    description: 'Vetiver, Avarampoo, Mudavatukal, Tulsi, and Neem gathered ethically from traditional rural herb gatherers.',
    benefits: ['Anti-inflammatory defense', 'Natural cooling body balance', 'Authentic Siddha heritage'],
    image: '/images/mudavatukal_soup_front.jpeg',
    featuredIn: ['Mudavatukal Soup Mix', 'Natural Soap']
  },
  {
    id: 'turmeric',
    name: 'Pure Golden Turmeric',
    tamilName: 'இயற்கை மஞ்சள்',
    description: 'Traditional native turmeric rhizomes rich in natural curcumin for immunity, inflammation support, and daily wellness.',
    benefits: ['Natural anti-inflammatory', 'Immunity booster & vitality', 'Time-tested herbal tradition'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    featuredIn: ['Mudavatukal Soup Mix', 'Natural Soap']
  },
  {
    id: 'coconut',
    name: 'Virgin Coconut Oil',
    tamilName: 'மரச்செக்கு தேங்காய் எண்ணெய்',
    description: 'Cold-pressed from fresh farm copras using traditional Vaagai wood chekku without chemical refining or heat.',
    benefits: ['Lauric acid rich hydration', 'Deep skin barrier repair', 'Natural antimicrobial'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    featuredIn: ['Natural Soap']
  },
  {
    id: 'moringa-curry-leaves',
    name: 'Moringa & Curry Leaves',
    tamilName: 'முருங்கை & கறிவேப்பிலை',
    description: 'Farm-fresh native drumstick leaves and aromatic curry foliage shade-dried under hygienic conditions to preserve vital bio-active minerals.',
    benefits: ['Natural plant iron & calcium', 'Nourishes hair roots & stamina', 'High plant antioxidant power'],
    image: '/images/murungai_pouch_front.jpg',
    featuredIn: ['Curry Leaf Powder', 'Murungai Leaf Powder']
  }
];

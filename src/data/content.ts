import { Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Priya Soundararajan',
    rating: 5,
    title: 'The Malai Thean and Mudavatukal Soup are extraordinary!',
    comment: 'I have been searching for authentic wild forest honey for years. The Malai Thean from Banaya Enterprises has that unmistakable raw floral aroma and thickness you only get from high hills. We also tried their Mudavatukal Soup Mix for joint flexibility, and the results are truly wonderful. 100% genuine products!',
    date: '2 weeks ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    location: 'Chennai, Tamil Nadu',
    productName: 'Malai Thean & Mudavatukal Soup Mix'
  },
  {
    id: 'rev-2',
    author: 'Dr. Anand Ramanathan',
    rating: 5,
    title: 'Unbelievable aroma in the Desi Cow Ghee',
    comment: 'As an Ayurvedic practitioner, I test ghee quality closely. Banayana Enterprise\'s A2 Bilona Ghee has true granular texture, deep golden amber color, and the rich cultured aroma of real Gaushala preparation. It elevates every meal and is wonderful for digestive health.',
    date: '1 month ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Coimbatore, Tamil Nadu',
    productName: 'Pure Desi Cow Ghee'
  },
  {
    id: 'rev-3',
    author: 'Meenakshi Sundaram',
    rating: 5,
    title: 'ABC Malt transformed my kids’ morning routine',
    comment: 'My children used to reject commercial chocolate powders once I checked their sugar labels. ABC Malt has been a godsend! Real beetroot, apple, carrot with sprouted grains and naatu sakkarai. They finish a warm glass in minutes and feel energized throughout school hours.',
    date: '3 weeks ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    location: 'Bengaluru, Karnataka',
    productName: 'ABC Malt'
  },
  {
    id: 'rev-4',
    author: 'Karthik Venkatesh',
    rating: 5,
    title: 'Mudakathan Soup worked wonders for morning stiffness',
    comment: 'I play badminton on weekends and was struggling with knee soreness. Having a hot cup of Mudakathan Soup daily has made a noticeable difference in my flexibility. The peppery taste is delicious, warming, and comforting. Ordering my second pack already!',
    date: '1 week ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    location: 'Madurai, Tamil Nadu',
    productName: 'Mudakathan Soup'
  },
  {
    id: 'rev-5',
    author: 'Shalini Nambiar',
    rating: 5,
    title: 'The Gulkand & Honey Amla are pure nostalgia',
    comment: 'The Damask rose petal Gulkand cured in the sun tastes just like the traditional recipe my grandmother used to make in ceramic jars. It cools the stomach instantly during hot summer days. The packaging arrived securely wrapped with eco-friendly materials.',
    date: 'Just recently',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Kochi, Kerala',
    productName: 'Gulkand & Honey Amla'
  }
];

export const WHY_CHOOSE_US = [
  {
    id: 'natural-ingredients',
    title: 'Natural Ingredients',
    description: 'Thoughtfully selected, 100% natural raw materials harvested responsibly from bio-diverse native reserves and certified partner farms.',
    iconName: 'Leaf'
  },
  {
    id: 'traditional-recipes',
    title: 'Traditional Recipes',
    description: 'Authentic formulas inspired by ancestral Siddha, Ayurvedic, and traditional South Indian culinary and wellness heritage.',
    iconName: 'Sparkles'
  },
  {
    id: 'quality-trust',
    title: 'Quality You Can Trust',
    description: 'Every batch undergoes rigorous quality checks, lab testing for heavy metals and purity, with zero chemical adulteration.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'fresh-hygienic',
    title: 'Fresh & Hygienic',
    description: 'Prepared in small artisanal batches in clean, standardized sanitary facilities to deliver farm-fresh potency to your doorstep.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'customer-first',
    title: 'Customer First',
    description: 'Dedicated support, satisfaction assurance, transparent ingredient sourcing, and personalized wellness guidance for every customer.',
    iconName: 'Smile'
  },
  {
    id: 'easy-shopping',
    title: 'Easy Online Shopping',
    description: 'Seamless ordering, secure UPI & card checkouts, free delivery on eligible orders, and fast door-to-door express dispatch across India.',
    iconName: 'Truck'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'post-1',
    image: '/images/honeycomb_macro.jpg',
    tag: 'Raw Harvest',
    caption: 'Pure Western Ghats raw honeycomb extraction — straight from nature to your glass jar.'
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    tag: 'Sun Curing',
    caption: '45-day slow sun-cooking of fragrant Damask Rose petals in vintage glass jars for traditional Gulkand.'
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?auto=format&fit=crop&w=600&q=80',
    tag: 'Vedic Bilona',
    caption: 'Hand-churned curd butter slow-boiled with moringa leaves to yield fragrant granular golden ghee.'
  },
  {
    id: 'post-4',
    image: '/images/mudavatukal_soup_front.jpeg',
    tag: 'Joint Health',
    caption: 'Authentic Banaya Mudavattukkal Soup Mix — heritage rhizome & native spices for strong joints.'
  },
  {
    id: 'post-5',
    image: '/images/abc_malt_poster.jpg',
    tag: 'Daily Wellness',
    caption: 'Morning nutrition redefined: Real Apple, Beetroot, Carrot & Sprouted Grains in creamy warm milk.'
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1607006314647-79754f9a0c00?auto=format&fit=crop&w=600&q=80',
    tag: 'Zero Chemicals',
    caption: 'Cold-pressed coconut, neem & holy basil herbal bars curing in our natural drying chambers.'
  }
];

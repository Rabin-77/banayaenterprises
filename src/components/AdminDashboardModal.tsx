import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Lock, KeyRound, Eye, EyeOff, LayoutDashboard, Package,
  Users, ShoppingBag, TrendingUp, Search, Filter, Plus, Edit2, Trash2,
  CheckCircle2, Clock, Truck, AlertCircle, X, Save, RefreshCw, ChevronRight,
  ExternalLink, Phone, Mail, MapPin, DollarSign, ArrowUpRight, BarChart3,
  Calendar, Check, AlertTriangle, ShieldAlert, Sparkles, MessageCircle, LogOut,
  SlidersHorizontal, CheckSquare, Layers, FileSpreadsheet, Upload, Image as ImageIcon,
  Camera, CheckCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import { CATEGORIES } from '../data/categories';
import { uploadProductImage } from '../utils/imageUpload';

// Official Authentic Sourced Images for Fast Selection (Primary & Secondary Views)
const PRESET_GALLERY_IMAGES = [
  // Honey & Natural Sweeteners
  { name: 'Pure Honey (Front Bottle)', path: '/images/banaya_honey.jpg', category: 'Honey', angle: 'Primary Front' },
  { name: 'Honey Web Shot (Side Phase)', path: '/assets/aistudio/honey_web_1d34d9ea.jfif', category: 'Honey', angle: 'Secondary Side Phase' },
  { name: 'Natural Honey Jar (Side Angle)', path: '/images/natural_honey_jar.jpg', category: 'Honey', angle: 'Secondary Angle' },
  { name: 'Raw Honeycomb Texture (Macro)', path: '/images/honeycomb_macro.jpg', category: 'Honey', angle: 'Secondary Texture' },
  { name: 'Malai Thean Mountain Bottle', path: '/images/malai_thean_bottle.jpg', category: 'Honey', angle: 'Primary Front' },
  { name: 'Amla in Honey (Front Jar)', path: '/images/banaya_amla.webp', category: 'Honey', angle: 'Primary Front' },
  { name: 'Amla Packaging Angle', path: '/assets/aistudio/amla_bade78da.webp', category: 'Honey', angle: 'Secondary Side Phase' },
  { name: 'Rose Gulkand (Damask Petals)', path: '/images/banaya_rose_gulkand.jpg', category: 'Traditional', angle: 'Primary Front' },

  // Malts & Traditional Kanji
  { name: 'ABC Health Malt (Front Pouch)', path: '/images/abc_malt_front.jpg', category: 'Malt', angle: 'Primary Front' },
  { name: 'ABC Malt (Back - Ingredients & Use)', path: '/images/abc_malt_back.jpg', category: 'Malt', angle: 'Secondary Back Packaging' },
  { name: 'ABC Malt Standee Pouch', path: '/images/abc_malt_pouch.jpg', category: 'Malt', angle: 'Secondary Side Phase' },
  { name: 'ABC Malt Infographic Poster', path: '/images/abc_malt_poster.jpg', category: 'Malt', angle: 'Secondary Poster' },
  { name: 'Karuppu Kavuni Kanji (Front)', path: '/images/karuppu_kavuni_kanji_front.jpg', category: 'Kanji', angle: 'Primary Front' },
  { name: 'Karuppu Kavuni Kanji (Back - Nutrition)', path: '/images/karuppu_kavuni_kanji_back.jpg', category: 'Kanji', angle: 'Secondary Back Packaging' },

  // Soups & Herbal Powders
  { name: 'Mudavattukkal Soup (Front Pouch)', path: '/images/mudavatukal_soup_front.jpeg', category: 'Soup', angle: 'Primary Front' },
  { name: 'Mudavattukkal Soup (Back - Recipe)', path: '/images/mudavatukal_soup_back.jpeg', category: 'Soup', angle: 'Secondary Back Packaging' },
  { name: 'Murungai Leaf Powder (Front)', path: '/images/murungai_pouch_front.jpg', category: 'Herbal', angle: 'Primary Front' },
  { name: 'Murungai Leaf Powder (Side View)', path: '/images/murungai_leaf_powder.jpg', category: 'Herbal', angle: 'Secondary Side Phase' },
  { name: 'Curry Leaf Powder (Front Pouch)', path: '/images/curry_leaf_pouch_front.jpg', category: 'Herbal', angle: 'Primary Front' },
  { name: 'Curry Leaf Powder (Back - Suggested Use)', path: '/images/curry_leaf_powder.jpg', category: 'Herbal', angle: 'Secondary Back Packaging' },
  { name: 'Nalangu Maavu Herbal Bath (Front)', path: '/images/nalangu_maavu_girls_pouch.jpg', category: 'Herbal', angle: 'Primary Front' },
  { name: 'Nalangu Maavu Herbal Infographic', path: '/images/nalangu_maavu_girls_infographic.jpg', category: 'Herbal', angle: 'Secondary Infographic' }
];

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Master Admin passkey
const ADMIN_PASSKEY = 'banayana00123';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    products,
    orders,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    adminNotes,
    setAdminNotesForOrder,
    showToast,
    serverSynced
  } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('banaya_admin_auth') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'customers' | 'products'>('overview');

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Selected Order for detail & status editing
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('Processing');
  const [newTracking, setNewTracking] = useState('');
  const [orderNoteInput, setOrderNoteInput] = useState('');

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === ADMIN_PASSKEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('banaya_admin_auth', 'true');
      setPasskeyError(false);
      setPasskeyInput('');
      showToast('Admin Authorized', 'Welcome to Banaya Enterprise Admin Portal', 'success');
    } else {
      setPasskeyError(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('banaya_admin_auth');
    showToast('Admin Signed Out', 'Secure session ended.', 'info');
  };

  // Quick stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStockProducts = products.filter(p => !p.inStock).length;

  // Aggregate Customer Profiles from all orders
  const customerList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      email: string;
      city: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
      lastOrderId: string;
      lastStatus: string;
    }>();

    orders.forEach(order => {
      const key = (order.phone || order.email || order.customerName).toLowerCase().trim();
      const existing = map.get(key);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += order.totalAmount;
        if (order.date > existing.lastOrderDate) {
          existing.lastOrderDate = order.date;
          existing.lastOrderId = order.id;
          existing.lastStatus = order.status;
        }
      } else {
        map.set(key, {
          name: order.customerName,
          phone: order.phone,
          email: order.email,
          city: order.city,
          ordersCount: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.date,
          lastOrderId: order.id,
          lastStatus: order.status
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase());

      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.tamilName && p.tamilName.includes(productSearch)) ||
        p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());

      const matchCategory = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customerList.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customerList, customerSearch]);

  // Save Order Updates
  const handleSaveOrderStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, newTracking || selectedOrder.trackingNumber, orderNoteInput);
    setSelectedOrder(null);
  };

  // Quick inline price change state
  const [quickPrices, setQuickPrices] = useState<Record<string, number>>({});

  const handleQuickPriceChange = (prodId: string, val: number) => {
    setQuickPrices(prev => ({ ...prev, [prodId]: val }));
  };

  const handleSaveQuickPrice = async (prod: Product) => {
    const newPrice = quickPrices[prod.id];
    if (newPrice === undefined || newPrice <= 0) return;
    const updated: Product = {
      ...prod,
      price: newPrice,
      originalPrice: prod.originalPrice && prod.originalPrice > newPrice ? prod.originalPrice : Math.round(newPrice * 1.25)
    };
    await updateProduct(updated);
    setQuickPrices(prev => {
      const copy = { ...prev };
      delete copy[prod.id];
      return copy;
    });
  };

  // Active Preview Image Index for the Live Storefront Preview (Primary = 0, Secondary = 1+)
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  // Upload Primary Front Image (Cover Photo) -> Uploads & persists to server
  const handleUploadPrimaryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 10MB.', 'warning');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setProductForm(prev => {
        const prevGallery = prev.gallery && prev.gallery.length > 0 ? [...prev.gallery] : [uploadedUrl];
        prevGallery[0] = uploadedUrl;
        return {
          ...prev,
          image: uploadedUrl,
          gallery: prevGallery
        };
      });
      setActivePreviewIdx(0);
      showToast('Primary Front Image Uploaded', 'Image saved & ready. Click Save & Update Live Product to publish.', 'success', uploadedUrl);
    } catch {
      showToast('Upload Failed', 'Could not process image file. Please try another photo.', 'warning');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Upload Secondary Image (Side Phase, Back Packaging, Nutritional Label, Texture)
  const handleUploadSecondaryImage = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 10MB.', 'warning');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setProductForm(prev => {
        const currentPrimary = prev.image || prev.gallery?.[0] || '/images/banaya_honey.jpg';
        const prevGallery = [...(prev.gallery && prev.gallery.length > 0 ? prev.gallery : [currentPrimary])];
        const targetIndex = slotIndex + 1;

        if (targetIndex < prevGallery.length) {
          prevGallery[targetIndex] = uploadedUrl;
        } else {
          prevGallery.push(uploadedUrl);
        }

        return {
          ...prev,
          gallery: prevGallery
        };
      });
      setActivePreviewIdx(slotIndex + 1);
      showToast(`Secondary Image #${slotIndex + 1} Uploaded`, 'Side phase photo uploaded. Save product to publish live.', 'success', uploadedUrl);
    } catch {
      showToast('Upload Failed', 'Could not process image file. Please try another photo.', 'warning');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add New Secondary Image Slot (Side Phase or Angle)
  const handleAddSecondarySlot = (imagePath?: string) => {
    const pathToAdd = imagePath || '/images/natural_honey_jar.jpg';
    setProductForm(prev => {
      const currentPrimary = prev.image || prev.gallery?.[0] || '/images/banaya_honey.jpg';
      const prevGallery = [...(prev.gallery && prev.gallery.length > 0 ? prev.gallery : [currentPrimary])];
      prevGallery.push(pathToAdd);
      return {
        ...prev,
        gallery: prevGallery
      };
    });
    showToast('Secondary Slot Added', 'Upload a photo or choose a preset for this angle.', 'info');
  };

  // Remove a Secondary Image Slot
  const handleRemoveSecondaryImage = (slotIndex: number) => {
    setProductForm(prev => {
      const currentPrimary = prev.image || prev.gallery?.[0] || '/images/banaya_honey.jpg';
      const prevGallery = [...(prev.gallery && prev.gallery.length > 0 ? prev.gallery : [currentPrimary])];
      const targetIndex = slotIndex + 1;
      if (targetIndex < prevGallery.length) {
        prevGallery.splice(targetIndex, 1);
      }
      return {
        ...prev,
        gallery: prevGallery
      };
    });
    setActivePreviewIdx(0);
    showToast('Image Removed', 'Secondary angle removed from gallery.', 'info');
  };

  // Promote a Secondary Image to Primary (Make it the Front View)
  const handlePromoteToPrimary = (slotIndex: number) => {
    setProductForm(prev => {
      const currentPrimary = prev.image || prev.gallery?.[0] || '/images/banaya_honey.jpg';
      const prevGallery = [...(prev.gallery && prev.gallery.length > 0 ? prev.gallery : [currentPrimary])];
      const targetIndex = slotIndex + 1;
      const promoted = prevGallery.splice(targetIndex, 1)[0];
      if (promoted) {
        prevGallery.unshift(promoted);
      }
      return {
        ...prev,
        image: promoted || prevGallery[0],
        gallery: prevGallery
      };
    });
    setActivePreviewIdx(0);
    showToast('Swapped to Primary Front View', 'Selected photo is now the main storefront cover.', 'success');
  };

  // Start Editing a Product
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingNewProduct(false);
    setActivePreviewIdx(0);
    const initialGallery = prod.gallery && prod.gallery.length > 0 ? [...prod.gallery] : [prod.image];
    // Ensure primary image is at gallery[0]
    if (initialGallery[0] !== prod.image) {
      initialGallery.unshift(prod.image);
    }
    setProductForm({ 
      ...prod,
      image: prod.image,
      gallery: initialGallery,
      weightOptions: prod.weightOptions || ['100g', '250g', '500g']
    });
  };

  // Start Adding a New Product
  const handleStartNewProduct = () => {
    setIsCreatingNewProduct(true);
    setEditingProduct(null);
    setActivePreviewIdx(0);
    setProductForm({
      id: `banaya-prod-${Date.now().toString().slice(-4)}`,
      name: '',
      tamilName: '',
      tagline: '100% Pure Natural Herb & Wellness Formulation',
      category: 'Traditional Wellness',
      categorySlug: 'traditional-wellness',
      price: 250,
      originalPrice: 320,
      rating: 4.9,
      reviewsCount: 15,
      inStock: true,
      weightOptions: ['100g', '250g', '500g'],
      defaultWeight: '500g',
      badges: ['100% Pure', 'Small Batch'],
      image: '/images/banaya_honey.jpg',
      gallery: [
        '/images/banaya_honey.jpg',
        '/assets/aistudio/honey_web_1d34d9ea.jfif',
        '/images/natural_honey_jar.jpg'
      ],
      description: 'Handcrafted fresh natural formulation prepared using authentic traditional methods from Banaya Enterprise.',
      ingredients: ['100% Pure Native Botanical Ingredients'],
      keyBenefits: ['Supports natural immunity', 'Zero chemical additives or synthetic preservatives'],
      howToUse: 'Consume 1-2 teaspoons daily with warm milk or water.',
      origin: 'Banaya Enterprise, Tamil Nadu',
      isBestSeller: false,
      isNew: true
    });
  };

  // Save Product (Edit or Create)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Validation Error', 'Product Name and Customer Price are required.', 'warning');
      return;
    }

    const parseList = (val: any): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
      if (typeof val === 'string') {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [String(val)];
    };

    const finalWeights = parseList(productForm.weightOptions);
    const compiledProduct: Product = {
      id: productForm.id || `banaya-${Date.now().toString().slice(-4)}`,
      name: productForm.name.trim(),
      tamilName: productForm.tamilName?.trim() || '',
      tagline: productForm.tagline?.trim() || '100% Pure Natural Herb & Wellness',
      category: productForm.category || 'Traditional Wellness',
      categorySlug: productForm.categorySlug || 'traditional-wellness',
      price: Number(productForm.price) || 200,
      originalPrice: Number(productForm.originalPrice) || Math.round(Number(productForm.price) * 1.25),
      rating: Number(productForm.rating) || 4.9,
      reviewsCount: Number(productForm.reviewsCount) || 12,
      inStock: productForm.inStock !== false,
      weightOptions: finalWeights.length > 0 ? finalWeights : ['100g', '250g', '500g'],
      defaultWeight: productForm.defaultWeight || (finalWeights[0] || '100g'),
      badges: parseList(productForm.badges).length > 0 ? parseList(productForm.badges) : ['100% Pure'],
      image: productForm.image || '/images/banaya_honey.jpg',
      gallery: productForm.gallery && productForm.gallery.length > 0 ? productForm.gallery : [productForm.image || '/images/banaya_honey.jpg'],
      description: productForm.description || '',
      ingredients: parseList(productForm.ingredients).length > 0 ? parseList(productForm.ingredients) : ['100% Pure Native Botanical Ingredients'],
      keyBenefits: parseList(productForm.keyBenefits).length > 0 ? parseList(productForm.keyBenefits) : ['Supports natural vitality and immune defense'],
      howToUse: productForm.howToUse || 'Consume 1 teaspoon daily with warm water or milk.',
      origin: productForm.origin || 'Banaya Enterprise, Tamil Nadu',
      isBestSeller: !!productForm.isBestSeller,
      isNew: !!productForm.isNew
    };

    setIsSavingProduct(true);
    try {
      if (isCreatingNewProduct) {
        await addProduct(compiledProduct);
      } else {
        await updateProduct(compiledProduct);
      }
      setEditingProduct(null);
      setIsCreatingNewProduct(false);
      setProductForm({});
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Format currency
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 text-slate-900 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-7xl max-h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="bg-[#064E3B] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/images/banaya_logo.png"
                alt="Banaya Enterprises"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white">
                  Banaya Enterprises Control Panel
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 border border-emerald-600">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Authorized Management for Customer Orders, Products & Store Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  serverSynced
                    ? 'bg-emerald-800/80 text-emerald-100 border-emerald-500/60'
                    : 'bg-amber-900/60 text-amber-200 border-amber-500/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${serverSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{serverSynced ? 'Live Store Sync Active' : 'Local Mode'}</span>
              </span>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-xs font-semibold text-emerald-200 border border-emerald-700 transition-colors cursor-pointer"
                title="Log out of Admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Secure Gatekeeper Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center flex-1 max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg ring-4 ring-emerald-100 flex items-center justify-center mb-5">
              <img
                src="/images/banaya_logo.png"
                alt="Banaya Enterprises Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-950 mb-2">
              Admin Access Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              This portal is restricted exclusively to store managers and staff to view customer purchases, update live inventory, and modify prices.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Admin Passkey"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (passkeyError) setPasskeyError(false);
                  }}
                  className={`w-full px-4 py-3 pr-12 text-sm rounded-xl border ${
                    passkeyError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#064E3B]'
                  } focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passkeyError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Invalid passkey. Master admin passkey is <strong>banayana00123</strong></span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Unlock Admin Portal</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center">
              <p className="text-[11px] text-slate-400">
                Staff Passkey: <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">banayana00123</code>
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated: Complete Professional Admin Workspace */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Navigation Tabs Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto shrink-0 gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                    activeTab === 'orders'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'orders' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'customers'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Customers</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'customers' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {customerList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'products'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Products & Rates</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'products' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {products.length}
                  </span>
                </button>
              </div>

              {activeTab === 'products' && (
                <button
                  onClick={handleStartNewProduct}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>

            {/* Main Tab Content Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/50">

              {/* ---------------- 1. OVERVIEW TAB ---------------- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top KPI Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="font-heading text-2xl font-extrabold text-slate-900">
                        {formatINR(totalRevenue)}
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Live across {totalOrders} customer orders</span>
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="font-heading text-2xl font-extrabold text-slate-900">
                        {totalOrders}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {pendingOrders} awaiting fulfillment
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="font-heading text-2xl font-extrabold text-slate-900">
                        {customerList.length}
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium mt-1">
                        100% verified Tamil Nadu clientele
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Catalog Items</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="font-heading text-2xl font-extrabold text-slate-900">
                        {products.length}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {lowStockProducts > 0 ? `${lowStockProducts} item out of stock` : 'All items in stock'}
                      </p>
                    </div>
                  </div>

                  {/* Recent Orders Snapshot */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-heading text-base font-bold text-slate-900">
                          Recent Orders & Fulfillment Status
                        </h3>
                        <p className="text-xs text-slate-500">
                          Real-time orders placed via UPI, GPay, and Direct WhatsApp
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Orders</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="py-2.5 px-3">Order ID</th>
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Items</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3">Payment</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.slice(0, 5).map(ord => (
                            <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                {ord.id}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{ord.customerName}</div>
                                <div className="text-[11px] text-slate-400">{ord.phone}</div>
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                {ord.items.map(it => `${it.product.name} (${it.selectedWeight} x${it.quantity})`).join(', ')}
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-900">
                                {formatINR(ord.totalAmount)}
                              </td>
                              <td className="py-3 px-3 text-[11px] text-slate-500">
                                {ord.paymentMethod.split('(')[0]}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.status === 'Shipped'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(ord);
                                    setNewStatus(ord.status);
                                    setNewTracking(ord.trackingNumber);
                                    setOrderNoteInput(adminNotes?.[ord.id] || '');
                                  }}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Admin Actions Box */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
                      <h4 className="font-heading text-sm font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-700" />
                        <span>Update Rates & Stock</span>
                      </h4>
                      <p className="text-xs text-emerald-800/80 mb-3 leading-relaxed">
                        Adjust product prices (e.g. Honey ₹300, Malai Thean ₹1300) or toggle stock status instantly.
                      </p>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Manage Product Rates &rarr;
                      </button>
                    </div>

                    <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4">
                      <h4 className="font-heading text-sm font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-700" />
                        <span>Dispatch & Courier Tracking</span>
                      </h4>
                      <p className="text-xs text-blue-800/80 mb-3 leading-relaxed">
                        Add courier tracking numbers and notify customers when their package is dispatched.
                      </p>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Update Order Tracking &rarr;
                      </button>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                      <h4 className="font-heading text-sm font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-700" />
                        <span>Customer Registry</span>
                      </h4>
                      <p className="text-xs text-amber-800/80 mb-3 leading-relaxed">
                        Review customer contact phone numbers, delivery addresses, and repeat purchases.
                      </p>
                      <button
                        onClick={() => setActiveTab('customers')}
                        className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View Customer Profiles &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 2. ORDERS MANAGEMENT TAB ---------------- */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer, Phone..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-semibold text-slate-500">Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="all">All Statuses ({orders.length})</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Order ID & Date</th>
                            <th className="py-3 px-4">Customer Details</th>
                            <th className="py-3 px-4">Delivery Location</th>
                            <th className="py-3 px-4">Purchased Items</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status & Tracking</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No customer orders matching your search or filter.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map(ord => (
                              <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="font-mono font-bold text-slate-900">{ord.id}</div>
                                  <div className="text-[11px] text-slate-400">{ord.date}</div>
                                  {ord.transactionId && (
                                    <div className="text-[10px] text-emerald-800 font-mono font-semibold truncate max-w-[130px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1" title={ord.transactionId}>
                                      {ord.transactionId}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-slate-900">{ord.customerName}</div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{ord.phone}</span>
                                  </div>
                                  {ord.email && (
                                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                      {ord.email}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">
                                  <div className="line-clamp-2 max-w-[180px] leading-tight">
                                    {ord.shippingAddress}, {ord.city} - {ord.postalCode}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1 max-w-[200px]">
                                    {ord.items.map((it, idx) => (
                                      <div key={idx} className="text-slate-800 text-[11px] flex items-center justify-between">
                                        <span className="truncate">{it.product.name}</span>
                                        <span className="text-slate-400 font-mono ml-2 shrink-0">{it.selectedWeight} x{it.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-slate-900">{formatINR(ord.totalAmount)}</div>
                                  <div className="text-[10px] text-emerald-700 font-medium">
                                    {ord.paymentMethod.split('(')[0]}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    ord.status === 'Delivered'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ord.status === 'Shipped'
                                        ? 'bg-blue-100 text-blue-800'
                                        : ord.status === 'Out for Delivery'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {ord.status}
                                  </span>
                                  {ord.trackingNumber && (
                                    <div className="font-mono text-[10px] text-slate-400 mt-1">
                                      Track: {ord.trackingNumber}
                                    </div>
                                  )}
                                  {adminNotes?.[ord.id] && (
                                    <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-[140px] truncate" title={adminNotes[ord.id]}>
                                      Note: {adminNotes[ord.id]}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(ord);
                                      setNewStatus(ord.status);
                                      setNewTracking(ord.trackingNumber);
                                      setOrderNoteInput(adminNotes?.[ord.id] || '');
                                    }}
                                    className="px-2.5 py-1 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete order ${ord.id}?`)) {
                                        deleteOrder(ord.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Order Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 3. CUSTOMER DETAILS TAB ---------------- */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search customers by name, phone, city..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Showing <strong>{filteredCustomers.length}</strong> unique registered customers
                    </div>
                  </div>

                  {/* Customer Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCustomers.map((cust, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#064E3B] font-heading font-bold text-base flex items-center justify-center">
                              {cust.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {cust.ordersCount} {cust.ordersCount === 1 ? 'Order' : 'Orders'}
                            </span>
                          </div>

                          <h4 className="font-heading text-base font-bold text-slate-900 mb-0.5">
                            {cust.name}
                          </h4>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{cust.city || 'Tamil Nadu'}</span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="font-mono font-medium">{cust.phone}</span>
                            </div>
                            {cust.email && (
                              <div className="flex items-center gap-2 truncate">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{cust.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 text-[11px] block">Total Spent:</span>
                            <span className="font-bold text-slate-900">{formatINR(cust.totalSpent)}</span>
                          </div>

                          <a
                            href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(cust.name)}%2C%20greetings%20from%20Banaya%20Enterprise!`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------- 4. PRODUCTS & RATES TAB ---------------- */}
              {activeTab === 'products' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Top Product Management Action Card */}
                  <div className="bg-gradient-to-r from-[#064E3B] via-emerald-800 to-teal-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                          Admin Inventory Control
                        </span>
                        <span className="text-emerald-200 text-xs">
                          {products.length} Products Active
                        </span>
                      </div>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                        Product Catalog & Rates Management
                      </h3>
                      <p className="text-xs text-emerald-100 max-w-xl mt-0.5">
                        Modify customer prices, packaging images, weights, and descriptions. Click <strong>"Add New Product"</strong> to launch a new item on the live storefront.
                      </p>
                    </div>

                    <button
                      id="admin-add-new-product-banner-btn"
                      onClick={handleStartNewProduct}
                      className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                      <span>＋ Add New Product</span>
                    </button>
                  </div>

                  {/* Quick Product Section Selector (Honey, Malai Thean, ABC Malt, etc.) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold text-xs">
                          ⚡
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Quick Product Selector & Editor
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Click any item below to immediately view and edit its prices, primary front image, and secondary side phase images
                          </span>
                        </div>
                      </div>

                      {/* Direct Product Picker Dropdown */}
                      <select
                        onChange={(e) => {
                          const chosen = products.find(p => p.id === e.target.value);
                          if (chosen) handleStartEditProduct(chosen);
                        }}
                        defaultValue=""
                        className="px-3 py-1.5 text-xs rounded-xl border border-emerald-300 bg-emerald-50/50 font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="" disabled>Select Product to Modify...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.category}) — ₹{p.price} [{(p.gallery?.length || 1)} Images]
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interactive Quick-Jump Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {products.map(p => {
                        const isHoney = p.name.toLowerCase().includes('honey') || p.categorySlug.includes('honey');
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleStartEditProduct(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                              isHoney
                                ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 border-amber-300 shadow-2xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-emerald-300'
                            }`}
                            title={`Click to edit ${p.name}`}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-5 h-5 rounded-md object-contain bg-white shrink-0 border border-slate-200"
                            />
                            <span className="font-bold">{p.name}</span>
                            <span className="font-mono text-[11px] font-bold text-emerald-800">₹{p.price}</span>
                            <span className="text-[10px] bg-white/80 px-1 rounded text-slate-500 font-mono">
                              {(p.gallery && p.gallery.length > 0 ? p.gallery.length : 1)} imgs
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search, Category Filter & Quick Stats Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products by name, Tamil name, ID..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Category:</span>
                        <select
                          value={productCategoryFilter}
                          onChange={(e) => setProductCategoryFilter(e.target.value)}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="all">All Categories ({products.length})</option>
                          {CATEGORIES.map(c => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleStartNewProduct}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Product & Images (Front + Side Phase)</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Default Weight</th>
                            <th className="py-3 px-4">Customer Rate (₹)</th>
                            <th className="py-3 px-4">Stock Status</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map(prod => {
                            const isEditingQuickPrice = quickPrices[prod.id] !== undefined;
                            const currentQuickVal = isEditingQuickPrice ? quickPrices[prod.id] : prod.price;
                            const allImages = prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image];

                            return (
                              <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        onClick={() => handleStartEditProduct(prod)}
                                        className="w-13 h-13 rounded-xl bg-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 cursor-pointer hover:border-emerald-500 transition-colors relative group"
                                        title="Click to modify photo or details"
                                      >
                                        <img
                                          src={prod.image}
                                          alt={prod.name}
                                          className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                          <Camera className="w-3.5 h-3.5" />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                          <span>{prod.name}</span>
                                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold font-mono">
                                            {allImages.length} {allImages.length === 1 ? 'view' : 'views'}
                                          </span>
                                        </div>
                                        {prod.tamilName && (
                                          <div className="text-[11px] text-emerald-700 font-medium">{prod.tamilName}</div>
                                        )}
                                        <div className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</div>
                                      </div>
                                    </div>

                                    {/* Gallery Thumbnails Strip (Primary + Secondary Side Phase / Back) */}
                                    <div className="flex items-center gap-1.5 pl-1 overflow-x-auto">
                                      {allImages.map((imgUrl, imgIdx) => (
                                        <div 
                                          key={imgIdx} 
                                          onClick={() => handleStartEditProduct(prod)}
                                          className="relative group cursor-pointer"
                                          title={imgIdx === 0 ? 'Primary Front View' : `Secondary View #${imgIdx}`}
                                        >
                                          <img
                                            src={imgUrl}
                                            alt=""
                                            className={`w-7 h-7 rounded-md object-contain bg-white border ${
                                              imgIdx === 0 ? 'border-emerald-500 ring-1 ring-emerald-400' : 'border-slate-200'
                                            }`}
                                          />
                                          <span className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded bg-slate-900/80 text-white leading-none">
                                            {imgIdx === 0 ? 'P' : `S${imgIdx}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                    {prod.category}
                                  </span>
                                </td>

                                <td className="py-3 px-4 font-medium text-slate-700">
                                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-emerald-200">
                                    {prod.defaultWeight}
                                  </span>
                                </td>

                                {/* Inline Rate Modifier */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1.5">
                                    <div className="relative w-24">
                                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                                      <input
                                        type="number"
                                        value={currentQuickVal}
                                        onChange={(e) => handleQuickPriceChange(prod.id, Number(e.target.value))}
                                        className={`w-full pl-6 pr-2 py-1 text-xs font-bold rounded-lg border ${
                                          isEditingQuickPrice ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-slate-50'
                                        } focus:outline-none focus:border-emerald-600 focus:bg-white`}
                                        title="Directly edit price"
                                      />
                                    </div>

                                    {isEditingQuickPrice && (
                                      <button
                                        type="button"
                                        onClick={() => handleSaveQuickPrice(prod)}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Save New Rate Immediately"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Save</span>
                                      </button>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-slate-400 line-through mt-0.5">
                                    MRP: {formatINR(prod.originalPrice)}
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => {
                                      updateProduct({ ...prod, inStock: !prod.inStock });
                                      showToast(
                                        prod.inStock ? 'Marked Out of Stock' : 'Marked In Stock', 
                                        `${prod.name} is now ${prod.inStock ? 'hidden from purchase' : 'available for order'}.`, 
                                        'info'
                                      );
                                    }}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                      prod.inStock
                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                    }`}
                                    title="Click to toggle in-stock / out-of-stock"
                                  >
                                    {prod.inStock ? 'In Stock (Active)' : 'Out of Stock'}
                                  </button>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="font-bold text-slate-900">★ {prod.rating}</span>
                                  <span className="text-[10px] text-slate-400 block">({prod.reviewsCount} reviews)</span>
                                </td>

                                <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => handleStartEditProduct(prod)}
                                    className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <Edit2 className="w-3 h-3 text-amber-300" />
                                    <span>Modify</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${prod.name}? This will remove it from the store catalog.`)) {
                                        deleteProduct(prod.id);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ---------------- ORDER STATUS & NOTE UPDATE MODAL ---------------- */}
        {selectedOrder && (
          <div 
            className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedOrder(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-950">
                    Update Order: {selectedOrder.id}
                  </h3>
                  <p className="text-xs text-slate-500">Customer: {selectedOrder.customerName} ({selectedOrder.phone})</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Transaction Security & Reference Badge */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TRANSACTION ID</span>
                    <span className="font-mono font-bold text-emerald-800">{selectedOrder.transactionId || `TXN-BNY-${selectedOrder.id}`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">BANK REF / UTR</span>
                    <span className="font-mono font-bold text-slate-800">{selectedOrder.bankRef || 'VERIFIED'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Order Fulfillment Status:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Processing">Processing (Under Preparation)</option>
                    <option value="Confirmed">Confirmed (Payment Verified)</option>
                    <option value="Shipped">Shipped (Dispatched to Courier)</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered (Handed to Customer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Courier / SpeedPost Tracking Number:
                  </label>
                  <input
                    type="text"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    placeholder="e.g. IND98427190IN or DTDC44920"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Customer can track this code in real-time under "Track Your Order".
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Internal Admin Note for this Order:
                  </label>
                  <textarea
                    rows={2}
                    value={orderNoteInput}
                    onChange={(e) => setOrderNoteInput(e.target.value)}
                    placeholder="e.g. Paid via Google Pay. Priority delivery requested for wedding."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Direct WhatsApp notify link for customer */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Customer Communication:</span>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customerName)}%2C%20your%20order%20${selectedOrder.id}%20status%20is%20now%20*${newStatus}*!%20Tracking%3A%20${encodeURIComponent(newTracking || selectedOrder.trackingNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128C7E] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Status Update via WhatsApp to Customer</span>
                  </a>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOrderStatus}
                    className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    Save & Apply Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PRODUCT EDIT / CREATE MODAL ---------------- */}
        {(editingProduct || isCreatingNewProduct) && (
          <div 
            className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
            onClick={() => {
              setEditingProduct(null);
              setIsCreatingNewProduct(false);
            }}
          >
            <div 
              className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingNewProduct(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                title="Close Form"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header with Quick Product Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200 shadow-xs">
                    {isCreatingNewProduct ? <Plus className="w-6 h-6 stroke-[2.5]" /> : <Edit2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 leading-tight">
                      {isCreatingNewProduct ? '＋ Add New Product to Store Catalog' : `Modify: ${productForm.name || editingProduct?.name}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Edit selling rates, primary front image, secondary side phase images, and package weights.
                    </p>
                  </div>
                </div>

                {/* Quick Product Switcher Dropdown in Modal Header */}
                {!isCreatingNewProduct && (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-bold text-slate-600 shrink-0">Switch Product:</span>
                    <select
                      value={editingProduct?.id || ''}
                      onChange={(e) => {
                        const targetProd = products.find(p => p.id === e.target.value);
                        if (targetProd) handleStartEditProduct(targetProd);
                      }}
                      className="px-3 py-1.5 text-xs rounded-xl border border-emerald-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Main 2-Column Split: Form (Left) & Live Preview (Right) */}
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Form Controls (7 Cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* Section 1: Pricing & Rates (Top Priority) */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                          Rate & Pricing Configuration
                        </span>
                        <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Store Selling Rates
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Customer Rate (₹)*:
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              required
                              value={productForm.price || ''}
                              onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                              placeholder="e.g. 300"
                              className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-amber-300 bg-white font-extrabold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            MRP / Original (₹):
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={productForm.originalPrice || ''}
                              onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                              placeholder="e.g. 380"
                              className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-bold text-slate-600 focus:outline-none focus:border-emerald-600"
                            />
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Default Weight:
                          </label>
                          <input
                            type="text"
                            value={productForm.defaultWeight || ''}
                            onChange={(e) => setProductForm({ ...productForm, defaultWeight: e.target.value })}
                            placeholder="500g / 250g / 1kg"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Available Package Sizes (comma-separated):
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(productForm.weightOptions) ? productForm.weightOptions.join(', ') : (productForm.weightOptions || '')}
                          onChange={(e) => setProductForm({ ...productForm, weightOptions: e.target.value as any })}
                          placeholder="e.g. 250g, 500g, 1kg"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Section 2: PRIMARY & SECONDARY MULTI-PHASE IMAGERY */}
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                          Primary & Secondary Store Imagery (Multi-Angle)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {((productForm.gallery?.length) || 1)} Photos Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        In the customer storefront, every section has more than 3 related images (Front packaging, Side phase, Back label/ingredients, and Texture). Manage each view below:
                      </p>

                      {/* --- A. PRIMARY IMAGE (Front View / Main Cover) --- */}
                      <div className="bg-white p-4 rounded-xl border-2 border-emerald-600/30 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[10px] font-extrabold flex items-center justify-center">
                              1
                            </span>
                            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                              Primary Image (Main Front View / Catalog Cover)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
                            Front Phase
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-20 h-20 rounded-xl bg-slate-50 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img
                              src={productForm.image || '/images/banaya_honey.jpg'}
                              alt="Primary Front"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            {/* Device Upload for Primary */}
                            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer font-bold text-xs transition-colors shadow-xs w-full">
                              <Upload className="w-3.5 h-3.5 text-amber-300" />
                              <span>Upload Primary Image from Device</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadPrimaryImage}
                                className="hidden"
                              />
                            </label>

                            <div className="relative">
                              <input
                                type="text"
                                value={productForm.image || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => {
                                    const g = prev.gallery && prev.gallery.length > 0 ? [...prev.gallery] : [val];
                                    g[0] = val;
                                    return { ...prev, image: val, gallery: g };
                                  });
                                }}
                                placeholder="Primary image path / URL (/images/banaya_honey.jpg)"
                                className="w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --- B. SECONDARY IMAGES (Side Phase, Back Packaging, Ingredients & Texture) --- */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Secondary Images (Side Phase, Back Packaging & Detail Shots)</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddSecondarySlot()}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Secondary Slot</span>
                          </button>
                        </div>

                        {/* List of Secondary Slots */}
                        {((productForm.gallery || []).slice(1)).length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center bg-white">
                            <p className="text-xs text-slate-500 mb-2">
                              No secondary side phase images configured yet. Click below to add side angle, back packaging, or nutrition facts photos.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleAddSecondarySlot('/assets/aistudio/honey_web_1d34d9ea.jfif')}
                              className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Side Phase Image</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {((productForm.gallery || []).slice(1)).map((secImg, secIdx) => {
                              const slotNumber = secIdx + 2;
                              const defaultAngleLabel = secIdx === 0 
                                ? 'Side Phase / Packaging Angle' 
                                : secIdx === 1 
                                  ? 'Back Packaging & Ingredients' 
                                  : secIdx === 2 
                                    ? 'Texture / Macro Shot' 
                                    : `Detail Angle #${secIdx + 1}`;

                              return (
                                <div key={secIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-4.5 h-4.5 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center">
                                        {slotNumber}
                                      </span>
                                      <span className="text-xs font-bold text-slate-800">
                                        Secondary Image #{secIdx + 1}: <span className="text-emerald-800 font-semibold">{defaultAngleLabel}</span>
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handlePromoteToPrimary(secIdx)}
                                        className="text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer"
                                        title="Make this the front main image"
                                      >
                                        Set as Primary Front
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSecondaryImage(secIdx)}
                                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                                        title="Remove this secondary image"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                                    <div 
                                      onClick={() => setActivePreviewIdx(secIdx + 1)}
                                      className="w-16 h-16 rounded-lg bg-slate-50 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 cursor-pointer hover:border-emerald-500"
                                      title="Click to preview on storefront card"
                                    >
                                      <img
                                        src={secImg}
                                        alt={`Secondary ${secIdx + 1}`}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>

                                    <div className="flex-1 space-y-1.5 w-full">
                                      {/* Device Upload for this specific secondary slot */}
                                      <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-lg cursor-pointer font-bold text-xs transition-colors w-full">
                                        <Camera className="w-3 h-3 text-emerald-700" />
                                        <span>Upload Side Phase Photo from Device</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleUploadSecondaryImage(secIdx, e)}
                                          className="hidden"
                                        />
                                      </label>

                                      <input
                                        type="text"
                                        value={secImg}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setProductForm(prev => {
                                            const g = [...(prev.gallery || [prev.image || '/images/banaya_honey.jpg'])];
                                            g[secIdx + 1] = val;
                                            return { ...prev, gallery: g };
                                          });
                                        }}
                                        placeholder="Secondary image path or URL"
                                        className="w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddSecondarySlot()}
                          className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Plus className="w-4 h-4 text-emerald-700" />
                          <span>＋ Add Another Secondary Image (Side Phase / Angle)</span>
                        </button>
                      </div>

                      {/* --- C. SOURCED PRESET PICKER --- */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          Or Click from Verified Sourced Photos (Primary Front & Side Angles):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                          {PRESET_GALLERY_IMAGES.map((img) => (
                            <button
                              key={img.path}
                              type="button"
                              onClick={() => {
                                // Add to secondary if already has primary, else set as primary
                                if (!productForm.image) {
                                  setProductForm({ ...productForm, image: img.path, gallery: [img.path] });
                                } else {
                                  handleAddSecondarySlot(img.path);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <img
                                src={img.path}
                                alt={img.name}
                                className="w-6 h-6 rounded object-contain bg-white shrink-0 border border-slate-200"
                              />
                              <div className="truncate">
                                <span className="text-[10px] font-bold text-slate-800 block truncate">
                                  {img.name}
                                </span>
                                <span className="text-[9px] text-emerald-700 font-semibold block leading-tight">
                                  {img.angle}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Identity & Sourcing */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-700" />
                        Product Name & Category
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Product Name (English)*:
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.name || ''}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="e.g. Pure Wildflower Honey"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Tamil Name (தமிழ் பெயர்):
                          </label>
                          <input
                            type="text"
                            value={productForm.tamilName || ''}
                            onChange={(e) => setProductForm({ ...productForm, tamilName: e.target.value })}
                            placeholder="e.g. சுத்தமான மலைத்தேன்"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Store Category:
                          </label>
                          <select
                            value={productForm.categorySlug || 'traditional-wellness'}
                            onChange={(e) => {
                              const sel = CATEGORIES.find(c => c.slug === e.target.value);
                              setProductForm({
                                ...productForm,
                                categorySlug: e.target.value,
                                category: sel ? sel.name : 'Traditional Wellness'
                              });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-emerald-600"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Stock Status:
                          </label>
                          <select
                            value={productForm.inStock ? 'true' : 'false'}
                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === 'true' })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-emerald-600"
                          >
                            <option value="true">In Stock (Available for Purchase)</option>
                            <option value="false">Out of Stock (Disabled)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Tagline / Subheading:
                        </label>
                        <input
                          type="text"
                          value={productForm.tagline || ''}
                          onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                          placeholder="Short marketing catchphrase"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Section 4: Details, Ingredients & How to Use */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                        Description, Benefits & Usage Instructions
                      </span>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Product Description:
                        </label>
                        <textarea
                          rows={2}
                          value={productForm.description || ''}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Authentic botanical sourcing and heritage recipe."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Key Benefits (comma-separated):
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(productForm.keyBenefits) ? productForm.keyBenefits.join(', ') : (productForm.keyBenefits || '')}
                            onChange={(e) => setProductForm({ ...productForm, keyBenefits: e.target.value as any })}
                            placeholder="Boosts immunity, 100% Raw, Zero chemicals"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Badges (comma-separated):
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(productForm.badges) ? productForm.badges.join(', ') : (productForm.badges || '')}
                            onChange={(e) => setProductForm({ ...productForm, badges: e.target.value as any })}
                            placeholder="100% Pure, Wild Harvest, Best Seller"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          How To Use & Dosage:
                        </label>
                        <input
                          type="text"
                          value={productForm.howToUse || ''}
                          onChange={(e) => setProductForm({ ...productForm, howToUse: e.target.value })}
                          placeholder="Consume 1 teaspoon daily with warm water or milk."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Live Customer Storefront Card Preview (5 Cols) */}
                  <div className="lg:col-span-5 sticky top-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        Live Customer Website View
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Exact Store Rendering
                      </span>
                    </div>

                    {(() => {
                      const galleryList = productForm.gallery && productForm.gallery.length > 0 
                        ? productForm.gallery 
                        : [productForm.image || '/images/banaya_honey.jpg'];
                      const activeImage = galleryList[activePreviewIdx] || galleryList[0] || '/images/banaya_honey.jpg';
                      const badgesList = Array.isArray(productForm.badges) 
                        ? productForm.badges 
                        : (typeof productForm.badges === 'string' ? (productForm.badges as string).split(',').map(s => s.trim()) : ['100% Pure']);

                      return (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl text-left space-y-3 relative overflow-hidden">
                          {/* Active Image Frame with Navigation Arrows */}
                          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 p-3 flex items-center justify-center group">
                            <img
                              src={activeImage}
                              alt={productForm.name || 'Product Preview'}
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Left/Right arrow navigation */}
                            {galleryList.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setActivePreviewIdx(prev => (prev === 0 ? galleryList.length - 1 : prev - 1))}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md cursor-pointer border border-slate-200"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActivePreviewIdx(prev => (prev === galleryList.length - 1 ? 0 : prev + 1))}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md cursor-pointer border border-slate-200"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {/* Badges Preview */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                              {badgesList.slice(0, 2).map((b, i) => (
                                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#064E3B] text-white shadow-xs">
                                  {b}
                                </span>
                              ))}
                              {productForm.isBestSeller && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                                  Best Seller
                                </span>
                              )}
                            </div>

                            {/* Image Angle Indicator Pill */}
                            <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                              {activePreviewIdx === 0 ? '📷 Primary Front' : `📐 Secondary Angle #${activePreviewIdx}`} ({activePreviewIdx + 1}/{galleryList.length})
                            </span>

                            {/* Stock pill */}
                            <span className={`absolute bottom-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              productForm.inStock !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {productForm.inStock !== false ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Thumbnails Navigation Row (Primary + Secondary) */}
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {galleryList.map((imgItem, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePreviewIdx(idx)}
                                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center bg-slate-50 p-1 ${
                                  activePreviewIdx === idx
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={imgItem}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold px-1 rounded bg-slate-900/85 text-white">
                                  {idx === 0 ? 'P' : `S${idx}`}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Title & Category */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              {productForm.category || 'Traditional Wellness'}
                            </span>
                            <h4 className="font-heading font-extrabold text-base text-slate-900 leading-snug">
                              {productForm.name || 'Product Title'}
                            </h4>
                            {productForm.tamilName && (
                              <span className="text-xs font-medium text-emerald-800 block">
                                {productForm.tamilName}
                              </span>
                            )}
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {productForm.tagline || '100% Pure Botanical Specialty'}
                            </p>
                          </div>

                          {/* Weight Selector Preview */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="text-[10px] text-slate-400 font-semibold">Available Sizes:</span>
                            {(Array.isArray(productForm.weightOptions) 
                              ? productForm.weightOptions 
                              : (typeof productForm.weightOptions === 'string' ? (productForm.weightOptions as string).split(',').map(s => s.trim()) : ['500g'])
                            ).map((w, wi) => (
                              <span 
                                key={wi}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                  w === productForm.defaultWeight
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {w}
                              </span>
                            ))}
                          </div>

                          {/* Pricing Preview with Discount */}
                          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                              <span className="text-2xl font-heading font-extrabold text-slate-900">
                                ₹{productForm.price || 0}
                              </span>
                              {productForm.originalPrice && productForm.originalPrice > (productForm.price || 0) && (
                                <>
                                  <span className="text-xs text-slate-400 line-through ml-2">
                                    ₹{productForm.originalPrice}
                                  </span>
                                  <span className="text-[11px] text-emerald-700 font-bold ml-2">
                                    {Math.round(((productForm.originalPrice - (productForm.price || 0)) / productForm.originalPrice) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              ★ 4.9 (Live Store)
                            </span>
                          </div>

                          {/* Add to bag button preview */}
                          <div className="w-full py-2.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs opacity-90">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add To Bag</span>
                          </div>

                          <p className="text-[10px] text-slate-400 text-center">
                            Live preview: this is exactly what customers see when browsing and ordering.
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* Form Bottom Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingNewProduct(false);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingProduct || isUploadingImage}
                    className="px-7 py-3 bg-[#064E3B] hover:bg-[#047857] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 transition-all duration-200 hover:scale-102"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>
                      {isUploadingImage
                        ? 'Uploading Photo...'
                        : isSavingProduct
                          ? 'Syncing to Live Website...'
                          : isCreatingNewProduct
                            ? 'Save & Launch New Product'
                            : 'Save & Update Live Product'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

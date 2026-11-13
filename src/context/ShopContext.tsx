import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Product, CartItem, Order, ActiveModal } from '../types';
import { PRODUCTS } from '../data/products';
import { getPriceForProductWeight } from '../utils/pricing';

const ADMIN_PASSKEY = 'banayana00123';
const SYNC_CHANNEL_NAME = 'banaya_store_sync';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  productImage?: string;
}

interface StoreSyncPayload {
  products?: Product[];
  orders?: Order[];
  adminNotes?: Record<string, string>;
  updatedAt?: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeModal: ActiveModal;
  selectedProduct: Product | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  toasts: ToastMessage[];
  appliedCoupon: { code: string; discountPercent: number; discountFixed: number } | null;
  serverSynced: boolean;
  lastSyncedAt: number | null;

  // Actions
  setActiveModal: (modal: ActiveModal) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: string) => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number, weight?: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order Actions
  placeOrder: (orderDetails: {
    customerName: string;
    phone: string;
    email: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
    transactionId?: string;
    bankRef?: string;
  }) => Order;
  trackOrderById: (orderId: string) => Order | null;

  // Toast
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning', productImage?: string) => void;
  dismissToast: (id: string) => void;

  // Quick View / Detail Navigation
  openProductDetail: (product: Product) => void;
  openQuickCheckout: (product: Product, weight?: string) => void;
  trackingLookupId: string;
  setTrackingLookupId: (orderId: string) => void;
  openOrderTracking: (orderId: string) => void;

  // Product Management (Admin)
  updateProduct: (updatedProduct: Product) => Promise<void>;
  addProduct: (newProduct: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Order & Customer Management (Admin)
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string, adminNotes?: string) => void;
  deleteOrder: (orderId: string) => void;
  adminNotes?: Record<string, string>;
  setAdminNotesForOrder: (orderId: string, note: string) => void;

  // Financial Calculations
  getEffectivePrice: (item: CartItem) => number;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial catalog state (quickly hydrated by server /api/store on mount)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('banaya_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore localStorage read issues
    }
    return PRODUCTS;
  });

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedProductState, setSelectedProductState] = useState<Product | null>(null);
  const [trackingLookupId, setTrackingLookupId] = useState<string>('STM-84920');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; discountFixed: number } | null>(null);
  const [serverSynced, setServerSynced] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Persistence for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('startone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence for Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('startone_wishlist');
      return saved ? JSON.parse(saved) : ['malai-thean', 'desi-cow-ghee', 'abc-malt'];
    } catch {
      return ['malai-thean', 'desi-cow-ghee', 'abc-malt'];
    }
  });

  // Persistence for Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('startone_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const byId = (id: string, fallbackIdx: number) =>
      PRODUCTS.find(p => p.id === id) || PRODUCTS[fallbackIdx] || PRODUCTS[0];

    if (PRODUCTS.length === 0) return [];

    return [
      {
        id: 'STM-84920',
        date: '2026-11-10',
        items: [
          { product: byId('malai-thean', 2), quantity: 1, selectedWeight: '500g' },
          { product: byId('abc-malt', 6), quantity: 2, selectedWeight: '100g' }
        ],
        subtotal: 1700,
        discount: 170,
        shipping: 0,
        totalAmount: 1530,
        status: 'Delivered',
        customerName: 'Ananya Ramesh',
        phone: '+91 98401 23456',
        email: 'ananya.r@example.com',
        shippingAddress: '42, Lotus Lake Road, Anna Nagar',
        city: 'Chennai',
        postalCode: '600040',
        paymentMethod: 'UPI / Google Pay (UTR: 329048120)',
        trackingNumber: 'IND98427190IN'
      },
      {
        id: 'STM-85104',
        date: '2026-11-11',
        items: [
          { product: byId('pure-honey', 0), quantity: 2, selectedWeight: '500g' },
          { product: byId('gulkand', 3), quantity: 1, selectedWeight: '250g' }
        ],
        subtotal: 750,
        discount: 0,
        shipping: 0,
        totalAmount: 750,
        status: 'Processing',
        customerName: 'Dr. Senthil Kumar',
        phone: '+91 94432 87654',
        email: 'dr.senthil@apollo.org',
        shippingAddress: '15/B, Vaigai Avenue, K.K. Nagar',
        city: 'Madurai',
        postalCode: '625020',
        paymentMethod: 'Google Pay (Instant Verification)',
        trackingNumber: 'STM8831920IN'
      },
      {
        id: 'STM-85219',
        date: '2026-11-11',
        items: [
          { product: byId('mudavatukal-soup', 9), quantity: 3, selectedWeight: '100g' },
          { product: byId('karuppukavani-kanji', 10), quantity: 2, selectedWeight: '250g' }
        ],
        subtotal: 1240,
        discount: 100,
        shipping: 0,
        totalAmount: 1140,
        status: 'Shipped',
        customerName: 'Meenakshi Sundaram',
        phone: '+91 97890 11223',
        email: 'meenakshi.s@gmail.com',
        shippingAddress: '78, Cross Cut Road, Gandhipuram',
        city: 'Coimbatore',
        postalCode: '641012',
        paymentMethod: 'UPI / PhonePe',
        trackingNumber: 'IND7723910IN'
      }
    ];
  });

  // Admin notes persistence
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('banaya_admin_notes');
      return saved ? JSON.parse(saved) : {
        'STM-84920': 'Delivered via DTDC Courier. Customer praised Honey aroma.',
        'STM-85104': 'Customer requested fresh batch honey jar. Verified via WhatsApp.',
        'STM-85219': 'Joint pain soup ordered for elderly parents. Shipped priority.'
      };
    } catch {
      return {};
    }
  });

  const applyServerSnapshot = useCallback((payload: StoreSyncPayload) => {
    if (Array.isArray(payload.products) && payload.products.length > 0) {
      setProducts(payload.products);
    }
    if (Array.isArray(payload.orders)) {
      setOrders(payload.orders);
    }
    if (payload.adminNotes && typeof payload.adminNotes === 'object') {
      setAdminNotes(payload.adminNotes);
    }
    setServerSynced(true);
    setLastSyncedAt(payload.updatedAt || Date.now());
  }, []);

  const fetchServerStore = useCallback(async () => {
    try {
      const response = await fetch(`/api/store?_t=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = (await response.json()) as StoreSyncPayload;
        applyServerSnapshot(data);
      }
    } catch {
      // Server offline / static mode fallback
    }
  }, [applyServerSnapshot]);

  // Initial server hydration + real-time SSE + cross-tab BroadcastChannel sync
  useEffect(() => {
    fetchServerStore();

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastChannelRef.current = channel;
      channel.onmessage = (event: MessageEvent<StoreSyncPayload>) => {
        if (event.data) {
          applyServerSnapshot(event.data);
        }
      };
    }

    let eventSource: EventSource | null = null;
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('connected', () => {
        setServerSynced(true);
      });
      eventSource.addEventListener('store-update', (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data) as StoreSyncPayload;
          applyServerSnapshot(parsed);
        } catch {
          // ignore malformed SSE chunk
        }
      });
      eventSource.onerror = () => {
        setServerSynced(false);
      };
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchServerStore();
      }
    };

    // Fallback sync every 15s when tab is active
    const syncTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchServerStore();
      }
    }, 15000);

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      eventSource?.close();
      broadcastChannelRef.current?.close();
      window.clearInterval(syncTimer);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [fetchServerStore, applyServerSnapshot]);

  // Local cache fallback (never crashes if quota exceeded)
  useEffect(() => {
    try {
      localStorage.setItem('banaya_products', JSON.stringify(products));
    } catch {
      // Ignore quota errors cleanly since server holds authoritative catalog
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('banaya_admin_notes', JSON.stringify(adminNotes));
    } catch {
      // ignore
    }
  }, [adminNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('startone_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('startone_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('startone_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Keep cart item product snapshots synchronized whenever admin edits prices/images
  useEffect(() => {
    setCart((prevCart) => {
      let changed = false;
      const nextCart = prevCart.map((item) => {
        const latest = products.find((p) => p.id === item.product.id);
        if (
          latest &&
          (latest.price !== item.product.price ||
            latest.originalPrice !== item.product.originalPrice ||
            latest.image !== item.product.image ||
            latest.name !== item.product.name)
        ) {
          changed = true;
          return { ...item, product: latest };
        }
        return item;
      });
      return changed ? nextCart : prevCart;
    });
  }, [products]);

  // Always derive selectedProduct from latest products array so edits update open/reopened detail views automatically
  const selectedProduct = useMemo(() => {
    if (!selectedProductState) return null;
    return products.find((p) => p.id === selectedProductState.id) || selectedProductState;
  }, [selectedProductState, products]);

  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success', productImage?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type, productImage }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, weight?: string) => {
    const latest = products.find(p => p.id === product.id) || product;
    if (!latest.inStock) {
      showToast('Out of Stock', `${latest.name} is currently out of stock.`, 'warning', latest.image);
      return;
    }
    const selectedWeight = weight || latest.defaultWeight;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === latest.id && item.selectedWeight === selectedWeight);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, { product: latest, quantity, selectedWeight }];
    });

    showToast('Added to Cart', `${latest.name} (${selectedWeight}) has been added to your bag.`, 'success', latest.image);
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedWeight === weight)));
    showToast('Removed', 'Item was removed from your bag.', 'info');
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', `${product?.name || 'Item'} was removed from your wishlist.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', `${product?.name || 'Item'} added to your wishlist.`, 'success', product?.image);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BANAYANA10' || cleanCode === 'STARTONE10') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 10, discountFixed: 0 });
      showToast('Coupon Applied!', '10% discount applied to your order.', 'success');
      return { success: true, message: '10% OFF coupon applied successfully!' };
    }
    if (cleanCode === 'NATURAL15') {
      if (cartSubtotal < 999) {
        return { success: false, message: 'NATURAL15 requires a minimum order of ₹999' };
      }
      setAppliedCoupon({ code: 'NATURAL15', discountPercent: 15, discountFixed: 0 });
      showToast('Coupon Applied!', '15% discount applied to your order.', 'success');
      return { success: true, message: '15% OFF coupon applied successfully!' };
    }
    if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discountPercent: 0, discountFixed: 0 });
      showToast('Coupon Applied!', 'Free shipping voucher applied.', 'success');
      return { success: true, message: 'Free shipping voucher applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try BANAYANA10 or NATURAL15' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promo code removed from cart.', 'info');
  };

  const openProductDetail = (product: Product) => {
    setSelectedProductState(product);
    setActiveModal('quickView');
  };

  const openQuickCheckout = (product: Product, weight?: string) => {
    const latest = products.find(p => p.id === product.id) || product;
    if (!latest.inStock) {
      showToast('Out of Stock', `${latest.name} is currently out of stock.`, 'warning', latest.image);
      return;
    }
    addToCart(latest, 1, weight);
    setActiveModal('checkout');
  };

  const openOrderTracking = (orderId: string) => {
    setTrackingLookupId(orderId);
    setActiveModal('trackOrder');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getEffectivePrice = (item: CartItem) => {
    const latest = products.find(p => p.id === item.product.id) || item.product;
    return getPriceForProductWeight(latest, item.selectedWeight).price;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0);

  const freeShippingThreshold = 499;
  const isFreeShippingByValue = cartSubtotal >= freeShippingThreshold;
  const isFreeShippingByCoupon = appliedCoupon?.code === 'FREESHIP';
  const cartShipping = cartSubtotal === 0 || isFreeShippingByValue || isFreeShippingByCoupon ? 0 : 60;

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFixed > 0 && !isFreeShippingByValue) {
      cartDiscount = appliedCoupon.discountFixed;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  const placeOrder = (details: {
    customerName: string;
    phone: string;
    email: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
    transactionId?: string;
    bankRef?: string;
  }): Order => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `BNY${Math.floor(10000000 + Math.random() * 90000000)}IN`;
    const txnId = details.transactionId || `TXN-BNY-${Date.now().toString().slice(-6)}`;
    const bankRef = details.bankRef || `SBI${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const newOrder: Order = {
      id: `BNY-${orderNumber}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      totalAmount: cartTotal,
      status: 'Confirmed',
      customerName: details.customerName,
      phone: details.phone,
      email: details.email,
      shippingAddress: details.shippingAddress,
      city: details.city,
      postalCode: details.postalCode,
      paymentMethod: details.paymentMethod,
      trackingNumber: trackingCode,
      transactionId: txnId,
      bankRef: bankRef
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Sync new order to live server store
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {
      // ignore if offline
    });

    return newOrder;
  };

  const trackOrderById = (orderId: string): Order | null => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId) || null;
  };

  // Product Management (Admin) -> Optimistic UI + Authoritative Server Sync + Cross-Tab Broadcast
  const updateProduct = async (updatedProduct: Product) => {
    let nextProducts: Product[] = [];
    setProducts(prev => {
      nextProducts = prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
      return nextProducts;
    });

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(updatedProduct.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': ADMIN_PASSKEY
        },
        body: JSON.stringify(updatedProduct)
      });

      if (res.ok) {
        const data = (await res.json()) as StoreSyncPayload;
        applyServerSnapshot(data);
        broadcastChannelRef.current?.postMessage({ products: data.products, updatedAt: data.updatedAt });
        showToast(
          'Synced Live to Website',
          `${updatedProduct.name} (₹${updatedProduct.price}) is now live across the store.`,
          'success',
          updatedProduct.image
        );
        return;
      }
    } catch {
      // fallback below
    }

    broadcastChannelRef.current?.postMessage({ products: nextProducts, updatedAt: Date.now() });
    showToast('Product Updated', `${updatedProduct.name} has been updated.`, 'success', updatedProduct.image);
  };

  const addProduct = async (newProduct: Product) => {
    let nextProducts: Product[] = [];
    setProducts(prev => {
      nextProducts = [newProduct, ...prev];
      return nextProducts;
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': ADMIN_PASSKEY
        },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        const data = (await res.json()) as StoreSyncPayload;
        applyServerSnapshot(data);
        broadcastChannelRef.current?.postMessage({ products: data.products, updatedAt: data.updatedAt });
        showToast('Launched Live to Website', `${newProduct.name} is now live in the storefront catalog.`, 'success', newProduct.image);
        return;
      }
    } catch {
      // fallback below
    }

    broadcastChannelRef.current?.postMessage({ products: nextProducts, updatedAt: Date.now() });
    showToast('Product Added', `${newProduct.name} has been added to catalog.`, 'success', newProduct.image);
  };

  const deleteProduct = async (productId: string) => {
    const prod = products.find(p => p.id === productId);
    let nextProducts: Product[] = [];
    setProducts(prev => {
      nextProducts = prev.filter(p => p.id !== productId);
      return nextProducts;
    });

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passkey': ADMIN_PASSKEY
        }
      });

      if (res.ok) {
        const data = (await res.json()) as StoreSyncPayload;
        applyServerSnapshot(data);
        broadcastChannelRef.current?.postMessage({ products: data.products, updatedAt: data.updatedAt });
        showToast('Removed from Live Store', `${prod?.name || 'Product'} removed from live website.`, 'info');
        return;
      }
    } catch {
      // fallback below
    }

    broadcastChannelRef.current?.postMessage({ products: nextProducts, updatedAt: Date.now() });
    showToast('Product Deleted', `${prod?.name || 'Product'} removed from catalog.`, 'info');
  };

  // Order & Customer Management (Admin)
  const updateOrderStatus = (orderId: string, status: Order['status'], trackingNumber?: string, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber
        };
      }
      return o;
    }));

    if (note !== undefined) {
      setAdminNotes(prev => ({ ...prev, [orderId]: note }));
    }

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passkey': ADMIN_PASSKEY
      },
      body: JSON.stringify({ status, trackingNumber, note })
    }).catch(() => {
      // ignore if offline
    });

    showToast('Order Updated', `Order ${orderId} updated to status "${status}".`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
      headers: { 'x-admin-passkey': ADMIN_PASSKEY }
    }).catch(() => {
      // ignore if offline
    });

    showToast('Order Removed', `Order ${orderId} deleted from records.`, 'info');
  };

  const setAdminNotesForOrder = (orderId: string, note: string) => {
    setAdminNotes(prev => ({ ...prev, [orderId]: note }));

    fetch(`/api/admin-notes/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passkey': ADMIN_PASSKEY
      },
      body: JSON.stringify({ note })
    }).catch(() => {
      // ignore if offline
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        activeModal,
        selectedProduct,
        searchQuery,
        selectedCategory,
        sortBy,
        toasts,
        appliedCoupon,
        serverSynced,
        lastSyncedAt,
        setActiveModal,
        setSelectedProduct,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        trackOrderById,
        showToast,
        dismissToast,
        openProductDetail,
        openQuickCheckout,
        trackingLookupId,
        setTrackingLookupId,
        openOrderTracking,
        updateProduct,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        adminNotes,
        setAdminNotesForOrder,
        getEffectivePrice,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        freeShippingThreshold,
        freeShippingRemaining
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

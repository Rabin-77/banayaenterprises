import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Lock, KeyRound, Eye, EyeOff, LayoutDashboard, Package,
  Users, ShoppingBag, TrendingUp, Search, Filter, Plus, Edit2, Trash2,
  CheckCircle2, Clock, Truck, AlertCircle, X, Save, RefreshCw, ChevronRight,
  ExternalLink, Phone, Mail, MapPin, DollarSign, ArrowUpRight, BarChart3,
  Calendar, Check, AlertTriangle, ShieldAlert, Sparkles, MessageCircle, LogOut,
  SlidersHorizontal, CheckSquare, Layers, FileSpreadsheet
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import { CATEGORIES } from '../data/categories';

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
    showToast
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

  // Start Editing a Product
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingNewProduct(false);
    setProductForm({ ...prod });
  };

  // Start Adding a New Product
  const handleStartNewProduct = () => {
    setIsCreatingNewProduct(true);
    setEditingProduct(null);
    setProductForm({
      id: `banaya-item-${Date.now().toString().slice(-4)}`,
      name: '',
      tamilName: '',
      tagline: '100% Pure Natural Herb & Wellness Specialty',
      category: 'Traditional Wellness',
      categorySlug: 'traditional-wellness',
      price: 250,
      originalPrice: 300,
      rating: 4.9,
      reviewsCount: 12,
      inStock: true,
      weightOptions: ['100g', '250g', '500g'],
      defaultWeight: '100g',
      badges: ['100% Pure', 'New Batch'],
      image: '/images/banaya_honey.jpg',
      gallery: ['/images/banaya_honey.jpg'],
      description: 'Handcrafted fresh natural formulation from Banaya Enterprise.',
      ingredients: ['100% Pure Native Botanical Ingredients'],
      keyBenefits: ['Supports natural immunity', 'Zero artificial chemicals'],
      howToUse: 'Consume 1 teaspoon daily with warm water or milk.',
      origin: 'Banaya Enterprise, Tamil Nadu',
      isBestSeller: false,
      isNew: true
    });
  };

  // Save Product (Edit or Create)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Product Name and Price are required.');
      return;
    }

    const compiledProduct: Product = {
      id: productForm.id || `product-${Date.now()}`,
      name: productForm.name,
      tamilName: productForm.tamilName || '',
      tagline: productForm.tagline || '100% Pure Natural Herb & Wellness',
      category: productForm.category || 'Traditional Wellness',
      categorySlug: productForm.categorySlug || 'traditional-wellness',
      price: Number(productForm.price) || 200,
      originalPrice: Number(productForm.originalPrice) || Number(productForm.price) * 1.25,
      rating: Number(productForm.rating) || 4.9,
      reviewsCount: Number(productForm.reviewsCount) || 10,
      inStock: productForm.inStock !== false,
      weightOptions: productForm.weightOptions || ['100g', '250g'],
      defaultWeight: productForm.defaultWeight || '100g',
      badges: productForm.badges || ['100% Pure'],
      image: productForm.image || '/images/banaya_honey.jpg',
      gallery: productForm.gallery && productForm.gallery.length > 0 ? productForm.gallery : [productForm.image || '/images/banaya_honey.jpg'],
      description: productForm.description || '',
      ingredients: Array.isArray(productForm.ingredients) ? productForm.ingredients : [String(productForm.ingredients || '')],
      keyBenefits: Array.isArray(productForm.keyBenefits) ? productForm.keyBenefits : [String(productForm.keyBenefits || '')],
      howToUse: productForm.howToUse || '',
      origin: productForm.origin || 'Banaya Enterprise, Tamil Nadu',
      isBestSeller: !!productForm.isBestSeller,
      isNew: !!productForm.isNew
    };

    if (isCreatingNewProduct) {
      addProduct(compiledProduct);
    } else {
      updateProduct(compiledProduct);
    }

    setEditingProduct(null);
    setIsCreatingNewProduct(false);
    setProductForm({});
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
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products by name, Tamil name, ID..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
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
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Default Weight</th>
                            <th className="py-3 px-4">Customer Rate (MRP)</th>
                            <th className="py-3 px-4">Stock Status</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map(prod => (
                            <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-heading font-bold text-slate-900 text-sm">{prod.name}</div>
                                    {prod.tamilName && (
                                      <div className="text-[11px] text-emerald-700 font-medium">{prod.tamilName}</div>
                                    )}
                                    <div className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                  {prod.category}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-medium text-slate-700">
                                {prod.defaultWeight}
                              </td>

                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900 text-sm">
                                  {formatINR(prod.price)}
                                </div>
                                <div className="text-[10px] text-slate-400 line-through">
                                  {formatINR(prod.originalPrice)}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <button
                                  onClick={() => {
                                    updateProduct({ ...prod, inStock: !prod.inStock });
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
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer transition-colors inline-flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit Rate</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                      deleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
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
            className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
            onClick={() => {
              setEditingProduct(null);
              setIsCreatingNewProduct(false);
            }}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingNewProduct(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-heading text-xl font-bold text-slate-950 mb-1">
                {isCreatingNewProduct ? 'Add New Product to Store' : `Edit Product: ${editingProduct?.name}`}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Update prices, weights, stock status, descriptions, and packaging imagery.
              </p>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Product Name (English)*:
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name || ''}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Wildflower Honey"
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
                      placeholder="e.g. சுத்தமான தேன்"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Customer Price (₹)*:
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price || ''}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      placeholder="e.g. 300"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Original Price / MRP (₹):
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      placeholder="e.g. 380"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Default Weight / Unit:
                    </label>
                    <input
                      type="text"
                      value={productForm.defaultWeight || ''}
                      onChange={(e) => setProductForm({ ...productForm, defaultWeight: e.target.value })}
                      placeholder="e.g. 500g or 100g"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category:
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Inventory Stock Status:
                    </label>
                    <select
                      value={productForm.inStock ? 'true' : 'false'}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === 'true' })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="true">In Stock (Available for Purchase)</option>
                      <option value="false">Out of Stock (Disabled)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Image Path / URL:
                  </label>
                  <input
                    type="text"
                    value={productForm.image || ''}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/images/banaya_honey.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-600"
                  />
                  <div className="flex gap-2 mt-2">
                    {['/images/banaya_honey.jpg', '/images/malai_thean_bottle.jpg', '/images/banaya_amla.webp', '/images/banaya_rose_gulkand.jpg', '/images/karuppu_kavuni_kanji_front.jpg', '/images/abc_malt_front.jpg', '/images/mudavatukal_soup_front.jpeg', '/images/curry_leaf_pouch_front.jpg', '/images/murungai_pouch_front.jpg'].map((path) => (
                      <button
                        key={path}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: path })}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600 truncate max-w-[120px]"
                      >
                        {path.split('/').pop()}
                      </button>
                    ))}
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

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Description:
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Detailed explanation of product benefits, traditional sourcing, and pure ingredients."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    How To Use & Dosage Instructions:
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.howToUse || ''}
                    onChange={(e) => setProductForm({ ...productForm, howToUse: e.target.value })}
                    placeholder="Serving suggestions, milk/water ratio, time of day."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingNewProduct(false);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save Product Changes</span>
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

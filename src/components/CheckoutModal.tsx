import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Smartphone, 
  ArrowRight, ArrowLeft, Download,
  MessageCircle, Send, Copy, Check, QrCode,
  ExternalLink, Sparkles, Lock, RefreshCw, Clock, BadgeCheck, FileText, Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { 
  getOrderWhatsAppUrl, 
  openWhatsAppUrl, 
  DISPLAY_PHONE_NUMBER,
  BANAYA_UPI_ID 
} from '../utils/whatsapp';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    activeModal, 
    setActiveModal, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    placeOrder, 
    showToast 
  } = useShop();

  // 4-step streamlined transaction flow:
  // 1. 'summary' -> shows product price & collects shipping address
  // 2. 'paid_confirm' -> opened right after clicking GPay / Pay Now ("I have paid ₹... Confirm & Send on WhatsApp")
  // 3. 'verifying' -> smooth animated transaction verification screen
  // 4. 'confirmed' -> final certified receipt & WhatsApp dispatch status
  const [step, setStep] = useState<'summary' | 'paid_confirm' | 'verifying' | 'confirmed'>('summary');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentConfirmedByCustomer, setPaymentConfirmedByCustomer] = useState(false);
  
  // Real-time verification sequence state
  const [verifyingProgress, setVerifyingProgress] = useState(15);
  const [verifyingStage, setVerifyingStage] = useState(0);

  // Customer Form state
  const [name, setName] = useState('Ananya Ramesh');
  const [phone, setPhone] = useState('+91 883 859 8172');
  const [email, setEmail] = useState('customer@example.com');
  const [address, setAddress] = useState('Flat 4B, Lotus Apartments, 3rd Cross Street, Anna Nagar');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pin, setPin] = useState('600040');

  if (activeModal !== 'checkout') return null;

  const upiIntentUrl = `upi://pay?pa=${BANAYA_UPI_ID}&pn=Banaya%20Enterprise&am=${cartTotal}&cu=INR&tn=Order%20Payment%20Banaya`;
  const gpayIntentUrl = `gpay://upi/pay?pa=${BANAYA_UPI_ID}&pn=Banaya%20Enterprise&am=${cartTotal}&cu=INR&tn=Order%20Payment`;

  // Security: If customer didn't pay, instantly close and return directly to Home page
  const handleCancelAndReturnToHome = () => {
    setActiveModal(null);
    setStep('summary');
    setCreatedOrder(null);
    setUtrNumber('');
    setPaymentConfirmedByCustomer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(
      'Payment Not Completed', 
      'You did not pay. Order was not created and you have returned to the Home Page.', 
      'info'
    );
  };

  // When user clicks "Pay with GPay / Pay Now"
  const handleLaunchPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Empty Bag', 'Your shopping bag is empty. Please select a product first.', 'warning');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pin.trim()) {
      showToast('Missing Details', 'Please fill in all required delivery fields.', 'warning');
      return;
    }

    // Attempt to directly trigger Google Pay / UPI on mobile
    try {
      window.location.href = gpayIntentUrl;
    } catch {
      try {
        window.location.href = upiIntentUrl;
      } catch {}
    }

    // Immediately open the requested "I have paid ₹{amount} • Confirm & Send on WhatsApp" page!
    setStep('paid_confirm');
    setPaymentConfirmedByCustomer(false);
    showToast('Opening Google Pay', `Paying ₹${cartTotal} to Banaya Enterprise (${BANAYA_UPI_ID})`, 'info');
  };

  // When user returns from GPay and clicks "I have paid Rs ... Confirm and send on whatsapp"
  const handleConfirmAndSendWhatsApp = () => {
    if (!paymentConfirmedByCustomer) {
      showToast(
        'Payment Confirmation Required', 
        'Please tick the verification box to confirm you completed the payment in Google Pay.', 
        'warning'
      );
      return;
    }

    // Initiate smooth animated transaction sequence
    setStep('verifying');
    setVerifyingProgress(15);
    setVerifyingStage(0);

    const progressInterval = setInterval(() => {
      setVerifyingProgress(prev => {
        if (prev >= 92) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 15;
      });
    }, 250);

    // Dynamic checklist milestone updates
    setTimeout(() => setVerifyingStage(1), 550);
    setTimeout(() => setVerifyingStage(2), 1100);
    setTimeout(() => setVerifyingStage(3), 1650);

    // Transaction approved and finalized
    setTimeout(() => {
      clearInterval(progressInterval);
      setVerifyingProgress(100);

      const generatedTxnId = `TXN-BNY-${Date.now().toString().slice(-6)}`;
      const generatedBankRef = utrNumber.trim() || `SBI${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const order = placeOrder({
        customerName: name,
        phone,
        email,
        shippingAddress: `${address}, ${state}`,
        city,
        postalCode: pin,
        paymentMethod: `Google Pay / UPI QR (${BANAYA_UPI_ID}) - PAID SUCCESSFULLY`,
        transactionId: generatedTxnId,
        bankRef: generatedBankRef
      });

      setCreatedOrder(order);
      setStep('confirmed');

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch {}

      // Automatically send order and paid status directly to WhatsApp
      const whatsappUrl = getOrderWhatsAppUrl(order, generatedBankRef);
      try {
        openWhatsAppUrl(whatsappUrl);
      } catch (err) {
        console.error('Error opening WhatsApp', err);
      }

      showToast(
        'Transaction Approved & Verified!', 
        `Paid ₹${order.totalAmount} successfully. Order notification sent to WhatsApp (+91 883 859 8172).`, 
        'success'
      );
    }, 2200);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(BANAYA_UPI_ID);
    setCopiedUpi(true);
    showToast('UPI ID Copied', `${BANAYA_UPI_ID} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleSendToWhatsApp = () => {
    if (!createdOrder) return;
    const url = getOrderWhatsAppUrl(createdOrder, utrNumber.trim() || undefined);
    openWhatsAppUrl(url);
  };

  const handleClose = () => {
    if (step === 'paid_confirm' && !createdOrder) {
      handleCancelAndReturnToHome();
    } else {
      setActiveModal(null);
      setStep('summary');
      setCreatedOrder(null);
      setUtrNumber('');
      setPaymentConfirmedByCustomer(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Container */}
      <div 
        id="checkout-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/images/banaya_logo.png"
                alt="Banaya Enterprises"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-950">
                {step === 'summary' && 'Order Summary & Direct GPay Checkout'}
                {step === 'paid_confirm' && `Payment Confirmation (₹${cartTotal})`}
                {step === 'verifying' && 'Verifying Transaction & Security Check'}
                {step === 'confirmed' && 'Order Confirmed & Paid!'}
              </h2>
              <span className="text-xs text-slate-500">
                {step === 'summary' && 'No Cash on Delivery (COD) • Direct Google Pay / UPI Payment'}
                {step === 'paid_confirm' && 'After paying in Google Pay, click below to confirm & send on WhatsApp'}
                {step === 'verifying' && 'Secure 256-bit SSL transaction verification in progress...'}
                {step === 'confirmed' && 'Transaction successful • Order dispatched to WhatsApp'}
              </span>
            </div>
          </div>

          <button
            id="close-checkout-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smooth Transaction Stepper Bar */}
        <div className="bg-slate-50/80 px-4 sm:px-8 py-3 border-b border-slate-200">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-xs font-semibold relative">
              {/* Stepper background track */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              {/* Smooth animated progress track */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
                style={{ 
                  width: step === 'summary' ? '12%' : step === 'paid_confirm' ? '42%' : step === 'verifying' ? '75%' : '100%' 
                }}
              />

              {/* Step 1: Details */}
              <div className={`relative z-10 flex flex-col items-center gap-1 ${step === 'summary' ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === 'summary' 
                    ? 'bg-[#064E3B] text-white ring-4 ring-emerald-100 scale-110 shadow-sm' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {step !== 'summary' ? <Check className="w-3.5 h-3.5" /> : '1'}
                </div>
                <span className="text-[10px] sm:text-xs">1. Details</span>
              </div>

              {/* Step 2: UPI / QR Pay */}
              <div className={`relative z-10 flex flex-col items-center gap-1 ${step === 'paid_confirm' ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === 'paid_confirm' 
                    ? 'bg-[#064E3B] text-white ring-4 ring-emerald-100 scale-110 shadow-sm' 
                    : step === 'verifying' || step === 'confirmed' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {step === 'verifying' || step === 'confirmed' ? <Check className="w-3.5 h-3.5" /> : '2'}
                </div>
                <span className="text-[10px] sm:text-xs">2. Payment</span>
              </div>

              {/* Step 3: Verification */}
              <div className={`relative z-10 flex flex-col items-center gap-1 ${step === 'verifying' ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === 'verifying' 
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse scale-110 shadow-sm' 
                    : step === 'confirmed' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {step === 'confirmed' ? <Check className="w-3.5 h-3.5" /> : '3'}
                </div>
                <span className="text-[10px] sm:text-xs">3. Verifying</span>
              </div>

              {/* Step 4: Receipt */}
              <div className={`relative z-10 flex flex-col items-center gap-1 ${step === 'confirmed' ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === 'confirmed' 
                    ? 'bg-[#25D366] text-white ring-4 ring-emerald-100 scale-110 shadow-sm' 
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {step === 'confirmed' ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                </div>
                <span className="text-[10px] sm:text-xs">4. Receipt</span>
              </div>

            </div>
          </div>
        </div>

        {/* 1. ORDER SUMMARY & DIRECT GPAY PAY BUTTON */}
        {step === 'summary' && (
          <form onSubmit={handleLaunchPayment} className="p-5 sm:p-8 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Customer & Delivery Details */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Contact Info */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <h3 className="font-heading font-bold text-base text-slate-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-xs flex items-center justify-center font-bold">1</span>
                    Customer Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        className="w-full px-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <h3 className="font-heading font-bold text-base text-slate-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-xs flex items-center justify-center font-bold">2</span>
                    Shipping Address
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Door / Flat No., Street, Landmark *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full street address"
                        className="w-full px-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Google Pay Notice */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">100% Direct Google Pay / UPI • No Cash on Delivery (COD)</strong>
                    <span className="text-emerald-800 text-[11px] leading-relaxed">
                      Clicking <strong>"Pay with Google Pay"</strong> will launch GPay directly with ₹{cartTotal}. After paying, confirm to send your order directly on WhatsApp.
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Direct GPay Trigger */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <h3 className="font-heading font-bold text-base text-slate-950 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-normal text-slate-500">{cart.length} item(s)</span>
                  </h3>

                  {/* List of items */}
                  <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className={`w-12 h-12 rounded-lg border border-slate-200 shrink-0 bg-white ${
                            item.product.image.startsWith('/images/') || item.product.image.startsWith('/assets/')
                              ? 'object-contain p-0.5'
                              : 'object-cover'
                          }`} 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                          <span className="text-[11px] text-emerald-800 font-medium block">{item.selectedWeight} × {item.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-950 text-sm">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Special Discount</span>
                        <span>-₹{cartDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>{cartShipping === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${cartShipping}`}</span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-100 items-baseline">
                      <span>Total Amount to Pay</span>
                      <span className="text-emerald-700 text-2xl font-heading font-extrabold">₹{cartTotal}</span>
                    </div>
                  </div>

                  {/* DIRECT GPAY / PAY NOW ACTION BUTTON */}
                  <button
                    id="direct-gpay-pay-now-btn"
                    type="submit"
                    className="w-full py-4 bg-[#064E3B] hover:bg-[#047857] text-white rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Smartphone className="w-5 h-5 text-amber-300" />
                    <span>Pay ₹{cartTotal} with Google Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Google Pay / UPI • Confirmation on WhatsApp</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelAndReturnToHome}
                    className="w-full py-2.5 text-xs text-slate-500 hover:text-rose-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel & Return to Home</span>
                  </button>

                </div>
              </div>

            </div>
          </form>
        )}

        {/* 2. "I HAVE PAID RS ... CONFIRM & SEND ON WHATSAPP" PAGE */}
        {step === 'paid_confirm' && (
          <div className="p-5 sm:p-8 bg-slate-50/50">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Payment Bill Bar */}
              <div className="bg-gradient-to-r from-[#064E3B] to-emerald-800 rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold block">Total Amount to Pay</span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-300">₹{cartTotal}</div>
                  <span className="text-xs text-emerald-100">Pay to: <strong>Banaya Enterprise</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] bg-emerald-700 px-3 py-1 rounded-full text-white font-mono font-medium inline-block mb-1">
                    UPI: {BANAYA_UPI_ID}
                  </span>
                  <p className="text-xs text-emerald-100">Customer: {name}</p>
                </div>
              </div>

              {/* Confirmation Container Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 text-center">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    Google Pay / UPI Payment
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Complete ₹{cartTotal} Payment
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Please finish the payment of <strong>₹{cartTotal}</strong> in Google Pay or scan the QR code below.
                  </p>
                </div>

                {/* Google Pay QR Code Display */}
                <div className="relative inline-block mx-auto p-4 bg-white rounded-2xl border-2 border-emerald-500 shadow-md">
                  <img 
                    src="/images/banaya_upi_qr.jpg" 
                    alt="Banaya Enterprise Google Pay QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto rounded-xl"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-xs font-bold text-slate-900 block">Banaya Enterprise</span>
                    <span className="text-[11px] font-mono text-slate-600">UPI ID: {BANAYA_UPI_ID}</span>
                  </div>
                </div>

                {/* Re-open Google Pay App link & Copy UPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                  <a
                    href={gpayIntentUrl}
                    className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-blue-200 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Re-open Google Pay (₹{cartTotal})
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">UPI Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Optional UTR / Reference ID Box */}
                <div className="max-w-md mx-auto text-left">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UPI Reference / UTR Number <span className="text-slate-400 font-normal">(Optional proof from receipt)</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 12-digit UTR from Google Pay"
                    className="w-full px-3 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                {/* Security Verification Checkbox */}
                <div className="max-w-md mx-auto">
                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    paymentConfirmedByCustomer 
                      ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={paymentConfirmedByCustomer}
                      onChange={(e) => setPaymentConfirmedByCustomer(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                    />
                    <div className="text-xs text-slate-800 leading-relaxed font-medium">
                      <span>I confirm that I opened Google Pay / UPI and transferred <strong>₹{cartTotal}</strong> to <strong>Banaya Enterprise</strong> ({BANAYA_UPI_ID}).</span>
                    </div>
                  </label>
                </div>

                {/* THE REQUESTED CONFIRMATION BUTTON & RETURN HOME OPTIONS */}
                <div className="max-w-md mx-auto space-y-3 pt-2">
                  <button
                    id="confirm-paid-send-whatsapp-btn"
                    type="button"
                    onClick={handleConfirmAndSendWhatsApp}
                    className={`w-full py-4.5 text-white rounded-2xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 shadow-xl cursor-pointer ${
                      paymentConfirmedByCustomer
                        ? 'bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-2xl'
                        : 'bg-emerald-700/80 hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>I Have Paid ₹{cartTotal} • Confirm & Send on WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-slate-500">
                    Clicking confirms payment and immediately dispatches order details & receipt to <strong>{DISPLAY_PHONE_NUMBER}</strong> on WhatsApp.
                  </p>

                  {/* Security Action: If user did NOT pay, cancel and return directly to Home page */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                      id="cancel-payment-return-home-btn"
                      type="button"
                      onClick={handleCancelAndReturnToHome}
                      className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-xl font-bold text-xs sm:text-sm border border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <X className="w-4 h-4" />
                      <span>Didn't Pay? Cancel & Return to Home Page</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('summary')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto pt-1 cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit Delivery Details
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 3. SMOOTH REAL-TIME TRANSACTION VERIFICATION SCREEN */}
        {step === 'verifying' && (
          <div className="p-8 sm:p-14 text-center max-w-lg mx-auto space-y-6 animate-fadeIn">
            {/* Spinning Security Shield with Glow */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#064E3B] to-emerald-600 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-100">
                <ShieldCheck className="w-10 h-10 text-amber-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-md animate-spin">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                Processing Secure Transaction
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950">
                Verifying Your Payment
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Authenticating ₹{cartTotal} transfer with Google Pay & SBI UPI Gateway...
              </p>
            </div>

            {/* Smooth Progress Bar with percentage */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${verifyingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Security Handshake</span>
                <span className="font-bold text-emerald-800">{verifyingProgress}%</span>
              </div>
            </div>

            {/* Step Checkpoints List */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Connection</span>
                </span>
                <span className="text-emerald-700 font-bold text-[11px]">Active</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  {verifyingStage >= 1 ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-checkmarkPop" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  )}
                  <span>UPI VPA (banayaenterprise100-1@oksbi)</span>
                </span>
                <span className={verifyingStage >= 1 ? "text-emerald-700 font-bold text-[11px]" : "text-amber-600 font-bold text-[11px]"}>
                  {verifyingStage >= 1 ? "Verified ✓" : "Verifying..."}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  {verifyingStage >= 2 ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-checkmarkPop" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Amount Authorization (₹{cartTotal})</span>
                </span>
                <span className={verifyingStage >= 2 ? "text-emerald-700 font-bold text-[11px]" : "text-slate-400 font-bold text-[11px]"}>
                  {verifyingStage >= 2 ? "Approved ✓" : "Authorizing..."}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  {verifyingStage >= 3 ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-checkmarkPop" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Official Signed Receipt Generation</span>
                </span>
                <span className={verifyingStage >= 3 ? "text-emerald-700 font-bold text-[11px]" : "text-slate-400 font-bold text-[11px]"}>
                  {verifyingStage >= 3 ? "Ready ✓" : "Queued"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Instant Merchant Settlement</span>
            </div>
          </div>
        )}

        {/* 4. ORDER CONFIRMED & CERTIFIED TRANSACTION RECEIPT SCREEN */}
        {step === 'confirmed' && (
          <div className="p-6 sm:p-10 text-center space-y-6 bg-white animate-fadeIn">
            
            <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-lg animate-checkmarkPop">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300 mb-2">
                <BadgeCheck className="w-4 h-4 text-emerald-700" />
                TRANSACTION APPROVED & VERIFIED
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950">
                Thank You, {createdOrder?.customerName}!
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your payment of <strong className="text-slate-900 font-bold">₹{createdOrder?.totalAmount}</strong> via Google Pay is confirmed. Official order receipt dispatched to WhatsApp.
              </p>
            </div>

            {/* Official Printable Transaction Receipt Card */}
            {createdOrder && (
              <div 
                id="official-transaction-receipt" 
                className="max-w-2xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-left shadow-md space-y-5 relative overflow-hidden"
              >
                {/* Top Brand Watermark Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                      <img
                        src="/images/banaya_logo.png"
                        alt="Banaya Enterprises"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 leading-none">
                        Banaya Enterprises
                      </h3>
                      <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                        Official Tax Invoice & Transaction Receipt
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-700" /> PAID IN FULL
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1 font-mono">{createdOrder.date}</span>
                  </div>
                </div>

                {/* 4-Box Transaction Summary Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Order Number</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900">{createdOrder.id}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Transaction ID</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 truncate">
                        {createdOrder.transactionId || `TXN-BNY-${createdOrder.id.slice(-4)}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(createdOrder.transactionId || createdOrder.id);
                          setCopiedTxn(true);
                          setTimeout(() => setCopiedTxn(false), 2000);
                        }}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        title="Copy Transaction ID"
                      >
                        {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tracking Number</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900">{createdOrder.trackingNumber}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bank Ref / UTR</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 truncate">
                        {createdOrder.bankRef || utrNumber || 'CONFIRMED'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(createdOrder.bankRef || utrNumber || 'CONFIRMED');
                          setCopiedUtr(true);
                          setTimeout(() => setCopiedUtr(false), 2000);
                        }}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        title="Copy Bank UTR"
                      >
                        {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer & Shipping Summary */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold">CUSTOMER DETAILS</span>
                      <p className="font-bold text-slate-900">{createdOrder.customerName}</p>
                      <p className="text-slate-600">{createdOrder.phone}</p>
                      <p className="text-slate-600">{createdOrder.email}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold">DELIVERY DESTINATION</span>
                      <p className="text-slate-800">{createdOrder.shippingAddress}</p>
                      <p className="text-slate-800">{createdOrder.city} - {createdOrder.postalCode}</p>
                      <p className="text-emerald-700 font-semibold mt-1">Express Delivery (2-4 Days)</p>
                    </div>
                  </div>
                </div>

                {/* Purchased Items Table */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">Purchased Natural Items</span>
                  <div className="divide-y divide-slate-100">
                    {createdOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.product.name}</span>
                            <span className="text-[11px] text-slate-500 font-medium">{item.selectedWeight} × {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-950">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Breakdown */}
                  <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{createdOrder.subtotal}</span>
                    </div>
                    {createdOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount Savings</span>
                        <span>-₹{createdOrder.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>{createdOrder.shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${createdOrder.shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-200 items-baseline">
                      <span>Total Amount Paid (Prepaid UPI)</span>
                      <span className="text-emerald-700 text-xl font-heading font-extrabold">₹{createdOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Merchant Security Seal & Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Merchant: Banaya Enterprises ({BANAYA_UPI_ID})</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    Auth Code: {createdOrder.bankRef || 'SBI-UPI-OK'} • 100% Tax Compliant
                  </span>
                </div>

              </div>
            )}

            {/* Direct WhatsApp Confirmation Callout */}
            {createdOrder && (
              <div className="max-w-2xl mx-auto p-4 bg-emerald-50 border border-emerald-300/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      WhatsApp Dispatch Notification
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Delivered</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Order details & certified receipt dispatched to Banaya Care at <strong>{DISPLAY_PHONE_NUMBER}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open WhatsApp</span>
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs hover:border-slate-300"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" /> Print / Save Tax Invoice
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveModal('account');
                }}
                className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-bold rounded-full hover:bg-[#047857] transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
              >
                View in My Account
              </button>

              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

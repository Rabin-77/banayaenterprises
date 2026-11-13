import { Order, Product } from '../types';
import { getPriceForProductWeight } from './pricing';

export const WHATSAPP_CONTACT_NUMBER = '918838598172';
export const DISPLAY_PHONE_NUMBER = '+91 883 859 8172';
export const BANAYA_UPI_ID = 'banayaenterprise100-1@oksbi';

/**
 * Builds a formatted WhatsApp text message for a complete customer order.
 */
export function formatOrderWhatsAppMessage(order: Order, transactionId?: string): string {
  const itemsText = order.items
    .map((item, idx) => {
      const unitPrice = getPriceForProductWeight(item.product, item.selectedWeight).price;
      const price = unitPrice * item.quantity;
      return `${idx + 1}. *${item.product.name}* (${item.selectedWeight}) × ${item.quantity} = ₹${price}`;
    })
    .join('\n');

  return `🌿 *NEW PREPAID ORDER - BANAYANA ENTERPRISE* 🌿
----------------------------------------
✅ *PAYMENT STATUS: PAID SUCCESSFULLY*
• *Payment Mode:* Online UPI QR (${BANAYA_UPI_ID})
• *Amount Paid:* *₹${order.totalAmount}*
${transactionId ? `• *UPI Ref / UTR:* ${transactionId}\n` : ''}• *Payment Verification:* Paid & Confirmed by Customer

📋 *ORDER DETAILS:*
• *Order ID:* ${order.id}
• *Date:* ${order.date}
• *Tracking Code:* ${order.trackingNumber}
• *Order Status:* Confirmed (Prepaid)

👤 *CUSTOMER SHIPPING DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.phone}
• *Email:* ${order.email || 'N/A'}
• *Delivery Address:* ${order.shippingAddress}, ${order.city} - ${order.postalCode}

🛍️ *PRODUCTS ORDERED:*
${itemsText}

----------------------------------------
💰 *BILLING SUMMARY:*
• *Subtotal:* ₹${order.subtotal}
${order.discount > 0 ? `• *Discount Applied:* -₹${order.discount}\n` : ''}• *Delivery Charge:* ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
• *TOTAL AMOUNT PAID:* *₹${order.totalAmount}*
----------------------------------------
🚚 *Action Required:* Payment is completed via UPI QR. Please pack and dispatch this order. Thank you!`;
}

/**
 * Generates the full wa.me link for a placed order.
 */
export function getOrderWhatsAppUrl(
  order: Order, 
  transactionId?: string, 
  phone: string = WHATSAPP_CONTACT_NUMBER
): string {
  const message = formatOrderWhatsAppMessage(order, transactionId);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct product booking message for 1-click booking from product cards or product modals.
 */
export function formatProductBookingMessage(params: {
  product: Product;
  selectedWeight: string;
  quantity: number;
  price: number;
  customerName?: string;
  customerPhone?: string;
  customerCity?: string;
  paidViaUpi?: boolean;
}): string {
  const { product, selectedWeight, quantity, price, customerName, customerPhone, customerCity, paidViaUpi } = params;
  const totalPrice = price * quantity;

  let msg = `🌿 *${paidViaUpi ? 'PREPAID PRODUCT ORDER' : 'PRODUCT INQUIRY'} - BANAYANA ENTERPRISE* 🌿
----------------------------------------
${paidViaUpi ? `✅ *PAYMENT STATUS: PAID VIA UPI QR*\n• *Amount:* ₹${totalPrice}\n• *UPI ID:* ${BANAYA_UPI_ID}\n----------------------------------------\n` : ''}🛍️ *PRODUCT DETAILS:*
• *Product Name:* ${product.name}
${product.tamilName ? `• *Tamil Name:* ${product.tamilName}\n` : ''}• *Category:* ${product.category}
• *Selected Pack:* ${selectedWeight}
• *Quantity:* ${quantity}
• *Unit Price:* ₹${price}
• *Total Payable:* *₹${totalPrice}*`;

  if (customerName || customerPhone || customerCity) {
    msg += `\n\n👤 *CUSTOMER DETAILS:*`;
    if (customerName) msg += `\n• *Name:* ${customerName}`;
    if (customerPhone) msg += `\n• *Phone:* ${customerPhone}`;
    if (customerCity) msg += `\n• *Location:* ${customerCity}`;
  }

  msg += `\n\n----------------------------------------
Hello Banayana Enterprise, ${paidViaUpi ? 'I have completed the payment via UPI QR. Please confirm dispatch.' : 'I want to book this product. Please share confirmation and delivery details!'}`;

  return msg;
}

/**
 * Generates the WhatsApp URL for a single product booking.
 */
export function getProductBookingWhatsAppUrl(params: {
  product: Product;
  selectedWeight: string;
  quantity: number;
  price: number;
  customerName?: string;
  customerPhone?: string;
  customerCity?: string;
  paidViaUpi?: boolean;
}, phone: string = WHATSAPP_CONTACT_NUMBER): string {
  const message = formatProductBookingMessage(params);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp in a new tab cleanly without triggering blocked window.open popups.
 */
export function openWhatsAppUrl(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}


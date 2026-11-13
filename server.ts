import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

interface StoredProduct {
  id: string;
  name: string;
  tamilName?: string;
  tagline: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  weightOptions: string[];
  defaultWeight: string;
  badges: string[];
  image: string;
  gallery: string[];
  description: string;
  ingredients: string[];
  keyBenefits: string[];
  howToUse: string;
  storageInfo?: string;
  origin: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface StoredOrder {
  id: string;
  date: string;
  items: Array<{
    product: StoredProduct;
    quantity: number;
    selectedWeight: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  trackingNumber: string;
  transactionId?: string;
  bankRef?: string;
}

interface StoreState {
  products: StoredProduct[];
  orders: StoredOrder[];
  adminNotes: Record<string, string>;
  updatedAt: number;
}

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DEFAULT_PRODUCTS_PATH = path.join(ROOT_DIR, 'src', 'data', 'products.json');
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'banayana00123';

const isRunningTsx =
  process.execArgv.some((arg) => arg.includes('tsx')) ||
  (process.env._ || '').includes('tsx');

const isDev =
  process.env.NODE_ENV === 'development' ||
  process.env.npm_lifecycle_event === 'dev' ||
  isRunningTsx ||
  !fs.existsSync(path.join(DIST_DIR, 'index.html'));

const isProduction = !isDev;

function resolveWritableDir(primaryDir: string, fallbackDir: string): string {
  try {
    fs.mkdirSync(primaryDir, { recursive: true });
    const testFile = path.join(primaryDir, '.write-check');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return primaryDir;
  } catch {
    fs.mkdirSync(fallbackDir, { recursive: true });
    return fallbackDir;
  }
}

const DATA_DIR = resolveWritableDir(
  path.join(ROOT_DIR, 'data'),
  path.join('/tmp', 'banaya-data')
);

const UPLOADS_DIR = resolveWritableDir(
  path.join(ROOT_DIR, 'public', 'uploads'),
  path.join('/tmp', 'banaya-uploads')
);

const STORE_FILE = path.join(DATA_DIR, 'store.json');

function loadDefaultProducts(): StoredProduct[] {
  try {
    if (fs.existsSync(DEFAULT_PRODUCTS_PATH)) {
      const raw = fs.readFileSync(DEFAULT_PRODUCTS_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as StoredProduct[];
      }
    }
  } catch (err) {
    console.error('Failed to read default products.json:', err);
  }
  return [];
}

function createInitialOrders(products: StoredProduct[]): StoredOrder[] {
  const byId = (id: string, fallbackIdx: number) =>
    products.find((p) => p.id === id) || products[fallbackIdx] || products[0];

  if (products.length === 0) return [];

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
}

function loadInitialStore(): StoreState {
  const defaultProducts = loadDefaultProducts();
  const repoStoreFile = path.join(ROOT_DIR, 'data', 'store.json');
  const candidateFiles = STORE_FILE === repoStoreFile ? [STORE_FILE] : [STORE_FILE, repoStoreFile];

  for (const filePath of candidateFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<StoreState>;
        return {
          products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : defaultProducts,
          orders: Array.isArray(parsed.orders) ? parsed.orders : createInitialOrders(defaultProducts),
          adminNotes: parsed.adminNotes && typeof parsed.adminNotes === 'object' ? parsed.adminNotes : {},
          updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now()
        };
      }
    } catch (err) {
      console.error(`Failed to load ${filePath}, trying next fallback:`, err);
    }
  }

  return {
    products: defaultProducts,
    orders: createInitialOrders(defaultProducts),
    adminNotes: {
      'STM-84920': 'Delivered via DTDC Courier. Customer praised Honey aroma.',
      'STM-85104': 'Customer requested fresh batch honey jar. Verified via WhatsApp.',
      'STM-85219': 'Joint pain soup ordered for elderly parents. Shipped priority.'
    },
    updatedAt: Date.now()
  };
}

let storeState: StoreState = loadInitialStore();
const sseClients = new Set<Response>();

function persistStore(syncProductsSeed = false): void {
  storeState.updatedAt = Date.now();
  const tempFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(storeState, null, 2), 'utf8');
  fs.renameSync(tempFile, STORE_FILE);

  // Mirror product catalog into src/data/products.json whenever writable so publishing carries edits automatically
  if (syncProductsSeed) {
    try {
      fs.writeFileSync(DEFAULT_PRODUCTS_PATH, JSON.stringify(storeState.products, null, 2) + '\n', 'utf8');
    } catch (err) {
      console.warn('Could not mirror products to src/data/products.json:', err);
    }
  }
}

function broadcastStoreUpdate(reason: string): void {
  const payload = JSON.stringify({
    reason,
    products: storeState.products,
    orders: storeState.orders,
    adminNotes: storeState.adminNotes,
    updatedAt: storeState.updatedAt
  });

  for (const client of sseClients) {
    try {
      client.write(`event: store-update\ndata: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const passkey = req.header('x-admin-passkey');
  if (passkey !== ADMIN_PASSKEY) {
    res.status(401).json({ error: 'Unauthorized: invalid admin passkey' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  // Serve uploaded product images cleanly in both dev & production (with bundled fallbacks)
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));
  const publicUploadsDir = path.join(ROOT_DIR, 'public', 'uploads');
  if (UPLOADS_DIR !== publicUploadsDir && fs.existsSync(publicUploadsDir)) {
    app.use('/uploads', express.static(publicUploadsDir, { maxAge: '7d' }));
  }
  const distUploadsDir = path.join(DIST_DIR, 'uploads');
  if (fs.existsSync(distUploadsDir)) {
    app.use('/uploads', express.static(distUploadsDir, { maxAge: '7d' }));
  }

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, updatedAt: storeState.updatedAt });
  });

  // Verify admin passkey server-side without exposing passkey in client UI
  app.post('/api/admin/verify', (req: Request, res: Response) => {
    const bodyPasskey = typeof req.body?.passkey === 'string' ? req.body.passkey : '';
    const headerPasskey = req.header('x-admin-passkey') || '';
    const candidate = bodyPasskey || headerPasskey;
    if (candidate === ADMIN_PASSKEY) {
      res.json({ ok: true });
      return;
    }
    res.status(401).json({ error: 'Invalid administrator passkey' });
  });

  // Read full live storefront state
  app.get('/api/store', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      products: storeState.products,
      orders: storeState.orders,
      adminNotes: storeState.adminNotes,
      updatedAt: storeState.updatedAt
    });
  });

  // Live Server-Sent Events stream for automatic website updates
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    res.write(
      `event: connected\ndata: ${JSON.stringify({ updatedAt: storeState.updatedAt })}\n\n`
    );

    sseClients.add(res);

    const heartbeat = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // Upload product image to persistent uploads folder
  app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body as { dataUrl?: string; filename?: string };
      if (!dataUrl || typeof dataUrl !== 'string') {
        res.status(400).json({ error: 'Missing image dataUrl' });
        return;
      }

      const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
      if (!match) {
        res.status(400).json({ error: 'Unsupported image format' });
        return;
      }

      const rawExt = match[1].toLowerCase();
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 10 * 1024 * 1024) {
        res.status(413).json({ error: 'Image too large (max 10MB)' });
        return;
      }

      const safeBase = (filename || 'product')
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .toLowerCase()
        .slice(0, 40) || 'product';
      const uniqueName = `${safeBase}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
      const destPath = path.join(UPLOADS_DIR, uniqueName);

      fs.writeFileSync(destPath, buffer);

      res.json({ url: `/uploads/${uniqueName}` });
    } catch (err) {
      console.error('Image upload error:', err);
      res.status(500).json({ error: 'Failed to save uploaded image' });
    }
  });

  // Update existing product (price, image, gallery, stock, etc.)
  app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const incoming = req.body as StoredProduct;
      if (!incoming || !incoming.id || !incoming.name) {
        res.status(400).json({ error: 'Invalid product payload' });
        return;
      }

      const existingIdx = storeState.products.findIndex((p) => p.id === id);
      if (existingIdx >= 0) {
        storeState.products[existingIdx] = incoming;
      } else {
        storeState.products.unshift(incoming);
      }

      persistStore(true);
      broadcastStoreUpdate('product-updated');

      res.json({
        product: incoming,
        products: storeState.products,
        updatedAt: storeState.updatedAt
      });
    } catch (err) {
      console.error('Product update error:', err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Create new product
  app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
    try {
      const incoming = req.body as StoredProduct;
      if (!incoming || !incoming.id || !incoming.name) {
        res.status(400).json({ error: 'Invalid product payload' });
        return;
      }

      const deduped = storeState.products.filter((p) => p.id !== incoming.id);
      storeState.products = [incoming, ...deduped];

      persistStore(true);
      broadcastStoreUpdate('product-added');

      res.status(201).json({
        product: incoming,
        products: storeState.products,
        updatedAt: storeState.updatedAt
      });
    } catch (err) {
      console.error('Product create error:', err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Delete product
  app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      storeState.products = storeState.products.filter((p) => p.id !== id);

      persistStore(true);
      broadcastStoreUpdate('product-deleted');

      res.json({
        products: storeState.products,
        updatedAt: storeState.updatedAt
      });
    } catch (err) {
      console.error('Product delete error:', err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Create customer order
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const order = req.body as StoredOrder;
      if (!order || !order.id) {
        res.status(400).json({ error: 'Invalid order payload' });
        return;
      }

      storeState.orders = [order, ...storeState.orders.filter((o) => o.id !== order.id)];
      persistStore(false);
      broadcastStoreUpdate('order-created');

      res.status(201).json({ order, updatedAt: storeState.updatedAt });
    } catch (err) {
      console.error('Order create error:', err);
      res.status(500).json({ error: 'Failed to save order' });
    }
  });

  // Update order status / tracking / admin note
  app.put('/api/orders/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber, note } = req.body as {
        status?: StoredOrder['status'];
        trackingNumber?: string;
        note?: string;
      };

      storeState.orders = storeState.orders.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          status: status || o.status,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber
        };
      });

      if (note !== undefined) {
        storeState.adminNotes[id] = note;
      }

      persistStore(false);
      broadcastStoreUpdate('order-updated');

      res.json({
        orders: storeState.orders,
        adminNotes: storeState.adminNotes,
        updatedAt: storeState.updatedAt
      });
    } catch (err) {
      console.error('Order update error:', err);
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // Delete order
  app.delete('/api/orders/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      storeState.orders = storeState.orders.filter((o) => o.id !== id);
      persistStore(false);
      broadcastStoreUpdate('order-deleted');

      res.json({ orders: storeState.orders, updatedAt: storeState.updatedAt });
    } catch (err) {
      console.error('Order delete error:', err);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });

  // Update admin note for an order
  app.put('/api/admin-notes/:orderId', requireAdmin, (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { note } = req.body as { note?: string };
      storeState.adminNotes[orderId] = note || '';
      persistStore(false);
      broadcastStoreUpdate('note-updated');
      res.json({ adminNotes: storeState.adminNotes, updatedAt: storeState.updatedAt });
    } catch (err) {
      console.error('Admin note update error:', err);
      res.status(500).json({ error: 'Failed to save admin note' });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(DIST_DIR, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          }
        }
      })
    );
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Banaya Enterprises server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

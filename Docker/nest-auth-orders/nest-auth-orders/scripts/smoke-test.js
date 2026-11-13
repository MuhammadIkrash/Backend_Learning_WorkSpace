// End-to-end check of the assignment's testing checklist against a RUNNING stack.
//   docker compose up -d --build   &&   ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/smoke-test.js
// Requires Node 18+ (global fetch).
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN = { email: process.env.ADMIN_EMAIL || 'admin@example.com', password: process.env.ADMIN_PASSWORD || '' };

let failed = 0;
const call = async (method, path, token, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};
const check = (name, cond, extra = '') => {
  if (!cond) failed++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name} ${cond ? '' : extra}`);
};

(async () => {
  const email = `cust_${Date.now()}@example.com`;
  const pw = 'Password123!';

  let r = await call('POST', '/auth/register', null, { name: 'Test Customer', email, password: pw });
  check('customer can register', r.status === 201, JSON.stringify(r));
  r = await call('POST', '/auth/register', null, { name: 'Dup', email, password: pw });
  check('duplicate email rejected (409)', r.status === 409, r.status);
  r = await call('POST', '/auth/register', null, { name: 'Sneaky', email: `s_${email}`, password: pw, role: 'admin' });
  check('cannot self-register as admin (400)', r.status === 400, r.status);

  r = await call('POST', '/auth/login', null, { email, password: pw });
  check('customer can login', r.status === 200 && !!r.body.accessToken, r.status);
  const C = r.body.accessToken;
  r = await call('POST', '/auth/login', null, { email, password: 'wrong-password' });
  check('wrong password rejected (401)', r.status === 401, r.status);
  r = await call('POST', '/auth/login', null, ADMIN);
  check('admin can login', r.status === 200 && r.body.user.role === 'admin', `${r.status} (check ADMIN_EMAIL/ADMIN_PASSWORD)`);
  const A = r.body?.accessToken;

  r = await call('GET', '/products');
  check('products need authentication (401)', r.status === 401, r.status);
  r = await call('POST', '/products', C, { name: 'Nope', price: 1, stock: 1, category: 'x' });
  check('customer cannot create product (403)', r.status === 403, r.status);
  r = await call('GET', '/products', C);
  check('customer cannot view products (403)', r.status === 403, r.status);

  r = await call('POST', '/products', A, { name: 'Keyboard', description: 'Mechanical', price: 49.99, stock: 5, category: 'accessories' });
  check('admin can create product', r.status === 201, r.status);
  const pid = r.body?._id;
  r = await call('PATCH', `/products/${pid}`, A, { price: 59.5 });
  check('admin can update product', r.status === 200 && r.body.price === 59.5, r.status);
  r = await call('GET', '/products', A);
  check('admin can list products', r.status === 200 && r.body.total >= 1, r.status);

  r = await call('POST', '/orders', A, { items: [{ productId: pid, quantity: 1 }] });
  check('admin cannot create order (403)', r.status === 403, r.status);
  r = await call('POST', '/orders', C, { items: [{ productId: pid, quantity: 2 }] });
  check('customer can create order, total computed server-side', r.status === 201 && r.body.totalPrice === 119, JSON.stringify(r.body));
  const oid = r.body?._id;
  r = await call('GET', `/products/${pid}`, A);
  check('stock decremented (5 -> 3)', r.body?.stock === 3, r.body?.stock);
  r = await call('POST', '/orders', C, { items: [{ productId: pid, quantity: 99 }] });
  check('over-stock order rejected (400)', r.status === 400, r.status);

  r = await call('GET', '/orders/my', C);
  check('customer sees own orders', r.status === 200 && r.body.length === 1, r.status);
  r = await call('GET', '/orders', C);
  check('customer cannot list all orders (403)', r.status === 403, r.status);
  r = await call('GET', '/orders', A);
  check('admin can list all orders', r.status === 200, r.status);
  r = await call('PATCH', `/orders/${oid}/status`, A, { status: 'confirmed' });
  check('admin can update order status', r.status === 200 && r.body.status === 'confirmed', r.status);
  r = await call('PATCH', `/orders/${oid}/status`, C, { status: 'shipped' });
  check('customer cannot update order status (403)', r.status === 403, r.status);

  r = await call('DELETE', `/products/${pid}`, A);
  check('admin can delete product (204)', r.status === 204, r.status);

  console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

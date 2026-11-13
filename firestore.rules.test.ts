/**
 * Security Rules Contract & "Dirty Dozen" Verification Suite
 * Mirrors the exact boolean invariants enforced in firestore.rules.
 * Run with: npx tsx firestore.rules.test.ts
 */
import assert from 'node:assert/strict';

const SERVER_TIME_TOKEN = '__SERVER_TIMESTAMP__';
const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const VALID_PHONE_REGEX = /^[0-9+\-\s()]{7,30}$/;
const MIN_DIGITS_PHONE_REGEX = /^([+\-\s()]*[0-9]){7,}[+\-\s()0-9]*$/;

function isValidId(id: unknown): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && VALID_ID_REGEX.test(id);
}

function isValidInquiry(data: Record<string, unknown>, requestTime: unknown): boolean {
  const required = ['name', 'phone', 'interest', 'message', 'status', 'createdAt'];
  const keys = Object.keys(data);
  if (!required.every((k) => keys.includes(k))) return false;
  if (!keys.every((k) => required.includes(k))) return false;

  return (
    typeof data.name === 'string' &&
    data.name.trim().length >= 2 &&
    data.name.length <= 100 &&
    typeof data.phone === 'string' &&
    data.phone.length >= 7 &&
    data.phone.length <= 30 &&
    VALID_PHONE_REGEX.test(data.phone) &&
    MIN_DIGITS_PHONE_REGEX.test(data.phone) &&
    typeof data.interest === 'string' &&
    data.interest.trim().length >= 2 &&
    data.interest.length <= 160 &&
    typeof data.message === 'string' &&
    data.message.length <= 1000 &&
    typeof data.status === 'string' &&
    data.status.length <= 20 &&
    data.status === 'new' &&
    data.createdAt === requestTime
  );
}

function isValidDownloadEvent(data: Record<string, unknown>, requestTime: unknown): boolean {
  const required = ['productId', 'productTitle', 'version', 'platform', 'createdAt'];
  const keys = Object.keys(data);
  if (!required.every((k) => keys.includes(k))) return false;
  if (!keys.every((k) => required.includes(k))) return false;

  return (
    isValidId(data.productId) &&
    typeof data.productTitle === 'string' &&
    data.productTitle.trim().length >= 2 &&
    data.productTitle.length <= 160 &&
    typeof data.version === 'string' &&
    data.version.trim().length >= 1 &&
    data.version.length <= 32 &&
    typeof data.platform === 'string' &&
    data.platform.trim().length >= 2 &&
    data.platform.length <= 100 &&
    data.createdAt === requestTime
  );
}

type OpResult = 'ALLOW' | 'PERMISSION_DENIED';

function evaluateRule(
  collection: string,
  op: 'get' | 'list' | 'create' | 'update' | 'delete',
  docId: string,
  incomingData?: Record<string, unknown>,
  existingData?: Record<string, unknown> | null
): OpResult {
  if (collection === 'software_catalog') {
    if (op === 'get') {
      return isValidId(docId) &&
        existingData != null &&
        typeof existingData.isPublic === 'boolean' &&
        existingData.isPublic === true
        ? 'ALLOW'
        : 'PERMISSION_DENIED';
    }
    if (op === 'list') {
      return existingData != null &&
        typeof existingData.isPublic === 'boolean' &&
        existingData.isPublic === true
        ? 'ALLOW'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  if (collection === 'inquiries') {
    if (op === 'create' && incomingData) {
      return isValidId(docId) && isValidInquiry(incomingData, SERVER_TIME_TOKEN)
        ? 'ALLOW'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  if (collection === 'download_events') {
    if (op === 'create' && incomingData) {
      return isValidId(docId) && isValidDownloadEvent(incomingData, SERVER_TIME_TOKEN)
        ? 'ALLOW'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  return 'PERMISSION_DENIED';
}

export function runDirtyDozenSecurityTests(): void {
  const validInquiry = {
    name: 'Muhammad Ali Khan',
    phone: '+92-339-8884124',
    interest: 'Pakistan Customs, Bonded Carrier & TIR ERP',
    message: 'Requesting live deployment walkthrough for Karachi clearing desk.',
    status: 'new',
    createdAt: SERVER_TIME_TOKEN,
  };

  const validEvent = {
    productId: 'prod-1',
    productTitle: 'Pakistan Customs Clearing, Bonded Carrier, TIR & ATT Management Software',
    version: 'Ready Suite',
    platform: 'Office & Mobile Access',
    createdAt: SERVER_TIME_TOKEN,
  };

  // Positive baselines (application expected paths)
  assert.equal(evaluateRule('inquiries', 'create', 'inq-2026-001', validInquiry), 'ALLOW');
  assert.equal(evaluateRule('download_events', 'create', 'evt-2026-001', validEvent), 'ALLOW');
  assert.equal(
    evaluateRule('software_catalog', 'get', 'prod-1', undefined, { isPublic: true }),
    'ALLOW'
  );
  assert.equal(
    evaluateRule('software_catalog', 'list', '', undefined, { isPublic: true }),
    'ALLOW'
  );

  // Dirty Dozen 1: PII Read/Scrape on inquiries
  assert.equal(evaluateRule('inquiries', 'get', 'inq-1'), 'PERMISSION_DENIED');
  assert.equal(evaluateRule('inquiries', 'list', ''), 'PERMISSION_DENIED');

  // Dirty Dozen 2: Inquiry Shadow / Ghost Field Injection
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-2', { ...validInquiry, isVerifiedAdmin: true }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 3: Inquiry Spoofed Client Timestamp
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-3', {
      ...validInquiry,
      createdAt: '2026-01-01T00:00:00Z',
    }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 4: Inquiry Status Spoofing on Create
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-4', { ...validInquiry, status: 'resolved' }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 5: Inquiry Path ID Poisoning (special chars & >128 chars)
  assert.equal(
    evaluateRule('inquiries', 'create', 'bad$id/poison', validInquiry),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('inquiries', 'create', 'x'.repeat(130), validInquiry),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 6: Oversized Payload (Denial of Wallet), Short Name & Whitespace Bypass
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-6', { ...validInquiry, message: 'A'.repeat(1001) }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-6b', { ...validInquiry, name: 'A' }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-6c', { ...validInquiry, name: '     ' }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 7: Invalid Phone Injection & Digitless Symbol Bypass
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-7', {
      ...validInquiry,
      phone: '<script>alert(1)</script>',
    }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('inquiries', 'create', 'inq-7b', {
      ...validInquiry,
      phone: '()--   ',
    }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 8: Inquiry Update / Delete Tampering
  assert.equal(evaluateRule('inquiries', 'update', 'inq-1', validInquiry), 'PERMISSION_DENIED');
  assert.equal(evaluateRule('inquiries', 'delete', 'inq-1'), 'PERMISSION_DENIED');

  // Dirty Dozen 9: Catalog Tampering Write
  assert.equal(
    evaluateRule('software_catalog', 'create', 'prod-99', { id: 'prod-99', isPublic: true }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('software_catalog', 'update', 'prod-1', { downloadsCount: 999999 }),
    'PERMISSION_DENIED'
  );
  assert.equal(evaluateRule('software_catalog', 'delete', 'prod-1'), 'PERMISSION_DENIED');

  // Dirty Dozen 10: Catalog Private Item & Null Document Read Leak
  assert.equal(
    evaluateRule('software_catalog', 'get', 'prod-draft', undefined, { isPublic: false }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('software_catalog', 'get', 'prod-missing', undefined, null),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('software_catalog', 'list', '', undefined, { isPublic: false }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 11: Download Event Ghost Field & Invalid Product ID
  assert.equal(
    evaluateRule('download_events', 'create', 'evt-11', {
      ...validEvent,
      productId: 'bad id!!',
    }),
    'PERMISSION_DENIED'
  );
  assert.equal(
    evaluateRule('download_events', 'create', 'evt-11b', {
      ...validEvent,
      adminOverride: true,
    }),
    'PERMISSION_DENIED'
  );

  // Dirty Dozen 12: Unlisted Collection Access (Global Deny)
  assert.equal(evaluateRule('users', 'get', 'u1'), 'PERMISSION_DENIED');
  assert.equal(evaluateRule('admins', 'create', 'a1', { role: 'admin' }), 'PERMISSION_DENIED');
  assert.equal(evaluateRule('test', 'get', 'connection'), 'PERMISSION_DENIED');
}

// Execute immediately if run directly
runDirtyDozenSecurityTests();
console.log('All Dirty Dozen Firestore security assertions passed.');

# Security Specification — Make Your Fly Easy (Firestore)

## 1. Architectural Context & Data Invariants
This application is a public corporate website and custom business software showcase with **no Login, Sign Up, or Admin Portal UI**. Client-side Firestore security rules enforce strict zero-trust boundaries:

1. **Global Deny Catch-All:** Every path outside explicitly whitelisted collections (`/{document=**}`) is strictly denied (`allow read, write: if false;`).
2. **Read-Only Public Catalog (`/software_catalog/{productId}`):**
   - `get` requires `isValidId(productId)` (`^[a-zA-Z0-9_-]+$`, `1..128` chars), `resource != null`, `resource.data.isPublic is bool`, and `resource.data.isPublic == true`.
   - `list` explicitly enforces `resource.data.isPublic is bool && resource.data.isPublic == true` (never delegating filtering to client queries).
   - `create`, `update`, and `delete` are strictly `false` from client SDKs to prevent unauthenticated catalog tampering or shadow writes.
3. **PII-Isolated Write-Only Inquiry Inbox (`/inquiries/{inquiryId}`):**
   - Contains client PII (`name`, `phone`, `message`), therefore `get`, `list`, `update`, and `delete` are unconditionally `false`.
   - `create` requires `isValidId(inquiryId)` and `isValidInquiry(incoming())` enforcing:
     - Exact field allowlist (`name`, `phone`, `interest`, `message`, `status`, `createdAt`) via `hasAll` + `hasOnly`.
     - Bounded non-whitespace string lengths (`name.trim().size() >= 2` and `<= 100`, `phone` `7..30`, `interest.trim().size() >= 2` and `<= 160`, `message` `0..1000`).
     - Phone character and minimum 7-digit validation (`^[0-9+\-\s()]{7,30}$` AND `^([+\-\s()]*[0-9]){7,}[+\-\s()0-9]*$`).
     - Locked initial intake status (`status == 'new'`).
     - Server timestamp integrity (`createdAt == request.time`).
4. **Append-Only Telemetry Stream (`/download_events/{eventId}`):**
   - Contains non-PII package telemetry (`productId`, `productTitle`, `version`, `platform`, `createdAt`).
   - `get`, `list`, `update`, and `delete` are unconditionally `false`.
   - `create` requires `isValidId(eventId)` and `isValidDownloadEvent(incoming())` with strict keys, trimmed non-empty bounded strings, valid `productId`, and `createdAt == request.time`.

---

## 2. The "Dirty Dozen" Adversarial Payloads (+ Boundary Guards)
Every one of the adversarial payloads below MUST evaluate to `PERMISSION_DENIED`:

1. **PII Read/Scrape on `inquiries` (`get` / `list`):** Attempting to read `/inquiries/inq-1` or list `/inquiries` from client SDK -> **DENIED** (`allow get, list: if false`).
2. **Inquiry Ghost / Shadow Field Injection:** Submitting `{ name, phone, interest, message, status: "new", createdAt: request.time, isVerifiedAdmin: true }` -> **DENIED** (`hasOnly` rejects unknown keys).
3. **Inquiry Spoofed Client Timestamp:** Submitting an `Inquiry` with a forged past/future ISO date or `createdAt != request.time` -> **DENIED** (`createdAt == request.time` gate).
4. **Inquiry Status Tampering on Create:** Submitting an `Inquiry` with `status: "resolved"` instead of `"new"` -> **DENIED** (`data.status == 'new'`).
5. **Inquiry Path ID Poisoning:** Attempting `create` at `/inquiries/../../admin$poison` or a 1,500-char document ID -> **DENIED** (`isValidId(inquiryId)` fails length/regex).
6. **Inquiry Denial-of-Wallet Oversized Payload & Whitespace Bypass:** Submitting a `message` of 1,500+ characters, `name` of 1 char, or spaces-only `name: "   "` -> **DENIED** (`size() <= 1000`, `name.trim().size() >= 2`).
7. **Inquiry Invalid Phone Format / Digitless Bypass / Script Injection:** Submitting `phone: "<script>alert(1)</script>"` or `phone: "()--   "` -> **DENIED** (phone character & 7-digit regex guards).
8. **Inquiry Update / Delete Tampering:** Attempting `update` or `delete` on `/inquiries/inq-1` -> **DENIED** (`allow update, delete: if false`).
9. **Catalog Tampering Write (`software_catalog`):** Attempting unauthenticated `create`, `update`, or `delete` on `/software_catalog/prod-1` -> **DENIED** (`allow create, update, delete: if false`).
10. **Catalog Private Draft / Non-Existent Read Leak:** Attempting `get` or `list` where `resource == null` or `resource.data.isPublic != true` -> **DENIED** (`resource.data.isPublic is bool && resource.data.isPublic == true`).
11. **Download Event Ghost Field & Forged Product ID:** Creating `/download_events/evt-1` with `productId: "bad id!!"` or extra `adminOverride: true` field -> **DENIED** (`isValidId(data.productId)` and `hasOnly`).
12. **Unlisted Collection Access (`users`, `admins`, `test`):** Attempting read/write on `/users/u1`, `/admins/a1`, or `/test/connection` -> **DENIED** (Global default-deny `match /{document=**}`).

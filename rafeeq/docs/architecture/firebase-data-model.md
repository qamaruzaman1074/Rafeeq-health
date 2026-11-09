# Firestore data model (competition demo)

All clinical content remains **fictional**. Do not store real genetic reports, identifiers, or patient records.

## Collections

### `users/{uid}`

| Field | Type | Notes |
|-------|------|--------|
| `displayName` | string | Optional |
| `demoPersonaId` | string | Optional link to seeded persona (P1–P6) |
| `createdAt` | timestamp | Server/client timestamp |

**Subcollections**

- `consents/{id}` — privacy-matrix consent rows (mirrors `/api/v1/consents` semantics).
- `notifications/{id}` — preview text only; **no genetic terms** in `preview` field.
- `demoSession/{id}` — optional session metadata; not a medical record.

### `partnerships/{partnershipId}`

| Field | Type | Notes |
|-------|------|--------|
| `memberUids` | array[2] | Both partners after acceptance |
| `status` | string | `pending` \| `active` \| `ended` |
| `updatedAt` | timestamp | |

**Subcollections**

- `consentGrants/{categoryId}` — explicit per-category grants; revocation sets `granted: false`.
- `sharingHistory/{eventId}` — append-only audit; `actorUid` required on create.

Partnership documents are readable **only** when `request.auth.uid` is in `memberUids`. An invitation alone does not create read access.

### `invitations/{inviteId}`

| Field | Type | Notes |
|-------|------|--------|
| `inviterUid` | string | Creator |
| `inviteeUid` | string | Target user (set when known) |
| `status` | string | `pending` \| `accepted` \| `cancelled` |
| `code` | string | Display code only; not a secret capability token |

Readable by inviter or invitee only. Accepting an invite should create/update `partnerships` in application logic (client phase), not widen rules to all invite holders.

### `demoFixtures/{document=**}`

Read-only seeded personas, copy, and synthetic report **metadata** (not real PHI). Writes denied in rules.

## Security principles

1. **Ownership:** `users/{uid}` readable/writable only by `uid`.
2. **Membership:** partnership data requires `memberUids` membership.
3. **Consent:** shared categories use `consentGrants`; revoked grants block reads in application logic; rules prevent non-members from reading partnership paths.
4. **Notifications:** private to the user; previews must stay non-clinical.
5. **Invitations ≠ access:** invitation documents do not grant access to another user's `users/{uid}` tree.

## Indexes

See `apps/web/firebase/firestore.indexes.json` for notification sorting, invitee invite lists, and partnership membership queries.

## Mode switch

| Variable | Behaviour |
|----------|-----------|
| `VITE_USE_MOCKS=true` | MSW serves `/api/v1` (current demo). |
| `VITE_USE_FIREBASE=false` | Firebase client does not initialize (default). |
| `VITE_USE_FIREBASE=true` | Client may initialize when config is complete (integration phase). |

Both flags can be documented for future coexistence; today's app still uses MSW for all product flows.

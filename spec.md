# Bloom Preorder

## Current State
A preorder landing page for "Bloom Styling Glue™" (INR ₹400, COD only). The backend stores orders using a non-stable `Map` that gets wiped on every canister upgrade, causing "Application error occurred" for customers after redeployments. The frontend form collects name, email, phone, and shipping address. An admin dashboard is password-protected and shows all orders with status management.

## Requested Changes (Diff)

### Add
- Stable storage for preorders using `stable var` arrays so orders persist across upgrades and redeployments
- `preupgrade` and `postupgrade` system hooks to serialize/deserialize order data

### Modify
- Replace non-stable `Map.empty<Nat, Preorder>()` with a stable array-backed storage pattern
- Keep all existing API signatures identical: `submitPreorder`, `updateOrderStatus`, `getTotalPreorders`, `getAllPreorders`

### Remove
- Dependency on `mo:core/Map` (replaced with stable array approach)

## Implementation Plan
1. Regenerate backend with stable array storage for preorders
2. Keep all frontend code unchanged (API signatures are identical)
3. Deploy

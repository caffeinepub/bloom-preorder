# Bloom Preorder - COD + Admin Dashboard

## Current State
- INR (₹400) preorder site for Bloom Styling Glue™
- Backend collects: name, email, quantity
- Frontend: hero, product showcase, social proof counter, preorder form, FAQ, footer
- No payment flow, no shipping address, no phone number
- No admin dashboard

## Requested Changes (Diff)

### Add
- Phone number field to preorder form
- Full shipping address field (street, city, state, pincode) to preorder form
- Payment method: Cash on Delivery (COD) only — order is submitted for manual review
- Order status field on each order (pending, confirmed, shipped, delivered, cancelled)
- Admin dashboard page at `/admin` — password protected (hardcoded admin password)
- Admin dashboard shows all orders in a table: name, email, phone, address, quantity, status, date
- Admin can update order status from the dashboard
- Total order count visible in admin

### Modify
- Backend Preorder type: add phone, address (street, city, state, pincode), paymentMethod (always "COD"), status, createdAt timestamp
- submitPreorder function: accept new fields
- getAllPreorders: return full order details including new fields
- Preorder form: add phone, address fields; update submit handler; show COD badge

### Remove
- Nothing removed from existing UI/UX

## Implementation Plan
1. Update Motoko backend:
   - Extend Preorder type with: phone, street, city, state, pincode, paymentMethod, status, createdAt
   - Add updateOrderStatus(caller: Principal, status: Text) function — admin only
   - Admin principal hardcoded or use a simple admin password check on frontend
   - Keep getTotalPreorders and getAllPreorders
2. Update preorder form frontend:
   - Add phone input
   - Add address fields: street, city, state, pincode
   - Show "Cash on Delivery" badge — no payment required upfront
   - Update submitPreorder call with new fields
3. Build admin dashboard page:
   - Route: `/admin` via hash routing or simple state toggle
   - Password gate (hardcoded password, local state only)
   - Table of all orders with columns: #, Name, Email, Phone, Address, Qty, Status, Date
   - Status dropdown per order to update (pending → confirmed → shipped → delivered / cancelled)
   - Summary stats at top: total orders, pending count, confirmed count
4. Wire admin updateOrderStatus to backend

# CHABBS Resort — Claude Code Implementation Guide
# ═══════════════════════════════════════════════════════════════
# 
# This file contains ALL 60 planned improvements organized into
# implementation batches. Use with Claude Code:
#
#   claude "Read CLAUDE_CODE_TASKS.md and implement Batch 1"
#
# ═══════════════════════════════════════════════════════════════

## Project Context

CHABBS Resort is a Christian-run luxury hospitality property in Lodwar, 
Turkana County, Kenya with 10 three-bedroom ensuite villas. This is a 
React management system (Vite + React 18, inline styles, no CSS framework).

Key files:
- src/App.jsx — Main monolith (2,382 lines) containing all views
- src/components/UI.jsx — Shared components (Badge, Card, etc.)
- src/data/seedData.js — All seed data constants (exported)
- src/styles/tokens.js — Design tokens (C, SC, THEMES)

Staff: 15 employees. Currency: KSh. Key names: Aggrey Ochieng (GM), 
Martha Auma (Sales), Chef Emmanuel Liru, Grace Akello (Housekeeping Head),
James Okwany (Maintenance Head).

Christian identity matters — cross symbols, scripture, faith language.
Salty Water Borehole Protocol is a recurring concern.

---

## BATCH 1 — Dashboard & Core Operations (Items 1-4, 8-10, 59)

### 1. Quick Actions Toolbar (Dashboard)
Add a row of shortcut buttons below the occupancy banner:
- "📅 New Booking" → opens booking form
- "🍽 New Order" → switches to Restaurant POS
- "🔧 Log Issue" → opens maintenance form
- "📦 Add Stock" → opens inventory form
Pass setView and trigger form open states via callback props.

### 2. Lodwar Weather Widget (Dashboard)
Add a small card showing current conditions. Use static realistic data 
for Lodwar (35-42°C, sunny/dusty). Format: "🌡 39°C · Sunny · Lodwar"
with a note "Heat protocol active" when temp > 38°C.

### 3. Revenue Comparison (Dashboard)  
Add a mini comparison row: "Today vs Yesterday vs Last Week Same Day"
showing revenue from financials data with green/red arrows for trend.

### 4. Occupancy Forecast (Dashboard)
Calculate next 7 days' expected occupancy from upcoming bookings.
Show as a mini bar chart: date labels with occupied villa count per day.

### 8. Check-in / Check-out Workflow (Bookings)
Add action buttons on each booking card:
- "Upcoming" → "Check In" button (changes status, logs timestamp)
- "Checked In" → "Check Out" button (changes status, logs timestamp)
Store checkInTime and checkOutTime in booking object.
When checking in, auto-update villa status to "Occupied".
When checking out, auto-update villa status to "Cleaning".

### 9. Deposit Tracking (Bookings)
Add deposit field to booking form and display:
- Deposit amount vs total
- Balance due (total - deposit)
- Payment progress bar
Show a "💰 Balance: KSh X" badge on each booking card.

### 10. Booking Source Tracking (Bookings)
Add "source" field to booking form: Referral, Google, Walk-in, Social 
Media, Phone, Email, Repeat Guest. Display source badge on booking cards.
This feeds into the Revenue Attribution tab in Sales.

### 59. Activity Log (System-wide)
Create a global activityLog state array in App. Log key actions:
- Booking created/status changed
- Villa status changed  
- Maintenance issue logged/resolved
- Order placed
- Payment recorded
Each entry: { id, timestamp, user, action, details, module }
Add an "📋 Activity Log" tab in Settings (admin only) showing recent 50.

---

## BATCH 2 — Maintenance & Utilities (Items 14-16, 17-19)

### 14. Asset Register (Maintenance)
Add new sub-tab "Assets" to MaintenanceView with a table of resort assets:
Seed data: AC units (10), Water pumps (2), Generator (1), Pool filter (1),
Kitchen equipment (5 items), Solar panels, Borehole pump.
Fields: name, category, location, purchaseDate, warranty, lastService, 
nextService, condition (Good/Fair/Poor), value.

### 15. Preventive Maintenance Calendar (Maintenance)
New sub-tab "Schedule" showing recurring tasks:
- Weekly: Salty water descale (Mon), Pool chemical check (Wed)
- Monthly: AC filter clean, Generator service, Pump inspection
- Quarterly: Deep borehole service, Solar panel clean
Show as a list with next-due dates, overdue highlighting in red.
"Auto-create" button generates a maintenance issue from the schedule.

### 16. Cost Tracking per Issue (Maintenance)
Add fields to maintenance log: partsCost (number), labourHours (number).
Display on each card. Show total maintenance spend as a KPI stat box.
Add to Night Audit report.

### 17. Usage Alerts (Water & Power)
Add alert banner when: kWh > 155, tank < 50%, pump > 5hrs.
Color-code: green (normal), yellow (caution), red (critical).
Show alert count in sidebar badge.

### 18. Monthly Comparison Charts (Water & Power)  
Add a "📊 Monthly" sub-tab comparing this month's avg usage to last month.
Show delta with green (down = good) or red (up = bad) arrows.

### 19. Solar Panel Tracker (Water & Power)
Add solar generation field to water/power readings.
New sub-tab "☀️ Solar" showing: generation vs consumption, 
solar offset percentage, estimated savings.
Seed with realistic Lodwar solar data (avg 6hrs peak sun).

---

## BATCH 3 — Financials & HR (Items 20-22, 40-43)

### 20. Petty Cash Tracker (Financials)
New sub-tab "Petty Cash" with form: date, amount, description, 
receiptNo, approvedBy. Running balance from a starting float (KSh 20,000).
Show daily totals and running balance.

### 21. Department Budget vs Actual (Financials)
New sub-tab "Budgets" with monthly budget per department:
Housekeeping: 80k, Kitchen: 120k, Maintenance: 60k, 
Marketing: 30k, Gardening: 15k, Pool: 10k, Admin: 50k.
Show bar chart: budget vs actual spend with % used.

### 22. Tax Compliance Panel (Financials)
New sub-tab "Tax" showing:
- Total PAYE deducted this month (sum from payroll)
- Total NSSF contributions
- Total NHIF contributions
- VAT estimate (16% of revenue)
- KRA filing deadline reminder

### 40. Document Storage (HR)
Add a documents array to each staff member's expanded view:
- Contract, ID copy, NHIF card, certificates
Display as a checklist: ✅ On file / ❌ Missing.
Flag staff with missing documents.

### 41. Training Tracker (HR)
New sub-tab "Training" in HRView. Track:
- First Aid (required annually)
- Food Safety (kitchen staff)
- Fire Drill (all staff, quarterly)
- Customer Service (annual)
Fields: staffId, course, completedDate, expiryDate, status.
Alert when training is expired or expiring within 30 days.

### 42. Overtime Tracking (HR)
Add to Shifts tab: overtime hours field, overtime rate (1.5x hourly).
Auto-calculate overtime pay. Require manager approval for > 4hrs OT.
Show monthly OT cost as a KPI.

### 43. Staff Satisfaction Survey (HR)
New sub-tab "Surveys". Anonymous quarterly survey with 5 questions:
- Work environment (1-5 stars)
- Management support (1-5 stars)
- Tools & equipment (1-5 stars)
- Team morale (1-5 stars)
- Overall satisfaction (1-5 stars)
Show average scores with trend arrows.

---

## BATCH 4 — Restaurant & Kitchen (Items 23-27)

### 23. Table Map View (Restaurant)
New sub-tab "Table Map" showing restaurant layout:
- 10 numbered tables + 4 bar seats
- Visual grid with status: green (available), blue (occupied), 
  yellow (reserved), grey (cleaning)
- Click table to see current order or create new one
- Show occupied table's elapsed time and order total

### 24. Kitchen Display System (Restaurant)
New sub-tab "KDS" (Kitchen Display System):
- Large-format cards optimised for a kitchen TV screen
- Only shows Pending and Preparing orders
- Big text, high contrast, countdown timer per order
- Auto-advance: order disappears when marked Ready
- Sound alert option for new orders (visual flash if no sound)

### 25. Ingredient Cost Tracking (Restaurant)
Add costPrice field to each menu item (alongside selling price).
Calculate: food cost % = (costPrice / price) × 100
Show margin per item in Menu Manager.
New "Profitability" section in Sales tab:
- Gross margin per category
- Items below 50% margin flagged red

### 26. Daily Specials (Restaurant)
Add a "Today's Specials" panel at top of POS tab.
Manager can set 1-3 specials daily without editing full menu.
Fields: menuItemId, specialPrice, notes ("Chef's recommendation").
Specials appear with a ⭐ badge in the POS menu grid.

### 27. Tip Tracking (Restaurant)
Add tip field to each order (entered at payment).
New "Tips" section in Sales tab:
- Total tips today, this week, this month
- Tips per server for fair distribution
- Average tip % per order type (dine-in vs room service)

---

## BATCH 5 — Inventory, Feedback, Conference (Items 44-49, 28-30)

### 44. Purchase Order System (Inventory)
New sub-tab "Purchase Orders":
- Create PO: supplier, items (from inventory), quantities, unit costs
- PO statuses: Draft → Sent → Delivered → Paid
- Auto-update inventory quantities when PO marked "Delivered"
- PO number format: PO-2026-001

### 45. Supplier Management (Inventory)
New sub-tab "Suppliers" with supplier database:
Seed: Nairobi Textiles, Mega Superstore, Plumbing Hub Lodwar, 
Afrigas Lodwar, Electronics Hub, Nairobi HVAC.
Fields: name, contact, phone, email, category, rating (1-5), 
leadTime, paymentTerms, lastOrder.

### 46. Expiry Date Tracking (Inventory)
Add expiryDate field to inventory items.
Show "⚠️ Expiring Soon" alert for items within 30 days of expiry.
Show "🚨 EXPIRED" badge for past-date items.
Relevant for: pool chemicals, kitchen perishables, cleaning agents.

### 47. Sentiment Analysis Tags (Feedback)
Auto-tag each feedback with themes based on keywords:
- "room/villa/clean/bed" → 🏡 Room
- "food/restaurant/chef/meal" → 🍽 Food
- "staff/friendly/service" → 👥 Staff
- "pool/swim" → 🏊 Pool
- "value/price/expensive" → 💰 Value
Show tag distribution chart.

### 48. Response Tracking (Feedback)
Add responded (boolean), respondedBy, respondedDate to feedback.
Show "Needs Response" count in sidebar badge.
"✍️ Respond" button on each card marks it as handled.

### 49. NPS Score (Feedback)
Add NPS question: "How likely to recommend CHABBS? (0-10)"
Calculate NPS: % Promoters (9-10) - % Detractors (0-6)
Display large NPS gauge: -100 to +100 scale with color zones.

### 28. Equipment Booking (Conference)
Track AV equipment assignment to events.
Show conflicts: "⚠️ Projector already booked for Turkana Hall"
Equipment list per venue with availability status.

### 29. Catering Calculator (Conference)
Auto-calculate food quantities: pax × servings per item.
Integrate with menu prices for cost estimate.
"🧮 Estimate Catering" button on event form.

### 30. Event Timeline (Conference)
New sub-tab "Timeline" per event:
- Hour-by-hour schedule blocks
- Setup, registration, sessions, breaks, meals, teardown
- Drag-to-adjust timing (or manual edit)

---

## BATCH 6 — Laundry, Pool, Gardening (Items 31-39)

### 31. Item-Level Tracking (Laundry)
Expand items field to structured array:
[{ type: "Bed Linen", qty: 3 }, { type: "Towels", qty: 6 }]
Show total item count. Compare sent vs returned for loss detection.

### 33. Damage Reporting (Laundry)
Add damageReport field: [{ item, description, action }]
Actions: "Replace", "Repair", "Discard"
Show damage count badge and monthly damage cost estimate.

### 34. Guest Wristband/Towel Tracking (Pool)
New sub-tab "Towels & Wristbands":
- Issue tracker: guestName, villa, itemsIssued, issuedAt, returnedAt
- Outstanding items count
- Loss prevention: flag unreturned items after checkout

### 35. Incident Report Form (Pool)
New sub-tab "Incidents":
- Form: date, time, type (slip, injury, near-miss, other), 
  description, witness, actionTaken, reportedBy
- Severity: Minor / Moderate / Serious
- For insurance compliance

### 36. Pool Maintenance Schedule (Pool)
Add to Activities or Safety tab:
- Filter backwash schedule (weekly)
- Chemical shock schedule (bi-weekly)
- Deep clean dates
- Show as recurring calendar items with overdue alerts

### 37. Irrigation Monitor (Gardening)
New sub-tab "Irrigation":
- Zone-by-zone status: Active / Blocked / Off
- Flow rate per zone
- Water usage tracking per zone
- "Report blockage" button creates maintenance issue

### 38. Harvest Log (Gardening)
New sub-tab "Harvest" for kitchen garden:
- Date, item harvested, quantity (kg), sentTo (Kitchen/Staff)
- Running total: "This month: 45kg tomatoes, 12kg spinach..."
- Notify Chef Emmanuel when harvest is available

### 39. Photo Journal (Gardening)
Add notes/description improvements:
- Before/after text descriptions per zone
- Seasonal comparison notes
- "Last major work" timestamp per zone

---

## BATCH 7 — Night Audit, Settings, System (Items 50-58, 60)

### 50. Printable Night Audit
Add "🖨 Print Report" button that triggers window.print().
Use @media print CSS to hide sidebar, topbar, and format 
the Night Audit as a clean A4 report with CHABBS letterhead.

### 51. Discrepancy Flags (Night Audit)
Auto-check and highlight:
- Occupied villas without matching bookings
- Revenue logged but no corresponding orders
- Check-outs without villa status change
Show as a "⚠️ Discrepancies" section with red highlights.

### 52. Sign-off Workflow (Night Audit)
Add auditor sign-off: name, timestamp, notes.
Morning review: Aggrey can mark "✅ Reviewed" with comments.
History of past audits with sign-off records.

### 53. Backup & Restore (Settings)
"📦 Export All Data" — downloads entire app state as JSON.
"📥 Import Data" — file upload to restore from backup.
Include version number in export for compatibility.

### 54. Audit Log (Settings)  
Already partially done as Activity Log (#59).
Extend to track: settings changes, role/PIN modifications,
module enable/disable. Admin-only access.

### 55. Notification Preferences (Settings)
New sub-tab "🔔 Notifications":
- Toggle alerts per role: which badges show for which events
- Priority levels: Critical (always show), Normal, Low (hide)
- Example: Housekeeping head sees low stock, but not kitchen orders

### 56. Offline Capability
Use service worker / localStorage to cache:
- Current state snapshot
- Auto-save every 60 seconds
- "📴 Offline Mode" indicator in TopBar
- Queue actions when offline, sync when reconnected
Note: This is complex — implement as localStorage auto-save first.

### 57. Multi-Language (Swahili)
Create a translations object: { en: {...}, sw: {...} }
Key strings: greetings, button labels, module names, form labels.
Language toggle in Settings or TopBar.
Start with: login screen, sidebar labels, common buttons.

### 58. Print Mode
Extend @media print CSS for:
- Payroll register (HR)
- Inventory stock report  
- Booking confirmation receipt
- Financial ledger
Add "🖨 Print" button on each printable view.

### 60. Mobile-Responsive Layout
Add responsive breakpoints:
- Sidebar collapses to icon-only below 768px
- KPI grids stack to 2 columns on tablet, 1 on mobile
- Restaurant POS: menu grid above cart (stacked, not side-by-side)
- SubTabs: horizontal scroll on small screens
Use CSS media queries in global.css or conditional inline styles.

---

## Implementation Notes

- All styles are inline — no CSS classes
- Use React hooks only (useState, useEffect, useRef)
- Theme colors from src/styles/tokens.js (import { C, SC } from ...)
- Shared components from src/components/UI.jsx
- Seed data from src/data/seedData.js
- Christian identity: maintain cross symbols, scripture, faith language
- Currency: KSh (Kenyan Shillings)
- Resort context: Turkana County desert climate, salty borehole water
- Staff names must match existing seed data

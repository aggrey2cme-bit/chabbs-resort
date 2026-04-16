# CHABBS Resort & Conference Centre — Management System v2.0

> ✟ "Commit your work to the Lord, and your plans will be established." — Proverbs 16:3

A comprehensive single-page resort management system for CHABBS Resort, a Christian-run luxury hospitality property in Lodwar, Turkana County, Kenya.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:3000
```

## Login Credentials

| Role | PIN | Access Level |
|------|-----|-------------|
| Admin / Manager | 1234 | Full access — all modules + settings |
| Receptionist | 5678 | Dashboard, Bookings, Villas, Restaurant, Conference, Feedback, Lost & Found |
| Housekeeping | 9012 | My Tasks, Laundry, Villa Status, Supplies, My Info |
| Maintenance | 3456 | Maintenance, Water & Power, Pool, Supplies, My Info |
| Kitchen Staff | 7890 | Restaurant, Supplies, My Info |
| Sales Team | 2345 | Sales & Marketing (17 tabs), Conference, Bookings, Feedback, My Info |
| Grounds Staff | 6789 | Gardening, Pool, Supplies, Maintenance, My Info |

## Architecture

```
src/
├── App.jsx              # Root component — full application (migrate modules out gradually)
├── main.jsx             # React entry point
├── components/
│   └── UI.jsx           # Shared UI primitives (Badge, Card, SectionTitle, SubTabs, etc.)
├── data/
│   └── seedData.js      # All 56 exported seed data constants
├── styles/
│   ├── global.css       # Base CSS, print styles, scrollbar
│   └── tokens.js        # Design tokens (C, SC, THEMES, inp)
└── modules/             # Ready for incremental module extraction
    ├── Dashboard.jsx     # (to be extracted)
    ├── Bookings.jsx      # (to be extracted)
    ├── Restaurant.jsx    # (to be extracted)
    └── ...
```

## Modules (21 total)

### Core Operations
- **Dashboard** — Occupancy, KPIs, cross-department status panels
- **Villa Management** — 10 villas × 3 rooms each, status tracking
- **Bookings** — List + Calendar views, new reservation form
- **Housekeeping** — Villa checklists, Salty Water Protocol
- **Laundry** — 5-stage job tracking with progress bars
- **Maintenance** — Priority-tagged issue log, Borehole Protocol

### Revenue
- **Restaurant & Kitchen** — POS, Kitchen Queue, Sales Reports, Menu Manager
- **Financials** — Daily revenue vs expenses ledger
- **Conference & Events** — Event bookings, 4 venues, revenue tracking
- **Stewardship** — Monthly reporting with scripture

### Guest Experience
- **Pool & Recreation** — Water chemistry, safety checklist, activities
- **Guest Feedback** — Star ratings, categories, recommendations
- **Lost & Found** — Item logging and claim tracking

### People & Resources
- **HR & Payroll** — Staff directory, payroll, advances, leave, shifts, performance
- **My Info** — Secure self-service (non-admin staff see only own data)
- **Inventory** — Stock levels, low stock alerts, supplier tracking
- **Water & Power** — Daily utility readings and charts

### Marketing (17 sub-tabs)
- **Lead Pipeline** — CRM with stage tracking
- **Content Calendar** — Monthly post schedule across platforms
- **Social Media Hub** — TikTok, Instagram, Facebook, LinkedIn, Twitter, Google
- **AI Content Studio** — Claude API-powered content generation
- **SEO Dashboard** — 12 tracked keywords with positions and trends
- **Competitor Analysis** — Lodwar market comparison
- **Email Marketing** — Campaigns with A/B subject line testing
- **SMS Marketing** — Safaricom bulk SMS
- **WhatsApp Business** — Message templates, guest quick-send
- **Guest CRM** — Loyalty tiers, lifetime value, segmentation
- **Automation Workflows** — 8 pre-built marketing automations
- **Review Aggregator** — Google, TripAdvisor, Booking.com
- **QR Code Generator** — 8 resort QR codes with scan tracking
- **Revenue Attribution** — Channel ROI analysis
- **Packages & Promotions** — 6 resort packages
- **Analytics** — Revenue trends, lead sources, social performance
- **Marketing Tasks** — Checklist with priority and owner

### System
- **Night Audit** — 11-section end-of-day report
- **Settings** — Identity, Themes (7), Modules, Roles, Villas, Devotions, Data Export

## Design System

- **Theme**: Turkana Earth Tones (7 swappable themes including Dark Mode)
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Navy #0F2744, Sand #F4ECD8, Terracotta #B85C38, Sage #5A7A5E, Gold #C9952A
- **Christian Identity**: Cross symbol ✟, Morning Devotion popup, scripture references throughout

## Migration Guide

To extract a module from App.jsx into its own file:

```jsx
// 1. Create src/modules/Dashboard.jsx
import { useState } from 'react';
import { C } from '../styles/tokens';
import { Badge, Card, SectionTitle, StatBox } from '../components/UI';

export const Dashboard = ({ villas, bookings, financials, ... }) => {
  // Paste the Dashboard component code here
};

// 2. In App.jsx, replace the component with an import:
import { Dashboard } from './modules/Dashboard';
```

## 60 Planned Improvements

See the improvement roadmap in the project. Key priorities:
- Check-in/Check-out workflow with timestamps
- Asset register and preventive maintenance calendar
- Table map for restaurant
- Petty cash and department budgets
- Purchase order system
- NPS scoring for guest feedback
- Activity audit log
- Print-optimised reports

## Tech Stack

- React 18 (hooks only — useState, useEffect, useRef)
- Vite 6 (dev server + build)
- Inline styles (no CSS framework)
- Anthropic Claude API (AI content generation in Sales module)
- Google Fonts (injected via HTML)

## Built for

**CHABBS Resort & Conference Centre**
Lodwar, Turkana County, Kenya
10 Luxury 3-Bedroom Ensuite Villas

---
*"Whatever you do, work heartily, as for the Lord and not for men." — Colossians 3:23*

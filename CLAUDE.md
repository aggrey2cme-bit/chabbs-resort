# CHABBS Resort Management System

## Project Overview
A comprehensive resort management system for CHABBS Resort & Conference Centre, 
a Christian-run luxury hospitality property in Lodwar, Turkana County, Kenya.
10 luxury three-bedroom ensuite villas. 15 staff. 21 modules. Single-page React app.

## Tech Stack  
- React 18 (hooks only — useState, useEffect, useRef)
- Vite 6 (dev server on port 3000)
- Inline styles only — NO CSS framework, NO Tailwind, NO styled-components
- Google Fonts: Playfair Display (headings) + DM Sans (body)
- Anthropic Claude API for AI content generation in Sales module

## Architecture
- `src/App.jsx` — Full working monolith (2,382 lines). This is the main file.
- `src/components/UI.jsx` — Shared UI primitives (Badge, Card, SectionTitle, etc.)
- `src/data/seedData.js` — All 56 seed data constants (exported)
- `src/styles/tokens.js` — Design tokens: C (colors), SC (status colors), THEMES
- `src/styles/global.css` — Base styles, print, scrollbar
- `src/modules/` — Empty, ready for incremental extraction from App.jsx

## Key Conventions
- All colors reference the C object from tokens.js: C.navy, C.terra, C.sage, etc.
- Status badges use the SC object for consistent color-coding
- Christian identity throughout: ✟ cross symbol, scripture, Morning Devotions
- Currency is KSh (Kenyan Shillings) — always format with .toLocaleString()
- Turkana/Lodwar context: desert heat, salty borehole water, NGO guests
- Role-based access: Admin sees everything, other roles are restricted
- The "My Info" view shows non-admin staff ONLY their own HR data

## Important People
- Aggrey Ochieng — General Manager / Admin (PIN 1234)
- Martha Auma — Assistant Manager / Sales
- Chef Emmanuel Liru — Head Chef
- Grace Akello — Head Housekeeper
- James Okwany — Head of Maintenance
- Simon Ewoton — Driver/Groundskeeper

## Task File
See `CLAUDE_CODE_TASKS.md` for 60 planned improvements organized into 7 batches.
Implement by running: `claude "Read CLAUDE_CODE_TASKS.md and implement Batch N"`

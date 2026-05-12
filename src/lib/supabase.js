import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing, export null so the app degrades to localStorage-only
export const supabase = url && key ? createClient(url, key) : null;

export const RESORT_ID = 'chabbs';

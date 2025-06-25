import { EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_SUPABASE_URL } from '@env';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 
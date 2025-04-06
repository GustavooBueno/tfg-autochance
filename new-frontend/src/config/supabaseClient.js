import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ansjxhspngkttwsxnwjt.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2p4aHNwbmdrdHR3c3hud2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTYxMTcsImV4cCI6MjA1ODQzMjExN30.zXShD_yUtIlz97jZDSsOVfkP3F9OcHlHL0KwoR4pvfg';

// Log para confirmar a configuração do cliente
console.log('Iniciando cliente Supabase com URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey); 
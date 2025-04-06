import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL 
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Log para confirmar a configuração do cliente
console.log('Iniciando cliente Supabase com URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey); 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '';
const supabaseKey = ''];

// Log para confirmar a configuração do cliente
console.log('Iniciando cliente Supabase com URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey); 

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);
async function run() {
  const { error } = await supabase.rpc('exec_sql', { sql: `
    DROP POLICY IF EXISTS "users can insert contributions" ON contributions;
    CREATE POLICY "anyone can insert contributions" ON contributions FOR INSERT WITH CHECK (true);
  `});
  console.log(error || 'RLS fixed');
}
run();

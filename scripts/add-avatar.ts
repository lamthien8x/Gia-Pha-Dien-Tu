import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    console.log("Adding avatar_url to people...");
    const { error: error2 } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE people ADD COLUMN IF NOT EXISTS avatar_url TEXT;'
    });
    console.log(error2 || "Added column avatar_url!");

    // Also update PEOPLE_FIELD_MAP inside the codebase? We'll do that via code edit.
}
run();

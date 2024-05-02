import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofrbvmebglbrqfebewol.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey as string)

export default supabase;
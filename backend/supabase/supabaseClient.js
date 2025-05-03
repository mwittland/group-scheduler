import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the root .env file
dotenv.config();

const supabaseUrl = 'https://iotwnwkbjzsrlizuiyqo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;  // This should pull from .env file

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase
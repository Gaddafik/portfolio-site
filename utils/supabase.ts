import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuiaimxwrsisrebllyxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aWFpbXh3cnNpc3JlYmxseXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTg0NzcsImV4cCI6MjA5NTI5NDQ3N30._oOsY-reWOyohwMv6rqI0xOi87e-pLDx5qzYIiuFnIk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
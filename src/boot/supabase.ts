import { createClient, AuthChangeEvent, Session } from '@supabase/supabase-js/dist/main';
import useAuthUser from 'src/composables/UseAuthUser';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.onAuthStateChange((event: AuthChangeEvent, sessionAuth: Session | null) => {
  const { session } = useAuthUser();

  session.value = sessionAuth;

  return event;
});

export default function useSupabase() {
  return { supabase };
}

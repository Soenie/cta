import { createSignal } from 'solid-js';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

export const [session, setSession] = createSignal<Session | null>(null);

export const initializeAuth = async () => {
  const { data: { session: initialSession } } = await supabase.auth.getSession();
  setSession(initialSession);

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  setSession(null);
};
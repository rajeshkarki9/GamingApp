import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

const SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds
let refreshTimeout: NodeJS.Timeout;

export async function getInitialSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setupSessionRefresh(session);
    }
    return session;
  } catch (error) {
    console.error('Error getting initial session:', error);
    return null;
  }
}

export async function setupAuthSubscription(
  callback: (session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setupSessionRefresh(session);
    } else {
      clearTimeout(refreshTimeout);
    }
    callback(session);
  });
}

function setupSessionRefresh(session: Session) {
  // Clear any existing refresh timeout
  clearTimeout(refreshTimeout);

  // Calculate time until session expiry
  const expiresAt = new Date(session.expires_at!).getTime();
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;

  // If session is about to expire, refresh it
  if (timeUntilExpiry < SESSION_EXPIRY) {
    refreshSession();
  }

  // Set up the next refresh
  refreshTimeout = setTimeout(refreshSession, timeUntilExpiry - 5 * 60 * 1000); // 5 minutes before expiry
}

async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    if (session) {
      setupSessionRefresh(session);
    }
  } catch (error) {
    console.error('Error refreshing session:', error);
    // Handle refresh error (e.g., force re-login)
    router.replace('/auth/sign-in');
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearTimeout(refreshTimeout);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
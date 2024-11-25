import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, createContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ErrorBoundary } from '../components/ErrorBoundary';
export const CredentialContext = createContext<{
  credentialLevel: string;
  setCredentialLevel: (level: string) => void;
}>({
  credentialLevel: 'anonymous',
  setCredentialLevel: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [credentialLevel, setCredentialLevel] = useState('anonymous');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          // Get user role from our custom users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            setCredentialLevel('user'); // Default to basic user access
          } else if (userData) {
            setCredentialLevel(userData.role);
          }
        } catch (error) {
          console.error('Error in session check:', error);
          setCredentialLevel('user'); // Fallback to basic access
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get user role from our custom users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            setCredentialLevel('user'); // Default to basic user access
          } else if (userData) {
            setCredentialLevel(userData.role);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setCredentialLevel('user'); // Fallback to basic access
        }
      } else if (event === 'SIGNED_OUT') {
        setCredentialLevel('anonymous');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <CredentialContext.Provider value={{ credentialLevel, setCredentialLevel }}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </CredentialContext.Provider>
  );
}
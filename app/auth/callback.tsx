import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verify CSRF token
        const storedCsrfToken = sessionStorage.getItem('csrfToken');
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user.user_metadata.csrfToken !== storedCsrfToken) {
          throw new Error('Invalid CSRF token');
        }

        // Clear CSRF token
        sessionStorage.removeItem('csrfToken');

        // Redirect to home
        router.replace('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/auth/sign-in');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f11',
    gap: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
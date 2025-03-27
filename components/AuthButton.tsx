import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface AuthButtonProps {
  isAuthenticated: boolean;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export function AuthButton({ isAuthenticated, onAuthStateChange }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        onAuthStateChange(false);
      } else {
        // Instead of using demo credentials, redirect to the sign-in screen
        router.push('/auth/sign-in');
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          isAuthenticated ? styles.signOutButton : styles.signInButton,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={handleAuth}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={isAuthenticated ? 'Sign out' : 'Sign in'}
        accessibilityState={{ busy: isLoading, disabled: isLoading }}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[
            styles.buttonText,
            isAuthenticated ? styles.signOutText : styles.signInText
          ]}>
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </Text>
        )}
      </TouchableOpacity>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  signInButton: {
    backgroundColor: '#6366f1',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInText: {
    color: '#fff',
  },
  signOutText: {
    color: '#fff',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
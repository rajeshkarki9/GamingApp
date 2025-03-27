import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import {
  Bell,
  Shield,
  CreditCard,
  CircleHelp as HelpCircle,
} from 'lucide-react-native';
import { Session } from '@supabase/supabase-js';
import { AuthButton } from '@/components/AuthButton';
import { getInitialSession, setupAuthSubscription } from '@/lib/auth';
import {
  registerForPushNotificationsAsync,
  sendTestNotification,
} from '@/lib/notifications';

export default function SettingsScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get initial session
    getInitialSession().then(setSession);

    // Subscribe to auth changes
    const subscription = setupAuthSubscription(setSession);

    return () => {
      // Cleanup subscription
      subscription.then(({ data: { subscription } }) => {
        subscription?.unsubscribe();
      });
    };
  }, []);

  const handleNotificationToggle = async () => {
    try {
      setNotificationError(null);
      if (!notificationsEnabled) {
        await registerForPushNotificationsAsync();
        await sendTestNotification();
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      setNotificationError(
        error instanceof Error
          ? error.message
          : 'Failed to toggle notifications'
      );
    }
  };

  const renderSettingItem = ({ icon, title, value, type = 'arrow' }) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon}
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: '#2c2d31', true: '#6366f1' }}
          thumbColor={value ? '#fff' : '#71717a'}
        />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.authContainer}>
            <AuthButton
              isAuthenticated={!!session}
              onAuthStateChange={(isAuthenticated) => {
                // Session will be updated automatically through the subscription
              }}
            />
            {session && <Text style={styles.emailText}>{session.user.email}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem({
            icon: <Bell size={24} color="#6366f1" />,
            title: 'Push Notifications',
            value: notificationsEnabled,
            type: 'switch',
          })}
          {notificationError && (
            <Text style={styles.errorText}>{notificationError}</Text>
          )}
          {notificationsEnabled && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => sendTestNotification()}>
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {renderSettingItem({
            icon: <Shield size={24} color="#6366f1" />,
            title: 'Privacy',
            value: 'Public Profile',
          })}
          {renderSettingItem({
            icon: <CreditCard size={24} color="#6366f1" />,
            title: 'Payment Methods',
            value: '•••• 4242',
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem({
            icon: <HelpCircle size={24} color="#6366f1" />,
            title: 'Help Center',
            value: '',
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f11',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#71717a',
    marginBottom: 16,
  },
  authContainer: {
    alignItems: 'center',
    backgroundColor: '#1a1b1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  emailText: {
    color: '#71717a',
    marginTop: 8,
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1b1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: '#71717a',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 8,
  },
  testButton: {
    backgroundColor: '#2c2d31',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
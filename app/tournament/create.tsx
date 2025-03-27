import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock, Trophy, Users, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format as formatDate } from 'date-fns';
import { supabase } from '@/lib/supabase';

const GAME_FORMATS = [
  { id: 'solo', name: 'Solo', maxPlayers: 100 },
  { id: 'duo', name: 'Duo', maxPlayers: 50 },
  { id: 'squad', name: 'Squad', maxPlayers: 25 },
];

export default function CreateTournament() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState(GAME_FORMATS[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [prizePool, setPrizePool] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      const { error: createError } = await supabase.from('tournaments').insert({
        title,
        description,
        game_type: 'free_fire',
        format: format.id,
        start_date: startDate.toISOString(),
        prize_pool: parseFloat(prizePool),
        max_participants: format.maxPlayers,
        status: 'draft',
      });

      if (createError) throw createError;
      router.push('/');
    } catch (err) {
      setError('Failed to create tournament. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Tournament</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Tournament Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter tournament title"
            placeholderTextColor="#71717a"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter tournament description"
            placeholderTextColor="#71717a"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Format</Text>
          <View style={styles.formatGrid}>
            {GAME_FORMATS.map((gameFormat) => (
              <TouchableOpacity
                key={gameFormat.id}
                style={[
                  styles.formatOption,
                  format.id === gameFormat.id && styles.formatOptionSelected,
                ]}
                onPress={() => setFormat(gameFormat)}>
                <Users size={24} color={format.id === gameFormat.id ? '#fff' : '#6366f1'} />
                <Text
                  style={[
                    styles.formatText,
                    format.id === gameFormat.id && styles.formatTextSelected,
                  ]}>
                  {gameFormat.name}
                </Text>
                <Text style={styles.maxPlayers}>{gameFormat.maxPlayers} players</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Calendar size={24} color="#6366f1" />
            <Text style={styles.dateText}>
              {formatDate(startDate, 'MMMM d, yyyy h:mm a')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Prize Pool</Text>
          <View style={styles.prizeInput}>
            <Trophy size={24} color="#6366f1" />
            <TextInput
              style={styles.prizeTextInput}
              value={prizePool}
              onChangeText={setPrizePool}
              placeholder="Enter prize amount"
              placeholderTextColor="#71717a"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Tournament</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1b1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1b1e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  formatOption: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2c2d31',
  },
  formatOptionSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  formatText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  formatTextSelected: {
    color: '#fff',
  },
  maxPlayers: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b1e',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  prizeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b1e',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  prizeTextInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
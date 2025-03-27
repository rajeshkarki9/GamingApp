import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MessageSquare, Users, Trophy, ArrowLeft } from 'lucide-react-native';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

// Rest of the file remains unchanged
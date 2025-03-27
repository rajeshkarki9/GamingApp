import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

const TOURNAMENTS = [
  {
    id: '1',
    title: 'Free Fire Pro League',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
    status: 'Ongoing',
    participants: 48,
    prizePool: '$1,000',
  },
  {
    id: '2',
    title: 'Squad Masters Cup',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop',
    status: 'Upcoming',
    participants: 32,
    prizePool: '$500',
  },
];

export default function TournamentsScreen() {
  const router = useRouter();

  const renderTournamentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/tournament/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardStatus}>{item.status}</Text>
          <Text style={styles.cardParticipants}>{item.participants} Teams</Text>
          <Text style={styles.cardPrize}>{item.prizePool}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tournaments</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/tournament/create')}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={TOURNAMENTS}
        renderItem={renderTournamentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#6366f1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1a1b1e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardStatus: {
    color: '#6366f1',
    fontWeight: '600',
  },
  cardParticipants: {
    color: '#71717a',
  },
  cardPrize: {
    color: '#22c55e',
    fontWeight: '600',
  },
});
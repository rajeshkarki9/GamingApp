import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';

const TEAMS = [
  {
    id: '1',
    name: 'Phoenix Squad',
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop',
    members: 4,
    rank: '#1',
    wins: 12,
  },
  {
    id: '2',
    name: 'Dragon Warriors',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop',
    members: 4,
    rank: '#2',
    wins: 10,
  },
];

export default function TeamsScreen() {
  const router = useRouter();

  interface Team {
    id: string;
    name: string;
    image: string;
    members: number;
    rank: string;
    wins: number;
  }
  
  const renderTeamCard = ({ item }: { item: Team }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(tabs)/team/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardRank}>Rank {item.rank}</Text>
          <Text style={styles.cardMembers}>{item.members} Members</Text>
          <Text style={styles.cardWins}>{item.wins} Wins</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/team/create')}>
          <UserPlus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={TEAMS}
        renderItem={renderTeamCard}
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
    height: 160,
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
  cardRank: {
    color: '#6366f1',
    fontWeight: '600',
  },
  cardMembers: {
    color: '#71717a',
  },
  cardWins: {
    color: '#22c55e',
    fontWeight: '600',
  },
});
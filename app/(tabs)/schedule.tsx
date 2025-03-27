import { View, Text, StyleSheet, SectionList } from 'react-native';
import { format } from 'date-fns';

const SCHEDULE = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        time: '14:00',
        tournament: 'Free Fire Pro League',
        round: 'Quarter Finals',
        teams: ['Phoenix Squad', 'Dragon Warriors'],
      },
      {
        id: '2',
        time: '16:00',
        tournament: 'Squad Masters Cup',
        round: 'Group Stage',
        teams: ['Ninja Team', 'Victory Legion'],
      },
    ],
  },
  {
    title: 'Tomorrow',
    data: [
      {
        id: '3',
        time: '15:00',
        tournament: 'Free Fire Pro League',
        round: 'Semi Finals',
        teams: ['TBD', 'TBD'],
      },
    ],
  },
];

export default function ScheduleScreen() {
  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.time}>{item.time}</Text>
      <View style={styles.matchInfo}>
        <Text style={styles.tournament}>{item.tournament}</Text>
        <Text style={styles.round}>{item.round}</Text>
        <Text style={styles.teams}>{item.teams.join(' vs ')}</Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <Text style={styles.date}>{format(new Date(), 'MMMM d, yyyy')}</Text>
      </View>
      <SectionList
        sections={SCHEDULE}
        renderItem={renderScheduleItem}
        renderSectionHeader={renderSectionHeader}
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#71717a',
    marginTop: 4,
  },
  list: {
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: '#1a1b1e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    width: 60,
  },
  matchInfo: {
    flex: 1,
  },
  tournament: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  round: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 4,
  },
  teams: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
});
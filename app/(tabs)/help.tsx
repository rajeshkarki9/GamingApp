import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Search, MessageSquare, Mail, ChevronRight } from 'lucide-react-native';
import Fuse from 'fuse.js';

const FAQ_DATA = [
  {
    id: '1',
    question: 'How do I join a tournament?',
    answer: 'To join a tournament, navigate to the Tournaments tab and select the tournament you want to join. Click the "Register" button and follow the instructions to complete your registration.',
    category: 'Tournaments',
  },
  {
    id: '2',
    question: 'How do I create a team?',
    answer: 'Go to the Teams tab and click the "+" button in the top right corner. Fill in your team details, including name and logo, then invite players using their usernames or email addresses.',
    category: 'Teams',
  },
  {
    id: '3',
    question: 'What happens if I miss a match?',
    answer: 'If you miss a match, it will be counted as a forfeit. Make sure to check your schedule regularly and set up notifications to avoid missing any matches.',
    category: 'Matches',
  },
];

const CATEGORIES = [
  {
    id: 'tournaments',
    title: 'Tournament Guide',
    icon: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&auto=format&fit=crop',
    description: 'Learn about joining and managing tournaments',
  },
  {
    id: 'teams',
    title: 'Team Management',
    icon: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    description: 'Create and manage your team',
  },
  {
    id: 'matches',
    title: 'Match Rules',
    icon: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    description: 'Understanding match schedules and rules',
  },
];

const fuse = new Fuse(FAQ_DATA, {
  keys: ['question', 'answer', 'category'],
  threshold: 0.3,
});

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(FAQ_DATA);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      const results = fuse.search(text).map(result => result.item);
      setSearchResults(results);
    } else {
      setSearchResults(FAQ_DATA);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help Center</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#71717a" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => {/* Navigate to category */}}>
                <Image
                  source={{ uri: category.icon }}
                  style={styles.categoryImage}
                />
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <ChevronRight size={20} color="#6366f1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {searchResults.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => {/* Expand FAQ item */}}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.sectionTitle}>Need More Help?</Text>
          <View style={styles.supportOptions}>
            <TouchableOpacity style={styles.supportCard}>
              <MessageSquare size={24} color="#6366f1" />
              <Text style={styles.supportTitle}>Live Chat</Text>
              <Text style={styles.supportDescription}>
                Chat with our support team
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportCard}>
              <Mail size={24} color="#6366f1" />
              <Text style={styles.supportTitle}>Email Support</Text>
              <Text style={styles.supportDescription}>
                Send us your questions
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#1a1b1e',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2d31',
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  categories: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#1a1b1e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: 120,
  },
  categoryContent: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 8,
  },
  faqContainer: {
    marginBottom: 32,
  },
  faqItem: {
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
  },
  supportContainer: {
    marginBottom: 32,
  },
  supportOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  supportCard: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
});
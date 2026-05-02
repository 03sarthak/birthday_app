import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllBirthdays, deleteBirthday, Birthday } from '../services/api';
import BirthdayCard from '../components/BirthdayCard';

interface Props {
  navigation: any;
}

const BirthdayListScreen: React.FC<Props> = ({ navigation }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch birthdays every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBirthdays();
    }, [])
  );

  const fetchBirthdays = async () => {
    try {
      const data = await getAllBirthdays();
      // Sort by closest birthday first
      const sorted = data.sort((a, b) => {
        const daysA = getDaysUntil(a.dob);
        const daysB = getDaysUntil(b.dob);
        return daysA - daysB;
      });
      setBirthdays(sorted);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch birthdays. Is the server running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDaysUntil = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEdit = (birthday: Birthday) => {
    navigation.navigate('AddBirthday', { birthday });
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Birthday',
      'Are you sure you want to delete this birthday?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBirthday(id);
              setBirthdays(prev => prev.filter(b => b.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete birthday');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBirthdays();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {birthdays.length === 0 ? (
        // Empty state
        <View style={styles.centered}>
          <Text style={styles.emptyText}>🎂 No birthdays yet!</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddBirthday')}>
            <Text style={styles.addButtonText}>+ Add Birthday</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={birthdays}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <BirthdayCard
              birthday={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B6B']}
            />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 8,
  },
});

export default BirthdayListScreen;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Birthday } from '../services/api';

// Calculate days until next birthday
const getDaysUntilBirthday = (dob: string): number => {
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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get countdown message
const getCountdownMessage = (days: number): string => {
  if (days === 0) return '🎉 Today is their birthday!';
  if (days === 1) return '🎂 Tomorrow is their birthday!';
  if (days === 7) return '🎈 Birthday in 1 week!';
  if (days === 14) return '📅 Birthday in 2 weeks!';
  return `🎂 Birthday in ${days} days!`;
};

// Format date nicely
const formatDate = (dob: string): string => {
  const date = new Date(dob);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

interface BirthdayCardProps {
  birthday: Birthday;
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: number) => void;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({
  birthday,
  onEdit,
  onDelete,
}) => {
  const daysUntil = getDaysUntilBirthday(birthday.dob);
  const countdownMessage = getCountdownMessage(daysUntil);
  const formattedDate = formatDate(birthday.dob);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>🎂 {birthday.name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.countdown}>{countdownMessage}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(birthday)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(birthday.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  countdown: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default BirthdayCard;
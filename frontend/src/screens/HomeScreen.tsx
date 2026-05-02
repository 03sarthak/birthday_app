import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { getAllBirthdays, Birthday } from '../services/api';

interface Props {
  navigation: any;
}

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDayBirthdays, setSelectedDayBirthdays] = useState<Birthday[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Refresh every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBirthdays();
    }, [])
  );

  const fetchBirthdays = async () => {
    try {
      const data = await getAllBirthdays();
      setBirthdays(data);
      markBirthdaysOnCalendar(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch birthdays. Is the server running?');
    }
  };

  // Mark birthday dates on calendar for current year
  const markBirthdaysOnCalendar = (data: Birthday[]) => {
    const today = new Date();
    const marked: MarkedDates = {};

    data.forEach(birthday => {
      const date = new Date(birthday.dob);
      // Mark for current year
      const currentYearDate = `${today.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      marked[currentYearDate] = {
        marked: true,
        dotColor: '#FF6B6B',
      };
    });

    setMarkedDates(marked);
  };

  // When user taps a date on calendar
  const handleDayPress = (day: any) => {
    const selected = day.dateString;
    setSelectedDate(selected);

    // Find birthdays on this day
    const birthdaysOnDay = birthdays.filter(birthday => {
      const date = new Date(birthday.dob);
      const today = new Date();
      const birthdayThisYear = `${today.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return birthdayThisYear === selected;
    });

    setSelectedDayBirthdays(birthdaysOnDay);

    // Update marked dates to show selected
    setMarkedDates(prev => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        selected: true,
        selectedColor: '#FF6B6B',
      },
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎂 Birthday App</Text>
        <Text style={styles.headerSubtitle}>Never miss a birthday!</Text>
      </View>

      {/* Calendar */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#FF6B6B',
          selectedDayBackgroundColor: '#FF6B6B',
          arrowColor: '#FF6B6B',
          dotColor: '#FF6B6B',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        style={styles.calendar}
      />

      {/* Selected Day Birthdays */}
      {selectedDayBirthdays.length > 0 && (
        <View style={styles.selectedDay}>
          <Text style={styles.selectedDayTitle}>
            🎉 Birthdays on {selectedDate}:
          </Text>
          {selectedDayBirthdays.map(birthday => (
            <Text key={birthday.id} style={styles.selectedDayName}>
              🎂 {birthday.name}
            </Text>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBirthday')}>
          <Text style={styles.addButtonText}>+ Add Birthday</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listButton}
          onPress={() => navigation.navigate('BirthdayList')}>
          <Text style={styles.listButtonText}>📋 View All Birthdays</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Birthdays */}
      {birthdays.length > 0 && (
        <View style={styles.upcoming}>
          <Text style={styles.upcomingTitle}>🔔 Upcoming Birthdays</Text>
          {birthdays
            .map(birthday => {
              const today = new Date();
              const date = new Date(birthday.dob);
              const nextBirthday = new Date(
                today.getFullYear(),
                date.getMonth(),
                date.getDate()
              );
              if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
              }
              const days = Math.ceil(
                (nextBirthday.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return { ...birthday, days };
            })
            .sort((a, b) => a.days - b.days)
            .slice(0, 3)
            .map(birthday => (
              <View key={birthday.id} style={styles.upcomingItem}>
                <Text style={styles.upcomingName}>🎂 {birthday.name}</Text>
                <Text style={styles.upcomingDays}>
                  {birthday.days === 0
                    ? '🎉 Today!'
                    : `${birthday.days} days`}
                </Text>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE0E0',
    marginTop: 4,
  },
  calendar: {
    borderRadius: 12,
    margin: 16,
    elevation: 3,
  },
  selectedDay: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  selectedDayName: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  buttons: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  listButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  upcoming: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 2,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  upcomingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  upcomingName: {
    fontSize: 15,
    color: '#333',
  },
  upcomingDays: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default HomeScreen;
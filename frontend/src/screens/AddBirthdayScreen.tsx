import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { addBirthday, updateBirthday, Birthday } from '../services/api';

interface Props {
  navigation: any;
  route: any;
}

const AddBirthdayScreen: React.FC<Props> = ({ navigation, route }) => {
  const existingBirthday: Birthday | undefined = route.params?.birthday;
  const isEditing = !!existingBirthday;

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  // If editing, prefill the form
  useEffect(() => {
    if (existingBirthday) {
      setName(existingBirthday.name);
      setDob(existingBirthday.dob);
    }
  }, [existingBirthday]);

  // Validate date format YYYY-MM-DD
  const isValidDate = (date: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsed = new Date(date);
    return parsed instanceof Date && !isNaN(parsed.getTime());
  };

  const handleSave = async () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    if (!dob.trim()) {
      Alert.alert('Error', 'Please enter a date of birth');
      return;
    }
    if (!isValidDate(dob)) {
      Alert.alert('Error', 'Please enter a valid date in YYYY-MM-DD format');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && existingBirthday) {
        await updateBirthday(existingBirthday.id, name.trim(), dob.trim());
        Alert.alert('Success', `${name} updated successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addBirthday(name.trim(), dob.trim());
        Alert.alert('Success', `${name}'s birthday added!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.error || 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? '✏️ Edit Birthday' : '🎂 Add Birthday'}
      </Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      {/* Date of Birth Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={dob}
          onChangeText={setDob}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={styles.hint}>Format: YYYY-MM-DD (e.g. 1995-04-23)</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            {isEditing ? '💾 Update' : '💾 Save'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#FFB3B3',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
});

export default AddBirthdayScreen;
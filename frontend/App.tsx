import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import HomeScreen from './src/screens/HomeScreen';
import AddBirthdayScreen from './src/screens/AddBirthdayScreen';
import BirthdayListScreen from './src/screens/BirthdayListScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    // Subscribe to birthday reminders topic
    messaging()
      .subscribeToTopic('birthday_reminders')
      .then(() => console.log('Subscribed to birthday_reminders topic'));

    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || '🎂 Birthday Reminder',
        remoteMessage.notification?.body || ''
      );
    });

    return unsubscribe;
  }, []);

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '🎂 Birthday App' }}
        />
        <Stack.Screen
          name="AddBirthday"
          component={AddBirthdayScreen}
          options={{ title: 'Add Birthday' }}
        />
        <Stack.Screen
          name="BirthdayList"
          component={BirthdayListScreen}
          options={{ title: 'All Birthdays' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
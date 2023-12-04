import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import InterestSelection from '../components/InterestSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainInterests } from '../components/InterestSelection';
import { trackEvent } from "@aptabase/react-native";
import { app, auth, database } from '../../firebaseConfig';
import { ref, get, set } from 'firebase/database';



export default function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSubInterests, setSelectedSubInterests] = useState([]);
  const [preferredDistance, setPreferredDistance] = useState('');
  const [preferredCost, setPreferredCost] = useState('');

  useEffect(() => {
    // Load preferences when the screen loads
    loadPreferences();
  }, []);

  useEffect(() => {
    // Save preferences whenever they change
    const filteredSubInterests = selectedInterests.filter(interest => !mainInterests.includes(interest));
    // console.log('Selected sub interests: ', filteredSubInterests);
    setSelectedSubInterests(filteredSubInterests);

    savePreferences();
  }, [selectedInterests, preferredDistance, preferredCost]);

  const savePreferences = async () => {
    try {

      // Get the current user from Firebase authentication
      const currentUser = auth.currentUser;
      //console.log(currentUser)

      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      // Stringify arrays to send actual values
      const selectedInterestsStringified = JSON.stringify(selectedInterests);
      const selectedSubInterestsStringified = JSON.stringify(selectedSubInterests);


      // console.log('Saving preferences in Preferences.js: ' + selectedSubInterests);
      // await AsyncStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
      // await AsyncStorage.setItem('selectedSubInterests', JSON.stringify(selectedSubInterests));
      // await AsyncStorage.setItem('preferredDistance', preferredDistance);
      // await AsyncStorage.setItem('preferredCost', preferredCost);


      // Save preferences to Firebase Realtime Database
      const preferencesRef = ref(database, `users/${currentUser.uid}/preferences`);


      await set(preferencesRef, {
        selectedInterests: JSON.stringify(selectedInterests),
        selectedSubInterests: JSON.stringify(selectedSubInterests),
        preferredDistance,
        preferredCost,
      });
      

      // Log analytics event when preferences are saved
      trackEvent('preferences_saved', {
        selectedInterests: selectedInterestsStringified,
        selectedSubInterests: selectedSubInterestsStringified,
        preferredDistance,
        preferredCost,
      });

    } catch (e) {
      console.log(e);
    }
  };

  const loadPreferences = async () => {
    try {
      // const savedInterests = await AsyncStorage.getItem('selectedInterests');
      // const savedSubInterests = await AsyncStorage.getItem('selectedSubInterests');
      // const savedDistance = await AsyncStorage.getItem('preferredDistance');
      // const savedCost = await AsyncStorage.getItem('preferredCost');

      //if (savedInterests !== null) setSelectedInterests(JSON.parse(savedInterests));
      //if (savedSubInterests !== null) setSelectedSubInterests(JSON.parse(savedSubInterests));
      //if (savedDistance !== null) setPreferredDistance(savedDistance);
      //if (savedCost !== null) setPreferredCost(savedCost);

      // Get the current user from Firebase authentication
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }


      //const databaseRef = getDatabase(); // Use the database function to get a reference
      const preferencesRef = ref(database, `users/${currentUser.uid}/preferences`); 


      // Load preferences from Firebase
      const snapshot = await get(preferencesRef);
      const preferences = snapshot.val();

      if (preferences) {

        console.log('Loaded Preferences:', preferences);

        const {
          selectedInterests: savedInterests,
          selectedSubInterests: savedSubInterests,
          preferredDistance: savedDistance,
          preferredCost: savedCost,
        } = preferences;

        setSelectedInterests(JSON.parse(savedInterests) || []);
        setSelectedSubInterests(JSON.parse(savedSubInterests) || []);
        setPreferredDistance(savedDistance || '');
        setPreferredCost(savedCost || '');
      }






    } catch (e) {
      console.log(e);
    }
  };

  const onNextPressed = () => {
    savePreferences();
    // Handle the logic for moving to next screen and pass the preferences
    navigation.navigate('NearbyPlaces', {
      selectedInterests,
      selectedSubInterests,
      preferredDistance,
      preferredCost,
    });
  };

  return (
    <Background>
      <Header>Select Your Interests</Header>
      <InterestSelection
        selectedInterests={selectedInterests}
        onInterestChange={setSelectedInterests}
        preferredDistance={preferredDistance}
        onDistanceChange={setPreferredDistance}
        preferredCost={preferredCost}
        onCostChange={setPreferredCost}
      />

      <Button
        mode="contained"
        onPress={onNextPressed}
        style={styles.button}
      >
        Update
      </Button>

    </Background>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8, 
    marginBottom: 80,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    color: theme.colors.primary,
  },
});

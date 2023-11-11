import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import InterestSelection from '../components/InterestSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [preferredDistance, setPreferredDistance] = useState('');
  const [preferredCost, setPreferredCost] = useState('');

  useEffect(() => {
    // Load any saved preferences when the component mounts
    loadPreferences();
  }, []);

  useEffect(() => {
    // Save preferences whenever they change
    savePreferences();
  }, [selectedInterests, preferredDistance, preferredCost]);

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
      await AsyncStorage.setItem('preferredDistance', preferredDistance);
      await AsyncStorage.setItem('preferredCost', preferredCost);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const loadPreferences = async () => {
    try {
      const savedInterests = await AsyncStorage.getItem('selectedInterests');
      const savedDistance = await AsyncStorage.getItem('preferredDistance');
      const savedCost = await AsyncStorage.getItem('preferredCost');

      if (savedInterests !== null) setSelectedInterests(JSON.parse(savedInterests));
      if (savedDistance !== null) setPreferredDistance(savedDistance);
      if (savedCost !== null) setPreferredCost(savedCost);
    } catch (e) {
      // loading error
      console.log(e);
    }
  };

  const onNextPressed = () => {
    // Handle the logic for moving to the next screen here and pass the selected interests
    navigation.navigate('NearbyPlaces', {
      selectedInterests,
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

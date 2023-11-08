import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import InterestSelection from '../components/InterestSelection';


export default function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [preferredDistance, setPreferredDistance] = useState('');
  const [preferredCost, setPreferredCost] = useState('');

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
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    color: theme.colors.primary,
  },
});

import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import InterestSelection from '../components/InterestSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainInterests } from '../components/InterestSelection';


export default function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSubInterests, setSelectedSubInterests] = useState([]);
  const [preferredDistance, setPreferredDistance] = useState('');
  const [preferredCost, setPreferredCost] = useState('');

  useEffect(() => {
    // Filter and update sub-interests whenever selectedInterests change
    const filteredSubInterests = selectedInterests.filter(interest => !mainInterests.includes(interest));
    setSelectedSubInterests(filteredSubInterests);

    // Save preferences whenever they change
    savePreferences();
  }, [selectedInterests, preferredDistance, preferredCost]);

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
      await AsyncStorage.setItem('selectedSubInterests', JSON.stringify(selectedSubInterests));
      await AsyncStorage.setItem('preferredDistance', preferredDistance);
      await AsyncStorage.setItem('preferredCost', preferredCost);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const onNextPressed = () => {
    // Handle the logic for moving to the next screen here and pass the selected interests
    navigation.navigate('HomeScreen', {
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
        Next
      </Button>

      <View style={styles.text}>
        <Text>Already have an account?</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8, 
  },
  text: {
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 40,
  },
  link: {
    color: theme.colors.primary,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

const InterestSelection = ({ selectedInterests, onInterestChange, preferredDistance, onDistanceChange, preferredCost, onCostChange }) => {
  // Define an array of interests
  const interests = [
    'Sports',
    'Art and Culture',
    'History',
    'Food and Dining',
    'Nature and Outdoors',
    'Music',
    'Technology',
    'Shopping',
    'Movies and Entertainment'
  ];

  const [preferredPrice, setpreferredPrice] = useState(3);

  const onPriceChange = (value) => {
    setpreferredPrice(value);
  };

  // Function to toggle the selected interests
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      onInterestChange(selectedInterests.filter(item => item !== interest));
    } else {
      onInterestChange([...selectedInterests, interest]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Your Interests:</Text>
      {interests.map((interest, index) => (
        <View key={index} style={styles.interestContainer}>
          <Checkbox
            value={selectedInterests.includes(interest)}
            onValueChange={() => toggleInterest(interest)}
          />
          <Text style={styles.interestText}>{interest}</Text>
        </View>
      ))}

      <Text style={styles.label}>Preferred Time Travel (in minutes):</Text>
      <TextInput
        value={preferredDistance}
        onChangeText={onDistanceChange}
        placeholder="Enter preferred distance"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Preferred Cost (1-5):</Text>
      <Text style={styles.sliderValue}>{preferredPrice}</Text>
      <Slider
        value={preferredPrice}
        onValueChange={onPriceChange}
        minimumValue={1}
        maximumValue={5}
        step={1}
        style={styles.slider}
        thumbTintColor="#f9a825"
        minimumTrackTintColor="#f9a825"
        maximumTrackTintColor="#ccc"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  interestText: {
    marginLeft: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  slider: {
    marginBottom: 20,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InterestSelection;

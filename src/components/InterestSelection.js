import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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

      <Text style={styles.label}>Preferred Distance (in meters):</Text>
      <TextInput
        value={preferredDistance}
        onChangeText={onDistanceChange}
        placeholder="Enter preferred distance"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Preferred Cost (0-5):</Text>
      <TextInput
        value={preferredCost}
        onChangeText={onCostChange}
        placeholder="Enter preferred cost"
        keyboardType="numeric"
        style={styles.input}
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
});

export default InterestSelection;

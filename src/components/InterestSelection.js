import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

const InterestSelection = ({ selectedInterests, onInterestChange, preferredDistance, onDistanceChange, preferredCost, onCostChange }) => {
  // Define an array of interests with sub-interests
  const interests = [
  {
    name: 'Sports',
    subInterests: ['Football', 'Basketball', 'Tennis', 'Golf'],
  },
  {
    name: 'Art and Culture',
    subInterests: ['Museum', 'Painting', 'Sculpture', 'Gallery'],
  },
  {
    name: 'History',
    subInterests: ['Ancient History', 'Modern History', 'Archaeology'],
  },
  {
    name: 'Food and Dining',
    subInterests: ['Fine Dining', 'Street Food', 'Vegetarian', 'Italian'],
  },
  {
    name: 'Nature and Outdoors',
    subInterests: ['Hiking', 'Camping', 'Wildlife', 'Beaches'],
  },
  {
    name: 'Music',
    subInterests: ['Rock', 'Jazz', 'Classical', 'Hip-Hop'],
  },
  {
    name: 'Technology',
    subInterests: ['Gadgets', 'Programming', 'AI', 'Mobile Apps'],
  },
  {
    name: 'Shopping',
    subInterests: ['Fashion', 'Electronics', 'Antiques', 'Local Markets'],
  },
  {
    name: 'Movies and Entertainment',
    subInterests: ['Action', 'Comedy', 'Drama', 'Science Fiction'],
  },
];


  const [preferredPrice, setPreferredPrice] = useState(3);

  const onPriceChange = (value) => {
    setPreferredPrice(value);
  };

  // Function to toggle the selected interests and sub-interests
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      onInterestChange(selectedInterests.filter(item => item !== interest));
    } else {
      onInterestChange([...selectedInterests, interest]);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}><View style={styles.container}>
      <Text style={styles.label}>Select Your Interests:</Text>
      {interests.map((mainInterest, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.interestContainer}
            onPress={() => toggleInterest(mainInterest.name)}
          >
            <Checkbox
              value={selectedInterests.includes(mainInterest.name)}
              onValueChange={() => toggleInterest(mainInterest.name)}
            />
            <Text style={styles.interestText}>{mainInterest.name}</Text>
          </TouchableOpacity>
          {selectedInterests.includes(mainInterest.name) && (
            mainInterest.subInterests.map((subInterest, subIndex) => (
              <TouchableOpacity
                key={subIndex}
                style={styles.subInterestContainer}
                onPress={() => toggleInterest(subInterest)}
              >
                <Checkbox
                  value={selectedInterests.includes(subInterest)}
                  onValueChange={() => toggleInterest(subInterest)}
                />
                <Text style={styles.subInterestText}>{subInterest}</Text>
              </TouchableOpacity>
            ))
          )}
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
      <View style={styles.sliderValueContainer}>
        <Text style={styles.sliderValue}>{preferredPrice}</Text>
      </View>
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
  </ScrollView>
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
  subInterestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 24, // Adjust the indentation as needed
  },
  subInterestText: {
    marginLeft: 8,
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  fullWidthSlider: {
    width: '100%',  
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderValueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9a825',
  },
});

export default InterestSelection;

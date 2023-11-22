import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

const InterestSelection = ({ selectedInterests, onInterestChange, preferredDistance, onDistanceChange, preferredCost, onCostChange }) => {
  // Define an array of interests
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

  const [preferredPrice, setpreferredPrice] = useState(3);

  const onPriceChange = (value) => {
    setpreferredPrice(value);
  };

  // Function to toggle the selected interests
  const toggleInterest = (interest, isMainInterest = false) => {
    onInterestChange(prevSelectedInterests => {
      let updatedInterests;
  
      if (isMainInterest) {
        // Find the main interest object
        const mainInterestObj = interests.find(i => i.name === interest);
  
        // Determine if the main interest is currently selected
        const isMainInterestSelected = prevSelectedInterests.includes(interest);
  
        if (isMainInterestSelected) {
          // Remove the main interest and its sub-interests if it's currently selected
          updatedInterests = prevSelectedInterests.filter(item => item !== interest && !mainInterestObj.subInterests.includes(item));
        } else {
          // Add the main interest and all its sub-interests
          updatedInterests = [...new Set([...prevSelectedInterests, interest, ...mainInterestObj.subInterests])];
        }
      } else {
        // Toggle individual sub-interest
        if (prevSelectedInterests.includes(interest)) {
          updatedInterests = prevSelectedInterests.filter(item => item !== interest);
        } else {
          updatedInterests = [...prevSelectedInterests, interest];
        }
  
        // Check if all or no sub-interests are selected to update the main interest accordingly
        const mainInterest = interests.find(i => i.subInterests.includes(interest));
        const allSubSelected = mainInterest && mainInterest.subInterests.every(sub => updatedInterests.includes(sub));
        const noneSubSelected = mainInterest && mainInterest.subInterests.every(sub => !updatedInterests.includes(sub));
  
        if (allSubSelected && !updatedInterests.includes(mainInterest.name)) {
          updatedInterests.push(mainInterest.name);
        } else if (noneSubSelected && updatedInterests.includes(mainInterest.name)) {
          updatedInterests = updatedInterests.filter(item => item !== mainInterest.name);
        }
      }
  
      return updatedInterests;
    });
  };

  return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
            <Text style={styles.label}>Select Your Interests:</Text>
            {interests.map((mainInterest) => (
              <View key={mainInterest.name}>
                <TouchableOpacity
                  style={styles.interestContainer}
                  onPress={() => toggleInterest(mainInterest.name, true)}
                >
                  <Checkbox
                    value={selectedInterests.includes(mainInterest.name)}
                    onValueChange={() => toggleInterest(mainInterest.name)}
                  />
                  <Text style={styles.interestText}>{mainInterest.name}</Text>
                </TouchableOpacity>
                {selectedInterests.includes(mainInterest.name) && (
                  mainInterest.subInterests.map((subInterest) => (
                    <TouchableOpacity
                      key={subInterest} // use subInterest as key here
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

          <Text style={styles.label}>ETA (in minutes - optional)</Text>
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
    marginVertical: 8, // Reduce the vertical margin
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4, // Reduce the vertical margin
    marginTop: 5, // move everything down by 5 pixels
    padding: 4, // Reduce the padding
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  interestText: {
    marginLeft: 8,
    fontSize: 16,
  },
  subInterestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4, // Reduce the vertical margin
    marginLeft: 16, // Adjust the indentation as needed
    padding: 4, // Reduce the padding
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
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
    borderRadius: 10,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8, // Reduce the vertical margin
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slider: {
    marginBottom: 20,
  },
});


export default InterestSelection;

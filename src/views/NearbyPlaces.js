import React, { Component } from 'react';
import Background from '../components/Background'
import Logo from '../components/Logo'
import BackButton from '../components/BackButton'
import PreferencesButton from '../components/PreferenceButton';
import { GoBackButtonStyles } from '../components/BackButton';
import { PreferenceButtonStyles} from '../components/PreferenceButton';
import { View, Text, Button, Alert, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal'; 
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from "@env";
import { CalloutStyles, LightGoogleMapsStyle } from '../core/styles';
import { theme } from '../core/theme';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import TextInput from '../components/TextInput';


export default class NearbyPlaces extends Component{

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      places: [],
      etaFilter: 3000,
      isModalVisible: false,
      userInput: '',
    };

  }

  componentDidMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      // const { latitude, longitude } = location.coords;
      const { latitude, longitude } = { latitude: 33.787037, longitude: -84.380527 };
      this.setNearbyPlaces(latitude, longitude);
      this.setState({
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      });
    } catch (error) {
      console.log("getLocationAsycn: ", error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  askChat = () => {
    
    const userInput = this.state.userInput; 

    this.setState({ userInput: '' });
  
    console.log('User input:', userInput);
  
    const results = "This is the result from askChat function.";
    return results;
    
    // Close the modal after handling the user's input
    //this.toggleModal();
  };
  
  

  getNearbyPlaces = async (latitude, longitude, textQuery) => {
    const { etaFilter } = this.state;
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const data = {
      textQuery: textQuery,
      maxResultCount: 10,
      locationBias: {
        circle: {
          center: { latitude, longitude },
          radius: etaFilter,
        }
      },
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours,places.editorialSummary,places.priceLevel,places.rating,places.userRatingCount,places.websiteUri,places.types',
    };
  
    try {
      const response = await axios.post(url, data, { headers });
      // console.log(response.data.places);
      return response.data.places;
    } catch (error) {
      Alert.alert('Error', 'Failed to get nearby places. Please try again.');
      console.error('getNearbyPlaces: ', error);
    }
  };
  
  setNearbyPlaces = async(latitude, longitude) => {
    const restaurants = await this.getNearbyPlaces(latitude, longitude, "restaurants");
    const attractions = await this.getNearbyPlaces(latitude, longitude, "local attractions");
    this.setState({ places: restaurants.concat(attractions) });
  }


  goBack = () => {
    if (this.props.navigation.canGoBack()) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('HomeScreen');
    }
  }

  handlePreferencesPress = () => {
    this.props.navigation.navigate('Preferences');
  }

  

  render() {
    const { region, places, isModalVisible } = this.state;

    if (!region) {
      return (
        <Background>
          <Logo />
          <Text>Getting Reccomendations ...</Text>
        </Background>
      );
    }
    return (
      <View style={{ flex: 1, paddingVertical: 5 + getStatusBarHeight() }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <BackButton goBack={this.goBack} />
          <PreferencesButton onPress={this.handlePreferencesPress} />
        </View>
  
        <MapView
          style={{ flex: 1 }}
          region={region}
          customMapStyle={LightGoogleMapsStyle}
          provider={PROVIDER_GOOGLE}
          cacheEnabled={true}
          loadingEnabled={true}
          liteMode={true}
        >
          <Marker coordinate={region} />
          {places.map(place => (
            <MemoizedMarker key={place.id} place={place} />
          ))}
        </MapView>

        


        <TouchableOpacity
          onPress={this.toggleModal} // Toggle the modal when the button is pressed
          style={{
            backgroundColor: 'teal',
            padding: 10,
            alignItems: 'center',
            width: '40%',
            borderRadius: 5, // Add rounded corners
            alignSelf: 'center', // Center the button horizontally
            marginTop: 10, // Add top margin for separation
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Ask Chat</Text>
        </TouchableOpacity>

  
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={this.toggleModal} // Close the modal when the backdrop is pressed
          style={{
            backgroundColor: 'transparent', // Set background to transparent
            padding: 0, // No extra padding
            margin: 0, // No margin
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10, // Add rounded corners to the child View
            maxHeight: '80%', // Set the maximum height of the child View
          }}>
            <Text>Ask Chat About The Places Around You!</Text>




            <TextInput
              placeholder="Ask your question or enter your message"
              value={this.state.userInput}
              onChangeText={(text) => this.setState({ userInput: text })}
              style={{
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
                borderRadius: 5, // Add rounded corners to the input field
              }}
            />

            <Button
              title="Submit"
              onPress={this.askChat}
              style={{
                backgroundColor: 'teal',
                padding: 10,
                width: '40%',
                borderRadius: 5,
                alignSelf: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
            </Button>
            <Button
              title="Close"
              onPress={this.toggleModal}
              style={{
                backgroundColor: 'teal',
                padding: 10,
                width: '40%',
                borderRadius: 5,
                alignSelf: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
            </Button>
          </View>
        </Modal>


      </View>
    );
  }
}

const MemoizedMarker = React.memo(function MemoizedMarker({ place }) {
  const {
    displayName,
    formattedAddress,
    location,
    priceLevel,
    rating,
    userRatingCount,
    websiteUri,
    editorialSummary,
    currentOpeningHours,
    types,
  } = place;

  const { text: placeName } = displayName;
  const { latitude, longitude } = location;

  let pinColor = 'blue';
  if (types.includes('culture') || types.includes('education') || types.includes('entertainment') || types.includes('recreation')) {
    pinColor = 'purple';
  } else if (types.includes('food') || types.includes('drink')) {
    pinColor = 'orange';
  } else if (types.includes('geocode')) {
    pinColor = 'black';
  } else if (types.includes('health') || types.includes('wellness')) {
    pinColor = 'pink';
  } else if (types.includes('lodging')) {
    pinColor = 'brown';
  } else if (types.includes('services')) {
    pinColor = 'teal';
  } else if (types.includes('shopping')) {
    pinColor = 'indigo';
  } else if (types.includes('sports')) {
    pinColor = 'maroon';
  }

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      pinColor={pinColor}
    >
      <Callout>
        <View style={CalloutStyles.calloutContainer}>
          <Text style={CalloutStyles.calloutTitle}>{placeName}</Text>
          {/*<Text style={CalloutStyles.calloutText}>Address: {formattedAddress}</Text>
          {priceLevel && <Text style={CalloutStyles.calloutText}>Price Level: {priceLevel}</Text>}*/}
          <Text style={CalloutStyles.calloutText}>Rating: {rating} ({userRatingCount} ratings)</Text>
          {editorialSummary && editorialSummary.text && (
            <Text style={CalloutStyles.calloutText}>
              Description: {editorialSummary.text}
            </Text>
          )}
          <TouchableOpacity onPress={() => Linking.openURL(websiteUri)}>
            <Text style={CalloutStyles.calloutLink}>Website</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
});


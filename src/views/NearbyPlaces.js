import React, { Component } from 'react';
import Background from '../components/Background'
import Logo from '../components/Logo'
import BackButton from '../components/BackButton'
import PreferencesButton from '../components/PreferenceButton';
import { View, Text, Button, Alert, Linking, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal'; 
import * as Location from 'expo-location';
import axios from 'axios';
import { LightGoogleMapsStyle } from '../core/styles';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PanGestureHandler, State, ScrollView } from 'react-native-gesture-handler';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { interests } from '../components/InterestSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';

// assign color based on sub-interest
const subInterestColorMap = interests.reduce((map, interest) => {
  interest.subInterests.forEach(subInterest => {
    map[subInterest.toLowerCase()] = interest.color;
  });
  return map;
}, {});

const getPinColor = (preference) => {
  const subInterests = preference.toLowerCase().split(', ');
  for (const subInterest of subInterests) {
    const color = subInterestColorMap[subInterest];
    if (color) {
      return color;
    }
  }
  return 'blue'; // default color if no match is found
};

export default class NearbyPlaces extends Component{

  constructor(props) {
    super(props);
    this.bottomSheetRef = React.createRef();
    this.state = {
      region: null,
      places: [],
      etaFilter: 3000,
      isModalVisible: false,
      userInput: '',
      selectedPlace: null,
      selectedSubInterests: [],
    };
    // Bind the method to the class instance
    this.handleMarkerPress = this.handleMarkerPress.bind(this);
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('NearbyPlaces.js: focus event')
      this.loadSelectedSubInterests();
      
    });
    this.getLocationAsync();
  }
  
  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedSubInterests !== prevState.selectedSubInterests) {
      this.setNearbyPlaces(this.state.region.latitude, this.state.region.longitude);
    }
  }

  loadSelectedSubInterests = async () => {
    try {
      const savedSubInterests = await AsyncStorage.getItem('selectedSubInterests');
      
      if (savedSubInterests !== null) {
        print('savedSubInterests: ', savedSubInterests)
        this.setState({ selectedSubInterests: JSON.parse(savedSubInterests) });
      }
    } catch (e) {
      console.log('Failed to load the selected sub interests: ', e);
    }
  }

  handleMarkerPress(place) {
    this.setState({ selectedPlace: place }, () => {
      this.bottomSheetRef.current.show();
    });
  }
  


  getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      // const { latitude, longitude } = { latitude: 33.779751, longitude: -84.390022 };
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


  askChat = () => {
    
    const userInput = this.state.userInput; 

    this.setState({ userInput: '' });
  
    console.log('User input:', userInput);
  
    const results = "This is the result from askChat function.";
    return results;
    
    // Close the modal after handling the user's input
    //this.toggleModal();
  };
  
  

  getNearbyPlaces = async (latitude, longitude) => {
    try {
      
      let radius = 3;

      let selectedSubInterests = this.state.selectedSubInterests
      console.log("Current selected sub interests: " + selectedSubInterests);

      let url = `https://pat266.pythonanywhere.com/recommended_places_open_trip?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      if (selectedSubInterests && selectedSubInterests.length > 0) {
        selectedSubInterests.forEach(interest => {
          url += `&preferences=${encodeURIComponent(interest)}`;
        });
      }
      console.log('URL: ', url);
      const response = await axios.get(url);

      // console.log(response.data)

      // Assuming the server returns a list of dictionaries
      return response.data;
    } catch (error) {
      Alert.alert('Error', 'Failed to get nearby places. Please try again.');
      console.error('getNearbyPlaces: ', error);
    }

  };
  
  setNearbyPlaces = async(latitude, longitude) => {
    const places = await this.getNearbyPlaces(latitude, longitude);
    this.setState({ places: places });
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
    // max height of the bottom sheet
    const maxHeight = Dimensions.get('window').height * 0.7;

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
          onPress={() => this.setState({ selectedPlace: null })}
        >
          <Marker coordinate={region} />
          {places.map(place => (
            <MemoizedMarker key={place.id} place={place} handleMarkerPress={this.handleMarkerPress} />
          ))}
        </MapView>

        {this.state.selectedPlace && (
          <BottomSheet  
            ref={this.bottomSheetRef} 
            height={maxHeight}
            draggable={false}
          >
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{this.state.selectedPlace.name}</Text>
              <Text style={{ fontSize: 16, color: 'gray', marginBottom: 5 }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Type: </Text>
                {this.state.selectedPlace.kinds}
              </Text>
              <Text style={{ fontSize: 16, color: 'black', marginTop: 10, marginBottom: 5, lineHeight: 24 }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Description: </Text>
                {this.state.selectedPlace.info}
              </Text>
            </ScrollView>
          </BottomSheet>
        )}




      </View>
    );
  }
}

const MemoizedMarker = React.memo(function MemoizedMarker({ place, handleMarkerPress }) {
  const {
    id,
    name,
    info,
    latitude,
    longitude,
    kinds, // types of places
  } = place;
  
  let pinColor = getPinColor(kinds);

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      pinColor={pinColor}
      onPress={(event) => {
        event.stopPropagation(); // Prevents the event from bubbling up to the map
        handleMarkerPress(place);
      }}
    >
    </Marker>
  );
});


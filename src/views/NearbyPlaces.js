import React, { Component } from 'react';
import { View, Text, Button, Alert, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from "@env";

export default class NearbyPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      places: [],
      etaFilter: 8000,
    };
    this.handleTenMinPress = this.handleEtaFilterChange.bind(this, 8000);
    this.handleTwentyMinPress = this.handleEtaFilterChange.bind(this, 16000);
    this.handleThirtyMinPress = this.handleEtaFilterChange.bind(this, 24000);
  }

  componentDidMount() {
    Alert.alert(
      'Location Permission',
      'Do you consent to share your information?',
      [
        { text: 'Yes', onPress: this.getLocationAsync },
        { text: 'No', onPress: () => console.log('Permission denied'), style: 'cancel' },
      ],
    );
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
      const places = await this.getNearbyPlaces(latitude, longitude);
      this.setState({
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        places,
      });
    } catch (error) {
      console.log("getLocationAsycn: ", error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  getNearbyPlaces = async (latitude, longitude) => {
    const { etaFilter } = this.state;
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const data = {
      textQuery: "attractions OR restaurants",
      maxResultCount: 5,
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
      console.log(response.data.places);
      return response.data.places;  // Adjust this line based on the actual response structure
    } catch (error) {
      Alert.alert('Error', 'Failed to get nearby places. Please try again.');
      console.error(error);  // Log the error for debugging purposes
    }
  };
  
  

  handleEtaFilterChange = async (etaFilter) => {
    this.setState({ etaFilter }, async () => {
      const { region } = this.state;
      const places = await this.getNearbyPlaces(region.latitude, region.longitude);
      this.setState({ places });
      console.log('ETA Filter changed to:', etaFilter);
    });
  };

  render() {
    const { region, places } = this.state;
    if (!region) {
      return <Text>Loading...</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} region={region} customMapStyle={mapStyle} provider={PROVIDER_GOOGLE} cacheEnabled={true} loadingEnabled={true}>
          <Marker coordinate={region} />
          {places.map(place => (
            <MemoizedMarker key={place.id} place={place} />
          ))}
        </MapView>
        <View style={{ backgroundColor: 'white' }}>
          <Text>ETA Filter:</Text>
          <Button title="10 min" onPress={this.handleTenMinPress} />
          <Button title="20 min" onPress={this.handleTwentyMinPress} />
          <Button title="30 min" onPress={this.handleThirtyMinPress} />
        </View>
      </View>
    );
  }
}

const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

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

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      pinColor={'blue'}  // Update color logic if needed
    >
      <Callout onPress={() => Linking.openURL(websiteUri)}>
        <View style={{ width: 200 }}>
          <Text style={{ fontWeight: 'bold' }}>{placeName}</Text>
          {/*<Text>Address: <Text>{formattedAddress}</Text></Text>
          <Text>Price Level: <Text>{priceLevel}</Text></Text>*/}
          <Text>Rating: <Text>{rating} ({userRatingCount} ratings)</Text></Text>
          <Text>Description: <Text>{editorialSummary}</Text></Text>
          <Text style={{ color: 'blue' }}>Website</Text>
        </View>
      </Callout>
    </Marker>
  );
});


import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from "@env";

export default class NearbyPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      places: [],
      etaFilter: '10',
    };
    this.handleTenMinPress = this.handleEtaFilterChange.bind(this, '10');
    this.handleTwentyMinPress = this.handleEtaFilterChange.bind(this, '20');
    this.handleThirtyMinPress = this.handleEtaFilterChange.bind(this, '30');
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
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  getNearbyPlaces = async (latitude, longitude) => {
    const { etaFilter } = this.state;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}&maxwidth=400&maxheight=400&rankby=distance&arrival_time=${etaFilter}`;
    try {
      const response = await axios.get(url);
      return response.data.results;
    } catch (error) {
      Alert.alert('Error', 'Failed to get nearby places. Please try again.');
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
          {places.map(place => (
            <Text key={place.id}>{place.name}</Text>
          ))}
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
  return (
    <Marker
      key={place.id}
      coordinate={{
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      }}
      title={place.name}
      description={place.vicinity}
      pinColor={place.types.includes('restaurant') ? 'red' : 'blue'}
    />
  );
});
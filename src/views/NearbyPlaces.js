import React, { Component } from 'react';
import { View, Text, Button } from 'react-native'; // Import Button component
import MapView, { Marker,PROVIDER_GOOGLE  } from 'react-native-maps';
import * as Location from 'expo-location'; // Updated import
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from "@env";

export default class NearbyPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      places: [],
      etaFilter: '10', // Default ETA filter is 10 minutes
    };
  }

  componentDidMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync(); // Updated permission request method
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.setState({
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      });
      this.getNearbyPlaces(latitude, longitude);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  getNearbyPlaces = async (latitude, longitude) => {
    const { etaFilter } = this.state;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}&maxwidth=400&maxheight=400&rankby=distance&arrival_time=${etaFilter}`;
    try {
      const response = await axios.get(url);
      this.setState({ places: response.data.results });
    } catch (error) {
      console.log('Error getting nearby places:', error);
    }
  };

  handleEtaFilterChange = etaFilter => {
    this.setState({ etaFilter }, () => {
      const { region } = this.state;
      this.getNearbyPlaces(region.latitude, region.longitude);
    });
  };

  render() {
    const { region, places } = this.state;
    if (!region) {
      return <Text>Loading...</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} region={region} provider={PROVIDER_GOOGLE}>
          <Marker coordinate={region} />
          {places.map(place => (
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
          ))}
        </MapView>
        <View style={{ backgroundColor: 'white' }}>
          <Text>ETA Filter:</Text>
          <Button title="10 min" onPress={() => this.handleEtaFilterChange('10')} />
          <Button title="20 min" onPress={() => this.handleEtaFilterChange('20')} />
          <Button title="30 min" onPress={() => this.handleEtaFilterChange('30')} />
          {places.map(place => (
            <Text key={place.id}>{place.name}</Text>
          ))}
        </View>
      </View>
    );
  }
}

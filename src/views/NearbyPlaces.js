import React, { Component } from 'react';
import { View, Text, Button, Alert, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from "@env";
import { CalloutStyles, LightGoogleMapsStyle } from '../core/styles';

export default class NearbyPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      places: [],
      etaFilter: 3000,
    };
    this.handleTenMinPress = this.handleEtaFilterChange.bind(this, 3000);
    this.handleTwentyMinPress = this.handleEtaFilterChange.bind(this, 6000);
    this.handleThirtyMinPress = this.handleEtaFilterChange.bind(this, 9000);
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
      const { latitude, longitude } = location.coords;
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

  getNearbyPlaces = async (latitude, longitude, textQuery) => {
    const { etaFilter } = this.state;
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const data = {
      textQuery: textQuery,
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

  handleEtaFilterChange = async (etaFilter) => {
    this.setState({ etaFilter }, async () => {
      const { region } = this.state;
      this.setNearbyPlaces(region.latitude, region.longitude);
      // const places = await this.getNearbyPlaces(region.latitude, region.longitude);
      // this.setState({ places });
      // console.log('ETA Filter changed to:', etaFilter);
    });
  };

  render() {
    const { region, places } = this.state;
    if (!region) {
      return <Text>Loading...</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} region={region} customMapStyle={LightGoogleMapsStyle} provider={PROVIDER_GOOGLE} cacheEnabled={true} loadingEnabled={true}>
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


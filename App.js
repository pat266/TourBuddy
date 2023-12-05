import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  HomeScreen,
  NearbyPlaces,
  Login,
  Interests,
  RegistrationForm,
  ResetPasswordScreen,
  Preferences,
} from './src/views'

import Aptabase from "@aptabase/react-native";
import mobileAds from 'react-native-google-mobile-ads';

Aptabase.init("A-US-5472510791");  // Aptabase Analytics project iD

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
          <Stack.Screen name="Interests" component={Interests} />
          <Stack.Screen name="NearbyPlaces" component={NearbyPlaces} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen name="Preferences" component={Preferences} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
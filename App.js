import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/components/LoginCreateAcc';
import RegistrationForm from './app/components/RegistrationForm';
import Interests from './app/components/RegistrationInterests';
import HomeScreen from './app/components/HomeScreen';

const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        theme={navTheme}
        initialRouteName='Login'
        screenOptions={{
          headerShown: false,
        }}
        style={styles.container} // Set background color here
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration_Beginning" component={RegistrationForm} />
        <Stack.Screen name="Registration_Interests" component={Interests}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', 
  },
});
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationForm from './app/components/RegistrationForm';

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
        screenOptions={{
          headerShown: false,
        }}
        style={styles.container} // Set background color here
      >
        
        <Stack.Screen name="Start Registration" component={RegistrationForm} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', // Set the background color here
  },
});

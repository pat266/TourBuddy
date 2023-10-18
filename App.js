import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, RegistrationForm, Interests, HomeScreen } from './src/views';
import { theme } from './src/core/theme'
import { StackNavigatorStyles } from './src/core/styles'

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerShown: false,
          }}
          style={StackNavigatorStyles.container} // Set background color here
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
          <Stack.Screen name="Interests" component={Interests}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen}/>


        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

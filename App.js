import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import RegistrationForm from './app/components/RegistrationForm';


export default function App() {
  return (
    <View style={styles.container}>


      <RegistrationForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: 'lightblue',
  },
});

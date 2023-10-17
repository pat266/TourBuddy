import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import styles from './Style'

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={styles.RegistrationForm}>
        <Text style={styles.Header}>Tour Buddy!</Text>

        <TextInput
          style={styles.input}
          placeholder='Username'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('HomeScreen')}>
          <Text style={styles.submitText} allowFontScaling={true}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('Registration_Beginning')}>
          <Text style={styles.submitText} allowFontScaling={true}>Create Account</Text>
        </TouchableOpacity>


      </View>
    );
  }
}

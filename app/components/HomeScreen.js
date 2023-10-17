import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import styles from './Style';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={styles.RegistrationForm}>
        <Text style={styles.Header}>Successfully Logged In!</Text>


        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('Registration_Beginning')}>
          <Text style={styles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

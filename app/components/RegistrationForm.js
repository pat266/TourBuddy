import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import styles from './Style';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={styles.RegistrationForm}>
        <Text style={styles.Header}>Register Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder='Name'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={styles.input}
          placeholder='Email'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('Registration_Interests')}>
          <Text style={styles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
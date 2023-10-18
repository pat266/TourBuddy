import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { RegistrationFormStyles } from '../core/styles';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={RegistrationFormStyles.RegistrationForm}>
        <Text style={RegistrationFormStyles.Header}>Register Your Account</Text>

        <TextInput
          style={RegistrationFormStyles.input}
          placeholder='Name'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={RegistrationFormStyles.input}
          placeholder='Email'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={RegistrationFormStyles.input}
          placeholder='Password'
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('Interests')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

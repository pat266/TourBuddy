import React from 'react';
import {Text, View, TextInput, TouchableOpacity } from 'react-native';

import { RegistrationFormStyles } from '../core/styles';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={RegistrationFormStyles.RegistrationForm}>
        <Text style={RegistrationFormStyles.Header}>Tour Buddy!</Text>

        <TextInput
          style={RegistrationFormStyles.input}
          placeholder='Username'
          underlineColorAndroid={'transparent'}
        />

        <TextInput
          style={RegistrationFormStyles.input}
          placeholder='Password'
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('HomeScreen')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('RegistrationForm')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Create Account</Text>
        </TouchableOpacity>


      </View>
    );
  }
}

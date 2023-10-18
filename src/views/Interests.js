import React from 'react';
import {Text, View, TextInput, TouchableOpacity, CheckBox} from 'react-native';

import { RegistrationFormStyles } from '../core/styles';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={RegistrationFormStyles.RegistrationForm}>
        <Text style={RegistrationFormStyles.Header}>Tell Us About Your Interests</Text>

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

        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('RegistrationForm')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

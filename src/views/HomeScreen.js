import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { RegistrationFormStyles } from '../core/styles';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={RegistrationFormStyles.RegistrationForm}>
        <Text style={RegistrationFormStyles.Header}>Successfully Logged In!</Text>

        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('RegistrationForm')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { RegistrationFormStyles } from '../core/styles';
import { loginStyles } from '../core/styles'

export default class RegistrationForm extends React.Component {

  goBack = () => {
    if (this.props.navigation.canGoBack()) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <Background>
        
        <Logo />
        <Text style={RegistrationFormStyles.Header}>Successfully Logged In!</Text>
        <TouchableOpacity style={RegistrationFormStyles.submit} onPress={() => this.props.navigation.navigate('NearbyPlaces')}>
          <Text style={RegistrationFormStyles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </Background> 
      
    );
  }
}

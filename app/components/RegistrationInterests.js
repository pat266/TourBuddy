import React from 'react';
import {Text, View, TextInput, TouchableOpacity, CheckBox} from 'react-native';

import styles from './Style';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={styles.RegistrationForm}>
        <Text style={styles.Header}>Tell Us About Your Interests</Text>

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

        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('Registration_Beginning')}>
          <Text style={styles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

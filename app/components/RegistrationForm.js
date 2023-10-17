import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

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

        <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate('NextScreen')}>
          <Text style={styles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  RegistrationForm: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'lightblue',
    padding: 20, 
  },
  Header: {
    fontSize: 24,
    color: 'black',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  input: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    padding: 10, 
  },
  submit: {
    alignSelf: 'auto',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    marginTop: 30,
    borderRadius: 10,
    padding: 10,
    width: '40%',
  },
  submitText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

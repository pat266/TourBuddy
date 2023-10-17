import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


export default class RegistrationForm extends React.Component {
  render() {
    return (
      <View style={styles.RegistrationForm}>
        <Text style={styles.Header}>Register Your Account</Text>

        <TextInput style={styles.input} placeholder='Name' underlineColorAndroid={'transparent'}   />

        <TextInput style={styles.input} placeholder='Email' underlineColorAndroid={'transparent'}   />

        <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} underlineColorAndroid={'transparent'}   />

        <TouchableOpacity style={styles.submit}>
          <Text style={styles.submitText} allowFontScaling={true}>Next</Text>
        </TouchableOpacity>




      </View>
    );
  
  }
}

const styles = StyleSheet.create({
  RegistrationForm: {
    
  },

  Header: {
    fontSize: 24,
    color: "black",
    paddingBottom: 10,
    paddingTop: 20,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },


  input: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: "#fff",
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },


  submit: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightgrey',
    marginTop: 30,
    borderRadius: 10,
    width: '40%',
    height: ''
  },


  submitText: {
    fontWeight: 'bold'
  },

});

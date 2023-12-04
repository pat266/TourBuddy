import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { loginStyles } from '../core/styles'
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics'; 
import {app, auth} from '../../firebaseConfig';
import { trackEvent } from "@aptabase/react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//import { getDatabase, ref, get } from 'firebase/database';
//import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });



  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);


    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    

    
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
  
      // Access the user information
      const user = userCredential.user;
      //console.log(user);
  
      // Log the event to aptabase
      trackEvent("login", { email: email.value });
  
      // Reset navigation stack to HomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed:', error.message);
      // You may want to update state to display a friendly error message

      if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Incorrect password. Please try again.');
      }
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Login</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={loginStyles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={loginStyles.forgot}>Forgot your password ?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Log in
      </Button>
      <View style={loginStyles.row}>
        <Text>You do not have an account yet ?</Text> 
      </View>
      <View style={loginStyles.row}>
      <TouchableOpacity onPress={() => navigation.replace('RegistrationForm')}>
          <Text style={loginStyles.link}>Create !</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}


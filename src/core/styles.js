import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../core/theme'

export const StackNavigatorStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue', 
    },
});


export const loginStyles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})


export const RegistrationFormStyles = StyleSheet.create({
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


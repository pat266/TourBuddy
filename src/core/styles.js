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
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });

export const CalloutStyles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 5,
  },
  calloutLink: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export const LightGoogleMapsStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
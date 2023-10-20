import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={GoBackButtonStyles.container}>
      <Image
        style={GoBackButtonStyles.image}
        source={require('../assets/back.png')}
      />
    </TouchableOpacity>
  )
}

export const GoBackButtonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
    zIndex: 1
  },
  image: {
    width: 24,
    height: 24,
  },
})
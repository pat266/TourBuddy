import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'teal',
    padding: 10,
    alignItems: 'center',
    width: '40%',
    borderRadius: 5, 
    alignSelf: 'center',
    marginTop: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 14,
  },
})
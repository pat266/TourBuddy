import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000', // black
    primary: '#1E88E5', // blue
    secondary: '#43A047', // green
    error: '#E53935', // red
    background: 'transparent', // transparent
  },
}
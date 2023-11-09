import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function PreferencesButton({ mode, goBack, style, onPress, ...props }) {
  return (
    <PaperButton
      style={[
        PreferenceButtonStyles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={PreferenceButtonStyles.text}
      mode={mode}
      onPress={goBack} 
      {...props}
    >

      <Icon name="arrow-left" size={20} color="black" style={PreferenceButtonStyles.icon} />
    </PaperButton>
  );
}

export const PreferenceButtonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 10,
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
});







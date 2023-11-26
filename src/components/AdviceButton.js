import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function AdviceButton({ mode, style, onPress, title, ...props }) {
  return (
    <PaperButton
      style={[
        AdviceButtonStyles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={AdviceButtonStyles.text}
      mode={mode}
      onPress={onPress} 
      {...props}
    >
      <Icon name="info-circle" size={20} color="black" style={AdviceButtonStyles.icon} />
      {title && <Text style={AdviceButtonStyles.title}>{title}</Text>}
    </PaperButton>
  );
}

export const AdviceButtonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 10,
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: theme.colors.primary,
  },
});

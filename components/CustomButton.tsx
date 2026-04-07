import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS } from '../constants/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

export const CustomButton = ({ title, ...rest }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} {...rest}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primaryBlue,
    height: 49,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.bgWhite,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
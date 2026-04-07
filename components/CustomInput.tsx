import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Biblioteca nativa de ícones
import { COLORS } from '../constants/Colors';

interface CustomInputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap; // Permite escolher qualquer ícone do Feather
  placeholder: string;
}

export const CustomInput = ({ icon, placeholder, ...rest }: CustomInputProps) => {
  return (
    <View style={styles.container}>
      <Feather name={icon} size={20} color={COLORS.primaryBlue} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textGray}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    height: 52, // Medida exata do Figma
    borderRadius: 8, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 16,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.titleDark,
  },
});
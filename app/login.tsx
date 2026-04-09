import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- MUDANÇA AQUI: importando da biblioteca moderna
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/Colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Muda de '/scanner' para '/dashboard'
    router.replace('/home'); 
  };

  const handleForgotPassword = () => {
    router.push('/recovery-code');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            icon="user"
            placeholder="Digite seu usuário"
            autoCapitalize="none"
          />
          
          <CustomInput
            icon="lock"
            placeholder="Digite sua Senha"
            secureTextEntry 
          />

          <CustomButton
            title="ENTRAR"
            onPress={handleLogin}
          />

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    height: 40,
    width: 150,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  forgotPasswordText: {
    color: COLORS.textGray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
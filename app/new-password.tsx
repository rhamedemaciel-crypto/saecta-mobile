import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/Colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function NewPasswordScreen() {
  const router = useRouter();
  
  // Estados para guardar o que o usuário digita
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // Uma validação simples para ver se as senhas batem
    if (password === '' || confirmPassword === '') {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem. Tente novamente.');
      return;
    }
    
    // Se estiver tudo certo, joga para a tela de sucesso!
    console.log('Senha alterada com sucesso!');
    router.push('/success');
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

        <View style={styles.contentContainer}>
          <Image source={require('../assets/img-reset.png')} style={styles.illustration} resizeMode="contain" />
          
          <Text style={styles.title}>Redefinição de Senha</Text>

          <View style={styles.formContainer}>
            <CustomInput
              icon="lock"
              placeholder="Digite a Nova Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <CustomInput
              icon="lock"
              placeholder="Repita a Nova Senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <CustomButton
              title="REDEFINIR SENHA"
              onPress={handleResetPassword}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgWhite },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { height: 40, width: 150 },
  contentContainer: { alignItems: 'center', width: '100%' },
  illustration: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', color: COLORS.titleDark, marginBottom: 30 },
  formContainer: { width: '100%' },
});
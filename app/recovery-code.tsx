import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/Colors';
import { CustomButton } from '../components/CustomButton';

export default function RecoveryCodeScreen() {
  const router = useRouter();
  
  // Alterado para 5 posições
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Agora pula até o índice 4 (quinta caixa)
    if (text !== '' && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleValidate = () => {
    // Joga o usuário para a tela de criar nova senha
    router.push('/new-password');
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
          <Image source={require('../assets/img-mail.png')} style={styles.illustration} resizeMode="contain" />
          
          <Text style={styles.title}>Redefinição de Senha</Text>
          
          {/* Texto e Email agora utilizam a cor laranja de aviso */}
          <Text style={styles.description}>
            Um email foi enviado para{'\n'}
            <Text style={styles.emailHighlight}>joseca********@gmail.com</Text>
          </Text>
          
          <Text style={styles.subDescription}>
            Por favor, digite o código de verificação{'\n'}presente no email enviado.
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputs.current[index] = ref; }}
                style={styles.codeBox}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          <CustomButton
            title="VALIDAR CÓDIGO"
            onPress={handleValidate}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgWhite },
  container: { flex: 1, paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logo: { height: 40, width: 150 },
  contentContainer: { alignItems: 'center', width: '100%' },
  illustration: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', color: COLORS.titleDark, marginBottom: 15 },
  description: { 
    fontSize: 14, 
    color: COLORS.warningOrange, // Cor laranja aplicada aqui
    textAlign: 'center', 
    marginBottom: 10, 
    lineHeight: 20 
  },
  emailHighlight: { 
    color: COLORS.warningOrange, // Email também em laranja
    fontWeight: '600' 
  },
  subDescription: { fontSize: 14, color: COLORS.textGray, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 17,
    marginBottom: 40,
  },
  codeBox: {
    width: 35,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.codeBorder,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.titleDark,
  },
});
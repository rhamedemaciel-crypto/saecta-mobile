import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/Colors';
import { CustomButton } from '../components/CustomButton';

export default function SuccessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Usamos o REPLACE em vez do PUSH. 
    // Assim, o usuário não consegue voltar para essa tela apertando o botão de voltar do celular.
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.contentContainer}>
          <Image source={require('../assets/img-success.png')} style={styles.illustration} resizeMode="contain" />
          
          <Text style={styles.title}>Senha redefinida com{'\n'}sucesso</Text>

          <View style={styles.buttonWrapper}>
            <CustomButton
              title="CONTINUAR"
              onPress={handleContinue}
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.bgWhite 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 24 
  },
  logoContainer: { 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 60 
  },
  logo: { 
    height: 40, 
    width: 150 
  },
  contentContainer: { 
    alignItems: 'center', 
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60 // Levanta o conteúdo um pouquinho para não ficar colado no fundo
  },
  illustration: { 
    width: 160, 
    height: 160, 
    marginBottom: 30 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: COLORS.titleDark, 
    textAlign: 'center', 
    marginBottom: 40,
    lineHeight: 30
  },
  buttonWrapper: {
    width: '100%',
  }
});
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface Step1QrCodeProps {
  scanned: boolean;
  onScan: (result: { type: string; data: string }) => void;
}

export default function Step1QrCode({ scanned, onScan }: Step1QrCodeProps) {
  const router = useRouter();

  const handleClose = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* 1. CÂMERA DE FUNDO */}
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing="back"
        onBarcodeScanned={scanned ? undefined : onScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* 2. CABEÇALHO AZUL */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Feather name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Escanear QR Code</Text>
        
        <Text style={styles.headerSubtitle}>
          Aponte a câmera para o QR code do aluno, de modo que ele fique perfeitamente enquadrado na tela.
        </Text>
      </View>

      {/* 3. CAIXA DE MARCAÇÃO (Target) */}
      <View style={styles.targetWrapper}>
        <View style={styles.targetSquare}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
      </View>

      {/* 4. RODAPÉ BRANCO COM A LOGO SAECTA */}
      <View style={styles.footer}>
        {/* Logo centralizada */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.footerLogo} 
          resizeMode="contain" 
        />
        
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 175,
    backgroundColor: '#122A4C',
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    borderBottomWidth: 4,
    borderBottomColor: '#E4E4E4',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 20,
    padding: 5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
    opacity: 0.9,
  },
  targetWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  targetSquare: {
    width: 201,
    height: 201,
  },
  corner: {
    position: 'absolute',
    width: 40.5,
    height: 30.5,
    borderColor: '#122A4C',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 },
  
  // --- ESTILOS DO NOVO FOOTER COM LOGO ---
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 31,
    borderTopRightRadius: 31,
    borderBottomWidth: 4,
    borderBottomColor: '#E4E4E4',
    justifyContent: 'center', // Centraliza a logo verticalmente
    alignItems: 'center',     // Centraliza a logo horizontalmente
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, 
    zIndex: 10,
  },
  footerLogo: {
    width: 120, // Largura ideal para a logo no rodapé
    height: 35,
    marginTop: Platform.OS === 'ios' ? 0 : 10, // Pequeno ajuste fino de alinhamento
  },
  closeButton: {
    position: 'absolute',
    right: 24, // Fixa o botão de fechar lá no canto direito
    top: Platform.OS === 'ios' ? 15 : 25,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
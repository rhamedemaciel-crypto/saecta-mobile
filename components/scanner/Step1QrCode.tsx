import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router'; // 1. Adicionamos o import do router

interface Props {
  scanned: boolean;
  onScan: (result: { data: string }) => void;
}

export default function Step1QrCode({ scanned, onScan }: Props) {
  const router = useRouter(); // 2. Iniciamos o router

  return (
    <SafeAreaView style={styles.fullScreen}>
      {/* Topo Verde com Botão de Voltar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <Text style={styles.backBtnText}>⬅ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.topText}>Aponte a câmera para o QR code</Text>
      </View>

      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : onScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      {/* Rodapé Verde */}
      <View style={styles.bottomBar}>
        <Text style={styles.logoText}>SAECTA</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    backgroundColor: '#b2d822', 
    padding: 20,
    paddingTop: 50, 
    flexDirection: 'row', // Coloca os itens lado a lado
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o texto principal
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  // Estilo novo para o botão
  backBtn: {
    position: 'absolute', // Deixa o botão solto à esquerda
    left: 20,
    top: 50,
    padding: 5,
  },
  backBtnText: { color: '#1A2B4C', fontSize: 16, fontWeight: 'bold' },
  // ... resto do seu estilo continua igual
  topText: { color: '#1A2B4C', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }, 
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 4, borderColor: '#b2d822', borderRadius: 20, backgroundColor: 'transparent' },
  bottomBar: { backgroundColor: '#b2d822', padding: 25, alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  logoText: { color: '#1A2B4C', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
});
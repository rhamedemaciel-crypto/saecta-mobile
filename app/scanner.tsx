import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import DocumentScanner from 'react-native-document-scanner-plugin';

// Importando nossos componentes fatiados
import Step1QrCode from '../components/scanner/Step1QrCode';
import Step2Gabarito from '../components/scanner/Step2Gabarito';
import Step3Questao from '../components/scanner/Step3Questao';
import Step4Review from '../components/scanner/Step4Review';

type Step = 'QR_CODE' | 'SCAN_GABARITO' | 'SCAN_QUESTAO' | 'REVIEW';

export default function ScannerFlow() {
  const [step, setStep] = useState<Step>('QR_CODE');
  const [permission, requestPermission] = useCameraPermissions();
  
  const [scanned, setScanned] = useState(false);
  const [studentData, setStudentData] = useState<string | null>(null);
  const [gabaritoImg, setGabaritoImg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [questaoPages, setQuestaoPages] = useState<string[]>([]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; 
    setScanned(true);
    Vibration.vibrate();
    setStudentData(data);

    Alert.alert("Aluno Identificado!", `Dados: ${data}`, [
      { text: "Escanear Provas", onPress: () => setStep('SCAN_GABARITO') },
      { text: "Tentar Novamente", style: "cancel", onPress: () => { setScanned(false); setStudentData(null); } }
    ]);
  };

  const scanDocument = async (target: 'gabarito' | 'questao') => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({ maxNumDocuments: 1, croppedImageQuality: 100 });
      if (scannedImages && scannedImages.length > 0) {
        if (target === 'gabarito') {
          setGabaritoImg(scannedImages[0]);
          setStep('SCAN_QUESTAO'); 
        } else {
          setQuestaoPages(prev => [...prev, scannedImages[0]]);
        }
      }
    } catch (e) {
      console.log("Scanner cancelado", e);
    }
  };

  const enviarParaServidor = async () => {
    if (!studentData || !gabaritoImg) {
      Alert.alert("Erro", "Faltam dados do aluno ou foto do gabarito.");
      return;
    }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('aluno_id', studentData);
      
      const gabaritoFilename = gabaritoImg.split('/').pop() || 'gabarito.jpg';
      formData.append('gabarito', { uri: gabaritoImg, name: gabaritoFilename, type: 'image/jpeg' } as any);

      questaoPages.forEach((imgUri, index) => {
        const filename = imgUri.split('/').pop() || `questao_${index}.jpg`;
        formData.append('questoes', { uri: imgUri, name: filename, type: 'image/jpeg' } as any);
      });

      const BACKEND_URL = 'http://192.168.0.163:8000/api/avaliar'; 
      const response = await fetch(BACKEND_URL, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso!", `Avaliação enviada. Nota prévia: ${result.nota || 'Em processamento'}`);
        resetFlow();
      } else {
        Alert.alert("Erro no Servidor", result.detail || "Falha ao enviar.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetFlow = () => {
    setStep('QR_CODE');
    setScanned(false);
    setStudentData(null);
    setGabaritoImg(null);
    setQuestaoPages([]); 
  };

  if (!permission) return <View />;
  if (!permission.granted) return (
    <View style={styles.centerParams}>
      <Text>Precisamos da permissão da câmera</Text>
      <Button title="Conceder Permissão" onPress={requestPermission} />
    </View>
  );

  return (
    <View style={styles.container}>
      {step === 'QR_CODE' && (
        <Step1QrCode scanned={scanned} onScan={handleBarCodeScanned} />
      )}

      {step === 'SCAN_GABARITO' && (
        <Step2Gabarito studentData={studentData} onScanClick={() => scanDocument('gabarito')} />
      )}

      {step === 'SCAN_QUESTAO' && (
        <Step3Questao 
          questaoPages={questaoPages} 
          onScanClick={() => scanDocument('questao')} 
          onFinishClick={() => setStep('REVIEW')} 
        />
      )}

      {step === 'REVIEW' && (
        <Step4Review 
          studentData={studentData} 
          gabaritoImg={gabaritoImg} 
          questaoPages={questaoPages} 
          isUploading={isUploading} 
          onSubmit={enviarParaServidor} 
          onCancel={resetFlow} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerParams: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
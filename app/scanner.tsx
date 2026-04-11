import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Vibration, Modal, TouchableOpacity } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones pro modal

import { COLORS } from '../constants/Colors'; // Cores padronizadas

// Importando nossos componentes atualizados
import Step1QrCode from '../components/scanner/Step1QrCode';
import CapturaHub from '../components/scanner/CapturaHub'; // Nosso novo painel central
import Step4Review from '../components/scanner/Step4Review';

type Step = 'QR_CODE' | 'SCAN_GABARITO' | 'SCAN_QUESTAO' | 'REVIEW';

export default function ScannerFlow() {
  const [step, setStep] = useState<Step>('QR_CODE');
  const [permission, requestPermission] = useCameraPermissions();
  
  const [scanned, setScanned] = useState(false);
  const [studentData, setStudentData] = useState<string | null>(null);
  
  // NOVO: Estado que controla se o modal bonitão do aluno lido tá aberto
  const [showStudentSuccess, setShowStudentSuccess] = useState(false);

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

    // No lugar do Alert.alert antigo, a gente chama a tela de transição
    setShowStudentSuccess(true);
  };

  // Funções que os botões do novo Modal usam:
  const handleConfirmStudent = () => {
    setShowStudentSuccess(false);
    setStep('SCAN_GABARITO'); // Avança o fluxo
  };

  const handleCancelStudent = () => {
    setShowStudentSuccess(false);
    setScanned(false);
    setStudentData(null); // Reseta pra ler outro aluno
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
    setShowStudentSuccess(false); // Fecha o modal pra garantir
  };

  const handleAvancarRevisao = () => {
    setStep('REVIEW');
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

      {(step === 'SCAN_GABARITO' || step === 'SCAN_QUESTAO') && (
        <CapturaHub 
          studentData={studentData}
          gabaritoLido={gabaritoImg !== null}
          questoesLidas={questaoPages.length > 0}
          onScanGabarito={() => scanDocument('gabarito')}
          onScanQuestao={() => scanDocument('questao')}
          onAvancar={handleAvancarRevisao}
          onVoltar={resetFlow}
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
          onEditGabarito={() => scanDocument('gabarito')}
          onEditQuestao={() => scanDocument('questao')}    
        />
      )}

      {/* A MÁGICA: O modal de sucesso do QR Code */}
      <Modal visible={showStudentSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.transitionCard}>
            
            <View style={styles.successIconBox}>
              <MaterialCommunityIcons name="check-decagram" size={65} color="#4CAF50" />
            </View>
            
            <Text style={styles.transitionTitle}>Aluno Identificado</Text>
            
            <View style={styles.studentIdBox}>
              <Feather name="user" size={18} color={COLORS.textGray} />
              <Text style={styles.transitionIdText}>Matrícula: {studentData}</Text>
            </View>

            <Text style={styles.transitionSub}>
              O QR Code foi lido com sucesso. Você já pode avançar para a captura das provas.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmStudent} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>ESCANEAR PROVAS</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelStudent}>
              <Text style={styles.secondaryButtonText}>Escanear outro aluno</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerParams: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  // --- CSS do Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escurinho atrás do card
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  transitionCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  transitionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#122A4C',
    marginBottom: 10,
  },
  studentIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  transitionIdText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textGray,
  },
  transitionSub: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#122A4C',
    width: '100%',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: COLORS.textGray,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
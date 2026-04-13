import React, { useState, useEffect, useRef } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Modal, Dimensions, Animated, Easing } from 'react-native'; 
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface Step4ReviewProps {
  studentData: string | null;
  gabaritoImg: string | null;
  questaoPages: string[];
  isUploading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onEditGabarito?: () => void;
  onEditQuestao?: () => void;
}

export default function Step4Review({
  studentData,
  gabaritoImg,
  questaoPages,
  isUploading,
  onSubmit,
  onCancel,
  onEditGabarito,
  onEditQuestao
}: Step4ReviewProps) {

  // Estado para controlar qual imagem estamos visualizando
  const [previewType, setPreviewType] = useState<'gabarito' | 'questao' | null>(null);

  // Lógica da animação do Laser de escaneamento
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isUploading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 80, // Desce o laser 80 pixels (tamanho do ícone)
            duration: 1200, // Tempo descendo (1.2 segundos)
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0, // Sobe o laser de volta pro topo
            duration: 1200, // Tempo subindo
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0); // Reseta a animação se parar de fazer upload
    }
  }, [isUploading, scanLineAnim]);

  const openPreview = (type: 'gabarito' | 'questao') => {
    setPreviewType(type);
  };

  const closePreview = () => {
    setPreviewType(null);
  };

  const handleRetake = () => {
    const type = previewType;
    closePreview();
    // Um pequeno delay para o modal fechar suavemente antes de abrir a câmera pesada
    setTimeout(() => {
      if (type === 'gabarito' && onEditGabarito) onEditGabarito();
      if (type === 'questao' && onEditQuestao) onEditQuestao();
    }, 300);
  };

  return (
    <View style={styles.container}>
      
      {/* CABEÇALHO AZUL */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel} disabled={isUploading}>
          <Feather name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisão Final</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CARD DO ALUNO (Flutuante) */}
        <View style={styles.studentCard}>
          <View style={styles.studentCardHeader}>
            <View style={styles.avatar}>
              <Feather name="user" size={24} color={COLORS.textGray} />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>Dados do Aluno</Text>
              <Text style={styles.studentId}>Matrícula: {studentData}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Arquivos Capturados</Text>

        {/* CARD DO GABARITO (Se tiver foto, abre o preview. Se não, abre a câmera) */}
        <TouchableOpacity 
          style={styles.fileCard} 
          activeOpacity={0.7} 
          onPress={() => gabaritoImg ? openPreview('gabarito') : onEditGabarito?.()}
          disabled={isUploading}
        >
          <View style={styles.fileIconWrapper}>
            <MaterialCommunityIcons name="grid" size={24} color={COLORS.primaryBlue} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileTitle}>Gabarito</Text>
            <Text style={styles.fileStatus}>
              {gabaritoImg ? 'Toque para visualizar' : 'Toque para escanear'}
            </Text>
          </View>
          {gabaritoImg ? (
            <View>
              <Image source={{ uri: gabaritoImg }} style={styles.thumbnail} />
              <View style={styles.editBadge}>
                <Feather name="search" size={12} color="#FFF" />
              </View>
            </View>
          ) : (
            <Feather name="alert-circle" size={24} color={COLORS.warningOrange} />
          )}
        </TouchableOpacity>

        {/* CARD DAS QUESTÕES (Se tiver foto, abre o preview. Se não, abre a câmera) */}
        <TouchableOpacity 
          style={styles.fileCard} 
          activeOpacity={0.7} 
          onPress={() => questaoPages.length > 0 ? openPreview('questao') : onEditQuestao?.()}
          disabled={isUploading}
        >
          <View style={styles.fileIconWrapper}>
            <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color={COLORS.primaryBlue} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileTitle}>Caderno de Questões</Text>
            <Text style={styles.fileStatus}>
              {questaoPages.length > 0 
                ? `${questaoPages.length} Página(s) - Toque p/ ver` 
                : 'Toque para adicionar'}
            </Text>
          </View>
          {questaoPages.length > 0 && (
             <View style={styles.pageCountBadge}>
               <Feather name="search" size={14} color="#4CAF50" />
             </View>
          )}
        </TouchableOpacity>

        {/* MENSAGEM DE ATENÇÃO */}
        <View style={styles.warningBox}>
          <Feather name="info" size={20} color={COLORS.primaryBlue} />
          <Text style={styles.warningText}>
            Confira se as imagens estão nítidas. Ao clicar em enviar, os dados serão processados pelo sistema para a correção automática.
          </Text>
        </View>

      </ScrollView>

      {/* RODAPÉ COM BOTÕES */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isUploading}>
          <Text style={styles.cancelButtonText}>CANCELAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitButton, isUploading && styles.submitButtonLoading]} onPress={onSubmit} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>ENVIAR AVALIAÇÃO</Text>
              <Feather name="send" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* OVERLAY DE CARREGAMENTO COM ANIMAÇÃO NATIVA */}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            
            <Text style={styles.loadingTitle}>Enviando Avaliação</Text>
            
            {/* O Nosso Ícone com o Laser Animado */}
            <View style={styles.animatedScannerContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={100} color="#E0E0E0" />
              <Animated.View 
                style={[
                  styles.laserLine, 
                  { transform: [{ translateY: scanLineAnim }] }
                ]} 
              />
            </View>

            <Text style={styles.loadingSubText}>Sincronizando gabarito e questões com o servidor...</Text>
            
            {/* Barra de progresso visual (Indeterminada) */}
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>

          </View>
        </View>
      )}

      {/* MODAL DE VISUALIZAÇÃO DE IMAGEM EM TELA CHEIA */}
      <Modal visible={!!previewType} transparent={false} animationType="slide" onRequestClose={closePreview}>
        <View style={styles.modalContainer}>
          
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closePreview} style={styles.modalHeaderBtn}>
              <Feather name="x" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>
              {previewType === 'gabarito' ? 'Visualizar Gabarito' : 'Visualizar Questões'}
            </Text>
            
            {/* Botão de Refazer a foto */}
            <TouchableOpacity onPress={handleRetake} style={styles.modalHeaderBtn}>
              <Feather name="camera" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Área da Imagem com Scroll */}
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.modalScroll}>
            {previewType === 'gabarito' && gabaritoImg && (
              <View style={styles.fullscreenImageContainer}>
                <Image source={{ uri: gabaritoImg }} style={styles.fullscreenImage} resizeMode="contain" />
              </View>
            )}
            
            {previewType === 'questao' && questaoPages.map((uri, index) => (
              <View key={index} style={styles.fullscreenImageContainer}>
                <Image source={{ uri }} style={styles.fullscreenImage} resizeMode="contain" />
                <View style={styles.pageIndicator}>
                  <Text style={styles.pageIndicatorText}>Página {index + 1} de {questaoPages.length}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {previewType === 'questao' && questaoPages.length > 1 && (
            <Text style={styles.swipeHint}>Deslize para os lados para ver mais páginas</Text>
          )}

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#122A4C',
    height: Platform.OS === 'ios' ? 120 : 100,
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 50, left: 20, padding: 5 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 0, // Sobe o card para sobrepor o header
    borderLeftWidth: 4,
    borderLeftColor: '#122A4C',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 2,
    marginBottom: 25,
  },
  studentCardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: COLORS.titleDark },
  studentId: { fontSize: 14, color: COLORS.textGray, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.titleDark, marginBottom: 15 },
  
  fileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fileIconWrapper: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  fileInfo: { flex: 1 },
  fileTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.titleDark },
  fileStatus: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  
  thumbnail: { width: 40, height: 50, borderRadius: 4, backgroundColor: '#EEE', borderWidth: 1, borderColor: '#DDD' },
  editBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#122A4C',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  pageCountBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },

  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    gap: 12,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, color: '#1565C0', fontSize: 13, lineHeight: 20 },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: { 
    flex: 1, 
    height: 52, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  cancelButtonText: { color: COLORS.textGray, fontSize: 15, fontWeight: 'bold' },
  submitButton: { 
    flex: 2, 
    backgroundColor: '#122A4C', 
    flexDirection: 'row', 
    height: 52, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  submitButtonLoading: { backgroundColor: '#0A182C' },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  // --- ESTILOS DA TELA DE UPLOAD ANIMADA ---
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
  },
  loadingTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.titleDark, marginBottom: 20 },
  animatedScannerContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  laserLine: {
    position: 'absolute',
    top: 10,
    width: 80,
    height: 3,
    backgroundColor: '#4CAF50', // Linha verde neon
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Brilho no Android
  },
  loadingSubText: { fontSize: 14, color: COLORS.textGray, marginTop: 5, textAlign: 'center' },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '40%', // Uma barrinha falsa mostrando que está pensando
    height: '100%',
    backgroundColor: '#122A4C',
    borderRadius: 3,
  },

  // --- ESTILOS DO MODAL DE PREVIEW ---
  modalContainer: { flex: 1, backgroundColor: '#000000' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#122A4C',
  },
  modalHeaderBtn: { padding: 5 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalScroll: { flex: 1 },
  fullscreenImageContainer: {
    width: width, 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageIndicatorText: { color: '#FFF', fontWeight: 'bold' },
  swipeHint: {
    color: '#AAAAAA',
    textAlign: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    fontSize: 14,
  }
});
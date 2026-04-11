import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/Colors';

interface CapturaHubProps {
  studentData: string | null;
  gabaritoLido: boolean;
  questoesLidas: boolean;
  onScanGabarito: () => void;
  onScanQuestao: () => void;
  onAvancar: () => void;
  onVoltar: () => void;
}

export default function CapturaHub({ 
  studentData, 
  gabaritoLido, 
  questoesLidas, 
  onScanGabarito, 
  onScanQuestao, 
  onAvancar,
  onVoltar
}: CapturaHubProps) {
  
  // Só permite avançar se o gabarito tiver sido lido
  const podeAvancar = gabaritoLido;

  return (
    <View style={styles.container}>
      
      {/* 1. CABEÇALHO AZUL CURVADO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onVoltar}>
          <Feather name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Captura de Avaliação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. CARTÃO DO ALUNO (Flutuante) */}
        <View style={styles.studentCard}>
          <View style={styles.studentCardHeader}>
            <View style={styles.avatar}>
              <Feather name="user" size={24} color={COLORS.textGray} />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>Aluno Identificado</Text>
              <Text style={styles.studentId}>ID/Matrícula: {studentData || 'Desconhecido'}</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <MaterialCommunityIcons name="check-decagram" size={18} color="#4CAF50" />
            <Text style={styles.badgeText}>Sincronizado</Text>
          </View>
        </View>

        {/* 3. DESCRIÇÃO DA AVALIAÇÃO */}
        <View style={styles.assessmentInfo}>
          <Text style={styles.assessmentTitle}>Simulado ENEM - 2026</Text>
          <Text style={styles.assessmentSubtitle}>Matemática e Ciências da Natureza</Text>
        </View>

        {/* 4. CAIXAS DE AÇÃO (Gabarito e Questões) */}
        <View style={styles.actionCardsContainer}>
          
          {/* Cartão do Gabarito */}
          <TouchableOpacity 
            style={[styles.actionCard, gabaritoLido && styles.actionCardSuccess]} 
            onPress={onScanGabarito}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, gabaritoLido && styles.iconBoxSuccess]}>
              <MaterialCommunityIcons 
                name={gabaritoLido ? "check-circle" : "grid"} 
                size={28} 
                color={gabaritoLido ? "#4CAF50" : COLORS.primaryBlue} 
              />
            </View>
            <View style={styles.actionCardText}>
              <Text style={styles.actionCardTitle}>Escanear Gabarito</Text>
              <Text style={styles.actionCardDesc}>Folha de bolinhas padrão</Text>
            </View>
            <Text style={[styles.statusText, gabaritoLido && styles.statusTextSuccess]}>
              {gabaritoLido ? "Lido" : "Pendente"}
            </Text>
          </TouchableOpacity>

          {/* Cartão de Questões */}
          <TouchableOpacity 
            style={[styles.actionCard, questoesLidas && styles.actionCardSuccess]} 
            onPress={onScanQuestao}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, questoesLidas && styles.iconBoxSuccess]}>
              <MaterialCommunityIcons 
                name={questoesLidas ? "check-circle" : "file-document-outline"} 
                size={28} 
                color={questoesLidas ? "#4CAF50" : COLORS.primaryBlue} 
              />
            </View>
            <View style={styles.actionCardText}>
              <Text style={styles.actionCardTitle}>Escanear Questões</Text>
              <Text style={styles.actionCardDesc}>Páginas da prova (Opcional)</Text>
            </View>
            <Text style={[styles.statusText, questoesLidas && styles.statusTextSuccess]}>
              {questoesLidas ? "Lido" : "Pendente"}
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* 5. BOTÃO DE AVANÇAR (Rodapé) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, !podeAvancar && styles.submitButtonDisabled]} 
          onPress={onAvancar}
          disabled={!podeAvancar}
        >
          <Text style={styles.submitButtonText}>AVANÇAR PARA REVISÃO</Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#122A4C',
    height: 90,
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 50, left: 20, padding: 5 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#122A4C',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 2,
  },
  studentCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: COLORS.titleDark },
  studentId: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

  assessmentInfo: { marginTop: 30, marginBottom: 20 },
  assessmentTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.titleDark },
  assessmentSubtitle: { fontSize: 14, color: COLORS.textGray, marginTop: 4 },

  actionCardsContainer: { gap: 15 },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionCardSuccess: { borderColor: '#4CAF50', backgroundColor: '#FAFFFA' },
  iconBox: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconBoxSuccess: { backgroundColor: '#E8F5E9' },
  actionCardText: { flex: 1 },
  actionCardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.titleDark },
  actionCardDesc: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textGray },
  statusTextSuccess: { color: '#4CAF50' },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  submitButton: { backgroundColor: '#122A4C', flexDirection: 'row', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 10 },
  submitButtonDisabled: { backgroundColor: '#A0AAB8' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
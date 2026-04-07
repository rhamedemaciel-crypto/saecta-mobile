import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  studentData: string | null;
  onScanClick: () => void;
}

export default function Step2Gabarito({ studentData, onScanClick }: Props) {
  return (
    <View style={styles.centerParams}>
      <Text style={styles.title}>Passo 2: Gabarito</Text>
      
      <View style={styles.card}>
        <Text style={styles.studentLabel}>Aluno Identificado:</Text>
        <Text style={styles.studentData}>{studentData}</Text>
      </View>
      
      <TouchableOpacity style={styles.btnGreen} onPress={onScanClick}>
        <Text style={styles.btnText}>📸 Escanear Gabarito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerParams: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#1A2B4C' },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee'
  },
  studentLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  studentData: { fontSize: 20, fontWeight: 'bold', color: '#1A2B4C' },
  btnGreen: { 
    backgroundColor: '#b2d822', // O verde do botão de "ENTRAR" do Figma
    padding: 18, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center' 
  },
  btnText: { color: '#1A2B4C', fontSize: 18, fontWeight: 'bold' } // Texto escuro em fundo claro fica top
});
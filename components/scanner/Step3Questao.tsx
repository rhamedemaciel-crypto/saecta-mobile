import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  questaoPages: string[];
  onScanClick: () => void;
  onFinishClick: () => void;
}

export default function Step3Questao({ questaoPages, onScanClick, onFinishClick }: Props) {
  return (
    <View style={styles.centerParams}>
      <Text style={styles.title}>3. Foto da Questão</Text>
      <Text style={styles.statusLabel}>Gabarito Salvo ✅</Text>
      
      <View style={styles.pagesContainer}>
        <Text style={styles.counterText}>Páginas da questão: {questaoPages.length}</Text>
        <ScrollView horizontal style={styles.scrollPreview}>
           {questaoPages.length === 0 && (
             <View style={styles.placeholder}>
                <Text style={{color: '#aaa', textAlign: 'center'}}>Nenhuma página ainda</Text>
             </View>
           )}
           {questaoPages.map((img, index) => (
             <Image key={index} source={{ uri: img }} style={styles.smallThumb} />
           ))}
        </ScrollView>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.btnBig} onPress={onScanClick}>
          <Text style={styles.btnText}>📸 Adicionar Página</Text>
        </TouchableOpacity>

        {questaoPages.length > 0 && (
          <TouchableOpacity style={styles.btnFinish} onPress={onFinishClick}>
            <Text style={styles.btnText}>✅ Finalizar Questão</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerParams: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  statusLabel: { fontSize: 16, color: 'green', marginBottom: 10 },
  pagesContainer: { height: 160, marginBottom: 20, width: '100%', alignItems: 'center' },
  counterText: { marginBottom: 5, color: '#666' },
  scrollPreview: { flexGrow: 0 },
  placeholder: { width: 100, height: 140, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderStyle: 'dashed', borderWidth: 1, borderColor: '#999' },
  smallThumb: { width: 80, height: 110, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  actionButtons: { width: '100%', gap: 10 },
  btnBig: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnFinish: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
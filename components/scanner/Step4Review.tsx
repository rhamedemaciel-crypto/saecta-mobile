import React from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native';

interface Props {
  studentData: string | null;
  gabaritoImg: string | null;
  questaoPages: string[];
  isUploading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function Step4Review({ studentData, gabaritoImg, questaoPages, isUploading, onSubmit, onCancel }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.reviewContainer}>
      <Text style={styles.title}>Conferência</Text>
      
      <Text style={styles.label}>Aluno:</Text>
      <Text style={styles.data}>{studentData}</Text>

      <Text style={styles.sectionHeader}>Gabarito:</Text>
      {gabaritoImg && <Image source={{ uri: gabaritoImg }} style={styles.largeThumb} />}

      <Text style={styles.sectionHeader}>Questão ({questaoPages.length} págs):</Text>
      <ScrollView horizontal>
        {questaoPages.map((img, index) => (
          <View key={index} style={{marginRight: 10, alignItems: 'center'}}>
             <Text style={{marginBottom: 5, fontWeight: 'bold'}}>Pág {index + 1}</Text>
             <Image source={{ uri: img }} style={styles.mediumThumb} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerButtons}>
        <Button 
          title={isUploading ? "Enviando... ⏳" : "✅ Enviar Avaliação"} 
          onPress={onSubmit} 
          disabled={isUploading}
        />
        <View style={{marginTop: 10}}>
          <Button title="Cancelar" color="red" onPress={onCancel} disabled={isUploading} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  reviewContainer: { padding: 20, paddingBottom: 50, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  label: { fontSize: 14, color: '#888' },
  data: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, width: '100%', borderBottomWidth: 1, borderColor: '#ddd' },
  largeThumb: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#ddd', borderRadius: 8 },
  mediumThumb: { width: 150, height: 200, resizeMode: 'contain', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  footerButtons: { width: '100%', marginTop: 30 },
});
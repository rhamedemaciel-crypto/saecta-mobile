import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones nativos

import { COLORS } from '../constants/Colors';

// Dados falsos só para montarmos o visual dos cards
const avaliacoes = [
  { id: '1', turma: '3º Ano - Ensino Médio', titulo: 'Simulado ENEM - 2024', data: '22/03/2024', corBorda: COLORS.primaryBlue },
  { id: '2', turma: '1º Ano - Ensino Médio', titulo: 'Prova Bimestral - Matemática', data: '25/03/2024', corBorda: COLORS.warningOrange },
];

export default function DashboardScreen() {
  const router = useRouter();

  const handleOpenScanner = () => {
    // É aqui que o botão gigante do QR Code te joga pra câmera!
    router.push('/scanner');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* HEADER ESCURO COM CURVATURA */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.userInfo}>
            {/* Se tiver a foto do usuário, substitua a source depois */}
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={24} color={COLORS.bgWhite} />
            </View>
            <View>
              <Text style={styles.greeting}>Olá, Rodrigo Silva</Text>
              <Text style={styles.userId}>ID: 4323</Text>
            </View>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={24} color={COLORS.bgWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="settings" size={24} color={COLORS.bgWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ANO LETIVO E FILTROS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Ano Letivo</Text>
            <TouchableOpacity style={styles.yearDropdown}>
              <Text style={styles.yearText}>2024</Text>
              <Feather name="chevron-down" size={20} color={COLORS.titleDark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Ver todos</Text>
            <View style={styles.activeIndicator} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>Lidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>Pendentes</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE AVALIAÇÕES */}
        <View style={styles.cardsContainer}>
          {avaliacoes.map((item) => (
            <View key={item.id} style={[styles.card, { borderLeftColor: item.corBorda }]}>
              <View style={styles.cardIconWrapper}>
                <MaterialCommunityIcons name="file-document-outline" size={32} color={item.corBorda} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTurma}>{item.turma}</Text>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardData}>{item.data}</Text>
              </View>
              <Feather name="chevron-right" size={24} color={COLORS.textGray} />
            </View>
          ))}
        </View>
        
        {/* Espaço vazio no final pro scroll não ficar escondido atrás do botão gigante */}
        <View style={{ height: 120 }} /> 
      </ScrollView>

      {/* BOTÃO FLUTUANTE (FAB) DO QR CODE */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenScanner} activeOpacity={0.8}>
        <MaterialCommunityIcons name="qrcode-scan" size={40} color={COLORS.titleDark} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray, // Um cinza bem clarinho pro fundo
  },
  header: {
    backgroundColor: COLORS.headerBlue, // #122A4C
    height: 175,
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50, // Dá espaço pra barra de status do celular
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    color: COLORS.bgWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  yearDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yearText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.titleDark,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activeTab: {
    paddingBottom: 10,
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 3,
  },
  inactiveTab: {
    paddingBottom: 10,
  },
  inactiveTabText: {
    fontSize: 16,
    color: COLORS.tabInactive,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    backgroundColor: COLORS.cardWhite,
    height: 80, // Medida do seu Figma
    borderRadius: 10,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // Sombras nativas pra ficar igual o box-shadow: 0px 1px 4px 0px #00000040
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardIconWrapper: {
    width: 40,
    alignItems: 'center',
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardTurma: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.titleDark,
    marginVertical: 2,
  },
  cardData: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  fab: {
    position: 'absolute',
    bottom: 30, // Fica sempre colado embaixo, independente do celular
    alignSelf: 'center', // Centraliza perfeitamente
    width: 92, // Medida exata do seu Figma
    height: 92,
    borderRadius: 16, // Um pouco mais arredondado fica melhor pro toque, mas você pode usar o 7.57 do Figma
    backgroundColor: COLORS.fabBg, // #F3F4F6
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
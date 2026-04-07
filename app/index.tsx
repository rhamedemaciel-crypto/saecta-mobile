import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from '../constants/Colors';
import { onboardingData } from '../constants/OnboardingData';
import { OnboardingSlide } from '../components/OnboardingSlide';


const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingSlide item={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.navRow}>
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => (
              <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Próximo {'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/login')}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgWhite },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  logo: { height: 40, width: 150 },
  footer: { paddingHorizontal: 36, paddingBottom: 40 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  dotsContainer: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.dotInactive },
  activeDot: { backgroundColor: COLORS.primaryBlue },
  nextButton: { backgroundColor: COLORS.primaryBlue, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  nextButtonText: { color: COLORS.bgWhite, fontSize: 14, fontWeight: '600' },
  skipButton: { alignItems: 'center' },
  skipText: { fontSize: 16, color: COLORS.primaryBlue, textDecorationLine: 'underline' },
});
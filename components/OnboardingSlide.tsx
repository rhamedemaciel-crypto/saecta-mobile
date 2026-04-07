import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface SlideProps {
  item: {
    title: string;
    text: string;
    image: any;
  };
}

export const OnboardingSlide = ({ item }: SlideProps) => (
  <View style={styles.pageContainer}>
    <Image source={item.image} style={styles.illustration} resizeMode="contain" />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.paragraph}>{item.text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  pageContainer: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.35,
    marginTop: 20,
    marginBottom: 40,
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.titleDark,
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textGray,
    lineHeight: 20,
  },
});
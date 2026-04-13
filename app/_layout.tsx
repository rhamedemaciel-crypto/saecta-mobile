import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Esconde a barra nativa
      NavigationBar.setVisibilityAsync("hidden");
      // Faz ela aparecer só se o usuário arrastar
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return <Slot />; 
}
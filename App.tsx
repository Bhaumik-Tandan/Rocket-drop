import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useGameStore } from './src/store/gameStore';
import { MainMenu } from './src/components/ui/MainMenu';
import { PauseMenu } from './src/components/ui/PauseMenu';
import { SettingsScreen } from './src/components/ui/SettingsScreen';
import { FlightSimulator } from './src/components/game/FlightSimulator';
import { setAudioEnabled } from './src/utils/audio';

// Suppress expo-av deprecation warning
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('expo-av') || args[0].includes('Audio'))) {
    return; // Suppress expo-av deprecation warnings
  }
  originalWarn.apply(console, args);
};

export default function App() {
  const { gameMode, settings, endSession, setGameMode, setPaused } = useGameStore();

  // Ensure audio mode follows settings
  useEffect(() => {
    setAudioEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleStartGame = async () => {
    // Start the game session
    setGameMode('playing');
    setPaused(false);
    
    // Haptic feedback
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGameOver = (score: number, time: number) => {
    // End the session and go back to main menu
    endSession();
    setGameMode('menu'); // Explicitly set game mode to menu
  };

  if (gameMode === 'menu') {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <MainMenu onStartGame={handleStartGame} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (gameMode === 'settings') {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <SettingsScreen />
        </View>
      </SafeAreaProvider>
    );
  }

  // Game is playing (either active or paused)
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <FlightSimulator onGameOver={handleGameOver} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B2A',
  },
}); 
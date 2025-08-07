import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
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
  if (args[0] && typeof args[0] === 'string' && args[0].includes('expo-av')) {
    return; // Suppress expo-av deprecation warnings
  }
  originalWarn.apply(console, args);
};

export default function App() {
  const { 
    gameMode, 
    sessionScore, 
    sessionTime, 
    sessionDistance, 
    startSession, 
    endSession, 
    setGameMode,
    settings
  } = useGameStore();

  // Sync sound setting with audio service
  useEffect(() => {
    setAudioEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleGameOver = (score: number, time: number) => {
    // End the session and go back to main menu
    endSession();
    setGameMode('menu');
  };

  const handleStartGame = () => {
    startSession();
  };

  // Render based on game mode
  if (gameMode === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <MainMenu onStartGame={handleStartGame} />
      </View>
    );
  }

  if (gameMode === 'settings') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <SettingsScreen />
      </View>
    );
  }









  // Game is playing
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
            <FlightSimulator onGameOver={handleGameOver} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B2A',
  },

}); 
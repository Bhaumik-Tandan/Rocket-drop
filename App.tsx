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

  // Game is playing
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
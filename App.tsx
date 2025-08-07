import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from './src/store/gameStore';
import { MainMenu } from './src/components/ui/MainMenu';
import { PauseMenu } from './src/components/ui/PauseMenu';
import { SettingsScreen } from './src/components/ui/SettingsScreen';

import { FlightSimulator } from './src/components/game/FlightSimulator';

export default function App() {
  const { 
    gameMode, 
    sessionScore, 
    sessionTime, 
    sessionDistance, 
    startSession, 
    endSession, 
    setGameMode 
  } = useGameStore();

  const handleGameOver = (score: number, time: number) => {
    // Persist run stats; keep rendering the game so we can show an in-game Game Over overlay
    endSession();
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
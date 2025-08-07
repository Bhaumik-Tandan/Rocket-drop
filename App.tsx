import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStateManager, GameState } from './src/utils/gameState';
import { MainMenu } from './src/components/ui/MainMenu';
import { PauseMenu } from './src/components/ui/PauseMenu';
import { SettingsScreen } from './src/components/ui/SettingsScreen';

import { FlightSimulator } from './src/components/game/FlightSimulator';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  // Subscribe to game state changes
  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleGameOver = (score: number, time: number) => {
    gameStateManager.endSession();
  };

  const handleStartGame = () => {
    gameStateManager.startSession();
  };

  // Render based on game mode
  if (gameState.gameMode === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <MainMenu onStartGame={handleStartGame} />
      </View>
    );
  }

  if (gameState.gameMode === 'settings') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <SettingsScreen />
      </View>
    );
  }





  if (gameState.gameMode === 'gameOver') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.modalContainer}>
          <View style={styles.premiumModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>GAME OVER</Text>
              <Text style={styles.modalSubtitle}>Flight Report</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{gameState.sessionScore}</Text>
                <Text style={styles.statLabel}>SCORE</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{Math.round(gameState.sessionTime / 1000)}s</Text>
                <Text style={styles.statLabel}>TIME</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{Math.floor(gameState.sessionDistance)}</Text>
                <Text style={styles.statLabel}>DISTANCE</Text>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.premiumButton} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  gameStateManager.setGameMode('playing');
                }}
              >
                <Text style={styles.premiumButtonText}>🚀 PLAY AGAIN</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.premiumButton, styles.secondaryButton]} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  gameStateManager.setGameMode('menu');
                }}
              >
                <Text style={styles.premiumButtonText}>🏠 MAIN MENU</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  premiumModal: {
    backgroundColor: 'rgba(15, 15, 45, 0.95)',
    padding: 32,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
    maxWidth: 340,
    minWidth: 300,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalSubtitle: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  statNumber: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  modalButtons: {
    width: '100%',
  },
  premiumButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#357ABD',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
    borderColor: '#495057',
    marginTop: 12,
  },
}); 
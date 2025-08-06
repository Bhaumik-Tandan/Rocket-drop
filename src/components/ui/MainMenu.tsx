import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStateManager, GameState } from '../../utils/gameState';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleStartGame = () => {
    onStartGame();
  };





  const handleSettings = () => {
    gameStateManager.setGameMode('settings');
  };



  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      <View style={styles.header}>
        <Text style={styles.title}>🚀 FLIGHT SIMULATOR</Text>
        <Text style={styles.subtitle}>Master the skies</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handleStartGame}>
          <Text style={styles.playButtonText}>🚀 FLY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{gameState.stats.bestScore}</Text>
          <Text style={styles.statLabel}>BEST SCORE</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.floor(gameState.stats.bestTime / 1000)}</Text>
          <Text style={styles.statLabel}>BEST TIME (S)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.floor(gameState.stats.bestDistance)}</Text>
          <Text style={styles.statLabel}>BEST DISTANCE</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'space-between',
    padding: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0A',
    opacity: 0.9,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '300',
  },
  playerInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 1,
  },
  experienceBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  experienceFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 2,
  },
  experienceText: {
    fontSize: 12,
    color: '#888888',
    letterSpacing: 0.5,
  },
  menuButtons: {
    gap: 12,
    marginHorizontal: 20,
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  menuContainer: {
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 20,
    marginVertical: 40,
  },
  playButton: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
}); 
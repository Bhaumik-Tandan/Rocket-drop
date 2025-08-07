import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStateManager, GameState } from '../../utils/gameState';

const { width, height } = Dimensions.get('window');

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleQuickPlay = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onStartGame();
  };





  const handleSettings = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    gameStateManager.setGameMode('settings');
  };



  return (
    <View style={styles.container}>
      {/* Background Stars - Like the game screen */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 100 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.8 + 0.2,
              }
            ]}
          />
        ))}
      </View>

      {/* Settings Button - Top Right */}
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings} activeOpacity={0.7}>
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* Highest Score Display - Top Center */}
      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreLabel}>HIGHEST</Text>
        <Text style={styles.highScoreValue}>{gameState.stats.bestScore}</Text>
      </View>

      {/* Rocket Character - Centered */}
      <View style={styles.rocketContainer}>
        <View style={styles.rocket}>
          <Text style={styles.rocketEmoji}>🚀</Text>
        </View>
      </View>

      {/* Tap to Start Overlay */}
      <TouchableOpacity 
        style={styles.tapOverlay} 
        onPress={handleQuickPlay}
        activeOpacity={1}
      >
        <View style={styles.tapOverlayContent}>
          <Text style={styles.tapOverlayText}>TAP TO START</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B2A',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    zIndex: 10,
  },
  settingsButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  highScoreContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  highScoreLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 4,
  },
  highScoreValue: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rocketContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocket: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketEmoji: {
    fontSize: 60,
  },
  tapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapOverlayContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  tapOverlayText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStateManager, GameState } from '../../utils/gameState';

export const PauseMenu: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());
  const [menuScale] = useState(new Animated.Value(0.8));
  const [menuOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (gameState.isPaused) {
      Animated.parallel([
        Animated.spring(menuScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(menuScale, {
          toValue: 0.8,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gameState.isPaused]);

  const handleResume = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    gameStateManager.setPaused(false);
  };

  const handleSettings = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    gameStateManager.setGameMode('settings');
  };

  const handleQuit = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    gameStateManager.setPaused(false);
    gameStateManager.setGameMode('menu');
  };

  if (!gameState.isPaused) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { opacity: menuOpacity }]}>
      <Animated.View style={[styles.menu, { transform: [{ scale: menuScale }] }]}>
        <Text style={styles.title}>PAUSED</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleResume}>
            <Text style={styles.buttonText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Text style={styles.buttonText}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.quitButton]} onPress={handleQuit}>
            <Text style={styles.buttonText}>QUIT TO MENU</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Double tap to pause/resume</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menu: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: 280,
    // backdropFilter: 'blur(20px)', // Not supported in React Native
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 4,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
  },
  button: {
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
  quitButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  hint: {
    fontSize: 11,
    color: '#888888',
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '300',
  },
}); 
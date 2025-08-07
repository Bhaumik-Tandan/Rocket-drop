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
  const [titleScale] = useState(new Animated.Value(0.8));
  const [buttonScale] = useState(new Animated.Value(0.9));
  const [statsOpacity] = useState(new Animated.Value(0));
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [showGameOverlay, setShowGameOverlay] = useState(false);

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleStartGame = () => {
    // Button press animation with inverse bound effect
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1.05,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setTimeout(() => {
      onStartGame();
    }, 150);
  };

  const handleQuickPlay = () => {
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowGameOverlay(true);
    setTimeout(() => {
      onStartGame();
    }, 300);
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

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Title */}
        <Animated.View style={[styles.header, { transform: [{ scale: titleScale }] }]}>
          <Text style={styles.title}>SPACE DROP</Text>
          <Text style={styles.subtitle}>Get Ready!</Text>
        </Animated.View>

        {/* Rocket Character */}
        <Animated.View style={[styles.rocketContainer, { transform: [{ scale: buttonScale }] }]}>
          <View style={styles.rocket}>
            <Text style={styles.rocketEmoji}>🚀</Text>
          </View>
        </Animated.View>
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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#87CEEB',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  rocketContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  rocket: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
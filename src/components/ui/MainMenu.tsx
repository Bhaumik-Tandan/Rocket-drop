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
      {/* Animated background gradient effect */}
      <Animated.View style={[styles.backgroundGradient, {
        opacity: backgroundAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      }]} />
      
      {/* Animated floating particles */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: (width / 8) * i + Math.random() * 40,
                top: height * 0.2 + Math.random() * height * 0.6,
                opacity: backgroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                transform: [{
                  translateY: backgroundAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                }],
              },
            ]}
          />
        ))}
      </View>
      
      <Animated.View style={[styles.header, { transform: [{ scale: titleScale }] }]}>
        <Text style={styles.title}>🚀 SPACE DROP</Text>
        <Text style={styles.subtitle}>Free Play Adventure</Text>
      </Animated.View>

      <Animated.View style={[styles.menuContainer, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity style={styles.playButton} onPress={handleQuickPlay} activeOpacity={0.8}>
          <Text style={styles.playButtonText}>🚀 TAP TO PLAY</Text>
          <View style={styles.buttonGlow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings} activeOpacity={0.7}>
          <Text style={styles.settingsButtonText}>⚙️ SETTINGS</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Game Overlay - Shows when user taps to play */}
      {showGameOverlay && (
        <Animated.View style={styles.gameOverlay}>
          <View style={styles.tapToPlayContainer}>
            <Text style={styles.tapToPlayText}>TAP TO START</Text>
            <Text style={styles.tapToPlaySubtext}>Fly through the gaps!</Text>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.statsContainer, { opacity: statsOpacity }]}>
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
      </Animated.View>
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
    backgroundColor: '#0B0B2A',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
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
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1,
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
  gameOverlay: {
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
  tapToPlayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  tapToPlayText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  tapToPlaySubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
}); 
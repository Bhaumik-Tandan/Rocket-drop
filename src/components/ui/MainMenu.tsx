import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { gameStateManager, GameState } from '../../utils/gameState';

const { width, height } = Dimensions.get('window');

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());
  const [ufoReady, setUfoReady] = useState(false);
  const clickSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/click.wav'),
          { shouldPlay: false, volume: 0.5 }
        );
        clickSoundRef.current = sound;
      } catch (error) {
        // Audio not available - continue without sound
      }
    };
    loadAudio();
    return () => {
      clickSoundRef.current?.unloadAsync();
    };
  }, []);

  const handleQuickPlay = () => {
    // Play click sound
    if (gameState.settings.soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.replayAsync();
    }
    
    // Haptic feedback
    if (gameState.settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!ufoReady) {
      setUfoReady(true);
    } else {
      onStartGame();
    }
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

      {/* Highest Score Display - Top Center */}
      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreLabel}>HIGHEST</Text>
        <Text style={styles.highScoreValue}>{gameState.stats.bestScore}</Text>
      </View>

      {/* Settings Button - Top Right */}
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings} activeOpacity={0.7}>
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* Transparent Black Curtain */}
      <View style={styles.curtainOverlay} />

      {/* Tap Anywhere Text */}
      <View style={styles.tapAnywhereContainer}>
        <Text style={styles.tapAnywhereText}>TAP ANYWHERE TO PLAY</Text>
      </View>

      {/* Detailed Spaceship - Like in game */}
      <View style={styles.spaceshipContainer}>
        <View style={[styles.spaceship, { 
          transform: [
            { rotate: ufoReady ? '0deg' : '20deg' },
            { translateY: ufoReady ? -20 : 0 }
          ] 
        }]}>
          {/* Main Body */}
          <View style={styles.spaceshipBody}>
            {/* Cockpit with glow */}
            <View style={styles.spaceshipCockpit}>
              <View style={styles.cockpitGlow} />
              <View style={styles.cockpitWindow} />
            </View>
            
            {/* Wings */}
            <View style={styles.spaceshipWings}>
              <View style={styles.wingLeft} />
              <View style={styles.wingRight} />
            </View>
            
            {/* Engine with thrust effect */}
            <View style={styles.spaceshipEngine}>
              <View style={styles.engineGlow} />
              <View style={styles.thrustEffect} />
            </View>
            
            {/* Side panels */}
            <View style={styles.sidePanelLeft} />
            <View style={styles.sidePanelRight} />
            
            {/* Nose cone */}
            <View style={styles.noseCone} />
          </View>
        </View>
      </View>

      {/* Tap to Start - Invisible overlay */}
      <TouchableOpacity 
        style={styles.tapOverlay} 
        onPress={handleQuickPlay}
        activeOpacity={1}
      />
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
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  settingsButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  highScoreContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  highScoreLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highScoreValue: {
    color: '#FFD700',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  curtainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  tapAnywhereContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 12,
  },
  tapAnywhereText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  spaceshipContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  spaceship: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipBody: {
    width: 30,
    height: 24,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#357ABD',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  spaceshipCockpit: {
    position: 'absolute',
    top: 2,
    left: 15 - 8,
    width: 16,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#87CEEB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#87CEEB',
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  cockpitGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  cockpitWindow: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  spaceshipWings: {
    position: 'absolute',
    top: 6,
    left: -6,
    width: 42,
    height: 8,
    backgroundColor: '#2E5C8A',
    borderRadius: 4,
  },
  wingLeft: {
    position: 'absolute',
    left: -8,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  wingRight: {
    position: 'absolute',
    right: -8,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  spaceshipEngine: {
    position: 'absolute',
    bottom: -6,
    left: 15 - 6,
    width: 12,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  engineGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.4)',
  },
  thrustEffect: {
    position: 'absolute',
    bottom: -8,
    left: 2,
    width: 8,
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    opacity: 0.8,
  },
  sidePanelLeft: {
    position: 'absolute',
    left: -2,
    top: 7,
    width: 4,
    height: 12,
    backgroundColor: '#357ABD',
    borderRadius: 2,
  },
  sidePanelRight: {
    position: 'absolute',
    right: -2,
    top: 7,
    width: 4,
    height: 12,
    backgroundColor: '#357ABD',
    borderRadius: 2,
  },
  noseCone: {
    position: 'absolute',
    top: -4,
    left: 15 - 4,
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },

  tapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 15,
  },
}); 
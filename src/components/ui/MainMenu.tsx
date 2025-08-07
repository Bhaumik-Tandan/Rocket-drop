import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { playClick, setAudioEnabled } from '../../utils/audio';
import { useGameStore } from '../../store/gameStore';

const { width, height } = Dimensions.get('window');

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const { settings, stats, setGameMode } = useGameStore();
  const [audioReady, setAudioReady] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setAudioEnabled(settings.soundEnabled).then(() => setAudioReady(true));
  }, [settings.soundEnabled]);

  const handleQuickPlay = () => {
    // Play click sound (only if audio is ready)
    if (settings.soundEnabled && audioReady) {
      playClick();
    }
    
    // Haptic feedback
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onStartGame();
  };





  const handleSettings = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setGameMode('settings');
  };



  return (
    <View style={styles.container}>
      {/* Enhanced Background Stars */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 150 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.9 + 0.1,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
              }
            ]}
          />
        ))}
      </View>

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Settings Button - Top Right */}
      <TouchableOpacity 
        style={[styles.settingsButton, { 
          top: insets.top + 20,
          right: insets.right + 20
        }]} 
        onPress={handleSettings} 
        activeOpacity={0.7}
      >
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* Main Content Container */}
      <View style={styles.mainContent}>
        {/* Game Title with Glow */}
        <View style={[styles.titleContainer, { marginTop: insets.top + 60 }]}>
          <Text style={styles.gameTitle}>SPACE DROP</Text>
          <Text style={styles.gameSubtitle}>Free Play Adventure</Text>
        </View>

        {/* High Score Card */}
        <View style={styles.highScoreCard}>
          <Text style={styles.highScoreLabel}>BEST SCORE</Text>
          <Text style={styles.highScoreValue}>{stats.bestScore}</Text>
        </View>

        {/* Play Button */}
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handleQuickPlay}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>TAP TO PLAY</Text>
          <Text style={styles.playButtonSubtext}>Ready for adventure?</Text>
        </TouchableOpacity>

        {/* Floating Spaceship */}
        <View style={styles.spaceshipContainer}>
          <View style={[styles.spaceship, { 
            transform: [
              { rotate: '15deg' },
              { translateY: -10 }
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
      </View>
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
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  settingsButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  highScoreContainer: {
    position: 'absolute',
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

  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 11, 42, 0.3)',
    zIndex: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  highScoreCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.6)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playButtonSubtext: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
    opacity: 0.8,
  },
  tapAnywhereContainer: {
    position: 'absolute',
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
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  gameTitle: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 3,
    marginBottom: 12,
  },
  gameSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
}); 
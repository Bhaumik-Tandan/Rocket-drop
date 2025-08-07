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
    if (settings.soundEnabled && audioReady) {
      playClick();
    }
    
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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background Stars */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 80 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.6 + 0.4,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
              }
            ]}
          />
        ))}
      </View>

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Settings Button */}
      <TouchableOpacity 
        style={[styles.settingsButton, { top: insets.top + 10, right: 20 }]} 
        onPress={handleSettings} 
        activeOpacity={0.7}
      >
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* Main Content - Centered like Flappy Bird */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.gameTitle}>COSMIC DASH</Text>
          <Text style={styles.gameSubtitle}>Space Adventure</Text>
        </View>

        {/* Centered UFO - Like Flappy Bird */}
        <View style={styles.ufoContainer}>
          <View style={styles.spaceship}>
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

        {/* Tap to Play - Centered below UFO */}
        <View style={styles.playSection}>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handleQuickPlay}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>TAP TO PLAY</Text>
          </TouchableOpacity>
        </View>

        {/* High Score - Bottom */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>BEST SCORE</Text>
          <Text style={styles.scoreValue}>{stats.bestScore}</Text>
        </View>
      </View>

      {/* Full Screen Tap Area */}
      <TouchableOpacity 
        style={styles.tapArea} 
        onPress={handleQuickPlay}
        activeOpacity={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  settingsButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  gameTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.8,
  },
  ufoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    top: 9,
    width: 4,
    height: 12,
    backgroundColor: '#357ABD',
    borderRadius: 2,
  },
  sidePanelRight: {
    position: 'absolute',
    right: -2,
    top: 9,
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
  playSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.6)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  scoreSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 4,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
}); 
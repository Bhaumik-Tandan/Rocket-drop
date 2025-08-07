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
        {Array.from({ length: 100 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.8 + 0.2,
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

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.gameTitle}>SPACE DROP</Text>
          <Text style={styles.gameSubtitle}>Free Play Adventure</Text>
        </View>

        {/* High Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>BEST SCORE</Text>
          <Text style={styles.scoreValue}>{stats.bestScore}</Text>
        </View>

        {/* Play Button */}
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handleQuickPlay}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>TAP TO PLAY</Text>
        </TouchableOpacity>

        {/* UFO Spaceship */}
        <View style={styles.spaceshipContainer}>
          <View style={[styles.spaceship, { transform: [{ rotate: '15deg' }] }]}>
            <View style={styles.spaceshipBody}>
              <View style={styles.spaceshipCockpit} />
              <View style={styles.spaceshipEngine} />
            </View>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  gameSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  scoreSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 20,
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
  playButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.6)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
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
  spaceshipContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  spaceship: {
    width: 60,
    height: 40,
  },
  spaceshipBody: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipCockpit: {
    width: 20,
    height: 12,
    backgroundColor: '#87CEEB',
    borderRadius: 6,
  },
  spaceshipEngine: {
    width: 8,
    height: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
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
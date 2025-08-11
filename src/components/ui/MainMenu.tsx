import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { playClick, setAudioEnabled } from '../../utils/audio';
import { useGameStore } from '../../store/gameStore';
import { getResponsiveDimensions } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const { settings, stats, setGameMode } = useGameStore();
  const [audioReady, setAudioReady] = useState(false);
  const insets = useSafeAreaInsets();
  const dims = getResponsiveDimensions();
  


  useEffect(() => {
    setAudioEnabled(settings.soundEnabled).then(() => setAudioReady(true));
  }, [settings.soundEnabled]);

  const handleQuickPlay = async () => {
    console.log('🎮 Tap detected - starting game!');
    
    if (settings.soundEnabled && audioReady) {
      // Play click sound
      await playClick();
    }
    
    // Start game immediately - no transition
    onStartGame();
    
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
        style={[
          styles.settingsButton, 
          { 
            top: insets.top + (dims.isTablet ? 20 : 10), 
            right: dims.padding,
            width: dims.buttonSize,
            height: dims.buttonSize,
            borderRadius: dims.buttonSize / 2,
            zIndex: 101,
          }
        ]} 
        onPress={handleSettings} 
        activeOpacity={0.7}
      >
        <Text style={[styles.settingsButtonText, { fontSize: dims.iconSize }]}>⚙️</Text>
      </TouchableOpacity>

      {/* Main Content - Centered like Flappy Bird */}
      <View style={[
        styles.content, 
        { 
          paddingTop: dims.isTablet ? 80 : 40, 
          paddingBottom: dims.isTablet ? 80 : 40,
          width: '100%',
        }
      ]}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.gameTitle, { fontSize: dims.titleSize }]}>COSMIC DASH</Text>
          <Text style={[styles.gameSubtitle, { fontSize: dims.subtitleSize }]}>Space Adventure</Text>
        </View>

        {/* Centered UFO - Tilted like falling */}
        <View style={styles.ufoContainer}>
          <View style={[
            styles.spaceship, 
            { 
              transform: [{ rotate: '0.2rad' }],
              width: dims.rocketSize,
              height: dims.rocketSize,
              justifyContent: 'center',
              alignItems: 'center',
            }
          ]}>
            {/* Main Body */}
            <View style={[
              styles.spaceshipBody,
              {
                width: dims.rocketSize,
                height: dims.rocketSize * 0.8,
                borderRadius: dims.rocketSize / 2,
                backgroundColor: '#4A90E2',
                borderWidth: 2,
                borderColor: '#357ABD',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 6,
              }
            ]}>
                              {/* Cockpit with glow */}
                <View style={[
                  styles.spaceshipCockpit,
                  {
                    top: dims.rocketSize * 0.1,
                    left: dims.rocketSize * 0.5 - dims.rocketSize * 0.2,
                    width: dims.rocketSize * 0.4,
                    height: dims.rocketSize * 0.3,
                    borderRadius: dims.rocketSize * 0.2,
                  }
                ]}>
                  <View style={[
                    styles.cockpitGlow,
                    {
                      top: -dims.rocketSize * 0.05,
                      left: -dims.rocketSize * 0.05,
                      right: -dims.rocketSize * 0.05,
                      bottom: -dims.rocketSize * 0.05,
                      borderRadius: dims.rocketSize * 0.25,
                    }
                  ]} />
                  <View style={[
                    styles.cockpitWindow,
                    {
                      top: dims.rocketSize * 0.1,
                      left: dims.rocketSize * 0.1,
                      width: dims.rocketSize * 0.2,
                      height: dims.rocketSize * 0.15,
                      borderRadius: dims.rocketSize * 0.1,
                    }
                  ]} />
                </View>
              
              {/* Wings */}
              <View style={[styles.spaceshipWings, {
                position: 'absolute',
                top: dims.rocketSize * 0.25,
                left: -dims.rocketSize * 0.2,
                width: dims.rocketSize * 1.4,
                height: dims.rocketSize * 0.27,
                backgroundColor: '#2E5C8A',
                borderRadius: dims.rocketSize * 0.13,
              }]}>
                <View style={[styles.wingLeft, {
                  position: 'absolute',
                  left: -dims.rocketSize * 0.27,
                  top: 0,
                  width: dims.rocketSize * 0.27,
                  height: dims.rocketSize * 0.27,
                  backgroundColor: '#1E3A5F',
                  borderRadius: dims.rocketSize * 0.07,
                }]} />
                <View style={[styles.wingRight, {
                  position: 'absolute',
                  right: -dims.rocketSize * 0.27,
                  top: 0,
                  width: dims.rocketSize * 0.27,
                  height: dims.rocketSize * 0.27,
                  backgroundColor: '#1E3A5F',
                  borderRadius: dims.rocketSize * 0.07,
                }]} />
              </View>
              
              {/* Engine with thrust effect */}
              <View style={[styles.spaceshipEngine, {
                position: 'absolute',
                bottom: -dims.rocketSize * 0.2,
                left: dims.rocketSize * 0.5 - dims.rocketSize * 0.2,
                width: dims.rocketSize * 0.4,
                height: dims.rocketSize * 0.33,
                borderRadius: dims.rocketSize * 0.2,
                backgroundColor: '#FF6B35',
                shadowColor: '#FF6B35',
                shadowOpacity: 0.8,
                shadowRadius: 4,
              }]}>
                <View style={[styles.engineGlow, {
                  top: -dims.rocketSize * 0.07,
                  left: -dims.rocketSize * 0.07,
                  right: -dims.rocketSize * 0.07,
                  bottom: -dims.rocketSize * 0.07,
                  borderRadius: dims.rocketSize * 0.27,
                  backgroundColor: 'rgba(255, 107, 53, 0.4)',
                }]} />
                <View style={[styles.thrustEffect, {
                  position: 'absolute',
                  bottom: -dims.rocketSize * 0.27,
                  left: dims.rocketSize * 0.07,
                  width: dims.rocketSize * 0.27,
                  height: dims.rocketSize * 0.2,
                  backgroundColor: '#FFD700',
                  borderRadius: dims.rocketSize * 0.1,
                  opacity: 0.8,
                }]} />
              </View>
              
              {/* Side panels */}
              <View style={[styles.sidePanelLeft, {
                position: 'absolute',
                left: -dims.rocketSize * 0.07,
                top: dims.rocketSize * 0.3,
                width: dims.rocketSize * 0.13,
                height: dims.rocketSize * 0.4,
                backgroundColor: '#357ABD',
                borderRadius: dims.rocketSize * 0.07,
              }]} />
              <View style={[styles.sidePanelRight, {
                position: 'absolute',
                right: -dims.rocketSize * 0.07,
                top: dims.rocketSize * 0.3,
                width: dims.rocketSize * 0.13,
                height: dims.rocketSize * 0.4,
                backgroundColor: '#357ABD',
                borderRadius: dims.rocketSize * 0.07,
              }]} />
              
              {/* Nose cone */}
              <View style={[styles.noseCone, {
                position: 'absolute',
                top: -dims.rocketSize * 0.13,
                left: dims.rocketSize * 0.5 - dims.rocketSize * 0.13,
                width: dims.rocketSize * 0.27,
                height: dims.rocketSize * 0.27,
                backgroundColor: '#FFD700',
                borderRadius: dims.rocketSize * 0.13,
                transform: [{ rotate: '45deg' }],
              }]} />
            </View>
          </View>
          
          {/* Tap to Play Text */}
          <Text style={[styles.tapToPlayText, { fontSize: dims.bodySize }]}>TAP TO PLAY</Text>
        </View>

        {/* High Score - Bottom */}
        <View style={[styles.scoreSection, { paddingVertical: dims.isTablet ? 16 : 12, paddingHorizontal: dims.isTablet ? 32 : 24 }]}>
          <Text style={[styles.scoreLabel, { fontSize: dims.smallSize }]}>BEST SCORE</Text>
          <Text style={[styles.scoreValue, { fontSize: dims.isTablet ? 36 : 24 }]}>{stats.bestScore}</Text>
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
    backgroundColor: '#0B0B2A', // Match game background color
    width: '100%',
    height: '100%',
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
    zIndex: 100,
  },
  tapToPlayText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 20,
    opacity: 0.7,
  },

}); 
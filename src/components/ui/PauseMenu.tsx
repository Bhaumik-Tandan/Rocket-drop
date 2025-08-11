import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/gameStore';
import { getResponsiveDimensions } from '../../utils/responsive';

export const PauseMenu: React.FC = () => {
  const { gameMode, isPaused, settings, stats, setGameMode, setPaused } = useGameStore();
  const [menuScale] = useState(new Animated.Value(0.8));
  const [menuOpacity] = useState(new Animated.Value(0));
  const dims = getResponsiveDimensions();

  useEffect(() => {
    if (isPaused) {
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
  }, [isPaused]);

  const handleResume = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPaused(false);
  };

  const handleSettings = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setGameMode('settings');
  };

  const handleQuit = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setPaused(false);
    setGameMode('menu');
  };

  if (!isPaused) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { opacity: menuOpacity }]}>
      <Animated.View style={[styles.menu, { transform: [{ scale: menuScale }], paddingVertical: dims.padding }]}>
        <Text style={[styles.title, { fontSize: dims.titleSize }]}>PAUSED</Text>
        
        {/* UFO Display */}
        <View style={styles.ufoContainer}>
          <View style={[styles.spaceship, { 
            width: dims.rocketSize, 
            height: dims.rocketSize,
            justifyContent: 'center',
            alignItems: 'center',
          }]}>
            <View style={[styles.spaceshipBody, {
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
            }]}>
              <View style={[styles.spaceshipCockpit, {
                top: dims.rocketSize * 0.1,
                left: dims.rocketSize * 0.5 - dims.rocketSize * 0.2,
                width: dims.rocketSize * 0.4,
                height: dims.rocketSize * 0.3,
                borderRadius: dims.rocketSize * 0.2,
              }]}>
                <View style={[styles.cockpitGlow, {
                  top: -dims.rocketSize * 0.05,
                  left: -dims.rocketSize * 0.05,
                  right: -dims.rocketSize * 0.05,
                  bottom: -dims.rocketSize * 0.05,
                  borderRadius: dims.rocketSize * 0.25,
                }]} />
                <View style={[styles.cockpitWindow, {
                  top: dims.rocketSize * 0.1,
                  left: dims.rocketSize * 0.1,
                  width: dims.rocketSize * 0.2,
                  height: dims.rocketSize * 0.15,
                  borderRadius: dims.rocketSize * 0.1,
                }]} />
              </View>
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
        </View>
        
        {/* Highest Score Display */}
        <View style={[styles.scoreContainer, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]}>
          <Text style={[styles.scoreLabel, { fontSize: dims.smallSize }]}>HIGHEST SCORE</Text>
          <Text style={[styles.scoreValue, { fontSize: dims.isTablet ? 32 : 24 }]}>{stats.bestScore}</Text>
        </View>
        
        <View style={[styles.buttonContainer, { gap: dims.isTablet ? 16 : 12 }]}>
          <TouchableOpacity style={[styles.button, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]} onPress={handleResume}>
            <Text style={[styles.buttonText, { fontSize: dims.bodySize }]}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]} onPress={handleSettings}>
            <Text style={[styles.buttonText, { fontSize: dims.bodySize }]}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.quitButton, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]} onPress={handleQuit}>
            <Text style={[styles.buttonText, { fontSize: dims.bodySize }]}>QUIT TO MENU</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.hint, { fontSize: dims.smallSize, marginTop: dims.isTablet ? 32 : 24 }]}>Double tap to pause/resume</Text>
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: 280,
    paddingHorizontal: 32,
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ufoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  spaceship: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipBody: {
    width: 40,
    height: 32,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
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
    top: 3,
    left: 20 - 10,
    width: 20,
    height: 15,
    borderRadius: 10,
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
    borderRadius: 12,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  cockpitWindow: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 12,
    height: 7,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  spaceshipWings: {
    position: 'absolute',
    top: 8,
    left: -8,
    width: 56,
    height: 10,
    backgroundColor: '#2E5C8A',
    borderRadius: 5,
  },
  wingLeft: {
    position: 'absolute',
    left: -10,
    top: 0,
    width: 10,
    height: 10,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  wingRight: {
    position: 'absolute',
    right: -10,
    top: 0,
    width: 10,
    height: 10,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  spaceshipEngine: {
    position: 'absolute',
    bottom: -8,
    left: 20 - 8,
    width: 16,
    height: 12,
    borderRadius: 8,
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
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 53, 0.4)',
  },
  thrustEffect: {
    position: 'absolute',
    bottom: -10,
    left: 3,
    width: 10,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    opacity: 0.8,
  },
  sidePanelLeft: {
    position: 'absolute',
    left: -3,
    top: 12,
    width: 6,
    height: 16,
    backgroundColor: '#357ABD',
    borderRadius: 3,
  },
  sidePanelRight: {
    position: 'absolute',
    right: -3,
    top: 12,
    width: 6,
    height: 16,
    backgroundColor: '#357ABD',
    borderRadius: 3,
  },
  noseCone: {
    position: 'absolute',
    top: -5,
    left: 20 - 5,
    width: 10,
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
  },
}); 
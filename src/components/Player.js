import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GAME_CONFIG } from '../utils/constants';

export default function Player({ y, isJumping, isSliding, activePowerUp }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: y.value },
        {
          scaleY: withSpring(isSliding.value ? 0.5 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const powerUpStyle = useAnimatedStyle(() => {
    if (activePowerUp) {
      return {
        opacity: withTiming(0.8, { duration: 200 }),
        transform: [
          {
            scale: withSpring(1.2, {
              damping: 10,
              stiffness: 100,
            }),
          },
        ],
      };
    }
    return {
      opacity: withTiming(1, { duration: 200 }),
      transform: [
        {
          scale: withSpring(1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  const getPlayerColor = () => {
    if (activePowerUp === 'magnet') {
      return GAME_CONFIG.COLORS.POWERUP_MAGNET;
    } else if (activePowerUp === 'slowTime') {
      return GAME_CONFIG.COLORS.POWERUP_SLOWTIME;
    }
    return GAME_CONFIG.COLORS.PLAYER;
  };

  return (
    <Animated.View
      style={[
        styles.player,
        animatedStyle,
        powerUpStyle,
        { backgroundColor: getPlayerColor() },
      ]}
    >
      {/* Helmet */}
      <View style={styles.helmet} />
      
      {/* Body */}
      <View style={styles.body} />
      
      {/* Arms */}
      <View style={styles.armLeft} />
      <View style={styles.armRight} />
      
      {/* Legs */}
      <View style={styles.legLeft} />
      <View style={styles.legRight} />
      
      {/* Jetpack effect when jumping */}
      {isJumping.value && (
        <View style={styles.jetpackEffect}>
          <View style={styles.flame1} />
          <View style={styles.flame2} />
        </View>
      )}
      
      {/* Power-up aura */}
      {activePowerUp && (
        <View style={[styles.powerUpAura, { borderColor: getPlayerColor() }]} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    left: GAME_CONFIG.PLAYER_START_X,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helmet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 5,
  },
  body: {
    width: 16,
    height: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'absolute',
    top: 20,
  },
  armLeft: {
    width: 6,
    height: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    position: 'absolute',
    left: 5,
    top: 25,
  },
  armRight: {
    width: 6,
    height: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    position: 'absolute',
    right: 5,
    top: 25,
  },
  legLeft: {
    width: 8,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    position: 'absolute',
    left: 8,
    bottom: 5,
  },
  legRight: {
    width: 8,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    position: 'absolute',
    right: 8,
    bottom: 5,
  },
  jetpackEffect: {
    position: 'absolute',
    right: -10,
    top: 15,
  },
  flame1: {
    width: 8,
    height: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    marginBottom: 2,
  },
  flame2: {
    width: 6,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  powerUpAura: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
}); 
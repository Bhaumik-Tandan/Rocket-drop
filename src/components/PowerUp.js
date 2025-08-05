import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { GAME_CONFIG } from '../utils/constants';

export default function PowerUp({ x, y, width, height, type }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Rotate continuously
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    // Pulse effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

    // Fade effect
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const getPowerUpStyle = () => {
    switch (type) {
      case 'magnet':
        return {
          backgroundColor: GAME_CONFIG.COLORS.POWERUP_MAGNET,
          borderColor: '#FFA500',
        };
      case 'slowTime':
        return {
          backgroundColor: GAME_CONFIG.COLORS.POWERUP_SLOWTIME,
          borderColor: '#00BFFF',
        };
      default:
        return {
          backgroundColor: GAME_CONFIG.COLORS.POWERUP_MAGNET,
          borderColor: '#FFA500',
        };
    }
  };

  const getPowerUpIcon = () => {
    switch (type) {
      case 'magnet':
        return (
          <View style={styles.magnetContainer}>
            <View style={styles.magnetLeft} />
            <View style={styles.magnetRight} />
            <View style={styles.magnetField} />
          </View>
        );
      case 'slowTime':
        return (
          <View style={styles.clockContainer}>
            <View style={styles.clockFace} />
            <View style={styles.clockHand1} />
            <View style={styles.clockHand2} />
            <View style={styles.clockCenter} />
          </View>
        );
      default:
        return <View style={styles.defaultIcon} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.powerUp,
        {
          left: x,
          top: y,
          width,
          height,
        },
        getPowerUpStyle(),
        animatedStyle,
      ]}
    >
      {getPowerUpIcon()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  powerUp: {
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Magnet power-up
  magnetContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  magnetLeft: {
    width: 8,
    height: 20,
    backgroundColor: '#FFA500',
    borderRadius: 4,
    position: 'absolute',
    left: 8,
  },
  magnetRight: {
    width: 8,
    height: 20,
    backgroundColor: '#FFA500',
    borderRadius: 4,
    position: 'absolute',
    right: 8,
  },
  magnetField: {
    width: 16,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
  },
  // Clock power-up
  clockContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockFace: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00BFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  clockHand1: {
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 6,
    left: 11,
  },
  clockHand2: {
    width: 2,
    height: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 8,
    left: 11,
    transform: [{ rotate: '90deg' }],
  },
  clockCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  // Default icon
  defaultIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 10,
  },
}); 
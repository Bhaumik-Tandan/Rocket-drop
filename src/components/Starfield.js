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

export default function Starfield() {
  const stars = Array.from({ length: GAME_CONFIG.STAR_COUNT }, (_, index) => ({
    id: index,
    x: useSharedValue(Math.random() * GAME_CONFIG.SCREEN_WIDTH),
    y: useSharedValue(Math.random() * GAME_CONFIG.SCREEN_HEIGHT),
    size: Math.random() * 3 + 1,
    opacity: useSharedValue(Math.random() * 0.8 + 0.2),
    speed: Math.random() * 2 + 0.5,
  }));

  useEffect(() => {
    stars.forEach((star, index) => {
      // Twinkle effect
      star.opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 2000 + index * 100 }),
          withTiming(1, { duration: 2000 + index * 100 })
        ),
        -1,
        false
      );

      // Move stars from right to left
      const moveStar = () => {
        star.x.value = withTiming(
          -10,
          { duration: (GAME_CONFIG.SCREEN_WIDTH / star.speed) * 1000 },
          () => {
            // Reset star position when it goes off screen
            star.x.value = GAME_CONFIG.SCREEN_WIDTH + 10;
            star.y.value = Math.random() * GAME_CONFIG.SCREEN_HEIGHT;
            moveStar();
          }
        );
      };

      moveStar();
    });
  }, []);

  return (
    <View style={styles.starfield}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
            },
            useAnimatedStyle(() => ({
              transform: [
                { translateX: star.x.value },
                { translateY: star.y.value },
              ],
              opacity: star.opacity.value,
            })),
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  star: {
    position: 'absolute',
    backgroundColor: GAME_CONFIG.COLORS.STAR,
  },
}); 
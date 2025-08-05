import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONFIG } from '../utils/constants';

export default function Platform({ x, y, width, height, type }) {
  const getPlatformStyle = () => {
    switch (type) {
      case 'planet':
        return {
          backgroundColor: '#8B4513',
          borderColor: '#654321',
        };
      case 'asteroid':
        return {
          backgroundColor: '#696969',
          borderColor: '#4A4A4A',
        };
      case 'spaceStation':
        return {
          backgroundColor: '#4682B4',
          borderColor: '#2F4F4F',
        };
      default:
        return {
          backgroundColor: '#8B4513',
          borderColor: '#654321',
        };
    }
  };

  const getPlatformDecoration = () => {
    switch (type) {
      case 'planet':
        return (
          <>
            <View style={styles.crater1} />
            <View style={styles.crater2} />
            <View style={styles.crater3} />
          </>
        );
      case 'asteroid':
        return (
          <>
            <View style={styles.asteroidBump1} />
            <View style={styles.asteroidBump2} />
          </>
        );
      case 'spaceStation':
        return (
          <>
            <View style={styles.light1} />
            <View style={styles.light2} />
            <View style={styles.light3} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.platform,
        {
          left: x,
          top: y,
          width,
          height,
        },
        getPlatformStyle(),
      ]}
    >
      {getPlatformDecoration()}
    </View>
  );
}

const styles = StyleSheet.create({
  platform: {
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Planet decorations
  crater1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#654321',
    position: 'absolute',
    left: 20,
    top: 6,
  },
  crater2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#654321',
    position: 'absolute',
    right: 30,
    top: 8,
  },
  crater3: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#654321',
    position: 'absolute',
    left: 60,
    top: 5,
  },
  // Asteroid decorations
  asteroidBump1: {
    width: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A4A4A',
    position: 'absolute',
    left: 25,
    top: 7,
  },
  asteroidBump2: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A4A4A',
    position: 'absolute',
    right: 40,
    top: 8,
  },
  // Space station decorations
  light1: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FF00',
    position: 'absolute',
    left: 15,
    top: 8,
  },
  light2: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF0000',
    position: 'absolute',
    right: 20,
    top: 8,
  },
  light3: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0000FF',
    position: 'absolute',
    left: 80,
    top: 8,
  },
}); 
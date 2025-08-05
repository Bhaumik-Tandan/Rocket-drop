import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONFIG } from '../utils/constants';

export default function Obstacle({ x, y, width, height, type }) {
  const getObstacleStyle = () => {
    switch (type) {
      case 'spike':
        return {
          backgroundColor: '#FF4444',
          borderColor: '#CC0000',
        };
      case 'satellite':
        return {
          backgroundColor: '#888888',
          borderColor: '#666666',
        };
      case 'asteroid':
        return {
          backgroundColor: '#8B4513',
          borderColor: '#654321',
        };
      default:
        return {
          backgroundColor: '#FF4444',
          borderColor: '#CC0000',
        };
    }
  };

  const getObstacleShape = () => {
    switch (type) {
      case 'spike':
        return (
          <View style={styles.spikeContainer}>
            <View style={styles.spikeBase} />
            <View style={styles.spikeTop} />
          </View>
        );
      case 'satellite':
        return (
          <View style={styles.satelliteContainer}>
            <View style={styles.satelliteBody} />
            <View style={styles.satellitePanel1} />
            <View style={styles.satellitePanel2} />
            <View style={styles.satelliteAntenna} />
          </View>
        );
      case 'asteroid':
        return (
          <View style={styles.asteroidContainer}>
            <View style={styles.asteroidBody} />
            <View style={styles.asteroidBump1} />
            <View style={styles.asteroidBump2} />
          </View>
        );
      default:
        return <View style={styles.defaultObstacle} />;
    }
  };

  return (
    <View
      style={[
        styles.obstacle,
        {
          left: x,
          top: y,
          width,
          height,
        },
        getObstacleStyle(),
      ]}
    >
      {getObstacleShape()}
    </View>
  );
}

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Spike obstacle
  spikeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spikeBase: {
    width: 20,
    height: 15,
    backgroundColor: '#CC0000',
    borderRadius: 2,
  },
  spikeTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF4444',
  },
  // Satellite obstacle
  satelliteContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  satelliteBody: {
    width: 20,
    height: 20,
    backgroundColor: '#666666',
    borderRadius: 10,
  },
  satellitePanel1: {
    width: 8,
    height: 12,
    backgroundColor: '#444444',
    position: 'absolute',
    left: -4,
    top: 4,
  },
  satellitePanel2: {
    width: 8,
    height: 12,
    backgroundColor: '#444444',
    position: 'absolute',
    right: -4,
    top: 4,
  },
  satelliteAntenna: {
    width: 2,
    height: 8,
    backgroundColor: '#666666',
    position: 'absolute',
    top: -4,
  },
  // Asteroid obstacle
  asteroidContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  asteroidBody: {
    width: 25,
    height: 25,
    backgroundColor: '#654321',
    borderRadius: 12,
  },
  asteroidBump1: {
    width: 8,
    height: 4,
    backgroundColor: '#4A4A4A',
    borderRadius: 2,
    position: 'absolute',
    left: 5,
    top: 8,
  },
  asteroidBump2: {
    width: 6,
    height: 3,
    backgroundColor: '#4A4A4A',
    borderRadius: 1.5,
    position: 'absolute',
    right: 8,
    bottom: 10,
  },
  // Default obstacle
  defaultObstacle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF4444',
  },
}); 
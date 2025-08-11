import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { FlightSimulatorProps } from '../types/FlightTypes';

const { width, height } = Dimensions.get('window');

const FlightSimulator: React.FC<FlightSimulatorProps> = ({ flightState, currentView, style }) => {
  const glRef = useRef<any>(null);

  useEffect(() => {
    if (glRef.current) {
      // Initialize 3D scene
      initializeScene();
    }
  }, []);

  const initializeScene = () => {
    // This would initialize Three.js scene
    // For now, we'll create a simple 3D view
  };

  const renderScene = (gl: any) => {
    // This would render the 3D aircraft and environment
    // For now, we'll show a placeholder

  };

  return (
    <View style={[styles.container, style]}>
      {/* 3D Scene - Temporarily disabled to prevent crashes */}
      <View style={styles.glView}>
        <Text style={styles.placeholderText}>3D View Loading...</Text>
      </View>
      
      {/* Camera View Overlay */}
      <View style={styles.viewOverlay}>
        <View style={styles.viewIndicator}>
          <View style={[styles.viewDot, currentView === 'cockpit' && styles.viewActive]} />
          <View style={[styles.viewDot, currentView === 'external' && styles.viewActive]} />
          <View style={[styles.viewDot, currentView === 'chase' && styles.viewActive]} />
        </View>
      </View>
      
      {/* Aircraft Status Overlay */}
      <View style={styles.statusOverlay}>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {currentView.toUpperCase()} VIEW
          </Text>
        </View>
        
        {currentView === 'cockpit' && (
          <View style={styles.cockpitOverlay}>
            {/* Artificial Horizon */}
            <View style={styles.horizon}>
              <View style={styles.horizonLine} />
              <View style={styles.horizonCenter} />
            </View>
            
            {/* Airspeed Indicator */}
            <View style={styles.airspeedIndicator}>
              <Text style={styles.airspeedText}>
                {Math.round(flightState.speed)}
              </Text>
              <Text style={styles.airspeedLabel}>KTS</Text>
            </View>
            
            {/* Altitude Indicator */}
            <View style={styles.altitudeIndicator}>
              <Text style={styles.altitudeText}>
                {Math.round(flightState.altitude)}
              </Text>
              <Text style={styles.altitudeLabel}>FT</Text>
            </View>
          </View>
        )}
        
        {currentView === 'external' && (
          <View style={styles.externalOverlay}>
            <Text style={styles.externalText}>
              EXTERNAL VIEW
            </Text>
            <Text style={styles.externalSubtext}>
              Aircraft visible from outside
            </Text>
          </View>
        )}
        
        {currentView === 'chase' && (
          <View style={styles.chaseOverlay}>
            <Text style={styles.chaseText}>
              CHASE VIEW
            </Text>
            <Text style={styles.chaseSubtext}>
              Following aircraft
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue
  },
  glView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  viewIndicator: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 10,
  },
  viewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#666',
    marginHorizontal: 5,
  },
  viewActive: {
    backgroundColor: '#00aaff',
  },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  statusRow: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cockpitOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  horizonLine: {
    width: 180,
    height: 2,
    backgroundColor: '#ffffff',
  },
  horizonCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff0000',
    position: 'absolute',
  },
  airspeedIndicator: {
    position: 'absolute',
    top: 50,
    left: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  airspeedText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  airspeedLabel: {
    color: '#cccccc',
    fontSize: 12,
  },
  altitudeIndicator: {
    position: 'absolute',
    top: 50,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  altitudeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  altitudeLabel: {
    color: '#cccccc',
    fontSize: 12,
  },
  externalOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  externalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  externalSubtext: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 5,
  },
  chaseOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  chaseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chaseSubtext: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 5,
  },
});

export default FlightSimulator; 
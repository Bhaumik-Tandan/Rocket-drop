import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CockpitControlsProps } from '../types/FlightTypes';
import ThrottleControl from './ThrottleControl';

const CockpitControls: React.FC<CockpitControlsProps> = ({
  flightState,
  onEngineStart,
  onEngineStop,
  onGearToggle,
  onFlapsToggle,
  onThrottleChange,
  onViewChange,
  style,
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
    >
      {/* Engine Controls */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>ENGINE</Text>
        
        <TouchableOpacity
          style={[styles.button, flightState.isEngineRunning ? styles.buttonActive : styles.buttonInactive]}
          onPress={flightState.isEngineRunning ? onEngineStop : onEngineStart}
        >
          <Text style={styles.buttonText}>
            {flightState.isEngineRunning ? 'STOP ENGINES' : 'START ENGINES'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.throttleContainer}>
          <ThrottleControl
            engine={1}
            value={flightState.engine1Throttle}
            onChange={onThrottleChange}
            style={styles.throttle}
          />
          <ThrottleControl
            engine={2}
            value={flightState.engine2Throttle}
            onChange={onThrottleChange}
            style={styles.throttle}
          />
        </View>
        
        <View style={styles.engineStatus}>
          <Text style={styles.statusText}>
            ENG 1: {Math.round(flightState.engine1RPM)} RPM
          </Text>
          <Text style={styles.statusText}>
            ENG 2: {Math.round(flightState.engine2RPM)} RPM
          </Text>
        </View>
      </View>
      
      {/* Landing Gear & Flaps */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>SYSTEMS</Text>
        
        <TouchableOpacity
          style={[styles.button, flightState.landingGear === 'DOWN' ? styles.buttonActive : styles.buttonInactive]}
          onPress={onGearToggle}
        >
          <Text style={styles.buttonText}>
            GEAR: {flightState.landingGear}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, flightState.flaps > 0 ? styles.buttonActive : styles.buttonInactive]}
          onPress={onFlapsToggle}
        >
          <Text style={styles.buttonText}>
            FLAPS: {flightState.flaps}°
          </Text>
        </TouchableOpacity>
        
        <View style={styles.systemStatus}>
          <Text style={styles.statusText}>
            SPEED: {Math.round(flightState.speed)} KTS
          </Text>
          <Text style={styles.statusText}>
            ALT: {Math.round(flightState.altitude)} FT
          </Text>
        </View>
      </View>
      
      {/* Camera Views */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>VIEWS</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => onViewChange('cockpit')}
        >
          <Text style={styles.buttonText}>COCKPIT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => onViewChange('external')}
        >
          <Text style={styles.buttonText}>EXTERNAL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => onViewChange('chase')}
        >
          <Text style={styles.buttonText}>CHASE</Text>
        </TouchableOpacity>
      </View>
      
      {/* Flight Mode */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>MODE</Text>
        
        <View style={styles.modeIndicator}>
          <Text style={[styles.modeText, flightState.isOnGround ? styles.modeActive : styles.modeInactive]}>
            GROUND
          </Text>
          <Text style={[styles.modeText, !flightState.isOnGround ? styles.modeActive : styles.modeInactive]}>
            AIRBORNE
          </Text>
        </View>
        
        <View style={styles.flightInfo}>
          <Text style={styles.infoText}>
            {flightState.isOnGround ? 'Ready for takeoff' : 'In flight'}
          </Text>
          <Text style={styles.infoText}>
            VS: {Math.round(flightState.verticalSpeed)} FPM
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  controlGroup: {
    marginRight: 20,
    minWidth: 120,
  },
  groupTitle: {
    color: '#00aaff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonActive: {
    backgroundColor: '#00aa00',
    borderColor: '#00ff00',
  },
  buttonInactive: {
    backgroundColor: '#333333',
    borderColor: '#666',
  },
  buttonSecondary: {
    backgroundColor: '#444444',
    borderColor: '#888',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  throttleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  throttle: {
    flex: 1,
    marginHorizontal: 5,
  },
  engineStatus: {
    marginTop: 5,
  },
  statusText: {
    color: '#cccccc',
    fontSize: 10,
    marginBottom: 2,
  },
  systemStatus: {
    marginTop: 5,
  },
  modeIndicator: {
    marginBottom: 10,
  },
  modeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    marginBottom: 5,
    borderRadius: 5,
  },
  modeActive: {
    backgroundColor: '#00aa00',
    color: '#ffffff',
  },
  modeInactive: {
    backgroundColor: '#333333',
    color: '#888888',
  },
  flightInfo: {
    marginTop: 5,
  },
  infoText: {
    color: '#cccccc',
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default CockpitControls; 
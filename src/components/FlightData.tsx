import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlightDataProps } from '../types/FlightTypes';

const FlightData: React.FC<FlightDataProps> = ({ flightState, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Primary Flight Data */}
      <View style={styles.primaryData}>
        <View style={styles.dataRow}>
          <Text style={styles.label}>ALT</Text>
          <Text style={styles.value}>{Math.round(flightState.altitude)}</Text>
          <Text style={styles.unit}>FT</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.label}>SPD</Text>
          <Text style={styles.value}>{Math.round(flightState.speed)}</Text>
          <Text style={styles.unit}>KTS</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.label}>HDG</Text>
          <Text style={styles.value}>{Math.round(flightState.heading)}</Text>
          <Text style={styles.unit}>°</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.label}>VS</Text>
          <Text style={[styles.value, flightState.verticalSpeed < 0 && styles.negative]}>
            {Math.round(flightState.verticalSpeed)}
          </Text>
          <Text style={styles.unit}>FPM</Text>
        </View>
      </View>
      
      {/* Engine Data */}
      <View style={styles.engineData}>
        <View style={styles.engineRow}>
          <Text style={styles.engineLabel}>ENG 1</Text>
          <Text style={styles.engineValue}>{Math.round(flightState.engine1RPM)}</Text>
          <Text style={styles.engineUnit}>RPM</Text>
        </View>
        
        <View style={styles.engineRow}>
          <Text style={styles.engineLabel}>ENG 2</Text>
          <Text style={styles.engineValue}>{Math.round(flightState.engine2RPM)}</Text>
          <Text style={styles.engineUnit}>RPM</Text>
        </View>
        
        <View style={styles.engineRow}>
          <Text style={styles.engineLabel}>TEMP 1</Text>
          <Text style={[styles.engineValue, flightState.engine1Temp > 100 && styles.warning]}>
            {Math.round(flightState.engine1Temp)}°C
          </Text>
        </View>
        
        <View style={styles.engineRow}>
          <Text style={styles.engineLabel}>TEMP 2</Text>
          <Text style={[styles.engineValue, flightState.engine2Temp > 100 && styles.warning]}>
            {Math.round(flightState.engine2Temp)}°C
          </Text>
        </View>
      </View>
      
      {/* System Status */}
      <View style={styles.systemStatus}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>GEAR</Text>
          <Text style={[styles.statusValue, flightState.landingGear === 'DOWN' ? styles.green : styles.red]}>
            {flightState.landingGear}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>FLAPS</Text>
          <Text style={styles.statusValue}>{flightState.flaps}°</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>ENGINE</Text>
          <Text style={[styles.statusValue, flightState.isEngineRunning ? styles.green : styles.red]}>
            {flightState.isEngineRunning ? 'RUNNING' : 'STOPPED'}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>MODE</Text>
          <Text style={[styles.statusValue, flightState.isOnGround ? styles.blue : styles.green]}>
            {flightState.isOnGround ? 'GROUND' : 'AIRBORNE'}
          </Text>
        </View>
      </View>
      
      {/* Position Data */}
      <View style={styles.positionData}>
        <Text style={styles.positionText}>
          LAT: {flightState.latitude.toFixed(4)}° N
        </Text>
        <Text style={styles.positionText}>
          LON: {flightState.longitude.toFixed(4)}° W
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  primaryData: {
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    color: '#00ff00',
    fontSize: 12,
    fontWeight: 'bold',
    width: 30,
  },
  value: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    minWidth: 50,
  },
  unit: {
    color: '#888888',
    fontSize: 10,
    marginLeft: 5,
  },
  negative: {
    color: '#ff4444',
  },
  engineData: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  engineLabel: {
    color: '#00aaff',
    fontSize: 11,
    fontWeight: 'bold',
    width: 40,
  },
  engineValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    minWidth: 50,
  },
  engineUnit: {
    color: '#888888',
    fontSize: 9,
    marginLeft: 5,
  },
  warning: {
    color: '#ffaa00',
  },
  systemStatus: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  statusLabel: {
    color: '#ffaa00',
    fontSize: 11,
    fontWeight: 'bold',
    width: 50,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  green: {
    color: '#00ff00',
  },
  red: {
    color: '#ff4444',
  },
  blue: {
    color: '#00aaff',
  },
  positionData: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  positionText: {
    color: '#cccccc',
    fontSize: 10,
    marginBottom: 2,
  },
});

export default FlightData; 
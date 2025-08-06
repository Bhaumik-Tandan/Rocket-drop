import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThrottleControlProps } from '../types/FlightTypes';

const ThrottleControl: React.FC<ThrottleControlProps> = ({ engine, value, onChange, style }) => {
  const handleThrottleChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(100, value + delta));
    onChange(engine, newValue);
  };

  const handleTap = () => {
    // Quick throttle adjustment
    if (value < 50) {
      onChange(engine, 100);
    } else {
      onChange(engine, 0);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>ENG {engine}</Text>
      
      {/* Throttle Lever */}
      <View style={styles.throttleContainer}>
        <View style={styles.throttleTrack}>
          <View 
            style={[
              styles.throttleLever, 
              { 
                height: `${value}%`,
                backgroundColor: value > 80 ? '#ff4444' : value > 50 ? '#ffaa00' : '#00aa00'
              }
            ]} 
          />
        </View>
        
        {/* Throttle Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.throttleButton}
            onPress={() => handleThrottleChange(10)}
            onLongPress={() => handleThrottleChange(25)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.throttleButton}
            onPress={() => handleThrottleChange(-10)}
            onLongPress={() => handleThrottleChange(-25)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Throttle Value Display */}
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{Math.round(value)}%</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => onChange(engine, 0)}
        >
          <Text style={styles.resetText}>IDLE</Text>
        </TouchableOpacity>
      </View>
      
      {/* Quick Access Buttons */}
      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={[styles.quickButton, value === 0 && styles.quickButtonActive]}
          onPress={() => onChange(engine, 0)}
        >
          <Text style={styles.quickButtonText}>0%</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickButton, value === 50 && styles.quickButtonActive]}
          onPress={() => onChange(engine, 50)}
        >
          <Text style={styles.quickButtonText}>50%</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickButton, value === 100 && styles.quickButtonActive]}
          onPress={() => onChange(engine, 100)}
        >
          <Text style={styles.quickButtonText}>100%</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  label: {
    color: '#00aaff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  throttleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  throttleTrack: {
    width: 20,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  throttleLever: {
    width: '100%',
    backgroundColor: '#00aa00',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  throttleButton: {
    width: 30,
    height: 30,
    backgroundColor: '#444',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#666',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resetText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: '#00aa00',
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ThrottleControl; 
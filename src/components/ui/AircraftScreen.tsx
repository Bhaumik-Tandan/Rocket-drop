import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { gameStateManager, GameState, Aircraft } from '../../utils/gameState';

const availableAircraft: Aircraft[] = [
  {
    id: 'cessna-172',
    name: 'Cessna 172',
    type: 'trainer',
    stats: {
      maxSpeed: 120,
      maxAltitude: 14000,
      maneuverability: 70,
      stability: 90,
      fuelCapacity: 100,
    },
    unlocked: true,
    mastery: 0,
  },
  {
    id: 'f-16',
    name: 'F-16 Fighting Falcon',
    type: 'fighter',
    stats: {
      maxSpeed: 1500,
      maxAltitude: 50000,
      maneuverability: 95,
      stability: 60,
      fuelCapacity: 80,
    },
    unlocked: false,
    mastery: 0,
  },
  {
    id: 'boeing-747',
    name: 'Boeing 747',
    type: 'commercial',
    stats: {
      maxSpeed: 570,
      maxAltitude: 45000,
      maneuverability: 40,
      stability: 95,
      fuelCapacity: 150,
    },
    unlocked: false,
    mastery: 0,
  },
  {
    id: 'apache',
    name: 'Apache Helicopter',
    type: 'helicopter',
    stats: {
      maxSpeed: 200,
      maxAltitude: 21000,
      maneuverability: 85,
      stability: 50,
      fuelCapacity: 90,
    },
    unlocked: false,
    mastery: 0,
  },
];

export const AircraftScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleBack = () => {
    gameStateManager.setGameMode('menu');
  };

  const selectAircraft = (aircraft: Aircraft) => {
    if (aircraft.unlocked) {
      gameStateManager.setState({ currentAircraft: aircraft });
    }
  };

  const getAircraftIcon = (type: string) => {
    switch (type) {
      case 'trainer': return '✈️';
      case 'fighter': return '🛩️';
      case 'commercial': return '🛫';
      case 'helicopter': return '🚁';
      default: return '✈️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trainer': return '#00D4AA';
      case 'fighter': return '#FF4757';
      case 'commercial': return '#FFA502';
      case 'helicopter': return '#74B9FF';
      default: return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AIRCRAFT</Text>
      </View>

      <ScrollView style={styles.aircraftList} showsVerticalScrollIndicator={false}>
        {availableAircraft.map((aircraft) => (
          <TouchableOpacity
            key={aircraft.id}
            style={[
              styles.aircraftCard,
              gameState.currentAircraft?.id === aircraft.id && styles.selectedAircraft,
              !aircraft.unlocked && styles.lockedAircraft,
            ]}
            onPress={() => selectAircraft(aircraft)}
            disabled={!aircraft.unlocked}
          >
            <View style={styles.aircraftHeader}>
              <Text style={styles.aircraftIcon}>{getAircraftIcon(aircraft.type)}</Text>
              <View style={styles.aircraftInfo}>
                <Text style={styles.aircraftName}>{aircraft.name}</Text>
                <Text style={[styles.aircraftType, { color: getTypeColor(aircraft.type) }]}>
                  {aircraft.type.toUpperCase()}
                </Text>
              </View>
              {!aircraft.unlocked && (
                <View style={styles.lockIcon}>
                  <Text style={styles.lockText}>🔒</Text>
                </View>
              )}
              {gameState.currentAircraft?.id === aircraft.id && (
                <View style={styles.selectedIcon}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Speed</Text>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statFill, 
                      { 
                        width: `${(aircraft.stats.maxSpeed / 1500) * 100}%`,
                        backgroundColor: getTypeColor(aircraft.type)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.statValue}>{aircraft.stats.maxSpeed}</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Maneuverability</Text>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statFill, 
                      { 
                        width: `${aircraft.stats.maneuverability}%`,
                        backgroundColor: getTypeColor(aircraft.type)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.statValue}>{aircraft.stats.maneuverability}</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Stability</Text>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statFill, 
                      { 
                        width: `${aircraft.stats.stability}%`,
                        backgroundColor: getTypeColor(aircraft.type)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.statValue}>{aircraft.stats.stability}</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Fuel</Text>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statFill, 
                      { 
                        width: `${(aircraft.stats.fuelCapacity / 150) * 100}%`,
                        backgroundColor: getTypeColor(aircraft.type)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.statValue}>{aircraft.stats.fuelCapacity}</Text>
              </View>
            </View>

            {!aircraft.unlocked && (
              <View style={styles.unlockInfo}>
                <Text style={styles.unlockText}>Unlock at Level 5</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    marginLeft: 20,
    letterSpacing: 2,
  },
  aircraftList: {
    flex: 1,
  },
  aircraftCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedAircraft: {
    borderColor: '#00D4AA',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
  },
  lockedAircraft: {
    opacity: 0.5,
  },
  aircraftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aircraftIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  aircraftInfo: {
    flex: 1,
  },
  aircraftName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aircraftType: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
  },
  lockIcon: {
    marginLeft: 8,
  },
  lockText: {
    fontSize: 20,
  },
  selectedIcon: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    width: 80,
    fontSize: 12,
    color: '#888888',
    fontWeight: '400',
  },
  statBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    width: 40,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'right',
  },
  unlockInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  unlockText: {
    fontSize: 12,
    color: '#FFA502',
    textAlign: 'center',
    fontWeight: '400',
  },
}); 
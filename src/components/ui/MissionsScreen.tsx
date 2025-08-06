import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { gameStateManager, GameState } from '../../utils/gameState';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'training' | 'navigation' | 'landing' | 'aerobatic' | 'rescue';
  difficulty: number;
  requiredLevel: number;
  reward: number;
  completed: boolean;
  bestTime?: number;
}

interface MissionsScreenProps {
  onStartMission: (missionId: string) => void;
}

const availableMissions: Mission[] = [
  {
    id: 'training-1',
    title: 'Basic Flight Training',
    description: 'Learn the basics of flight control',
    type: 'training',
    difficulty: 1,
    requiredLevel: 1,
    reward: 50,
    completed: false,
  },
  {
    id: 'navigation-1',
    title: 'Navigation Challenge',
    description: 'Navigate through waypoints',
    type: 'navigation',
    difficulty: 2,
    requiredLevel: 2,
    reward: 100,
    completed: false,
  },
  {
    id: 'landing-1',
    title: 'Precision Landing',
    description: 'Land safely on target zone',
    type: 'landing',
    difficulty: 3,
    requiredLevel: 3,
    reward: 150,
    completed: false,
  },
  {
    id: 'aerobatic-1',
    title: 'Aerobatic Maneuvers',
    description: 'Perform advanced flight maneuvers',
    type: 'aerobatic',
    difficulty: 4,
    requiredLevel: 5,
    reward: 200,
    completed: false,
  },
  {
    id: 'rescue-1',
    title: 'Rescue Mission',
    description: 'Rescue stranded pilots',
    type: 'rescue',
    difficulty: 5,
    requiredLevel: 7,
    reward: 300,
    completed: false,
  },
];

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ onStartMission }) => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleBack = () => {
    gameStateManager.setGameMode('menu');
  };

  const startMission = (mission: Mission) => {
    if (gameState.level >= mission.requiredLevel) {
      onStartMission(mission.id);
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'training': return '🎓';
      case 'navigation': return '🧭';
      case 'landing': return '🛬';
      case 'aerobatic': return '🔄';
      case 'rescue': return '🚁';
      default: return '🎯';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#00D4AA';
      case 2: return '#FFA502';
      case 3: return '#FF6B35';
      case 4: return '#FF4757';
      case 5: return '#8B0000';
      default: return '#FFFFFF';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'EASY';
      case 2: return 'MEDIUM';
      case 3: return 'HARD';
      case 4: return 'EXPERT';
      case 5: return 'MASTER';
      default: return 'UNKNOWN';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>MISSIONS</Text>
      </View>

      <ScrollView style={styles.missionsList} showsVerticalScrollIndicator={false}>
        {availableMissions.map((mission) => {
          const isUnlocked = gameState.level >= mission.requiredLevel;
          const isCompleted = mission.completed;
          
          return (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionCard,
                isCompleted && styles.completedMission,
                !isUnlocked && styles.lockedMission,
              ]}
              onPress={() => startMission(mission)}
              disabled={!isUnlocked}
            >
              <View style={styles.missionHeader}>
                <Text style={styles.missionIcon}>{getMissionIcon(mission.type)}</Text>
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDescription}>{mission.description}</Text>
                </View>
                <View style={styles.missionStatus}>
                  {isCompleted && (
                    <View style={styles.completedIcon}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                  {!isUnlocked && (
                    <View style={styles.lockIcon}>
                      <Text style={styles.lockText}>🔒</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.missionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Difficulty</Text>
                  <Text style={[styles.detailValue, { color: getDifficultyColor(mission.difficulty) }]}>
                    {getDifficultyText(mission.difficulty)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Required Level</Text>
                  <Text style={[styles.detailValue, { color: isUnlocked ? '#00D4AA' : '#FF4757' }]}>
                    {mission.requiredLevel}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reward</Text>
                  <Text style={[styles.detailValue, { color: '#FFD700' }]}>
                    {mission.reward} XP
                  </Text>
                </View>

                {mission.bestTime && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Best Time</Text>
                    <Text style={[styles.detailValue, { color: '#00D4AA' }]}>
                      {Math.round(mission.bestTime / 1000)}s
                    </Text>
                  </View>
                )}
              </View>

              {!isUnlocked && (
                <View style={styles.unlockInfo}>
                  <Text style={styles.unlockText}>Unlock at Level {mission.requiredLevel}</Text>
                </View>
              )}

              {isUnlocked && !isCompleted && (
                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>START MISSION</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  missionsList: {
    flex: 1,
  },
  missionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedMission: {
    borderColor: '#00D4AA',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
  },
  lockedMission: {
    opacity: 0.5,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '300',
  },
  missionStatus: {
    marginLeft: 8,
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockIcon: {
    marginLeft: 8,
  },
  lockText: {
    fontSize: 20,
  },
  missionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
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
  startButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
}); 
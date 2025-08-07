import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { gameStateManager, GameState } from '../../utils/gameState';

export const SettingsScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  const handleBack = () => {
    gameStateManager.setGameMode('menu');
  };

  const toggleSound = (value: boolean) => {
    gameStateManager.updateSettings({ soundEnabled: value });
  };

  const toggleMusic = (value: boolean) => {
    gameStateManager.updateSettings({ musicEnabled: value });
  };

  const toggleHaptics = (value: boolean) => {
    gameStateManager.updateSettings({ hapticsEnabled: value });
  };

  // Removed difficulty and graphics settings - keeping it simple

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUDIO</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={gameState.settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#333333', true: '#00D4AA' }}
              thumbColor={gameState.settings.soundEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Background Music</Text>
            <Switch
              value={gameState.settings.musicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: '#333333', true: '#00D4AA' }}
              thumbColor={gameState.settings.musicEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={gameState.settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#333333', true: '#00D4AA' }}
              thumbColor={gameState.settings.hapticsEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>
        </View>

        {/* Simple Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME INFO</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🚀 Space Drop - Free Play</Text>
            <Text style={styles.infoText}>Tap to fly through the gaps!</Text>
            <Text style={styles.infoText}>Avoid the green pipes and get the highest score!</Text>
          </View>
        </View>
      </View>
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
    marginBottom: 40,
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
  settingsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00D4AA',
    marginBottom: 20,
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 18,
    color: '#00D4AA',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 6,
  },
}); 
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

  const setDifficulty = (difficulty: 'easy' | 'normal' | 'hard') => {
    gameStateManager.updateSettings({ difficulty });
  };

  const setGraphicsQuality = (quality: 'low' | 'medium' | 'high') => {
    gameStateManager.updateSettings({ graphicsQuality: quality });
  };

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

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Difficulty</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.difficultyButton, 
                  gameState.settings.difficulty === 'easy' && styles.activeButton
                ]} 
                onPress={() => setDifficulty('easy')}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  gameState.settings.difficulty === 'easy' && styles.activeButtonText
                ]}>EASY</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.difficultyButton, 
                  gameState.settings.difficulty === 'normal' && styles.activeButton
                ]} 
                onPress={() => setDifficulty('normal')}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  gameState.settings.difficulty === 'normal' && styles.activeButtonText
                ]}>NORMAL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.difficultyButton, 
                  gameState.settings.difficulty === 'hard' && styles.activeButton
                ]} 
                onPress={() => setDifficulty('hard')}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  gameState.settings.difficulty === 'hard' && styles.activeButtonText
                ]}>HARD</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Graphics Quality</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.qualityButton, 
                  gameState.settings.graphicsQuality === 'low' && styles.activeButton
                ]} 
                onPress={() => setGraphicsQuality('low')}
              >
                <Text style={[
                  styles.qualityButtonText,
                  gameState.settings.graphicsQuality === 'low' && styles.activeButtonText
                ]}>LOW</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.qualityButton, 
                  gameState.settings.graphicsQuality === 'medium' && styles.activeButton
                ]} 
                onPress={() => setGraphicsQuality('medium')}
              >
                <Text style={[
                  styles.qualityButtonText,
                  gameState.settings.graphicsQuality === 'medium' && styles.activeButtonText
                ]}>MED</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.qualityButton, 
                  gameState.settings.graphicsQuality === 'high' && styles.activeButton
                ]} 
                onPress={() => setGraphicsQuality('high')}
              >
                <Text style={[
                  styles.qualityButtonText,
                  gameState.settings.graphicsQuality === 'high' && styles.activeButtonText
                ]}>HIGH</Text>
              </TouchableOpacity>
            </View>
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyButtonText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '400',
  },
  qualityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  qualityButtonText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '400',
  },
  activeButton: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useGameStore } from '../../store/gameStore';

export const SettingsScreen: React.FC = () => {
  const { settings, setGameMode, updateSettings } = useGameStore();

  const handleBack = () => {
    setGameMode('menu');
  };

  const toggleSound = (value: boolean) => {
    updateSettings({ soundEnabled: value });
  };

  const toggleHaptics = (value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  };

  // Removed difficulty and graphics settings - keeping it simple

  return (
    <View style={styles.container}>
      {/* Transparent overlay background */}
      <View style={styles.overlay} />
      
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
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#333333', true: '#00D4AA' }}
              thumbColor={settings.soundEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>

          {/* Background music switch removed */}

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#333333', true: '#00D4AA' }}
              thumbColor={settings.hapticsEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>
        </View>

        {/* Game Controls section removed */}


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 24,
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
    paddingVertical: 18,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
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
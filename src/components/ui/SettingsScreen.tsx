import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { getResponsiveDimensions } from '../../utils/responsive';

export const SettingsScreen: React.FC = () => {
  const { gameMode, settings, setGameMode, updateSettings } = useGameStore();
  const dims = getResponsiveDimensions();

  const handleBack = () => {
    setGameMode('menu');
  };

  const toggleSound = (value: boolean) => {
    updateSettings({ ...settings, soundEnabled: value });
  };

  const toggleHaptics = (value: boolean) => {
    updateSettings({ ...settings, hapticsEnabled: value });
  };

  if (gameMode !== 'settings') {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { paddingVertical: dims.padding }]}>
        <Text style={[styles.title, { fontSize: dims.titleSize }]}>SETTINGS</Text>
        
        <View style={[styles.settingsContainer, { gap: dims.isTablet ? 16 : 12 }]}>
          <View style={[styles.settingRow, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]}>
            <Text style={[styles.settingLabel, { fontSize: dims.bodySize }]}>SOUND</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(74, 144, 226, 0.5)' }}
              thumbColor={settings.soundEnabled ? '#4A90E2' : 'rgba(255, 255, 255, 0.3)'}
            />
          </View>

          <View style={[styles.settingRow, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]}>
            <Text style={[styles.settingLabel, { fontSize: dims.bodySize }]}>HAPTICS</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(74, 144, 226, 0.5)' }}
              thumbColor={settings.hapticsEnabled ? '#4A90E2' : 'rgba(255, 255, 255, 0.3)'}
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.backButton, { paddingVertical: dims.isTablet ? 20 : 16, paddingHorizontal: dims.isTablet ? 32 : 24 }]} onPress={handleBack}>
          <Text style={[styles.backButtonText, { fontSize: dims.bodySize }]}>BACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: 280,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 4,
  },
  settingsContainer: {
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  settingRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { gameStateManager } from '../../utils/gameState';

export const LevelGuide: React.FC = () => {
  const handleBack = () => {
    gameStateManager.setGameMode('menu');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HOW TO LEVEL UP</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 EXPERIENCE POINTS (XP)</Text>
          <Text style={styles.description}>
            You earn XP by playing the game and performing various actions. Here's how to gain XP:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 FLYING</Text>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+0.1 XP</Text>
            <Text style={styles.xpDescription}>Per frame while flying (continuous)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⛽ FUEL COLLECTION</Text>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+15 XP</Text>
            <Text style={styles.xpDescription}>Each fuel canister collected</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💥 SURVIVAL BONUS</Text>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+10 XP</Text>
            <Text style={styles.xpDescription}>Base survival bonus when you crash</Text>
          </View>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+5 XP/second</Text>
            <Text style={styles.xpDescription}>Additional bonus for each second survived</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 GAME OVER BONUSES</Text>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+5 XP</Text>
            <Text style={styles.xpDescription}>Running out of fuel</Text>
          </View>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+2 XP/second</Text>
            <Text style={styles.xpDescription}>Fuel management bonus</Text>
          </View>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+8 XP</Text>
            <Text style={styles.xpDescription}>Hitting screen boundaries</Text>
          </View>
          <View style={styles.xpItem}>
            <Text style={styles.xpAmount}>+3 XP/second</Text>
            <Text style={styles.xpDescription}>Boundary awareness bonus</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 LEVEL PROGRESSION</Text>
          <View style={styles.levelItem}>
            <Text style={styles.levelNumber}>Level 1 → 2</Text>
            <Text style={styles.levelXP}>100 XP required</Text>
          </View>
          <View style={styles.levelItem}>
            <Text style={styles.levelNumber}>Level 2 → 3</Text>
            <Text style={styles.levelXP}>150 XP required</Text>
          </View>
          <View style={styles.levelItem}>
            <Text style={styles.levelNumber}>Level 3 → 4</Text>
            <Text style={styles.levelXP}>225 XP required</Text>
          </View>
          <View style={styles.levelItem}>
            <Text style={styles.levelNumber}>Level 4 → 5</Text>
            <Text style={styles.levelXP}>337 XP required</Text>
          </View>
          <Text style={styles.note}>
            Each level requires 1.5x more XP than the previous level
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔓 UNLOCKS</Text>
          <View style={styles.unlockItem}>
            <Text style={styles.unlockLevel}>Level 2</Text>
            <Text style={styles.unlockDescription}>Navigation Challenge Mission</Text>
          </View>
          <View style={styles.unlockItem}>
            <Text style={styles.unlockLevel}>Level 3</Text>
            <Text style={styles.unlockDescription}>Precision Landing Mission</Text>
          </View>
          <View style={styles.unlockItem}>
            <Text style={styles.unlockLevel}>Level 5</Text>
            <Text style={styles.unlockDescription}>F-16 Fighter Aircraft + Aerobatic Mission</Text>
          </View>
          <View style={styles.unlockItem}>
            <Text style={styles.unlockLevel}>Level 7</Text>
            <Text style={styles.unlockDescription}>Rescue Mission</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 LEVEL DIFFERENCES</Text>
          <View style={styles.levelDiffItem}>
            <Text style={styles.levelDiffTitle}>Level 1-2: NORMAL</Text>
            <Text style={styles.levelDiffDesc}>• Standard meteor speed and spawn rate</Text>
            <Text style={styles.levelDiffDesc}>• Normal fuel consumption</Text>
            <Text style={styles.levelDiffDesc}>• Orange meteors</Text>
          </View>
          
          <View style={styles.levelDiffItem}>
            <Text style={styles.levelDiffTitle}>Level 3-4: HARD</Text>
            <Text style={styles.levelDiffDesc}>• 30% faster meteors and more spawns</Text>
            <Text style={styles.levelDiffDesc}>• Increased fuel consumption</Text>
            <Text style={styles.levelDiffDesc}>• Bigger meteors and fuel canisters</Text>
            <Text style={styles.levelDiffDesc}>• Darker orange meteors</Text>
          </View>
          
          <View style={styles.levelDiffItem}>
            <Text style={styles.levelDiffTitle}>Level 5+: EXTREME</Text>
            <Text style={styles.levelDiffDesc}>• 50% faster meteors and many more spawns</Text>
            <Text style={styles.levelDiffDesc}>• Much faster fuel consumption</Text>
            <Text style={styles.levelDiffDesc}>• Multiple meteors spawn at once</Text>
            <Text style={styles.levelDiffDesc}>• Red meteors (more dangerous)</Text>
            <Text style={styles.levelDiffDesc}>• Bigger fuel rewards</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 TIPS FOR FAST LEVELING</Text>
          <Text style={styles.tip}>• Collect as many fuel canisters as possible</Text>
          <Text style={styles.tip}>• Survive longer to get bigger bonuses</Text>
          <Text style={styles.tip}>• Play frequently - XP adds up quickly</Text>
          <Text style={styles.tip}>• Try to avoid crashing early</Text>
          <Text style={styles.tip}>• Complete missions for bonus XP</Text>
          <Text style={styles.tip}>• Higher levels give more XP per action</Text>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00D4AA',
    marginBottom: 12,
    letterSpacing: 1,
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 8,
  },
  xpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  xpAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  xpDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
    marginLeft: 12,
  },
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  levelXP: {
    fontSize: 14,
    color: '#FFA502',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  unlockLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
    width: 80,
  },
  unlockDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  tip: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 6,
    paddingLeft: 8,
  },
  levelDiffItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelDiffTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
    marginBottom: 8,
  },
  levelDiffDesc: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 4,
    paddingLeft: 8,
  },
}); 
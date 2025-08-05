import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GAME_CONFIG } from '../utils/constants';

export default function GameUI({
  score,
  highScore,
  gameState,
  onRestart,
  activePowerUp,
}) {
  const formatScore = (score) => {
    return score.toString().padStart(6, '0');
  };

  const getPowerUpText = () => {
    switch (activePowerUp) {
      case 'magnet':
        return 'MAGNET ACTIVE';
      case 'slowTime':
        return 'TIME SLOWED';
      default:
        return '';
    }
  };

  const getPowerUpColor = () => {
    switch (activePowerUp) {
      case 'magnet':
        return GAME_CONFIG.COLORS.POWERUP_MAGNET;
      case 'slowTime':
        return GAME_CONFIG.COLORS.POWERUP_SLOWTIME;
      default:
        return GAME_CONFIG.COLORS.UI_TEXT;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top UI */}
      <View style={styles.topUI}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{formatScore(score)}</Text>
        </View>
        
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>BEST</Text>
          <Text style={styles.highScoreValue}>{formatScore(highScore)}</Text>
        </View>
      </View>

      {/* Power-up indicator */}
      {activePowerUp && (
        <View style={styles.powerUpIndicator}>
          <Text style={[styles.powerUpText, { color: getPowerUpColor() }]}>
            {getPowerUpText()}
          </Text>
        </View>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
            <Text style={styles.finalScore}>Final Score: {formatScore(score)}</Text>
            {score >= highScore && (
              <Text style={styles.newRecord}>NEW RECORD!</Text>
            )}
            <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
              <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Instructions */}
      {gameState === 'playing' && score < 100 && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>TAP TO JUMP</Text>
          <Text style={styles.instructionText}>SWIPE DOWN TO SLIDE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topUI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreValue: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 24,
    fontWeight: 'bold',
  },
  highScoreContainer: {
    alignItems: 'center',
  },
  highScoreLabel: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  highScoreValue: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  powerUpIndicator: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  powerUpText: {
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    backgroundColor: GAME_CONFIG.COLORS.UI_BACKGROUND,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GAME_CONFIG.COLORS.UI_TEXT,
  },
  gameOverTitle: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 18,
    marginBottom: 10,
  },
  newRecord: {
    color: GAME_CONFIG.COLORS.POWERUP_MAGNET,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: GAME_CONFIG.COLORS.PLAYER,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: GAME_CONFIG.COLORS.UI_TEXT,
  },
  restartButtonText: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: GAME_CONFIG.COLORS.UI_TEXT,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getResponsiveDimensions } from '../../utils/responsive';

interface HUDProps {
  score: number;
  distance: number;
  timeElapsed: number;
  combo: number;
  boost: number;
  shield: number;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  distance,
  timeElapsed,
  combo,
  boost,
  shield,
}) => {
  const dims = getResponsiveDimensions();
  

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={[styles.topHUD, { padding: dims.hudPadding, paddingTop: dims.hudTopPadding }]}>
        <View style={[styles.hudBox, { padding: dims.isTablet ? 16 : 12, minWidth: dims.isTablet ? 100 : 70 }]}>
          <Text style={[styles.label, { fontSize: dims.smallSize }]}>SCORE</Text>
          <Text style={[styles.value, { color: '#FFD700', fontSize: dims.isTablet ? 20 : 14 }]}>{score}</Text>
        </View>

        <View style={[styles.hudBox, { padding: dims.isTablet ? 16 : 12, minWidth: dims.isTablet ? 100 : 70 }]}>
          <Text style={[styles.label, { fontSize: dims.smallSize }]}>DISTANCE</Text>
          <Text style={[styles.value, { fontSize: dims.isTablet ? 20 : 14 }]}>{Math.floor(distance)}</Text>
        </View>

        <View style={[styles.hudBox, { padding: dims.isTablet ? 16 : 12, minWidth: dims.isTablet ? 100 : 70 }]}>
          <Text style={[styles.label, { fontSize: dims.smallSize }]}>TIME</Text>
          <Text style={[styles.value, { fontSize: dims.isTablet ? 20 : 14 }]}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Power-up indicators */}
      <View style={[styles.powerUpHUD, { right: dims.hudPadding, top: dims.isTablet ? 160 : 120 }]}>
        {combo > 1 && (
          <View style={[styles.comboBox, { paddingHorizontal: dims.isTablet ? 16 : 12, paddingVertical: dims.isTablet ? 8 : 6 }]}>
            <Text style={[styles.comboText, { fontSize: dims.isTablet ? 16 : 12 }]}>COMBO x{combo}</Text>
          </View>
        )}
        
        {boost > 0 && (
          <View style={[styles.boostBox, { padding: dims.isTablet ? 12 : 8, minWidth: dims.isTablet ? 120 : 80 }]}>
            <Text style={[styles.powerUpText, { fontSize: dims.isTablet ? 14 : 10 }]}>🔥 BOOST</Text>
            <View style={[styles.powerUpBar, { width: dims.isTablet ? 80 : 60, height: dims.isTablet ? 6 : 4 }]}>
              <View style={[styles.powerUpFill, { width: `${(boost / 180) * 100}%`, backgroundColor: '#FF4500' }]} />
            </View>
          </View>
        )}
        
        {shield > 0 && (
          <View style={[styles.shieldBox, { padding: dims.isTablet ? 12 : 8, minWidth: dims.isTablet ? 120 : 80 }]}>
            <Text style={[styles.powerUpText, { fontSize: dims.isTablet ? 14 : 10 }]}>🛡️ SHIELD</Text>
            <View style={[styles.powerUpBar, { width: dims.isTablet ? 80 : 60, height: dims.isTablet ? 6 : 4 }]}>
              <View style={[styles.powerUpFill, { width: `${(shield / 300) * 100}%`, backgroundColor: '#00FF00' }]} />
            </View>
          </View>
        )}
      </View>

      {/* Bottom HUD */}
      <View style={[styles.bottomHUD, { bottom: dims.isTablet ? 80 : 60 }]}>
        <Text style={[styles.hint, { fontSize: dims.isTablet ? 16 : 12 }]}>Tap to thrust • Long press to pause</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  topHUD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  powerUpHUD: {
    position: 'absolute',
    right: 20,
    top: 120,
    gap: 8,
    alignItems: 'flex-end',
  },
  comboBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  comboText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  boostBox: {
    backgroundColor: 'rgba(255, 69, 0, 0.9)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4500',
    alignItems: 'center',
    minWidth: 80,
  },
  shieldBox: {
    backgroundColor: 'rgba(0, 255, 0, 0.9)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00FF00',
    alignItems: 'center',
    minWidth: 80,
  },
  powerUpText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  powerUpBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  powerUpFill: {
    height: '100%',
    borderRadius: 2,
  },
  bottomHUD: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  hudBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: 70,
    // backdropFilter: 'blur(10px)', // Not supported in React Native
  },
  label: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  hint: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    letterSpacing: 0.5,
    fontWeight: '300',
  },

}); 
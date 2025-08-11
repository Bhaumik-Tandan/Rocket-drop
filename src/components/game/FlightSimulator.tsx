import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated, Text, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { playClick, playPassed, setAudioEnabled } from '../../utils/audio';
import { useGameStore } from '../../store/gameStore';
import { HUD } from '../ui/HUD';
import { PauseMenu } from '../ui/PauseMenu';
import { getResponsiveDimensions } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

// Game constants - will be set dynamically based on device
let ROCKET_SIZE = 30;
let PIPE_GAP = 100; // Reduced from 120 for even more difficulty - much tighter vertical spacing
let PIPE_WIDTH = 80; // Keep increased width for imposing pillars

const GRAVITY = 0.4;           // Reduced gravity for easier control
const JUMP_POWER = -8;         // Gentler jump power
const MAX_VELOCITY_Y = 10;     // Lower max velocity
const WORLD_SPEED = 3;         // Increased from 2 for more difficulty
const VELOCITY_INCREASE_PER_SCORE = 0.15; // Increased from 0.1 for faster progression
const MAX_VELOCITY_MULTIPLIER = 4; // Increased from 3 for more challenge
const NEAR_MISS_THRESHOLD_PX = 8; // Distance from gap edge to count as near-miss
const BREATHER_EVERY_PASSES = 7; // Spawn an easier gap periodically
const BREATHER_EXTRA_GAP = 40; // Pixels to add during breather
const ROTATION_LERP = 0.18; // Smoother rotation interpolation

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface SpaceObstacle {
  id: number;
  position: Position;
  height: number;
  isTop: boolean;
  passed: boolean;
  type: 'asteroid_field' | 'space_station' | 'satellite';
  gapHeight?: number; // only set on obstacle pairs to render accurate gap indicator
}

interface Collectible {
  id: number;
  position: Position;
  size: number;
  type: 'coin' | 'star' | 'boost' | 'shield';
  value: number;
  speed: number;
  pulse?: number;
}

interface Particle {
  id: number;
  position: Position;
  velocity: Velocity;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Waypoint {
  id: number;
  position: Position;
  size: number;
  reached: boolean;
}

interface Cloud {
  id: number;
  position: Position;
  size: number;
  speed: number;
  opacity: number;
}

interface GameplayState {
  rocket: {
    position: Position;
    velocity: Velocity;
    rotation: number;
  };
  obstacles: SpaceObstacle[];
  particles: Particle[];
  score: number;
  timeElapsed: number;
  gameOver: boolean;
  screenShake: Animated.Value;
  gameStartTime: number;
  nearMissFlash?: Animated.Value;
  achievement?: string;
}

interface FlightSimulatorProps {
  onGameOver: (score: number, time: number) => void;
}

export const FlightSimulator: React.FC<FlightSimulatorProps> = ({
  onGameOver,
}) => {
  // Set responsive game constants
  const dims = getResponsiveDimensions();
  ROCKET_SIZE = dims.rocketSize;
  PIPE_GAP = dims.pipeGap;
  PIPE_WIDTH = dims.pipeWidth;
  const { settings, addScore, setGameMode, setPaused, isPaused } = useGameStore();
  const [gameplayState, setGameplayState] = useState<GameplayState>({
    rocket: {
      position: { x: width / 2, y: height / 2 }, // Center position like main menu
      velocity: { x: 0, y: -JUMP_POWER }, // Start with upward movement like first tap
      rotation: 0.2, // Same tilt as main menu
    },
    obstacles: [],
    particles: [],
          score: 0,
      timeElapsed: 0,
    gameOver: false,
    screenShake: new Animated.Value(0),
    gameStartTime: Date.now(),
    
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const scoreUpdateRef = useRef<number>(0);
  const obstacleIdCounter = useRef<number>(0);

  // Ensure audio mode follows settings
  useEffect(() => {
    setAudioEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Initialize game when starting
  useEffect(() => {
    initializeGame();
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // Handle score updates outside of render cycle
  useEffect(() => {
    if (scoreUpdateRef.current > 0) {
      addScore(scoreUpdateRef.current);
      scoreUpdateRef.current = 0;
    }
  }, [gameplayState.score, addScore]);

  const initializeGame = async () => {
    setGameplayState({
      rocket: {
        position: { x: width / 2, y: height / 2 }, // Center position like main menu
        velocity: { x: 0, y: -JUMP_POWER }, // Start with upward movement like first tap
        rotation: 0.2, // Same tilt as main menu
      },
      obstacles: [],
      particles: [],
      score: 0,
      timeElapsed: 0,
      gameOver: false,
      screenShake: new Animated.Value(0),
      gameStartTime: Date.now(),
    });
    

  };

  // Simple Flappy Bird game loop
  const gameLoop = useCallback(() => {
            if (!gameplayState.gameOver && !isPaused) {
      const now = Date.now();
      lastUpdateRef.current = now;

      setGameplayState(prevState => {
        const newState = { ...prevState };
        
        // Apply gravity (Flappy Bird physics)
        newState.rocket.velocity.y += GRAVITY;
        newState.rocket.velocity.y = Math.min(newState.rocket.velocity.y, MAX_VELOCITY_Y);
        
        // Update position
        newState.rocket.position.y += newState.rocket.velocity.y;
        
        // Rotation based on velocity with smoothing (lerp)
        const targetRotation = Math.max(-0.5, Math.min(0.5, newState.rocket.velocity.y * 0.05));
        newState.rocket.rotation = newState.rocket.rotation + (targetRotation - newState.rocket.rotation) * ROTATION_LERP;
        
        // Calculate current velocity based on score
        const velocityMultiplier = Math.min(1 + (newState.score * VELOCITY_INCREASE_PER_SCORE), MAX_VELOCITY_MULTIPLIER);
        const currentWorldSpeed = WORLD_SPEED * velocityMultiplier;
        
        // Move space obstacles left with increasing speed
        newState.obstacles = newState.obstacles.map(obstacle => ({
          ...obstacle,
          position: { x: obstacle.position.x - currentWorldSpeed, y: obstacle.position.y }
        })).filter(obstacle => obstacle.position.x > -PIPE_WIDTH);
        
        // Spawn new space obstacles continuously - ensure infinite gameplay
        let lastObstacle = newState.obstacles.length > 0 ? 
          Math.max(...newState.obstacles.map(o => o.position.x)) : -1000;
        
        // Minimum distance between obstacle pairs (300px for easier gameplay)
        const MIN_OBSTACLE_DISTANCE = 300;
        
        // Always ensure there are obstacles ready to appear on screen (infinite gameplay)
        // Spawn multiple obstacles if needed to maintain continuous flow
        while (newState.obstacles.length === 0 || lastObstacle < width + MIN_OBSTACLE_DISTANCE * 2) {
          // Dynamic gap: slightly tighter with score, with periodic breathers
          const baseGap = PIPE_GAP;
          const tighter = Math.min(newState.score * 2, 60);
          let currentGap = baseGap - tighter;
          if (newState.score > 0 && newState.score % BREATHER_EVERY_PASSES === 0) {
            currentGap = baseGap + BREATHER_EXTRA_GAP;
          }
          const gapY = Math.random() * (height - currentGap - 200) + 100; // Keep gaps away from edges
          const obstacleId = Date.now() + Math.random(); // Ensure unique IDs
          const obstacleTypes: ('asteroid_field' | 'space_station' | 'satellite')[] = ['asteroid_field', 'space_station', 'satellite'];
          const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          
          // Calculate spawn position - if no obstacles, spawn at screen edge, otherwise maintain distance
          const spawnX = Math.max(width, lastObstacle + MIN_OBSTACLE_DISTANCE);
          
          // Top obstacle
          newState.obstacles.push({
            id: obstacleId,
            position: { x: spawnX, y: 0 },
            height: gapY,
            isTop: true,
            passed: false,
            type: obstacleType,
            gapHeight: currentGap,
          });
          
          // Bottom obstacle
          newState.obstacles.push({
            id: obstacleId + 1,
            position: { x: spawnX, y: gapY + currentGap },
            height: height - (gapY + currentGap),
            isTop: false,
            passed: false,
            type: obstacleType,
            gapHeight: currentGap,
          });
          
          // Update lastObstacle for next iteration
          lastObstacle = spawnX;
        }
        
        // Update distance traveled for infinite feel
        const distanceTraveled = currentWorldSpeed * 0.1; // Convert pixels to distance units
        newState.timeElapsed = Date.now() - newState.gameStartTime;
        // Distance tracking handled by Zustand store
        
        // Check space obstacle collisions - more forgiving hitbox
        for (let obstacle of newState.obstacles) {
          const hitboxReduction = 5; // Make hitbox smaller for easier gameplay
          if (
            newState.rocket.position.x + (ROCKET_SIZE / 2 - hitboxReduction) > obstacle.position.x &&
            newState.rocket.position.x - (ROCKET_SIZE / 2 - hitboxReduction) < obstacle.position.x + PIPE_WIDTH &&
            newState.rocket.position.y + (ROCKET_SIZE / 2 - hitboxReduction) > obstacle.position.y &&
            newState.rocket.position.y - (ROCKET_SIZE / 2 - hitboxReduction) < obstacle.position.y + obstacle.height
          ) {
            // Defer side effects via handleGameOver
            handleGameOver(newState.score, newState.timeElapsed);
            return newState;
          }
          
          // Check if passed obstacle for scoring
          if (!obstacle.passed && obstacle.position.x + PIPE_WIDTH < newState.rocket.position.x) {
            obstacle.passed = true;
            if (!obstacle.isTop) { // Only count once per pair
              newState.score++;
              scoreUpdateRef.current += 1; // Queue score update for next render cycle
              
              // Increase velocity based on score
              const velocityMultiplier = Math.min(1 + (newState.score * VELOCITY_INCREASE_PER_SCORE), MAX_VELOCITY_MULTIPLIER);
              const newWorldSpeed = WORLD_SPEED * velocityMultiplier;
              
              // Play passed sound (centralized)
              if (settings.soundEnabled) {
                playPassed();
              }
              // Success haptic feedback
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);



              // Near-miss bonus: within threshold of gap edges
              const gapHeight = obstacle.gapHeight ?? PIPE_GAP;
              const gapBottom = obstacle.position.y;
              const gapTop = gapBottom - gapHeight;
              const rocketY = newState.rocket.position.y;
              const distToEdge = Math.min(Math.abs(rocketY - gapTop), Math.abs(rocketY - gapBottom));
              if (distToEdge <= NEAR_MISS_THRESHOLD_PX) {
                newState.score++;
                scoreUpdateRef.current += 1;
                // Light haptic to reinforce near-miss
                if (settings.hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                // Add near-miss visual feedback
                const nearMissFlash = new Animated.Value(1);
                newState.nearMissFlash = nearMissFlash;
                Animated.sequence([
                  Animated.timing(nearMissFlash, { toValue: 0, duration: 300, useNativeDriver: true }),
                ]).start();
              }
            }
          }
        }
        
        // Achievement checks
        if (newState.score === 10) {
          newState.achievement = "First Steps!";
        } else if (newState.score === 25) {
          newState.achievement = "Getting Good!";
        } else if (newState.score === 50) {
          newState.achievement = "Space Ace!";
        } else if (newState.score === 100) {
          newState.achievement = "Legendary!";
        }
        
        // Check boundaries - more forgiving
        if (newState.rocket.position.y < -10 || newState.rocket.position.y > height + 10) {
          handleGameOver(newState.score, newState.timeElapsed);
          return newState;
        }
        
        return newState;
      });
    }
  }, []);



  const handleGameOver = (score: number, time: number) => {
    // mark state; side effects are deferred in effect below
    setGameplayState(prev => ({ ...prev, gameOver: true }));
  };

  useEffect(() => {
    if (!gameplayState.gameOver) return;
    triggerScreenShake();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Remove automatic onGameOver call - let user tap button instead
  }, [gameplayState.gameOver]);

  // Set up game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameplayState.gameOver) {
        gameLoop();
      }
    }, 16); // ~60 FPS
    
    return () => clearInterval(interval);
  }, [gameLoop, gameplayState.gameOver]);

  const jump = () => {
    if (gameplayState.gameOver || isPaused) return;
    
    // Play click sound
      if (settings.soundEnabled) {
        playClick();
      }
    
    // Haptic feedback
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setGameplayState(prev => ({
      ...prev,
      rocket: {
        ...prev.rocket,
        velocity: { ...prev.rocket.velocity, y: JUMP_POWER }
      }
    }));
    
    // Enhanced haptic feedback for jump (only if enabled)
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDoubleTap = () => {
    setPaused(!gameplayState.gameOver);
  };

  const triggerScreenShake = () => {
    Animated.sequence([
      Animated.timing(gameplayState.screenShake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(gameplayState.screenShake, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };



  return (
    <View style={styles.container}>
      {/* Background Stars */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 100 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.8 + 0.2,
              }
            ]}
          />
        ))}
      </View>

      {/* Game Area */}
      <Animated.View
        style={[
          styles.gameArea,
        ]}
      >
        <Animated.View
          style={{
            transform: [
              { translateX: gameplayState.screenShake },
            ],
          }}
        >
          {/* Enhanced Spaceship */}
          <View 
            style={[
              styles.spaceship, 
              { 
                left: gameplayState.rocket.position.x - ROCKET_SIZE / 2, 
                top: gameplayState.rocket.position.y - ROCKET_SIZE / 2,
                transform: [
                  { 
                    rotate: `${gameplayState.rocket.rotation}rad`
                  }
                ]
              }
            ]}
          >
            {/* Main Body */}
            <View style={styles.spaceshipBody}>
              {/* Cockpit with glow */}
              <View style={styles.spaceshipCockpit}>
                <View style={styles.cockpitGlow} />
                <View style={styles.cockpitWindow} />
              </View>
              
              {/* Wings */}
              <View style={styles.spaceshipWings}>
                <View style={styles.wingLeft} />
                <View style={styles.wingRight} />
              </View>
              
              {/* Engine with thrust effect */}
              <View style={styles.spaceshipEngine}>
                <View style={styles.engineGlow} />
                <View style={styles.thrustEffect} />
              </View>
              
              {/* Side panels */}
              <View style={styles.sidePanelLeft} />
              <View style={styles.sidePanelRight} />
              
              {/* Nose cone */}
              <View style={styles.noseCone} />
            </View>
          </View>



          {/* Space Obstacles */}
          {gameplayState.obstacles.map(obstacle => (
            <View
              key={obstacle.id}
              style={[
                styles.spaceObstacle,
                {
                  left: obstacle.position.x,
                  top: obstacle.position.y,
                  width: PIPE_WIDTH,
                  height: obstacle.height,
                }
              ]}
            >
              {/* Modern sleek pillar design - tilted for upper, normal for lower */}
              <View style={[
                obstacle.isTop ? styles.modernPillarUpper : styles.modernPillar,
                obstacle.isTop ? styles.pillarTop : styles.pillarBottom
              ]}>
                {/* Energy rings and pulses for astronomical effect - only on upper pillar */}
                {obstacle.isTop && (
                  <>
                    <View style={styles.energyPulse} />
                    <View style={styles.energyRing} />
                    <View style={styles.energyRingInner} />
                  </>
                )}
                
                {/* Infinite pillar effect - extends into space forever */}
                {obstacle.isTop ? (
                  <View style={styles.infinitePillarTop} />
                ) : (
                  <View style={styles.infinitePillarBottom} />
                )}
                
                {/* Infinite pillar core for depth */}
                {obstacle.isTop ? (
                  <View style={styles.infinitePillarCoreTop} />
                ) : (
                  <View style={styles.infinitePillarCoreBottom} />
                )}
                
                {/* Infinite pillar edges that extend into space */}
                {obstacle.isTop ? (
                  <>
                    <View style={styles.infinitePillarEdgeTop} />
                    <View style={styles.infinitePillarEdgeRightTop} />
                  </>
                ) : (
                  <>
                    <View style={styles.infinitePillarEdgeBottom} />
                    <View style={styles.infinitePillarEdgeRightBottom} />
                  </>
                )}
                
                {/* Pillar body with gradient effect */}
                <View style={styles.pillarBody}>
                  {/* Main pillar structure */}
                  <View style={styles.pillarCore} />
                  
                  {/* Pillar edge highlights */}
                  <View style={styles.pillarEdgeLeft} />
                  <View style={styles.pillarEdgeRight} />
                  
                  {/* Astronomical accent lines with variety - more on upper pillar */}
                  {obstacle.isTop ? (
                    <>
                      <View style={[styles.accentLineThick, { top: '20%' }]} />
                      <View style={[styles.accentLine, { top: '40%' }]} />
                      <View style={[styles.accentLineThin, { top: '60%' }]} />
                      <View style={[styles.accentLineThick, { top: '80%' }]} />
                    </>
                  ) : (
                    <>
                      <View style={[styles.accentLine, { top: '30%' }]} />
                      <View style={[styles.accentLineThin, { top: '70%' }]} />
                    </>
                  )}
                  
                  {/* Pillar segments for texture with variety */}
                  <View style={styles.pillarSegments}>
                    {Array.from({ length: Math.ceil(obstacle.height / 25) }, (_, i) => {
                      // Randomly choose segment style for variety
                      const segmentStyles = [styles.pillarSegment, styles.pillarSegmentWide, styles.pillarSegmentNarrow];
                      const randomStyle = segmentStyles[Math.floor(Math.random() * segmentStyles.length)];
                      return <View key={i} style={randomStyle} />;
                    })}
                  </View>
                  
                  {/* Cosmic particles with variety - more on upper pillar */}
                  {obstacle.isTop ? (
                    <>
                      <View style={[styles.cosmicParticleLarge, { top: '15%', left: '10%' }]} />
                      <View style={[styles.cosmicParticle, { top: '35%', right: '15%' }]} />
                      <View style={[styles.cosmicParticleLarge, { top: '55%', left: '20%' }]} />
                      <View style={[styles.cosmicParticle, { top: '75%', right: '10%' }]} />
                      <View style={[styles.cosmicParticle, { top: '45%', left: '50%' }]} />
                    </>
                  ) : (
                    <>
                      <View style={[styles.cosmicParticle, { top: '25%', left: '15%' }]} />
                      <View style={[styles.cosmicParticleLarge, { top: '65%', right: '20%' }]} />
                      <View style={[styles.cosmicParticle, { top: '45%', right: '50%' }]} />
                    </>
                  )}
                </View>
                
                {/* Modern pillar tip/cap */}
                <View style={[
                  styles.modernPillarCap,
                  obstacle.isTop ? styles.pillarCapTop : styles.pillarCapBottom
                ]}>
                  {/* Cap glow effect */}
                  <View style={styles.capGlow} />
                  
                  {/* Cap highlight */}
                  <View style={styles.capHighlight} />
                  
                  {/* Cap border accent */}
                  <View style={styles.capBorder} />
                </View>
              </View>
            </View>
          ))}

        </Animated.View>
      </Animated.View>

      {/* Score and Combo Display */}
      {!gameplayState.gameOver && (
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreText}>{gameplayState.score}</Text>

          {gameplayState.achievement ? (
            <Text style={styles.achievementText}>{gameplayState.achievement}</Text>
          ) : null}
        </View>
      )}


      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 255, 255, 0.2)',
          opacity: gameplayState.nearMissFlash || new Animated.Value(0),
        }}
      />



      {/* Pause Menu */}
      <PauseMenu />

      {/* Touch Controls - TAP TO JUMP disabled after game over */}
      {!gameplayState.gameOver && (
        <TouchableOpacity 
          style={styles.fullScreenTouch} 
          onPress={jump}
          activeOpacity={1}
        />
      )}

      {/* Game Over Overlay - in-game, centered */}
      {gameplayState.gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
            <Text style={styles.gameOverSubtitle}>Final Score</Text>
            <View style={styles.gameOverStatsRow}>
              <View style={styles.gameOverStat}><Text style={styles.gameOverStatNum}>{gameplayState.score}</Text><Text style={styles.gameOverStatLbl}>SCORE</Text></View>
              <View style={styles.gameOverStat}><Text style={styles.gameOverStatNum}>{Math.round(gameplayState.timeElapsed / 1000)}s</Text><Text style={styles.gameOverStatLbl}>TIME</Text></View>
            </View>
            <TouchableOpacity 
              style={styles.gameOverBtnPrimary} 
              onPress={() => {
                // Play click sound
                if (settings.soundEnabled) {
                  playClick();
                }
                // Haptic feedback
                if (settings.hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onGameOver(gameplayState.score, gameplayState.timeElapsed);
              }}
            >
              <Text style={styles.gameOverBtnText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B2A',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  gameArea: {
    position: 'absolute',
    width: width,
    height: height,
  },
  spaceship: {
    position: 'absolute',
    width: ROCKET_SIZE,
    height: ROCKET_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipBody: {
    width: ROCKET_SIZE,
    height: ROCKET_SIZE * 0.8,
    backgroundColor: '#4A90E2',
    borderRadius: ROCKET_SIZE / 2,
    borderWidth: 2,
    borderColor: '#357ABD',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  spaceshipCockpit: {
    position: 'absolute',
    top: 2,
    left: ROCKET_SIZE / 2 - 8,
    width: 16,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#87CEEB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#87CEEB',
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  cockpitGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  cockpitWindow: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  spaceshipWings: {
    position: 'absolute',
    top: ROCKET_SIZE * 0.2,
    left: -6,
    width: ROCKET_SIZE + 12,
    height: 8,
    backgroundColor: '#2E5C8A',
    borderRadius: 4,
  },
  wingLeft: {
    position: 'absolute',
    left: -8,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  wingRight: {
    position: 'absolute',
    right: -8,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  spaceshipEngine: {
    position: 'absolute',
    bottom: -6,
    left: ROCKET_SIZE / 2 - 6,
    width: 12,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  engineGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.4)',
  },
  thrustEffect: {
    position: 'absolute',
    bottom: -8,
    left: 2,
    width: 8,
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    opacity: 0.8,
  },
  sidePanelLeft: {
    position: 'absolute',
    left: -2,
    top: ROCKET_SIZE * 0.3,
    width: 4,
    height: 12,
    backgroundColor: '#357ABD',
    borderRadius: 2,
  },
  sidePanelRight: {
    position: 'absolute',
    right: -2,
    top: ROCKET_SIZE * 0.3,
    width: 4,
    height: 12,
    backgroundColor: '#357ABD',
    borderRadius: 2,
  },
  noseCone: {
    position: 'absolute',
    top: -4,
    left: ROCKET_SIZE / 2 - 4,
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  spaceObstacle: {
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modern sleek pillar design - Metroid Prime inspired with enhanced variety
  modernPillar: {
    width: PIPE_WIDTH + 20, // Increased width for more imposing appearance
    height: '100%',
    backgroundColor: '#0B3D1F', // Deeper, richer green for better contrast
    borderRadius: 18, // Slightly more rounded for smoother appearance
    position: 'relative',
    overflow: 'hidden', // Hide overflow for gradient effect
    shadowColor: '#00FF41', // Matrix-style green glow
    shadowOffset: { width: 0, height: 8 }, // Enhanced shadow depth
    shadowOpacity: 0.7, // Increased opacity for stronger glow
    shadowRadius: 15, // Larger shadow radius for better glow effect
    elevation: 10, // Increased elevation for better depth
    borderWidth: 3, // Thicker border for more definition
    borderColor: '#00FF41', // Bright green border for alien tech feel
  },
  // Inverted upper pillar for astronomical feel with enhanced variety
  modernPillarUpper: {
    width: PIPE_WIDTH + 20,
    height: '100%',
    backgroundColor: '#0B3D1F', // Deeper, richer green for better contrast
    borderRadius: 18, // Slightly more rounded for smoother appearance
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00FF41', // Matrix-style green glow
    shadowOffset: { width: 0, height: 8 }, // Enhanced shadow depth
    shadowOpacity: 0.7, // Increased opacity for stronger glow
    shadowRadius: 15, // Larger shadow radius for better glow effect
    elevation: 10, // Increased elevation for better depth
    borderWidth: 3, // Thicker border for more definition
    borderColor: '#00FF41', // Bright green border for alien tech feel
    transform: [{ scaleY: -1 }], // Invert upside down for astronomical feel
  },
  pillarTop: {
    borderBottomWidth: 0,
  },
  pillarBottom: {
    borderTopWidth: 0,
  },
  pillarBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0B3D1F', // Deeper, richer green for better contrast
    borderRadius: 18, // Slightly more rounded for smoother appearance
    position: 'relative',
    overflow: 'hidden', // Hide overflow for gradient effect
    shadowColor: '#00FF41', // Green glow
    shadowOffset: { width: 0, height: 4 }, // Enhanced shadow depth
    shadowOpacity: 0.6, // Increased opacity for stronger glow
    shadowRadius: 10, // Larger shadow radius for better glow effect
    elevation: 6, // Increased elevation for better depth
  },
  pillarCore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B3D1F', // Deeper, richer green for better contrast
    borderRadius: 18, // Slightly more rounded for smoother appearance
    borderWidth: 3, // Thicker border for more definition
    borderColor: '#00FF41', // Bright green border
    zIndex: 1,
    // Add enhanced alien tech gradient effect
    borderLeftColor: 'rgba(0, 255, 65, 0.9)', // Brighter green left edge
    borderRightColor: 'rgba(0, 255, 65, 0.5)', // Enhanced green right edge
    borderTopColor: 'rgba(0, 255, 65, 0.7)', // Brighter green top
    borderBottomColor: 'rgba(0, 255, 65, 0.4)', // Enhanced green bottom
  },
  pillarEdgeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4, // Slightly wider for better visibility
    backgroundColor: 'rgba(0, 255, 65, 1)', // Full opacity bright green left edge
    borderRadius: 3, // Enhanced rounded corners
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // Full opacity for maximum glow
    shadowRadius: 6, // Enhanced glow radius
  },
  pillarEdgeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4, // Slightly wider for better visibility
    backgroundColor: 'rgba(0, 255, 65, 0.8)', // Enhanced green right edge
    borderRadius: 3, // Enhanced rounded corners
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Enhanced glow
    shadowRadius: 4, // Enhanced glow radius
  },
  pillarSegments: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  modernPillarCap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22, // Slightly increased for better proportions
    backgroundColor: '#0B3D1F', // Deeper, richer green for better contrast
    borderRadius: 18, // Slightly more rounded for smoother appearance
    borderWidth: 3, // Thicker border for more definition
    borderColor: '#00FF41', // Bright green border
    zIndex: 2,
    shadowColor: '#00FF41', // Green glow
    shadowOffset: { width: 0, height: 5 }, // Enhanced shadow depth
    shadowOpacity: 0.8, // Increased opacity for stronger glow
    shadowRadius: 12, // Enhanced glow radius
    elevation: 8, // Increased elevation for better depth
  },
  pillarCapTop: {
    bottom: 0,
    borderBottomWidth: 3, // Thicker bottom border for better definition
    borderBottomLeftRadius: 15, // Increased from 8 for smoother edges
    borderBottomRightRadius: 15, // Increased from 8 for smoother edges
  },
  pillarCapBottom: {
    top: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 15, // Increased from 8 for smoother edges
    borderTopRightRadius: 15, // Increased from 8 for smoother edges
    // Add a subtle highlight at the bottom edge
    borderTopWidth: 3, // Thicker top border for better definition
  },
  capGlow: {
    position: 'absolute',
    top: -4, // Enhanced glow area
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 18, // Enhanced rounded corners
    backgroundColor: 'rgba(0, 255, 65, 0.3)', // Enhanced green glow
    zIndex: -1,
  },
  capHighlight: {
    position: 'absolute',
    left: 4, // Enhanced positioning
    right: 4,
    height: 3, // Thicker for better visibility
    backgroundColor: 'rgba(0, 255, 65, 0.9)', // Enhanced bright green highlight
    borderRadius: 3, // Enhanced rounded corners
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, // Enhanced glow
    shadowRadius: 4, // Enhanced glow radius
  },
  capBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3, // Thicker for better visibility
    backgroundColor: 'rgba(0, 255, 65, 1)', // Full opacity bright green border accent
    borderRadius: 3, // Enhanced rounded corners
  },
  scoreDisplay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  comboText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF00',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fullScreenTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: 'transparent',
  },

  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60,
  },
  gameOverCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 260,
  },
  gameOverTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 6,
  },
  gameOverSubtitle: {
    color: '#A0AEC0',
    fontSize: 13,
    marginBottom: 16,
  },
  gameOverStatsRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 16,
  },
  gameOverStat: {
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  gameOverStatNum: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
  },
  gameOverStatLbl: {
    color: '#FFD700',
    fontSize: 10,
    opacity: 0.9,
    marginTop: 2,
    letterSpacing: 1,
  },
  gameOverBtnPrimary: {
    marginTop: 4,
    backgroundColor: 'rgba(74,144,226,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(74,144,226,0.5)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  gameOverBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Astronomical energy rings
  energyRing: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(0, 255, 65, 0.6)',
    top: -10,
    left: -10,
    zIndex: 0,
    opacity: 0.8,
  },
  energyRingInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 65, 0.4)',
    top: 5,
    left: 5,
    zIndex: 0,
    opacity: 0.6,
  },
  // Cosmic particle effects
  cosmicParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#00FF41',
    borderRadius: 2,
    opacity: 0.8,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  // Larger cosmic particles for variety
  cosmicParticleLarge: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#00FF41',
    borderRadius: 3,
    opacity: 0.9,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  // Energy pulse effect for dynamic appearance
  energyPulse: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 65, 0.4)',
    top: -5,
    left: -5,
    zIndex: -1,
    opacity: 0.6,
  },
  // Enhanced pillar segments with astronomical theme and variety
  pillarSegment: {
    width: '90%', // Slightly wider for better coverage
    height: 4, // Thicker for better visibility
    backgroundColor: '#00FF41', // Bright green segments
    borderRadius: 4, // Enhanced rounded corners
    opacity: 0.9, // Higher opacity for better visibility
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, // Enhanced glow
    shadowRadius: 5, // Enhanced glow radius
    marginVertical: 3, // Increased spacing between segments
  },
  // Varied pillar segments for visual interest
  pillarSegmentWide: {
    width: '95%', // Wider segments for variety
    height: 5, // Thicker for variety
    backgroundColor: '#00FF41',
    borderRadius: 5,
    opacity: 0.95,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    marginVertical: 4,
  },
  pillarSegmentNarrow: {
    width: '80%', // Narrower segments for variety
    height: 3, // Thinner for variety
    backgroundColor: '#00FF41',
    borderRadius: 3,
    opacity: 0.85,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    marginVertical: 2,
  },
  // Astronomical accent lines with variety
  accentLine: {
    position: 'absolute',
    width: '100%',
    height: 2, // Thicker for better visibility
    backgroundColor: 'rgba(0, 255, 65, 0.7)', // Enhanced green with higher opacity
    borderRadius: 2, // Enhanced rounded corners
    opacity: 0.8, // Higher opacity for better visibility
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Enhanced glow
    shadowRadius: 3, // Enhanced glow radius
  },
  // Varied accent lines for visual interest
  accentLineThick: {
    position: 'absolute',
    width: '100%',
    height: 3, // Thicker for variety
    backgroundColor: 'rgba(0, 255, 65, 0.8)', // Brighter for variety
    borderRadius: 3,
    opacity: 0.9,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  accentLineThin: {
    position: 'absolute',
    width: '90%', // Narrower for variety
    height: 1, // Thinner for variety
    backgroundColor: 'rgba(0, 255, 65, 0.6)', // Softer for variety
    borderRadius: 1,
    opacity: 0.7,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },

  // Infinite pillar effect - extends into space forever
  infinitePillarTop: {
    position: 'absolute',
    top: -1000, // Extend far above the screen
    left: 0,
    width: '100%',
    height: 1000, // Very tall to create infinite effect
    backgroundColor: '#0B3D1F',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#00FF41',
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
    zIndex: -1, // Behind the main pillar
  },
  infinitePillarBottom: {
    position: 'absolute',
    bottom: -1000, // Extend far below the screen
    left: 0,
    width: '100%',
    height: 1000, // Very tall to create infinite effect
    backgroundColor: '#0B3D1F',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#00FF41',
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
    zIndex: -1, // Behind the main pillar
  },
  // Infinite pillar core for depth
  infinitePillarCoreTop: {
    position: 'absolute',
    top: -1000,
    left: 10,
    right: 10, // Use right instead of width for proper sizing
    height: 1000,
    backgroundColor: '#0B3D1F',
    borderRadius: 16,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: 'rgba(0, 255, 65, 0.9)',
    borderRightColor: 'rgba(0, 255, 65, 0.5)',
    zIndex: -2,
  },
  infinitePillarCoreBottom: {
    position: 'absolute',
    bottom: -1000,
    left: 10,
    right: 10, // Use right instead of width for proper sizing
    height: 1000,
    backgroundColor: '#0B3D1F',
    borderRadius: 16,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: 'rgba(0, 255, 65, 0.9)',
    borderRightColor: 'rgba(0, 255, 65, 0.5)',
    zIndex: -2,
  },

  // Infinite pillar edges that extend into space
  infinitePillarEdgeTop: {
    position: 'absolute',
    top: -1000,
    left: 0,
    width: 4,
    height: 1000,
    backgroundColor: 'rgba(0, 255, 65, 1)',
    borderRadius: 3,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: -1,
  },
  infinitePillarEdgeBottom: {
    position: 'absolute',
    bottom: -1000,
    left: 0,
    width: 4,
    height: 1000,
    backgroundColor: 'rgba(0, 255, 65, 1)',
    borderRadius: 3,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: -1,
  },
  infinitePillarEdgeRightTop: {
    position: 'absolute',
    top: -1000,
    right: 0,
    width: 4,
    height: 1000,
    backgroundColor: 'rgba(0, 255, 65, 0.8)',
    borderRadius: 3,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
    zIndex: -1,
  },
  infinitePillarEdgeRightBottom: {
    position: 'absolute',
    bottom: -1000,
    right: 0,
    width: 4,
    height: 1000,
    backgroundColor: 'rgba(0, 255, 65, 0.8)',
    borderRadius: 3,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
    zIndex: -1,
  },

}); 
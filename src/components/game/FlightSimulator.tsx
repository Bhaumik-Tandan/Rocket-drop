import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated, Text, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useGameStore } from '../../store/gameStore';
import { HUD } from '../ui/HUD';
import { PauseMenu } from '../ui/PauseMenu';

const { width, height } = Dimensions.get('window');

// Easier Flappy Bird constants
const ROCKET_SIZE = 30;
const GRAVITY = 0.4;           // Reduced gravity for easier control
const JUMP_POWER = -8;         // Gentler jump power
const MAX_VELOCITY_Y = 10;     // Lower max velocity
const WORLD_SPEED = 2;         // Slower pipe movement
const PIPE_GAP = 200;          // Much bigger gap between pipes
const PIPE_WIDTH = 60;
const VELOCITY_INCREASE_PER_SCORE = 0.1; // Increase velocity by 0.1 for each score
const MAX_VELOCITY_MULTIPLIER = 3; // Maximum 3x speed

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
}

interface FlightSimulatorProps {
  onGameOver: (score: number, time: number) => void;
}

export const FlightSimulator: React.FC<FlightSimulatorProps> = ({
  onGameOver,
}) => {
  const { settings, addScore, setGameMode, setPaused } = useGameStore();
  const [gameplayState, setGameplayState] = useState<GameplayState>({
    rocket: {
      position: { x: 100, y: height / 2 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
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
  const passedSoundRef = useRef<Audio.Sound | null>(null);
  const clickSoundRef = useRef<Audio.Sound | null>(null);
  const scoreUpdateRef = useRef<number>(0);

  // Load audio files
  useEffect(() => {
    const loadAudio = async () => {
      try {
        console.log('Loading audio in FlightSimulator...');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const { sound: clickSound } = await Audio.Sound.createAsync(
          require('../../../assets/click.wav'),
          { shouldPlay: false, volume: 0.5 }
        );
        console.log('Click sound loaded successfully');
        clickSoundRef.current = clickSound;

        const { sound: passedSound } = await Audio.Sound.createAsync(
          require('../../../assets/passed.wav'),
          { shouldPlay: false, volume: 0.7 }
        );
        console.log('Passed sound loaded successfully');
        passedSoundRef.current = passedSound;
      } catch (error) {
        console.log('Audio loading error in FlightSimulator:', error);
        // Audio not available - continue without sound
      }
    };

    loadAudio();
    return () => {
      console.log('Unloading audio in FlightSimulator');
      clickSoundRef.current?.unloadAsync();
      passedSoundRef.current?.unloadAsync();
    };
  }, []);

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

  const initializeGame = () => {
    setGameplayState({
      rocket: {
        position: { x: 100, y: height / 2 },
        velocity: { x: 0, y: JUMP_POWER }, // Start with upward movement
        rotation: -0.3, // Slight upward tilt
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
            if (!gameplayState.gameOver) {
      const now = Date.now();
      lastUpdateRef.current = now;

      setGameplayState(prevState => {
        const newState = { ...prevState };
        
        // Apply gravity (Flappy Bird physics)
        newState.rocket.velocity.y += GRAVITY;
        newState.rocket.velocity.y = Math.min(newState.rocket.velocity.y, MAX_VELOCITY_Y);
        
        // Update position
        newState.rocket.position.y += newState.rocket.velocity.y;
        
        // Rotation based on velocity (subtle)
        newState.rocket.rotation = Math.max(-0.5, Math.min(0.5, newState.rocket.velocity.y * 0.05));
        
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
          const gapY = Math.random() * (height - PIPE_GAP - 200) + 100; // Keep gaps away from edges
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
            type: obstacleType
          });
          
          // Bottom obstacle
          newState.obstacles.push({
            id: obstacleId + 1,
            position: { x: spawnX, y: gapY + PIPE_GAP },
            height: height - (gapY + PIPE_GAP),
            isTop: false,
            passed: false,
            type: obstacleType
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
            // Heavy haptic feedback on collision
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            handleGameOver(newState.score, newState.timeElapsed);
            return prevState;
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
              
              // Play passed sound
              if (settings.soundEnabled && passedSoundRef.current) {
                console.log('Playing passed sound');
                passedSoundRef.current.playAsync().catch(error => {
                  console.log('Error playing passed sound:', error);
                });
              } else {
                console.log('Passed sound not played - settings:', settings.soundEnabled, 'soundRef:', !!passedSoundRef.current);
              }
              // Success haptic feedback
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        }
        
        // Check boundaries - more forgiving
        if (newState.rocket.position.y < -10 || newState.rocket.position.y > height + 10) {
          // Heavy haptic feedback on boundary collision
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          handleGameOver(newState.score, newState.timeElapsed);
          return prevState;
        }
        
        return newState;
      });
    }
  }, []);



  const handleGameOver = (score: number, time: number) => {
    triggerScreenShake();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onGameOver(score, time);
  };

  // Set up game loop
  useEffect(() => {
    const interval = setInterval(() => {
      gameLoop();
    }, 16); // ~60 FPS
    
    return () => clearInterval(interval);
  }, [gameLoop]);

  const jump = () => {
    if (gameplayState.gameOver) return;
    
    // Play click sound
    if (settings.soundEnabled && clickSoundRef.current) {
      console.log('Playing click sound in FlightSimulator');
      clickSoundRef.current.playAsync().catch(error => {
        console.log('Error playing click sound in FlightSimulator:', error);
      });
    } else {
      console.log('Click sound not played in FlightSimulator - settings:', settings.soundEnabled, 'soundRef:', !!clickSoundRef.current);
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
    
    // Enhanced haptic feedback for jump
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

          {/* Gap indicators - show where to fly through */}
          {gameplayState.obstacles.filter(obstacle => obstacle.isTop).map(obstacle => (
            <View
              key={`gap-${obstacle.id}`}
              style={[
                styles.gapIndicator,
                {
                  left: obstacle.position.x + PIPE_WIDTH / 2 - 2,
                  top: obstacle.height,
                  height: PIPE_GAP,
                }
              ]}
            />
          ))}

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
              {/* Clear pipe-style obstacle */}
              <View style={[
                styles.pipeBody,
                obstacle.isTop ? styles.pipeTop : styles.pipeBottom
              ]}>
                {/* Pipe cap for visual clarity */}
                <View style={[
                  styles.pipeCap,
                  obstacle.isTop ? styles.pipeCapTop : styles.pipeCapBottom
                ]} />
                
                {/* Pipe texture */}
                <View style={styles.pipeTexture}>
                  {Array.from({ length: Math.ceil(obstacle.height / 30) }, (_, i) => (
                    <View key={i} style={styles.pipeRing} />
                  ))}
                </View>
              </View>
            </View>
          ))}

        </Animated.View>
      </Animated.View>

      {/* Simple Score Display */}
      <View style={styles.scoreDisplay}>
        <Text style={styles.scoreText}>{gameplayState.score}</Text>
      </View>



      {/* Pause Menu */}
      <PauseMenu />

      {/* Touch Controls - TAP TO JUMP */}
      <TouchableOpacity 
        style={styles.fullScreenTouch} 
        onPress={jump}
        activeOpacity={1}
      />
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
  gapIndicator: {
    position: 'absolute',
    width: 4,
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.6)',
  },
  // Clear pipe-style obstacles like Flappy Bird
  pipeBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#228B22',
    borderWidth: 3,
    borderColor: '#006400',
    position: 'relative',
  },
  pipeTop: {
    borderBottomWidth: 0,
  },
  pipeBottom: {
    borderTopWidth: 0,
  },
  pipeCap: {
    position: 'absolute',
    left: -8,
    width: PIPE_WIDTH + 16,
    height: 30,
    backgroundColor: '#32CD32',
    borderWidth: 3,
    borderColor: '#006400',
    zIndex: 2,
  },
  pipeCapTop: {
    bottom: -3,
    borderTopWidth: 0,
  },
  pipeCapBottom: {
    top: -3,
    borderBottomWidth: 0,
  },
  pipeTexture: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pipeRing: {
    width: '80%',
    height: 3,
    backgroundColor: '#006400',
    borderRadius: 1.5,
    opacity: 0.6,
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
  fullScreenTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },


}); 
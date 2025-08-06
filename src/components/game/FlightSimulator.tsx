import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated, Text, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStateManager, GameState, Aircraft, Mission } from '../../utils/gameState';
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
  const [gameState, setGameState] = useState<GameState>(() => gameStateManager.getState());
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

  // Subscribe to game state changes
  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  // Initialize game when starting
  useEffect(() => {
    if (gameState.gameMode === 'playing') {
      initializeGame();
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.gameMode]);

  const initializeGame = () => {
    setGameplayState({
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
  };

  // Simple Flappy Bird game loop
  const gameLoop = useCallback(() => {
    if (!gameStateManager.getState().isPaused && gameStateManager.getState().gameMode === 'playing') {
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
        
        // Move space obstacles left
        newState.obstacles = newState.obstacles.map(obstacle => ({
          ...obstacle,
          position: { x: obstacle.position.x - WORLD_SPEED, y: obstacle.position.y }
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
        const distanceTraveled = WORLD_SPEED * 0.1; // Convert pixels to distance units
        newState.timeElapsed = Date.now() - newState.gameStartTime;
        gameStateManager.addDistance(distanceTraveled);
        
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
              gameStateManager.addScore(1);
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
    if (gameState.gameMode === 'playing' && !gameState.isPaused) {
      const interval = setInterval(() => {
        gameLoop();
      }, 16); // ~60 FPS
      
      return () => clearInterval(interval);
    }
  }, [gameState.gameMode, gameState.isPaused, gameLoop]);

  const jump = () => {
    console.log('🚀 JUMP CALLED!', { gameMode: gameState.gameMode, isPaused: gameState.isPaused, gameOver: gameplayState.gameOver });
    if (gameState.gameMode !== 'playing' || gameState.isPaused || gameplayState.gameOver) return;
    
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
    if (gameState.gameMode === 'playing') {
      gameStateManager.setPaused(!gameState.isPaused);
    }
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
          {/* Main Spaceship */}
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
            {/* Spaceship Body */}
            <View style={styles.spaceshipBody}>
              <View style={styles.spaceshipCockpit} />
              <View style={styles.spaceshipWings} />
              <View style={styles.spaceshipEngine} />
              <View style={styles.spaceshipThrusters} />
            </View>
          </View>

          {/* Space Obstacles */}
          {gameplayState.obstacles.map(obstacle => (
            <View
              key={obstacle.id}
              style={[
                styles.spaceObstacle,
                obstacle.type === 'asteroid_field' && styles.asteroidField,
                obstacle.type === 'space_station' && styles.spaceStation,
                obstacle.type === 'satellite' && styles.satellite,
                {
                  left: obstacle.position.x,
                  top: obstacle.position.y,
                  width: PIPE_WIDTH,
                  height: obstacle.height,
                }
              ]}
            >
              {obstacle.type === 'asteroid_field' && (
                <Text style={styles.obstacleText}>☄️</Text>
              )}
              {obstacle.type === 'space_station' && (
                <Text style={styles.obstacleText}>🛰️</Text>
              )}
              {obstacle.type === 'satellite' && (
                <Text style={styles.obstacleText}>📡</Text>
              )}
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
  spaceshipWings: {
    position: 'absolute',
    top: ROCKET_SIZE * 0.2,
    left: -6,
    width: ROCKET_SIZE + 12,
    height: 8,
    backgroundColor: '#2E5C8A',
    borderRadius: 4,
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
  spaceshipThrusters: {
    position: 'absolute',
    bottom: -10,
    left: ROCKET_SIZE / 2 - 3,
    width: 6,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 6,
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
  asteroidField: {
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: '#654321',
  },
  spaceStation: {
    backgroundColor: '#708090',
    borderWidth: 2,
    borderColor: '#556B2F',
  },
  satellite: {
    backgroundColor: '#2F4F4F',
    borderWidth: 2,
    borderColor: '#191970',
  },
  obstacleText: {
    fontSize: 20,
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  PanGestureHandler,
  State,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import Player from '../components/Player';
import Platform from '../components/Platform';
import Obstacle from '../components/Obstacle';
import PowerUp from '../components/PowerUp';
import Starfield from '../components/Starfield';
import GameUI from '../components/GameUI';
import { GAME_CONFIG } from '../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
  // Game state
  const [gameState, setGameState] = useState('playing'); // 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [activePowerUp, setActivePowerUp] = useState(null);

  // Player state
  const playerY = useSharedValue(SCREEN_HEIGHT * 0.7);
  const playerVelocity = useSharedValue(0);
  const isJumping = useSharedValue(false);
  const isSliding = useSharedValue(false);

  // Game loop
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    // Initialize platforms
    const initialPlatforms = [];
    for (let i = 0; i < 5; i++) {
      initialPlatforms.push({
        id: i,
        x: SCREEN_WIDTH + (i * 200),
        y: SCREEN_HEIGHT * 0.8,
        width: 150,
        height: 20,
        type: 'planet',
      });
    }
    setPlatforms(initialPlatforms);

    // Start game loop
    startGameLoop();
  };

  const startGameLoop = () => {
    const gameLoop = (currentTime) => {
      if (gameState === 'playing') {
        updateGame(currentTime - lastTimeRef.current);
        lastTimeRef.current = currentTime;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const updateGame = (deltaTime) => {
    // Update player physics
    updatePlayerPhysics(deltaTime);
    
    // Update game objects
    updatePlatforms(deltaTime);
    updateObstacles(deltaTime);
    updatePowerUps(deltaTime);
    
    // Check collisions
    checkCollisions();
    
    // Update score
    updateScore(deltaTime);
  };

  const updatePlayerPhysics = (deltaTime) => {
    if (isJumping.value) {
      playerVelocity.value += GAME_CONFIG.GRAVITY * deltaTime;
      playerY.value += playerVelocity.value * deltaTime;
      
      // Check if player landed
      if (playerY.value >= SCREEN_HEIGHT * 0.7) {
        playerY.value = SCREEN_HEIGHT * 0.7;
        playerVelocity.value = 0;
        isJumping.value = false;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const updatePlatforms = (deltaTime) => {
    setPlatforms(prevPlatforms => {
      const updated = prevPlatforms.map(platform => ({
        ...platform,
        x: platform.x - GAME_CONFIG.SCROLL_SPEED * deltaTime,
      })).filter(platform => platform.x > -200);

      // Add new platforms
      if (updated.length < 5) {
        const lastPlatform = updated[updated.length - 1];
        const newPlatform = {
          id: Date.now(),
          x: lastPlatform ? lastPlatform.x + 200 : SCREEN_WIDTH + 200,
          y: SCREEN_HEIGHT * 0.8,
          width: 150,
          height: 20,
          type: 'planet',
        };
        updated.push(newPlatform);
      }

      return updated;
    });
  };

  const updateObstacles = (deltaTime) => {
    setObstacles(prevObstacles => {
      const updated = prevObstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - GAME_CONFIG.SCROLL_SPEED * deltaTime,
      })).filter(obstacle => obstacle.x > -100);

      // Randomly spawn obstacles
      if (Math.random() < 0.01) {
        const newObstacle = {
          id: Date.now(),
          x: SCREEN_WIDTH + 100,
          y: SCREEN_HEIGHT * 0.7,
          width: 30,
          height: 30,
          type: Math.random() > 0.5 ? 'spike' : 'satellite',
        };
        updated.push(newObstacle);
      }

      return updated;
    });
  };

  const updatePowerUps = (deltaTime) => {
    setPowerUps(prevPowerUps => {
      const updated = prevPowerUps.map(powerUp => ({
        ...powerUp,
        x: powerUp.x - GAME_CONFIG.SCROLL_SPEED * deltaTime,
      })).filter(powerUp => powerUp.x > -50);

      // Randomly spawn power-ups
      if (Math.random() < 0.005) {
        const newPowerUp = {
          id: Date.now(),
          x: SCREEN_WIDTH + 100,
          y: SCREEN_HEIGHT * 0.6,
          width: 40,
          height: 40,
          type: Math.random() > 0.5 ? 'magnet' : 'slowTime',
        };
        updated.push(newPowerUp);
      }

      return updated;
    });
  };

  const checkCollisions = () => {
    // Check platform collisions
    const playerBounds = {
      x: 100,
      y: playerY.value,
      width: 50,
      height: 50,
    };

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (isColliding(playerBounds, obstacle)) {
        gameOver();
      }
    });

    // Check power-up collisions
    setPowerUps(prevPowerUps => {
      return prevPowerUps.filter(powerUp => {
        if (isColliding(playerBounds, powerUp)) {
          activatePowerUp(powerUp.type);
          return false;
        }
        return true;
      });
    });
  };

  const isColliding = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const activatePowerUp = (type) => {
    setActivePowerUp(type);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      setActivePowerUp(null);
    }, 3000);
  };

  const updateScore = (deltaTime) => {
    setScore(prevScore => {
      const newScore = prevScore + Math.floor(deltaTime * 0.1);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return newScore;
    });
  };

  const gameOver = () => {
    setGameState('gameOver');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    setPlatforms([]);
    setObstacles([]);
    setPowerUps([]);
    setActivePowerUp(null);
    playerY.value = SCREEN_HEIGHT * 0.7;
    playerVelocity.value = 0;
    isJumping.value = false;
    isSliding.value = false;
    initializeGame();
  };

  // Gesture handlers
  const onTap = () => {
    if (gameState === 'playing' && !isJumping.value) {
      playerVelocity.value = -GAME_CONFIG.JUMP_FORCE;
      isJumping.value = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const onSlide = () => {
    if (gameState === 'playing' && !isSliding.value) {
      isSliding.value = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setTimeout(() => {
        isSliding.value = false;
      }, 500);
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = 0;
    },
    onActive: (event, context) => {
      context.startY = event.translationY;
    },
    onEnd: (event) => {
      if (event.translationY > 50) {
        runOnJS(onSlide)();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Starfield />
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.gameArea}>
          <TouchableWithoutFeedback onPress={onTap}>
            <View style={styles.touchArea}>
              {/* Platforms */}
              {platforms.map(platform => (
                <Platform key={platform.id} {...platform} />
              ))}
              
              {/* Obstacles */}
              {obstacles.map(obstacle => (
                <Obstacle key={obstacle.id} {...obstacle} />
              ))}
              
              {/* Power-ups */}
              {powerUps.map(powerUp => (
                <PowerUp key={powerUp.id} {...powerUp} />
              ))}
              
              {/* Player */}
              <Player
                y={playerY}
                isJumping={isJumping}
                isSliding={isSliding}
                activePowerUp={activePowerUp}
              />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
      
      <GameUI
        score={score}
        highScore={highScore}
        gameState={gameState}
        onRestart={restartGame}
        activePowerUp={activePowerUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameArea: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
  },
}); 
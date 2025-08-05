import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GAME_CONFIG = {
  // Physics
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  SCROLL_SPEED: 2,
  
  // Player
  PLAYER_WIDTH: 50,
  PLAYER_HEIGHT: 50,
  PLAYER_START_X: 100,
  PLAYER_START_Y: SCREEN_HEIGHT * 0.7,
  
  // Platforms
  PLATFORM_WIDTH: 150,
  PLATFORM_HEIGHT: 20,
  PLATFORM_SPACING: 200,
  
  // Obstacles
  OBSTACLE_SPAWN_RATE: 0.01,
  OBSTACLE_WIDTH: 30,
  OBSTACLE_HEIGHT: 30,
  
  // Power-ups
  POWERUP_SPAWN_RATE: 0.005,
  POWERUP_WIDTH: 40,
  POWERUP_HEIGHT: 40,
  POWERUP_DURATION: 3000,
  
  // Scoring
  SCORE_PER_SECOND: 10,
  BONUS_PER_JUMP: 1,
  BONUS_PER_POWERUP: 5,
  
  // Colors
  COLORS: {
    BACKGROUND: '#000000',
    PLAYER: '#4A90E2',
    PLATFORM: '#8B4513',
    OBSTACLE: '#FF4444',
    POWERUP_MAGNET: '#FFD700',
    POWERUP_SLOWTIME: '#00FFFF',
    STAR: '#FFFFFF',
    UI_TEXT: '#FFFFFF',
    UI_BACKGROUND: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Starfield
  STAR_COUNT: 100,
  STAR_SPEED: 1,
  
  // Screen dimensions
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

export const GAME_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
};

export const POWERUP_TYPES = {
  MAGNET: 'magnet',
  SLOW_TIME: 'slowTime',
};

export const OBSTACLE_TYPES = {
  SPIKE: 'spike',
  SATELLITE: 'satellite',
  ASTEROID: 'asteroid',
};

export const PLATFORM_TYPES = {
  PLANET: 'planet',
  ASTEROID: 'asteroid',
  SPACE_STATION: 'spaceStation',
}; 
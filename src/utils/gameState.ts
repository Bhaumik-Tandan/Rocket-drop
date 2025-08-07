// Enhanced game state manager for flight simulator

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Aircraft {
  id: string;
  name: string;
  type: 'trainer' | 'fighter' | 'commercial' | 'helicopter';
  stats: {
    maxSpeed: number;
    maxAltitude: number;
    maneuverability: number;
    stability: number;
    fuelCapacity: number;
    thrustPower: number;
  };
  unlocked: boolean;
  mastery: number;
  requiredLevel: number;
}

// Mission interface removed - switching to free play mode only

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  // Removed difficulty and other complex settings - keeping it simple for free play
}

export interface GameStats {
  totalPlayTime: number;
  totalScore: number;
  // missionsCompleted removed - free play only
  aircraftUnlocked: number;
  longestSurvival: number;
  fuelCollected: number;
  meteorsAvoided: number;
}

export interface GameState {
  // Game status
  gameMode: 'menu' | 'playing' | 'paused' | 'gameOver' | 'settings';
  isPaused: boolean;
  
  // Current session (simplified)
  sessionScore: number;
  sessionTime: number;
  sessionStartTime: number;
  sessionDistance: number;
  
  // Game settings
  settings: GameSettings;
  
  // Simple statistics
  stats: {
    bestScore: number;
    bestTime: number;
    bestDistance: number;
    totalGamesPlayed: number;
  };
}

// No more aircraft unlocking or missions - keep it simple!

// Initial state
const initialSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  graphicsQuality: 'medium',
  controlSensitivity: 1.0,
  difficulty: 'normal',
  autoPause: true,
};

export const initialGameState: GameState = {
  gameMode: 'menu',
  isPaused: false,
  sessionScore: 0,
  sessionTime: 0,
  sessionStartTime: 0,
  sessionDistance: 0,
  settings: initialSettings,
  stats: {
    bestScore: 0,
    bestTime: 0,
    bestDistance: 0,
    totalGamesPlayed: 0,
  },
};

// Enhanced state manager
class GameStateManager {
  private state: GameState = initialGameState;
  private listeners: ((state: GameState) => void)[] = [];

  getState(): GameState {
    return { ...this.state };
  }

  setState(newState: Partial<GameState>) {
    this.state = { ...this.state, ...newState };
    setTimeout(() => {
      this.notifyListeners();
    }, 0);
  }

  subscribe(listener: (state: GameState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    const stateCopy = { ...this.state };
    this.listeners.forEach(listener => {
      try {
        listener(stateCopy);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  // Simple actions
  setGameMode(mode: GameState['gameMode']) {
    this.setState({ gameMode: mode });
  }

  setPaused(paused: boolean) {
    this.setState({ isPaused: paused });
  }

  startSession() {
    this.setState({
      gameMode: 'playing',
      sessionScore: 0,
      sessionTime: 0,
      sessionDistance: 0,
      sessionStartTime: Date.now(),
    });
  }

  endSession() {
    const sessionDuration = Date.now() - this.state.sessionStartTime;
    const newStats = {
      bestScore: Math.max(this.state.stats.bestScore, this.state.sessionScore),
      bestTime: Math.max(this.state.stats.bestTime, sessionDuration),
      bestDistance: Math.max(this.state.stats.bestDistance, this.state.sessionDistance),
      totalGamesPlayed: this.state.stats.totalGamesPlayed + 1,
    };
    
    this.setState({
      gameMode: 'gameOver',
      stats: newStats,
      sessionTime: sessionDuration,
    });
  }

  addScore(points: number) {
    this.setState({ sessionScore: this.state.sessionScore + points });
  }

  addDistance(distance: number) {
    this.setState({ sessionDistance: this.state.sessionDistance + distance });
  }

  updateSettings(newSettings: Partial<GameSettings>) {
    const { settings } = this.state;
    this.setState({ settings: { ...settings, ...newSettings } });
  }

  resetGame() {
    this.setState(initialGameState);
  }
}

export const gameStateManager = new GameStateManager(); 
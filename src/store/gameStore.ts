import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface GameStats {
  bestScore: number;
  bestTime: number;
  bestDistance: number;
  totalGamesPlayed: number;
}

export interface GameState {
  // Game status
  gameMode: 'menu' | 'playing' | 'paused' | 'gameOver' | 'settings';
  isPaused: boolean;
  
  // Current session
  sessionScore: number;
  sessionTime: number;
  sessionStartTime: number;
  sessionDistance: number;
  
  // Game settings
  settings: GameSettings;
  
  // Statistics
  stats: GameStats;
}

interface GameStore extends GameState {
  // Actions
  setGameMode: (mode: GameState['gameMode']) => void;
  setPaused: (paused: boolean) => void;
  startSession: () => void;
  endSession: () => void;
  addScore: (points: number) => void;
  addDistance: (distance: number) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetGame: () => void;
  updateStats: (newStats: Partial<GameStats>) => void;
}

const initialSettings: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
};

const initialStats: GameStats = {
  bestScore: 0,
  bestTime: 0,
  bestDistance: 0,
  totalGamesPlayed: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameMode: 'menu',
      isPaused: false,
      sessionScore: 0,
      sessionTime: 0,
      sessionStartTime: 0,
      sessionDistance: 0,
      settings: initialSettings,
      stats: initialStats,

      // Actions
      setGameMode: (mode) => set({ gameMode: mode }),
      
      setPaused: (paused) => set({ isPaused: paused }),
      
      startSession: () => {
        const now = Date.now();
        set({
          sessionScore: 0,
          sessionTime: 0,
          sessionStartTime: now,
          sessionDistance: 0,
          gameMode: 'playing',
          isPaused: false,
        });
      },
      
      endSession: () => {
        const state = get();
        const sessionTime = Date.now() - state.sessionStartTime;
        
        // Update stats
        const newStats = { ...state.stats };
        newStats.totalGamesPlayed += 1;
        
        if (state.sessionScore > state.stats.bestScore) {
          newStats.bestScore = state.sessionScore;
        }
        
        if (sessionTime > state.stats.bestTime) {
          newStats.bestTime = sessionTime;
        }
        
        if (state.sessionDistance > state.stats.bestDistance) {
          newStats.bestDistance = state.sessionDistance;
        }
        
        set({
          gameMode: 'gameOver',
          isPaused: false,
          stats: newStats,
        });
      },
      
      addScore: (points) => {
        const state = get();
        const newScore = state.sessionScore + points;
        set({ sessionScore: newScore });
        
        // Update best score if needed
        if (newScore > state.stats.bestScore) {
          set({
            stats: {
              ...state.stats,
              bestScore: newScore,
            },
          });
        }
      },
      
      addDistance: (distance) => {
        const state = get();
        const newDistance = state.sessionDistance + distance;
        set({ sessionDistance: newDistance });
        
        // Update best distance if needed
        if (newDistance > state.stats.bestDistance) {
          set({
            stats: {
              ...state.stats,
              bestDistance: newDistance,
            },
          });
        }
      },
      
      updateSettings: (newSettings) => {
        const state = get();
        set({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        });
      },
      
      resetGame: () => {
        set({
          gameMode: 'menu',
          isPaused: false,
          sessionScore: 0,
          sessionTime: 0,
          sessionStartTime: 0,
          sessionDistance: 0,
        });
      },
      
      updateStats: (newStats) => {
        const state = get();
        set({
          stats: {
            ...state.stats,
            ...newStats,
          },
        });
      },
    }),
    {
      name: 'space-drop-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
      }),
    }
  )
); 
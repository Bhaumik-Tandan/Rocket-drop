# Implementation Roadmap - First Steps

## Week 1: Start with Obstacle Variety

### Step 1: Add Obstacle Types (Day 1-2)
```typescript
// In FlightSimulator.tsx, add new obstacle types
interface SpaceObstacle {
  id: number;
  position: Position;
  height: number;
  isTop: boolean;
  passed: boolean;
  type: 'asteroid_field' | 'space_station' | 'satellite' | 'cosmic_storm';
  gapHeight?: number;
  // Add visual properties
  color: string;
  particleCount: number;
}

// Update obstacle creation logic
const createObstacle = (type: string, score: number) => {
  switch(type) {
    case 'space_station':
      return { color: '#4A90E2', particleCount: 8, width: PIPE_WIDTH + 10 };
    case 'satellite':
      return { color: '#FFD700', particleCount: 4, width: PIPE_WIDTH - 5 };
    case 'cosmic_storm':
      return { color: '#FF6B35', particleCount: 12, width: PIPE_WIDTH };
    default:
      return { color: '#00FF41', particleCount: 6, width: PIPE_WIDTH };
  }
};
```

### Step 2: Implement Difficulty Waves (Day 3-4)
```typescript
// Add difficulty wave logic
const isChallengeWave = (score: number) => score > 0 && score % 10 === 0;
const isBreatherWave = (score: number) => score > 0 && score % 15 === 0;

// Modify gap calculation
const calculateDynamicGap = (currentScore: number, worldSpeed: number): number => {
  let dynamicGap = BASE_GAP - (currentScore * GAP_REDUCTION_PER_SCORE);
  
  if (isChallengeWave(currentScore)) {
    dynamicGap = Math.max(MIN_GAP - 20, dynamicGap * 0.8); // 20% tighter
  } else if (isBreatherWave(currentScore)) {
    dynamicGap = Math.min(MAX_GAP + 30, dynamicGap * 1.2); // 20% wider
  }
  
  return Math.max(MIN_GAP, Math.min(MAX_GAP, dynamicGap));
};
```

### Step 3: Add Visual Variety (Day 5-7)
```typescript
// Update obstacle rendering with color and effects
{gameplayState.obstacles.map(obstacle => (
  <View
    key={obstacle.id}
    style={[
      styles.spaceObstacle,
      {
        left: obstacle.position.x,
        top: obstacle.position.y,
        width: obstacle.width || PIPE_WIDTH,
        height: obstacle.height,
        backgroundColor: obstacle.color, // Use dynamic color
      }
    ]}
  >
    {/* Add particle effects based on obstacle type */}
    {obstacle.particleCount > 0 && (
      <View style={styles.particleContainer}>
        {Array.from({ length: obstacle.particleCount }).map((_, i) => (
          <View key={i} style={styles.particle} />
        ))}
      </View>
    )}
  </View>
))}
```

## Week 2: Mission System

### Step 1: Create Mission Types (Day 1-2)
```typescript
// Add to gameStore.ts
interface Mission {
  id: string;
  type: 'survival' | 'score' | 'distance' | 'skill';
  target: number;
  description: string;
  reward: number;
  progress: number;
  completed: boolean;
}

interface GameState {
  // ... existing properties
  currentMission: Mission | null;
  dailyMission: Mission | null;
  weeklyMission: Mission | null;
}
```

### Step 2: Mission Generation (Day 3-4)
```typescript
// Generate daily missions
const generateDailyMission = (): Mission => {
  const missionTypes = [
    { type: 'survival', target: 30, description: 'Survive for 30 seconds' },
    { type: 'score', target: 25, description: 'Get 25 points' },
    { type: 'distance', target: 500, description: 'Travel 500 units' },
    { type: 'skill', target: 3, description: 'Get 3 near-miss bonuses' }
  ];
  
  const randomMission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
  return {
    id: `daily_${Date.now()}`,
    ...randomMission,
    reward: 50, // XP reward
    progress: 0,
    completed: false
  };
};
```

### Step 3: Mission UI (Day 5-7)
```typescript
// Add mission display to HUD
const MissionDisplay = () => {
  const { currentMission } = useGameStore();
  
  if (!currentMission) return null;
  
  return (
    <View style={styles.missionContainer}>
      <Text style={styles.missionText}>{currentMission.description}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentMission.progress / currentMission.target) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
};
```

## Week 3: XP and Progression

### Step 1: XP System (Day 1-3)
```typescript
// Add to gameStore.ts
interface GameState {
  // ... existing properties
  experience: number;
  level: number;
  levelProgress: number;
  nextLevelXP: number;
}

// XP calculation
const calculateXP = (score: number, nearMisses: number, perfectPasses: number) => {
  return score + (nearMisses * 2) + (perfectPasses * 3);
};

// Level calculation
const calculateLevel = (xp: number) => {
  return Math.floor(xp / 50) + 1;
};
```

### Step 2: Level Rewards (Day 4-5)
```typescript
// Level-based unlocks
const getLevelRewards = (level: number) => {
  const rewards = [];
  
  if (level >= 5) rewards.push('larger_hitbox');
  if (level >= 10) rewards.push('slower_gravity');
  if (level >= 15) rewards.push('forgiving_gaps');
  if (level >= 20) rewards.push('unlock_speed_ship');
  
  return rewards;
};
```

### Step 3: Visual Progression (Day 6-7)
```typescript
// Theme unlocks based on level
const getCurrentTheme = (level: number) => {
  if (level >= 20) return 'sunset';
  if (level >= 15) return 'ocean';
  if (level >= 10) return 'forest';
  return 'classic';
};
```

## Quick Wins (Can implement in 1-2 days)

### 1. Add Combo Multiplier
```typescript
// Track consecutive passes
const [comboCount, setComboCount] = useState(0);

// Update scoring
if (obstacle.passed && !obstacle.isTop) {
  const comboMultiplier = comboCount >= 3 ? 2 : 1;
  const newScore = newState.score + (1 * comboMultiplier);
  setComboCount(prev => prev + 1);
}
```

### 2. Expand Achievements
```typescript
// Add more achievement checks
if (newState.score === 75) {
  newState.achievement = "Space Veteran!";
} else if (newState.score === 150) {
  newState.achievement = "Cosmic Legend!";
} else if (newState.score === 200) {
  newState.achievement = "Galaxy Master!";
}
```

### 3. Add Daily Streak
```typescript
// Simple streak tracking
const [lastPlayedDate, setLastPlayedDate] = useState(null);
const [streakCount, setStreakCount] = useState(0);

// Check if it's a new day
const today = new Date().toDateString();
if (lastPlayedDate !== today) {
  if (lastPlayedDate === new Date(Date.now() - 86400000).toDateString()) {
    setStreakCount(prev => prev + 1); // Consecutive day
  } else {
    setStreakCount(1); // New streak
  }
  setLastPlayedDate(today);
}
```

## Testing Strategy

### Phase 1 Testing (Week 1-2)
- Test obstacle variety doesn't break gameplay
- Ensure difficulty waves feel fair
- Verify visual changes don't impact performance

### Phase 2 Testing (Week 3-4)
- Test XP system balance
- Verify level progression feels rewarding
- Ensure achievements unlock correctly

### Phase 3 Testing (Week 5-6)
- Test daily engagement features
- Verify streak system works correctly
- Test collectibles don't interfere with gameplay

## Performance Monitoring

### Key Metrics to Track
- FPS during complex obstacle patterns
- Memory usage with new visual effects
- Battery drain with particle systems
- Load time with new features

### Optimization Targets
- Maintain 60 FPS minimum
- Keep memory under 100MB
- Battery life: 2+ hours continuous play
- Load time: Under 3 seconds

## Next Steps

1. **Start with Week 1** - Obstacle variety is the foundation
2. **Test thoroughly** - Each feature should enhance, not break gameplay
3. **Measure impact** - Track engagement metrics after each phase
4. **Iterate quickly** - Fix issues before moving to next phase
5. **Keep it simple** - If a feature feels complex, simplify or remove it

Remember: The goal is to make the game more engaging while maintaining Flappy Bird's simplicity. Every new feature should feel natural and enhance the core experience. 
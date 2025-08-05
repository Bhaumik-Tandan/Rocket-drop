# 🌌 Universe Runner

A lightweight, high-performance endless runner game built with React Native and Expo. Navigate through space as an astronaut, jumping between planetary platforms while avoiding cosmic obstacles.

## 🎮 Game Features

- **Endless Runner Gameplay**: Auto-running astronaut with simple tap-to-jump controls
- **Space Theme**: Beautiful starfield background with planetary platforms
- **Power-ups**: Collect magnets and time-slow effects for advantages
- **Obstacles**: Avoid spikes, satellites, and asteroids
- **High Performance**: Optimized for smooth gameplay on all devices
- **Haptic Feedback**: Immersive touch feedback for actions
- **Score System**: Track your progress and beat your high score

## 🎯 Controls

- **Tap**: Jump over obstacles
- **Swipe Down**: Slide under obstacles
- **No double jumps**: Simple, accessible controls

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd universe-runner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

## 🛠️ Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch controls
- **Expo Haptics**: Tactile feedback

## 📱 Game Architecture

```
src/
├── components/          # Reusable game components
│   ├── Player.js       # Astronaut character
│   ├── Platform.js     # Planetary surfaces
│   ├── Obstacle.js     # Dangerous objects
│   ├── PowerUp.js      # Collectible items
│   ├── Starfield.js    # Background stars
│   └── GameUI.js       # User interface
├── screens/            # Game screens
│   └── GameScreen.js   # Main game logic
└── utils/              # Utilities and constants
    └── constants.js    # Game configuration
```

## 🎨 Design Principles

- **Low Graphics**: Simple 2D shapes and colors for performance
- **High Performance**: Optimized rendering and minimal animations
- **Accessible**: Easy-to-understand controls and visual feedback
- **Responsive**: Works on all screen sizes and device capabilities

## 🎯 Game Mechanics

### Physics
- Gravity-based jumping system
- Collision detection for obstacles and power-ups
- Smooth scrolling background

### Scoring
- Points earned for survival time
- Bonus points for successful jumps
- Power-up collection bonuses
- High score tracking

### Power-ups
- **Magnet**: Attracts nearby power-ups
- **Slow Time**: Reduces obstacle movement speed

## 🔧 Configuration

Game settings can be adjusted in `src/utils/constants.js`:

- Physics values (gravity, jump force)
- Spawn rates for obstacles and power-ups
- Visual styling and colors
- Performance settings

## 📦 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Game Rules Summary

| Feature | Description |
|---------|-------------|
| Character | Auto-running astronaut |
| Input | Single tap (jump), swipe down (slide) |
| Graphics | Flat 2D, vector-style, minimal animations |
| Obstacles | Simple types, static or slow-moving |
| Platforms | Sequential planetary tiles |
| Game Loop | Endless, resets on death, shows score |
| Performance | Optimized for low-end devices |

---

**Enjoy exploring the universe! 🚀** 
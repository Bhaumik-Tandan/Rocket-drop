# 🌍 Planet Hopper

A bite-sized, one-screen arcade game that's easy to pick up and hard to put down!

## 🎮 How to Play

**Objective:** Guide your little planet from the bottom of the screen up to the "solar portal" at the top.

**Controls:** Tap anywhere on the screen to make your planet hop upward. The planet falls under gravity when you don't tap.

**Obstacles:** Floating asteroids drift side-to-side across the screen. Landing squarely on an asteroid gives you a super-bounce (higher hop), but hitting an asteroid's edge spins you off course.

## 🚀 Game Mechanics

### Momentum Bounces
- Landing squarely on an asteroid grants a super-bounce (higher hop)
- Glancing blows spin you downward faster—watch your angle!

### Star Collectibles
- Three "solar flares" placed at increasing heights
- Each star gives you +100 points

### Timer & Combo System
- A 30-second timer ticks down—reach the portal before time's up
- Consecutive perfect asteroid bounces build a combo multiplier (×2, ×3…), rewarding skilled play

## 🌟 Features

- **Quick Sessions:** Each round is 30 seconds—perfect for a coffee-break challenge
- **Skill + Luck:** Easy to learn (tap to hop), but mastering bounce angles and timing keeps players coming back
- **Replayability:** Randomized asteroid drift patterns ensure no two runs feel identical
- **Haptic Feedback:** Feel the bounces and impacts on supported devices
- **Visual Effects:** Screen shake on misses, screen pulse on perfect landings

## 🎨 Visual Design

- **Graphics:** Simple vector art with emoji-based sprites
- **Background:** Parallax starfield for depth
- **Feedback:** Perfect landings briefly pulse the screen; misses cause a quick screen shake

## 🛠️ Technical Details

Built with:
- React Native
- Expo
- TypeScript
- Animated API for smooth animations
- Haptics for tactile feedback

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn start
   ```

3. Run on your preferred platform:
   ```bash
   yarn ios     # iOS Simulator
   yarn android # Android Emulator
   yarn web     # Web Browser
   ```

## 🎯 Why It Works

- **Quick Sessions:** Each round is 30 seconds—perfect for a coffee-break challenge
- **Skill + Luck:** Easy to learn (tap to hop), but mastering bounce angles and timing keeps players coming back
- **Replayability:** Randomized asteroid drift patterns and star placements ensure no two runs feel identical

Have fun hopping! 🚀 
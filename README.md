# 🎯 First Game - Anti-Aircraft Artillery

An anti-aircraft artillery game developed with **React** and **Pixi.js**, where you must shoot down enemy planes using an anti-aircraft cannon. The game combines the power of React for state management and UI with Pixi.js for high-performance rendering.

## 🎮 Game Features

### Core Mechanics
- **Shooting System**: Click to fire projectiles from an anti-aircraft cannon
- **Realistic Physics**: Projectiles follow ballistic trajectories with gravity
- **Ammunition System**: Start with 80 bullets, manage your ammo wisely
- **Dynamic Planes**: Planes fly in random trajectories every 4 seconds
- **Health System**: Each plane requires 4 hits to be shot down
- **Visual Effects**: Staged explosions (normal damage → death explosion)
- **Immersive Audio**: Sound effects for shots, explosions and background music

### Visual Elements
- **Background Clouds**: Multi-layer cloud system for depth effect
- **Dynamic Crosshair**: Aiming crosshair that follows the mouse cursor
- **Ammo Counter**: UI showing remaining bullets and planes shot down
- **Color Effects**: Planes change color randomly using hue filters
- **Collision Box**: Optional debug system to visualize hitboxes

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI framework with modern hooks
- **Pixi.js 8.8.1** - High-performance 2D rendering engine
- **@pixi/react 8.0.0** - React-Pixi.js integration
- **TypeScript** - Static typing for greater robustness

### Development Tools
- **Vite** - Ultra-fast build tool and dev server
- **ESLint** - Linter to keep code clean
- **Prettier** - Automatic code formatter

## 🚀 Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd first-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm start           # Alias for npm run dev

# Production
npm run build       # Build for production
npm run lint        # Run ESLint
```

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/
│   ├── entities/           # Game entities (planes, bullets, explosions)
│   ├── scenes/            # Game scenes
│   └── ui/                # User interface components
├── constants/             # Game configuration
├── contexts/              # React contexts (audio)
├── hooks/                 # Custom hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utilities and helpers
```

### Implemented Design Patterns

#### 1. **Separation of Concerns**
- **React**: State management, UI and application logic
- **Pixi.js**: Rendering, animations and visual effects
- **Custom Hooks**: Reusable logic and complex state management

#### 2. **Entity System**
- `PlaneSprite`: Plane with animation and physics
- `BulletSystem`: Projectile management with collisions
- `ExplosionSystem`: Staged explosion effects
- `CloudSystem`: Multi-layer cloud system

#### 3. **State Management**
- Custom hooks for each system (`usePlaneState`, `useBulletCounter`)
- Context API for global configuration (audio)
- Local state for specific components

## 🎯 How to Play

1. **Activate Audio**: Click the audio activation button when it appears
2. **Aim**: Move the mouse to aim with the red crosshair
3. **Shoot**: Click to fire projectiles
4. **Shoot Down Planes**: Each plane needs 4 hits to be destroyed
5. **Manage Ammunition**: You start with 80 bullets, use them wisely
6. **Configuration**: Use the config button to adjust volume

## ⚙️ Game Configuration

The file `src/constants/game-config.ts` contains all configuration:

```typescript
// Configuration examples
BULLET: {
  SPEED: 800,           // Projectile speed
  GRAVITY: 400,         // Applied gravity
  MAX_BULLETS: 50,      // Maximum simultaneous bullets
  INITIAL_AMMO: 80,     // Initial ammunition
}

PLANE: {
  MAX_HEALTH: 4,        // Hits needed to shoot down
  COLLISION_WIDTH: 800, // Collision box width
  COLLISION_HEIGHT: 150,// Collision box height
}
```

## 🎨 Customization

### Adding New Assets
1. Place files in `public/assets/`
2. Update `GAME_CONFIG.ASSETS` in `game-config.ts`
3. Use the `useAsset()` hook to load textures

### Modifying Physics
- Adjust `BULLET.GRAVITY` to change projectile trajectory
- Modify `BULLET.SPEED` for initial velocity
- Change `PLANE.MAX_HEALTH` for difficulty

### Visual Effects
- Enable `DEBUG.SHOW_COLLISION_BOXES` to see hitboxes
- Modify `CROSSHAIR.COLOR` to change crosshair color
- Adjust `EXPLOSION.DURATION` for explosion duration

## 🚀 Performance Optimizations

### Implemented
- **Object Pooling**: Object reuse for bullets and explosions
- **Sprite Batching**: Sprite grouping to reduce draw calls
- **Lazy Loading**: On-demand asset loading
- **Efficient Cleanup**: Automatic cleanup of unused resources
- **WebGPU Support**: Next-generation renderer with WebGL fallback

### Best Practices Followed
- Use of `useMemo` and `useCallback` to avoid unnecessary re-renders
- Separation of rendering logic and application logic
- Efficient memory management with cleanup in `useEffect`
- Animation optimization with Pixi.js `useTick`

## 🧪 Testing and Debugging

### Debug Tools
- **Collision Boxes**: Visualize collision boxes by enabling `DEBUG.SHOW_COLLISION_BOXES`
- **Console Logs**: Detailed information in browser console
- **Performance Monitoring**: Use browser DevTools to monitor FPS

### Manual Testing
- Test on different screen resolutions
- Verify behavior on mobile devices
- Test memory management during long sessions

## 📱 Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Devices
- **Desktop**: Optimized for mouse and keyboard
- **Mobile**: Touch compatible (consider adding touch controls)

## 🔮 Future Roadmap

### Planned Features
- [ ] Scoring system and leaderboards
- [ ] Multiple plane types with different behaviors
- [ ] Power-ups and weapon upgrades
- [ ] Multiple levels with different difficulties
- [ ] Multiplayer mode
- [ ] Advanced particle effects
- [ ] Achievement system

### Technical Improvements
- [ ] Web Workers implementation for physics
- [ ] Asset streaming system
- [ ] Additional mobile optimizations
- [ ] Analytics services integration

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code Standards
- Follow the project's naming conventions
- Use TypeScript for all new code
- Maintain separation between React and Pixi.js logic
- Document complex functions with JSDoc

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 👨‍💻 Author

Developed with ❤️ using React + Pixi.js

---

**Enjoy shooting down planes! 🛩️💥**

# 🎯 First Game - Artillería Antiaérea

Un juego de artillería antiaérea desarrollado con **React** y **Pixi.js**, donde debes derribar aviones enemigos usando un cañón antiaéreo. El juego combina la potencia de React para la gestión de estado y UI con Pixi.js para el rendering de alto rendimiento.

## 🎮 Características del Juego

### Mecánicas Principales
- **Sistema de Disparo**: Haz clic para disparar proyectiles desde un cañón antiaéreo
- **Física Realista**: Los proyectiles siguen trayectorias balísticas con gravedad
- **Sistema de Munición**: Comienza con 80 balas, gestiona tu munición sabiamente
- **Aviones Dinámicos**: Los aviones vuelan en trayectorias aleatorias cada 4 segundos
- **Sistema de Salud**: Cada avión requiere 4 impactos para ser derribado
- **Efectos Visuales**: Explosiones escalonadas (daño normal → explosión de muerte)
- **Audio Inmersivo**: Efectos de sonido para disparos, explosiones y música de fondo

### Elementos Visuales
- **Nubes de Fondo**: Sistema de nubes multicapa para efecto de profundidad
- **Mira Dinámica**: Cruz de puntería que sigue el cursor del mouse
- **Contador de Munición**: UI que muestra balas restantes y aviones derribados
- **Efectos de Color**: Los aviones cambian de color aleatoriamente usando filtros de matiz
- **Caja de Colisión**: Sistema de debug opcional para visualizar hitboxes

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI con hooks modernos
- **Pixi.js 8.8.1** - Motor de rendering 2D de alto rendimiento
- **@pixi/react 8.0.0** - Integración React-Pixi.js
- **TypeScript** - Tipado estático para mayor robustez

### Herramientas de Desarrollo
- **Vite** - Build tool y dev server ultra-rápido
- **ESLint** - Linter para mantener código limpio
- **Prettier** - Formateador de código automático

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd first-game
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm start           # Alias para npm run dev

# Producción
npm run build       # Construye para producción
npm run lint        # Ejecuta ESLint
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/
│   ├── entities/           # Entidades del juego (aviones, balas, explosiones)
│   ├── scenes/            # Escenas del juego
│   └── ui/                # Componentes de interfaz de usuario
├── constants/             # Configuración del juego
├── contexts/              # Contextos de React (audio)
├── hooks/                 # Custom hooks personalizados
├── types/                 # Definiciones de tipos TypeScript
└── utils/                 # Utilidades y helpers
```

### Patrones de Diseño Implementados

#### 1. **Separación de Responsabilidades**
- **React**: Gestión de estado, UI y lógica de aplicación
- **Pixi.js**: Rendering, animaciones y efectos visuales
- **Custom Hooks**: Lógica reutilizable y gestión de estado compleja

#### 2. **Sistema de Entidades**
- `PlaneSprite`: Avión con animación y física
- `BulletSystem`: Gestión de proyectiles con colisiones
- `ExplosionSystem`: Efectos de explosión escalonados
- `CloudSystem`: Sistema de nubes multicapa

#### 3. **Gestión de Estado**
- Hooks personalizados para cada sistema (`usePlaneState`, `useBulletCounter`)
- Context API para configuración global (audio)
- Estado local para componentes específicos

## 🎯 Cómo Jugar

1. **Activa el Audio**: Haz clic en el botón de activación de audio cuando aparezca
2. **Apunta**: Mueve el mouse para apuntar con la mira roja
3. **Dispara**: Haz clic para disparar proyectiles
4. **Derriba Aviones**: Cada avión necesita 4 impactos para ser destruido
5. **Gestiona Munición**: Comienzas con 80 balas, úsalas sabiamente
6. **Configuración**: Usa el botón de configuración para ajustar el volumen

## ⚙️ Configuración del Juego

El archivo `src/constants/game-config.ts` contiene toda la configuración:

```typescript
// Ejemplos de configuración
BULLET: {
  SPEED: 800,           // Velocidad de proyectiles
  GRAVITY: 400,         // Gravedad aplicada
  MAX_BULLETS: 50,      // Máximo de balas simultáneas
  INITIAL_AMMO: 80,     // Munición inicial
}

PLANE: {
  MAX_HEALTH: 4,        // Impactos necesarios para derribar
  COLLISION_WIDTH: 800, // Ancho de la caja de colisión
  COLLISION_HEIGHT: 150,// Alto de la caja de colisión
}
```

## 🎨 Personalización

### Agregar Nuevos Assets
1. Coloca los archivos en `public/assets/`
2. Actualiza `GAME_CONFIG.ASSETS` en `game-config.ts`
3. Usa el hook `useAsset()` para cargar las texturas

### Modificar Física
- Ajusta `BULLET.GRAVITY` para cambiar la trayectoria de proyectiles
- Modifica `BULLET.SPEED` para la velocidad inicial
- Cambia `PLANE.MAX_HEALTH` para la dificultad

### Efectos Visuales
- Activa `DEBUG.SHOW_COLLISION_BOXES` para ver hitboxes
- Modifica `CROSSHAIR.COLOR` para cambiar el color de la mira
- Ajusta `EXPLOSION.DURATION` para la duración de explosiones

## 🚀 Optimizaciones de Rendimiento

### Implementadas
- **Object Pooling**: Reutilización de objetos para balas y explosiones
- **Sprite Batching**: Agrupación de sprites para reducir draw calls
- **Lazy Loading**: Carga de assets bajo demanda
- **Efficient Cleanup**: Limpieza automática de recursos no utilizados
- **WebGPU Support**: Renderer de próxima generación con fallback a WebGL

### Mejores Prácticas Seguidas
- Uso de `useMemo` y `useCallback` para evitar re-renders innecesarios
- Separación de lógica de rendering y lógica de aplicación
- Gestión eficiente de memoria con cleanup en `useEffect`
- Optimización de animaciones con `useTick` de Pixi.js

## 🧪 Testing y Debugging

### Herramientas de Debug
- **Collision Boxes**: Visualiza las cajas de colisión activando `DEBUG.SHOW_COLLISION_BOXES`
- **Console Logs**: Información detallada en la consola del navegador
- **Performance Monitoring**: Usa las DevTools del navegador para monitorear FPS

### Testing Manual
- Prueba en diferentes resoluciones de pantalla
- Verifica el comportamiento en dispositivos móviles
- Testa la gestión de memoria durante sesiones largas

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- **Desktop**: Optimizado para mouse y teclado
- **Mobile**: Compatible con touch (considera agregar controles táctiles)

## 🔮 Roadmap Futuro

### Características Planificadas
- [ ] Sistema de puntuación y leaderboards
- [ ] Múltiples tipos de aviones con diferentes comportamientos
- [ ] Power-ups y mejoras de armamento
- [ ] Múltiples niveles con diferentes dificultades
- [ ] Modo multijugador
- [ ] Efectos de partículas avanzados
- [ ] Sistema de logros

### Mejoras Técnicas
- [ ] Implementación de Web Workers para física
- [ ] Sistema de asset streaming
- [ ] Optimizaciones adicionales para móviles
- [ ] Integración con servicios de analytics

## 🤝 Contribución

### Cómo Contribuir
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Estándares de Código
- Sigue las convenciones de naming del proyecto
- Usa TypeScript para todo el código nuevo
- Mantén la separación entre lógica React y Pixi.js
- Documenta funciones complejas con JSDoc

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ usando React + Pixi.js

---

**¡Disfruta derribando aviones! 🛩️💥**
import { useCallback, useEffect } from "react";
import { Graphics as PixiGraphics } from "pixi.js";

interface GameOverModalProps {
  x: number;
  y: number;
  width: number;
  height: number;
  planesDestroyed: number;
  onRestart: () => void;
}

/**
 * Game Over Modal component
 * - Displays when player runs out of bullets
 * - Shows final score (planes destroyed)
 * - Provides restart button to reset the game
 * - Uses military-style design consistent with the game
 */
export const GameOverModal = ({
  x,
  y,
  width,
  height,
  planesDestroyed,
  onRestart,
}) => {
  const drawModal = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Modal background - dark military style
      g.beginFill(0x000000, 0.95);
      g.drawRoundedRect(0, 0, width, height, 12);
      g.endFill();

      // Border - red for game over
      g.lineStyle(4, 0xff0000);
      g.drawRoundedRect(0, 0, width, height, 12);

      // Inner border for depth
      g.lineStyle(2, 0xaa0000);
      g.drawRoundedRect(3, 3, width - 6, height - 6, 9);
    },
    [width, height],
  );

  const drawRestartButton = useCallback((g: PixiGraphics) => {
    g.clear();

    // Button background
    g.beginFill(0x333333);
    g.drawRoundedRect(0, 0, 120, 40, 8);
    g.endFill();

    // Button border
    g.lineStyle(2, 0x00ff00);
    g.drawRoundedRect(0, 0, 120, 40, 8);

    // Button highlight
    g.lineStyle(1, 0x00aa00);
    g.drawRoundedRect(1, 1, 118, 38, 7);
  }, []);

  // Handle click events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if click is within modal bounds
      if (
        clickX >= x &&
        clickX <= x + width &&
        clickY >= y &&
        clickY <= y + height
      ) {
        const localX = clickX - x;
        const localY = clickY - y;

        // Check if click is on restart button
        const buttonX = (width - 120) / 2;
        const buttonY = height - 60;
        
        if (
          localX >= buttonX &&
          localX <= buttonX + 120 &&
          localY >= buttonY &&
          localY <= buttonY + 40
        ) {
          onRestart();
          return;
        }
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [x, y, width, height, onRestart]);

  return (
    <pixiContainer x={x} y={y}>
      {/* Modal background */}
      <pixiGraphics draw={drawModal} />

      {/* Game Over Title */}
      <pixiText
        text="GAME OVER"
        x={width / 2}
        y={40}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 32,
          fill: 0xff0000,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 2 },
        }}
      />

      {/* Results */}
      <pixiText
        text="MISSION RESULTS:"
        x={width / 2}
        y={100}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 18,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      <pixiText
        text={`ENEMY AIRCRAFT DESTROYED: ${planesDestroyed}`}
        x={width / 2}
        y={140}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 16,
          fill: 0xffffff,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      {/* Restart Button */}
      <pixiContainer x={(width - 120) / 2} y={height - 60}>
        <pixiGraphics draw={drawRestartButton} />
        <pixiText
          text="RESTART"
          x={60}
          y={20}
          anchor={0.5}
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 14,
            fill: 0x00ff00,
            fontWeight: "bold",
            stroke: { color: 0x000000, width: 1 },
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

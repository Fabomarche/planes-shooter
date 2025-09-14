import { useState, useCallback, useEffect } from "react";
import { Graphics as PixiGraphics } from "pixi.js";

interface PlayerNameInputProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onSave: (playerName: string) => void;
  onCancel: () => void;
  score: number;
}

/**
 * Player Name Input component
 * - Allows player to enter their name for the ranking
 * - Uses HTML input overlay for text input
 * - Military-style design consistent with the game
 */
export const PlayerNameInput = ({
  x,
  y,
  width,
  height,
  onSave,
  onCancel,
  score,
}: PlayerNameInputProps) => {
  const [playerName, setPlayerName] = useState("");
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  const drawInputBackground = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Background
      g.beginFill(0x000000, 0.95);
      g.drawRoundedRect(0, 0, width, height, 12);
      g.endFill();

      // Border - green for input
      g.lineStyle(4, 0x00ff00);
      g.drawRoundedRect(0, 0, width, height, 12);

      // Inner border for depth
      g.lineStyle(2, 0x00aa00);
      g.drawRoundedRect(3, 3, width - 6, height - 6, 9);
    },
    [width, height],
  );

  const drawSaveButton = useCallback((g: PixiGraphics) => {
    g.clear();

    // Button background
    g.beginFill(0x333333);
    g.drawRoundedRect(0, 0, 80, 35, 6);
    g.endFill();

    // Button border
    g.lineStyle(2, 0x00ff00);
    g.drawRoundedRect(0, 0, 80, 35, 6);

    // Button highlight
    g.lineStyle(1, 0x00aa00);
    g.drawRoundedRect(1, 1, 78, 33, 5);
  }, []);

  const drawCancelButton = useCallback((g: PixiGraphics) => {
    g.clear();

    // Button background
    g.beginFill(0x333333);
    g.drawRoundedRect(0, 0, 80, 35, 6);
    g.endFill();

    // Button border
    g.lineStyle(2, 0xff0000);
    g.drawRoundedRect(0, 0, 80, 35, 6);

    // Button highlight
    g.lineStyle(1, 0xaa0000);
    g.drawRoundedRect(1, 1, 78, 33, 5);
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

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

        // Check if click is on save button
        const saveButtonX = (width - 180) / 2;
        const saveButtonY = height - 50;
        
        if (
          localX >= saveButtonX &&
          localX <= saveButtonX + 80 &&
          localY >= saveButtonY &&
          localY <= saveButtonY + 35
        ) {
          if (playerName.trim()) {
            onSave(playerName.trim());
          }
          return;
        }

        // Check if click is on cancel button
        const cancelButtonX = saveButtonX + 100;
        
        if (
          localX >= cancelButtonX &&
          localX <= cancelButtonX + 80 &&
          localY >= saveButtonY &&
          localY <= saveButtonY + 35
        ) {
          onCancel();
          return;
        }
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [x, y, width, height, onSave, onCancel, playerName]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && playerName.trim()) {
        onSave(playerName.trim());
      } else if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onSave, onCancel, playerName]);

  return (
    <>
      {/* Pixi.js modal background */}
      <pixiContainer x={x} y={y}>
        <pixiGraphics draw={drawInputBackground} />

        {/* Title */}
        <pixiText
          text="NEW HIGH SCORE!"
          x={width / 2}
          y={30}
          anchor={0.5}
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 20,
            fill: 0x00ff00,
            fontWeight: "bold",
            stroke: { color: 0x000000, width: 2 },
          }}
        />

        {/* Score display */}
        <pixiText
          text={`SCORE: ${score}`}
          x={width / 2}
          y={60}
          anchor={0.5}
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 16,
            fill: 0xffffff,
            fontWeight: "bold",
            stroke: { color: 0x000000, width: 1 },
          }}
        />

        {/* Instructions */}
        <pixiText
          text="ENTER YOUR NAME:"
          x={width / 2}
          y={90}
          anchor={0.5}
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 14,
            fill: 0x00ff00,
            fontWeight: "bold",
            stroke: { color: 0x000000, width: 1 },
          }}
        />

        {/* Save Button */}
        <pixiContainer x={(width - 180) / 2} y={height - 50}>
          <pixiGraphics draw={drawSaveButton} />
          <pixiText
            text="SAVE"
            x={40}
            y={17}
            anchor={0.5}
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 12,
              fill: 0x00ff00,
              fontWeight: "bold",
              stroke: { color: 0x000000, width: 1 },
            }}
          />
        </pixiContainer>

        {/* Cancel Button */}
        <pixiContainer x={(width - 180) / 2 + 100} y={height - 50}>
          <pixiGraphics draw={drawCancelButton} />
          <pixiText
            text="CANCEL"
            x={40}
            y={17}
            anchor={0.5}
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 12,
              fill: 0xff0000,
              fontWeight: "bold",
              stroke: { color: 0x000000, width: 1 },
            }}
          />
        </pixiContainer>
      </pixiContainer>

      {/* HTML input overlay for text input */}
      <div
        style={{
          position: "absolute",
          left: x + 20,
          top: y + 110,
          width: width - 40,
          height: 30,
          zIndex: 1000,
        }}
      >
        <input
          ref={setInputRef}
          type="text"
          value={playerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
          maxLength={15}
          placeholder="PILOT NAME"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #00ff00",
            borderRadius: "4px",
            color: "#ffffff",
            fontFamily: "Courier New, monospace",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            outline: "none",
            padding: "0 10px",
          }}
        />
      </div>
    </>
  );
};
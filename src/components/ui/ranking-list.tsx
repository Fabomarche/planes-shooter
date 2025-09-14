import { useCallback } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { RankingEntry } from "../../hooks/use-ranking";

interface RankingListProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rankings: RankingEntry[];
}

/**
 * Ranking List component
 * - Displays top 5 scores in military-style design
 * - Shows player name, score, and date
 * - Uses consistent styling with the game's UI
 */
export const RankingList = ({
  x,
  y,
  width,
  height,
  rankings,
}: RankingListProps) => {
  const drawRankingBackground = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Background for ranking section
      g.beginFill(0x111111, 0.9);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();

      // Border
      g.lineStyle(2, 0x00ff00);
      g.drawRoundedRect(0, 0, width, height, 8);

      // Inner border for depth
      g.lineStyle(1, 0x00aa00);
      g.drawRoundedRect(1, 1, width - 2, height - 2, 7);
    },
    [width, height],
  );

  const drawRankingEntry = useCallback(
    (g: PixiGraphics, _entryY: number, isHighlighted: boolean = false) => {
      g.clear();

      // Entry background
      const bgColor = isHighlighted ? 0x222222 : 0x1a1a1a;
      g.beginFill(bgColor, 0.8);
      g.drawRoundedRect(0, 0, width - 20, 30, 4);
      g.endFill();

      // Entry border
      const borderColor = isHighlighted ? 0x00ff00 : 0x333333;
      g.lineStyle(1, borderColor);
      g.drawRoundedRect(0, 0, width - 20, 30, 4);
    },
    [width],
  );

  return (
    <pixiContainer x={x} y={y}>
      {/* Ranking background */}
      <pixiGraphics draw={drawRankingBackground} />

      {/* Title */}
      <pixiText
        text="TOP SCORES"
        x={width / 2}
        y={15}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 16,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      {/* Rankings */}
      {rankings.length === 0 ? (
        <pixiText
          text="NO SCORES YET"
          x={width / 2}
          y={height / 2}
          anchor={0.5}
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 14,
            fill: 0x666666,
            fontWeight: "bold",
            stroke: { color: 0x000000, width: 1 },
          }}
        />
      ) : (
        rankings.map((entry, index) => {
          const entryY = 40 + index * 35;
          const isTopThree = index < 3;
          
          return (
            <pixiContainer key={entry.id} x={10} y={entryY}>
              {/* Entry background */}
              <pixiGraphics draw={(g: PixiGraphics) => drawRankingEntry(g, entryY, isTopThree)} />
              
              {/* Position number */}
              <pixiText
                text={`${index + 1}.`}
                x={10}
                y={15}
                anchor={0}
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 12,
                  fill: isTopThree ? 0x00ff00 : 0xffffff,
                  fontWeight: "bold",
                  stroke: { color: 0x000000, width: 1 },
                }}
              />
              
              {/* Player name */}
              <pixiText
                text={entry.playerName.toUpperCase()}
                x={30}
                y={15}
                anchor={0}
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 11,
                  fill: 0xffffff,
                  fontWeight: "bold",
                  stroke: { color: 0x000000, width: 1 },
                }}
              />
              
              {/* Score */}
              <pixiText
                text={`${entry.score}`}
                x={width - 50}
                y={15}
                anchor={1}
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 12,
                  fill: isTopThree ? 0x00ff00 : 0xffffff,
                  fontWeight: "bold",
                  stroke: { color: 0x000000, width: 1 },
                }}
              />
              
              {/* Date */}
              <pixiText
                text={entry.date}
                x={width - 10}
                y={25}
                anchor={1}
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 8,
                  fill: 0x888888,
                  fontWeight: "normal",
                  stroke: { color: 0x000000, width: 1 },
                }}
              />
            </pixiContainer>
          );
        })
      )}
    </pixiContainer>
  );
};
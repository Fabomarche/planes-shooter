import { PlaneSprite } from '../entities/plane-sprite';
import { CloudSystem } from '../entities/cloud-system';

/**
 * Main game scene component
 * Follows pixi.mdc structure guidelines for scene organization
 */
export const GameScene = () => {
  return (
    <>
      <PlaneSprite />
      <CloudSystem cloudCount={8} />
      {/* Add more game entities here */}
    </>
  );
};

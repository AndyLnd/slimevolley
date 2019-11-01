<script>
  import { onDestroy } from "svelte";
  import GameContainer from "./GameContainer.svelte";
  import Slime from "./Slime.svelte";
  import Ball from "./Ball.svelte";
  import Floor from "./Floor.svelte";
  import { createScore, createSlime, createBall } from "./store.js";
  import { loop, createWall } from "./util.js";
  import { createKeyHandler } from "./keyhandler.js";

  const maxScore = 5;

  export const scoreL = createScore(maxScore);
  export const scoreR = createScore(maxScore);
  export const slimeL = createSlime(200, 580);
  export const slimeR = createSlime(600, 580);
  export const ball = createBall(200, 300, y => {
    if (y < 400) {
      scoreR.addPoint();
    } else {
      scoreL.addPoint();
    }
  });

  const keyHandler = createKeyHandler();
  keyHandler.addFunction("a", slimeL.left);
  keyHandler.addFunction("d", slimeL.right);
  keyHandler.addFunction("w", slimeL.jump);

  keyHandler.addFunction("ArrowLeft", slimeR.left);
  keyHandler.addFunction("ArrowRight", slimeR.right);
  keyHandler.addFunction("ArrowUp", slimeR.jump);

  const net = createWall(397, 510, 6, 70);

  const stopLoop = loop(() => {
    keyHandler.poll();
    slimeL.update(0, 397, 580);
    slimeR.update(403, 800, 580);
    ball.update(0, 800, 580, [net], [$slimeL, $slimeR]);
    slimeL.stop();
    slimeR.stop();
  });

  onDestroy(stopLoop);
</script>

<GameContainer width={800} height={600}>
  <Floor height={20} />
  <rect {...net} fill="white" />
  <Slime pos={$slimeL.p} facingRight target={$ball.p} color="blue" />
  <Slime pos={$slimeR.p} target={$ball.p} color="red" />
  <Ball pos={$ball.p} r={$ball.r} />
</GameContainer>

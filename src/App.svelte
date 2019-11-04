<script>
  import { onDestroy } from "svelte";
  import GameContainer from "./GameContainer.svelte";
  import Slime from "./Slime.svelte";
  import Ball from "./Ball.svelte";
  import Floor from "./Floor.svelte";
  import ScoreBoard from "./ScoreBoard.svelte";
  import { createGameStore } from "./store/game.js";
  import { createSlimeStore } from "./store/slime.js";
  import { createBallStore } from "./store/ball.js";
  import { loop, createWall } from "./util.js";
  import { createKeyHandler } from "./keyhandler.js";

  const maxScore = 6;
  const game = createGameStore();
  export const slimeL = createSlimeStore(200, 580);
  export const slimeR = createSlimeStore(600, 580);
  export const ball = createBallStore(200, 300, x => {
    if ($game.ballIsHot) {
      const leftScores = x > 400;
      if (leftScores) {
        game.winRoundL();
      } else {
        game.winRoundR();
      }
      if (!$game.gameOver) {
        setTimeout(() => {
          ball.reset(leftScores);
          slimeL.reset();
          slimeR.reset();
          game.startRound();
        }, 800);
      }
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

  const startGame = () => {
    ball.reset(true);
    slimeL.reset();
    slimeR.reset();
    game.startGame();
  };

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

<style>
  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(5deg);
    }
  }

  text {
    font-size: 150px;
    width: 800px;
    cursor: pointer;
    transform-origin: 50%;
    animation: 0.3s ease-in-out infinite alternate bounce;
  }
  .spin {
    transform-origin: 50%;
    animation: 1s ease-in-out infinite alternate spin;
  }
</style>

<GameContainer width={800} height={600}>
  {#if $game.gameOver}
    <g class="spin">
      <text x={400} y={300}>
        <tspan on:click={startGame} text-anchor="middle">🏐</tspan>
      </text>
    </g>
  {:else}
    <ScoreBoard {maxScore} score={$game.scoreL} x={20} y={30} />
    <ScoreBoard {maxScore} toLeft score={$game.scoreR} x={600} y={30} />
  {/if}
  <Floor height={20} />
  <rect {...net} fill="white" />
  <Slime
    pos={$slimeL.p}
    isDancing={$game.started && !$game.ballIsHot && $game.leftWonLast}
    facingRight
    target={$ball.p}
    color="blue" />
  <Slime
    pos={$slimeR.p}
    isDancing={$game.started && !$game.ballIsHot && !$game.leftWonLast}
    target={$ball.p}
    color="red" />
  <Ball pos={$ball.p} r={$ball.r} />
</GameContainer>

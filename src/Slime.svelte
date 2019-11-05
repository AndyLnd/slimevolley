<script>
  import Eye from "./Eye.svelte";

  export let pos = { x: 0, y: 0 };
  export let target = { x: 0, y: 0 };
  export let color = "";
  export let isDancing = false;

  export let facingRight = false;
</script>

<style>
  @keyframes dance {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-25px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .dance {
    animation: 0.2s 0.2s forwards linear 10 dance;
  }
</style>

<radialGradient id="ball-gradient-{color}" cx="50%" cy="25%" r="150%">
  <stop offset="0%" stop-color={color} />
  <stop offset="100%" stop-color="black" />
</radialGradient>

<g id="slimeL" transform="translate({pos.x} {pos.y})">
  <g class:dance={isDancing}>
    <path d="M-50,0 a1,1 0 0,1 100,0" fill="url(#ball-gradient-{color})" />
    <Eye x={facingRight ? 25 : -25} y={-25} parentPos={pos} {target} />
  </g>
</g>

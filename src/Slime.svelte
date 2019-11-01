<script>
  import Eye from "./Eye.svelte";

  export let pos = { x: 0, y: 0 };
  export let target = { x: 0, y: 0 };
  export let color = "";

  export let facingRight = false;
</script>

<radialGradient id="ball-gradient-{color}" cx="50%" cy="25%" r="150%">
  <stop offset="0%" stop-color={color} />
  <stop offset="100%" stop-color="black" />
</radialGradient>

<g id="slimeL" transform="translate({pos.x} {pos.y})">
  <path d="M-50,0 a1,1 0 0,1 100,0" fill="url(#ball-gradient-{color})" />
  <Eye x={facingRight ? 25 : -25} y={-25} parentPos={pos} {target} />
</g>

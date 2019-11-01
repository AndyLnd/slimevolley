<script>
	import Eye from './Eye.svelte';

	export let pos = {x:0,y:0};
	export let target = {x:0,y:0};
	export let color = '';

	export let facingRight = false;
</script>

<g id="slimeL" transform="translate({pos.x} {pos.y})">
		<path d="M-50,0 a1,1 0 0,1 100,0" fill={color} />
		<Eye x={facingRight ? 25 : -25} y={-25} parentPos={pos} {target}/>
</g>
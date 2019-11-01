<script>
	export let x = 0;
	export let y = 0;
	export let parentPos = {x:0,y:0};
	export let target =  {x:0,y:0};
	let pupilX;
	let pupilY;
	
	let blink = false;
	const initBlink = () => {
		blink = false
		setTimeout(()=>{
			blink = true;
			setTimeout(initBlink, 60);
		}, Math.random() * 2000 + 1000)
	}
	initBlink();
	
	$: {
		const diffX = target.x - (parentPos.x + x);
   	const diffY = target.y - (parentPos.y + y);
	 	const length = Math.sqrt(diffX ** 2 + diffY ** 2);
	 	const scale = length > 4 ? length / 4 : 1;
	 	pupilX = diffX / scale;
	 	pupilY = diffY / scale;
	}

</script>		

<g transform="translate({x} {y})">
	{#if blink}
	<circle cx="0" cy="0" r="10" fill="rgba(0,0,0,.3)" />
	{:else}
	<circle cx="0" cy="0" r="10" fill="white" />
	<circle cx="0" cy="0" r="6" fill="black" transform="translate({pupilX} {pupilY})"/>
	{/if}
</g>
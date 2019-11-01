<script>
	import {onDestroy} from 'svelte';
	import GameContainer from './GameContainer.svelte';
	import Slime from './Slime.svelte';
	import Ball from './Ball.svelte';
	import {slimeL, slimeR, ball} from './store.js';
	import {loop} from './util.js';
	import {createKeyHandler} from './keyhandler.js';
	
	const keyHandler = createKeyHandler();
	keyHandler.addFunction('a', slimeL.left);
	keyHandler.addFunction('d', slimeL.right);
	keyHandler.addFunction('w', slimeL.jump);
	
	keyHandler.addFunction('ArrowLeft', slimeR.left);
	keyHandler.addFunction('ArrowRight', slimeR.right);
	keyHandler.addFunction('ArrowUp', slimeR.jump);
	
	
	const stopLoop = loop(()=> {
		keyHandler.poll();
		slimeL.update(0,397,580);
		slimeR.update(403,800,580);
		ball.update(0,800,580,[],[$slimeL,$slimeR]);
		slimeL.stop();
		slimeR.stop();
	});
	
	onDestroy(stopLoop)
	
</script>

<GameContainer width={800} height={600}>
	<rect x="0" y="580" width="800" height="20"  fill="grey"/>
	<rect x="397" y="510" width="6px" height="70" fill="white"/>
	<Slime pos={$slimeL.p} facingRight target={$ball.p} color="blue"/>
	<Slime pos={$slimeR.p} target={$ball.p} color="red"/>
	<Ball pos={$ball.p} r={$ball.r}/>
</GameContainer>

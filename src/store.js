import {writable} from 'svelte/store';
import {clamp} from './util.js';
import {vec, vAdd, vMul, vLength, doBallSlimeCollide, resolveBallCollision} from './physics.js';

  const damp = 0.95;
	const maxSpeed = 16;
	const g = .5;
	const jumpForce =  -10;

function createSlime(x, y) {
  const data = writable({p: vec(x, y), v: vec(0, 0), r: 50});
  let isFloored = true;

  const update = (left, right, floor) => {
    data.update(({p, v, r}) => {
      const finalLeft = left + r;
      const finalRight = right - r;
      const newY = p.y + v.y;
      const newX = p.x + v.x;
      isFloored = newY >= floor;
      return {
        p: vec(clamp(newX, finalLeft, finalRight), isFloored ? floor : newY),
        v: vec(v.x, isFloored ? 0 : v.y + g),
        r,
      };
    });
  };

  return {
    subscribe: data.subscribe,
    update,
    left: () => data.update(({p, v, r}) => ({p, v: vec(-8, v.y), r})),
    right: () => data.update(({p, v, r}) => ({p, v: vec(8, v.y), r})),
    stop: () => data.update(({p, v, r}) => ({p, v: vec(0, v.y), r})),
    jump: () => isFloored && data.update(({p, v, r}) => ({p, v: vec(v.x, jumpForce), r})),
  };
}

function createBall(x, y) {
  const data = writable({p: vec(x, y), v: vec(0, 0), r: 8});

  const update = (left, right, floor, walls = [], slimes = []) => {
    data.update(({p, v, r}) => {
      let newBall = {r, v: vAdd(v, vec(0, g))};
      newBall.p = vAdd(p, newBall.v);

      slimes.forEach(slime => {
        if (doBallSlimeCollide(newBall, slime)) {
          newBall = resolveBallCollision(newBall, slime);
        }
      });
      const finalLeft = left + r;
      const finalRight = right - r;
      const finalFloor = floor - r;
      const hitsWall = newBall.p.x <= finalLeft || newBall.p.x >= finalRight;

      const hitsFloor = newBall.p.y >= finalFloor;
      newBall.p = vec(
        hitsWall ? (newBall.p.x <= finalLeft ? finalLeft : finalRight) : newBall.p.x,
        hitsFloor ? finalFloor : newBall.p.y
      );
      newBall.v = vec(newBall.v.x * (hitsWall ? -1 : 1), newBall.v.y * (hitsFloor ? -1 : 1));
      if (hitsWall || hitsFloor) {
        newBall.v = vMul(newBall.v, damp);
      }
			const speed = vLength(newBall.v);
			if (speed > maxSpeed) {
				newBall.v = vMul(newBall.v, maxSpeed / speed);
			}

      return newBall;
    });
  };

  return {
    subscribe: data.subscribe,
    update,
  };
}


export const slimeL = createSlime(200, 580);
export const slimeR = createSlime(600, 580);
export const ball = createBall(200, 300);

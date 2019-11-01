import {writable} from 'svelte/store';
import {clamp} from './util.js';
import {
  vec,
  vAdd,
  vMul,
  vLength,
  doBallSlimeCollide,
  resolveBallCollision,
  checkWallCollision,
  Direction,
} from './physics.js';

const damp = 0.95;
const maxSpeed = 16;
const gBall = 0.5;
const gSlime = 0.7;
const vSlime = 8;
const jumpForce = -13.4;

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
        v: vec(v.x, isFloored ? 0 : v.y + gSlime),
        r,
      };
    });
  };

  return {
    subscribe: data.subscribe,
    update,
    left: () => data.update(({p, v, r}) => ({p, v: vec(-vSlime, v.y), r})),
    right: () => data.update(({p, v, r}) => ({p, v: vec(vSlime, v.y), r})),
    stop: () => data.update(({p, v, r}) => ({p, v: vec(0, v.y), r})),
    jump: () => isFloored && data.update(({p, v, r}) => ({p, v: vec(v.x, jumpForce), r})),
  };
}

function createBall(x, y) {
  const data = writable({p: vec(x, y), v: vec(0, 0), r: 8});

  const update = (left, right, floor, walls = [], slimes = []) => {
    data.update(({p, v, r}) => {
      let newBall = {r, v: vAdd(v, vec(0, gBall))};
      newBall.p = vAdd(p, newBall.v);

      slimes.forEach(slime => {
        if (doBallSlimeCollide(newBall, slime)) {
          newBall = resolveBallCollision(newBall, slime);
        }
      });

      let hitsWall = false;
      const {Left, Right, Up, Down} = Direction;
      walls.forEach(wall => {
        const direction = checkWallCollision(newBall, wall);
        if (direction) {
          hitsWall = true;
          if ([Left, Right].includes(direction)) {
            newBall.v.x = -newBall.v.x;
            newBall.p.x = direction === Left ? wall.x2 + r : wall.x - r;
          }
          if ([Up, Down].includes(direction)) {
            newBall.v.y = -newBall.v.y;
            newBall.p.y = direction === Up ? wall.y2 + r : wall.y - r;
          }
        }
      });

      const finalLeft = left + r;
      const finalRight = right - r;
      const finalFloor = floor - r;

      const hitsBounds = newBall.p.x <= finalLeft || newBall.p.x >= finalRight;

      const hitsFloor = newBall.p.y >= finalFloor;
      newBall.p = vec(
        hitsBounds ? (newBall.p.x <= finalLeft ? finalLeft : finalRight) : newBall.p.x,
        hitsFloor ? finalFloor : newBall.p.y
      );
      newBall.v = vec(newBall.v.x * (hitsBounds ? -1 : 1), newBall.v.y * (hitsFloor ? -1 : 1));
      if (hitsBounds || hitsFloor || hitsWall) {
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

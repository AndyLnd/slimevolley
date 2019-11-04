import {writable} from 'svelte/store';
import {
  vec,
  vAdd,
  vMul,
  vLength,
  doBallSlimeCollide,
  resolveBallCollision,
  checkWallCollision,
  Direction,
} from '../physics.js';

const damp = 0.95;
const maxSpeed = 16;
const gBall = 0.5;

export function createBallStore(x, y, onHitFloor = () => {}) {
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
      if (hitsFloor) {
        onHitFloor(newBall.p.x);
      }
      return newBall;
    });
  };

  return {
    subscribe: data.subscribe,
    update,
    reset(leftScores) {
      data.set({p: vec(leftScores ? x : 800 - x, y), v: vec(0, 0), r: 8});
    },
  };
}

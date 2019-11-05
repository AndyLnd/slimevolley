import {writable} from 'svelte/store';
import {clamp} from '../util.js';
import {vec} from '../physics.js';

const gSlime = 0.7;
const vSlime = 6;
const jumpForce = -13.4;

export function createSlimeStore(x, y) {
  const data = writable({p: vec(x, y), v: vec(0, 0), r: 50, isDancing: false});
  let isFloored = true;

  const update = (left, right, floor, auto = false, ball) => {
    data.update(({p, v, r, isDancing}) => {
      const finalLeft = left + r;
      const finalRight = right - r;
      let newVX = v.x;
      let newVY = v.y;

      if (auto) {
        const ballDist = ball.p.x - p.x;
        const isBallLeft = ballDist < 0;
        const isFast = isBallLeft ? ball.v.x > vSlime : ball.v.x < -vSlime;
        if (Math.abs(ballDist) > 5) {
          newVX = isBallLeft ? (isFast ? vSlime : -vSlime) : isFast ? -vSlime : vSlime;
        } else if (Math.abs(ballDist) < 1) {
          newVX = p.x < 400 ? -vSlime : vSlime;
        }
      }

      const newY = p.y + newVY;
      const newX = p.x + newVX;
      isFloored = newY >= floor;
      newVY = isFloored ? 0 : newVY + gSlime;

      if (auto && isFloored && Math.abs(ball.p.x - p.x) < 15) {
        newVY = jumpForce;
      }

      return {
        p: vec(clamp(newX, finalLeft, finalRight), isFloored ? floor : newY),
        v: vec(newVX, newVY),
        r,
        isDancing,
      };
    });
  };

  return {
    subscribe: data.subscribe,
    update,
    left() {
      data.update(d => ({...d, v: vec(-vSlime, d.v.y)}));
    },
    right() {
      data.update(d => ({...d, v: vec(vSlime, d.v.y)}));
    },
    stop() {
      data.update(d => ({...d, v: vec(0, d.v.y)}));
    },
    jump() {
      isFloored && data.update(d => ({...d, v: vec(d.v.x, jumpForce)}));
    },
    dance() {
      data.update(d => ({...d, isDancing: true}));
    },
    reset() {
      data.set({p: vec(x, y), v: vec(0, 0), r: 50, isDancing: false});
    },
  };
}

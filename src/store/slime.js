import {writable} from 'svelte/store';
import {clamp} from '../util.js';
import {
  vec,
} from '../physics.js';

const gSlime = 0.7;
const vSlime = 6;
const jumpForce = -13.4;

export function createSlimeStore(x, y) {
  const data = writable({p: vec(x, y), v: vec(0, 0), r: 50, isDancing: false});
  let isFloored = true;

  const update = (left, right, floor) => {
    data.update(({p, v, r, isDancing}) => {
      const finalLeft = left + r;
      const finalRight = right - r;
      const newY = p.y + v.y;
      const newX = p.x + v.x;
      isFloored = newY >= floor;
      return {
        p: vec(clamp(newX, finalLeft, finalRight), isFloored ? floor : newY),
        v: vec(v.x, isFloored ? 0 : v.y + gSlime),
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
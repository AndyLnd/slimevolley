export const loop = fn => {
  let rafId;
  const loopedFn = () => {
    rafId = requestAnimationFrame(loopedFn);
    fn();
  };
  loopedFn();

  return () => cancelAnimationFrame(rafId);
};

export const createWall = (x, y, width, height) => ({x, y, width, height, x2: x + width, y2: y + height});

export const clamp = (val, low, high) => Math.min(high, Math.max(low, val));

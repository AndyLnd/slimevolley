export const vLength = v => Math.sqrt(v.x * v.x + v.y * v.y);
export const vSub = (v1, v2) => vec(v1.x - v2.x, v1.y - v2.y);
export const vAdd = (v1, v2) => vec(v1.x + v2.x, v1.y + v2.y);
export const vMul = (v, m) => vec(v.x * m, v.y * m);
export const vec = (x, y) => ({x, y});
export const vClone = ({x, y}) => ({x, y});

export const doBallSlimeCollide = (ball, slime) => {
  if (ball.p.y >= slime.p.y) {
    return false;
  }
  const maxDist = ball.r + slime.r;
  const dist = vLength(vSub(ball.p, slime.p));
  return dist <= maxDist;
};

// based on https://blogs.msdn.microsoft.com/faber/2013/01/09/elastic-collisions-of-balls/
export function resolveBallCollision(ball, slime) {
  const newBall = {p: vClone(ball.p), v: vClone(ball.v), r: ball.r};
  const newSlime = {p: vClone(slime.p), v: vClone(slime.v), r: slime.r};

  const collisionAngle = Math.atan2(slime.p.y - ball.p.y, slime.p.x - ball.p.x);
  const speedBall = vLength(ball.v);
  const speedSlime = vLength(slime.v);

  const directionBall = Math.atan2(ball.v.y, ball.v.x);
  const directionSlime = Math.atan2(slime.v.y, slime.v.x);

  const newXSpeedBall = speedBall * Math.cos(directionBall - collisionAngle);
  const newYSpeedBall = speedBall * Math.sin(directionBall - collisionAngle);
  const newXSpeedSlime = speedSlime * Math.cos(directionSlime - collisionAngle);
  const newYSpeedSlime = speedSlime * Math.sin(directionSlime - collisionAngle);

  const finalXSpeedBall = 2 * newXSpeedSlime - newXSpeedBall;
  const finalXSpeedSlime = newXSpeedSlime;
  const finalYSpeedBall = newYSpeedBall;
  const finalYSpeedSlime = newYSpeedSlime;

  const cosAngle = Math.cos(collisionAngle);
  const sinAngle = Math.sin(collisionAngle);
  newBall.v.x = cosAngle * finalXSpeedBall - sinAngle * finalYSpeedBall;
  newBall.v.y = sinAngle * finalXSpeedBall + cosAngle * finalYSpeedBall;
  newSlime.v.x = cosAngle * finalXSpeedSlime - sinAngle * finalYSpeedSlime;
  newSlime.v.y = sinAngle * finalXSpeedSlime + cosAngle * finalYSpeedSlime;

  let posBall = vec(ball.p.x, ball.p.y);
  let posSlime = vec(slime.p.x, slime.p.y);

  const posDiff = vSub(posBall, posSlime);
  const d = vLength(posDiff);
  const mtd = vMul(posDiff, (ball.r + slime.r - d) / d);

  posBall = vAdd(posBall, mtd);
  posSlime = posSlime;
  newBall.p = posBall;
  newSlime.p = posSlime;
  return newBall;
}

export const Direction = {
  None: 0,
  Up: 1,
  Right: 2,
  Down: 3,
  Left: 4,
};

export const checkWallCollision = ({v, p, r}, wall) => {
  const goesLeft = v.x < 0;
  const goesUp = v.y < 0;
  const left = wall.x2 - p.x + r;
  const right = p.x + r - wall.x;
  const top = wall.y2 - p.y + r;
  const bottom = p.y + r - wall.y;

  if (left > 0 && right > 0 && top > 0 && bottom > 0) {
    const x = goesLeft ? left : right;
    const y = goesUp ? top : bottom;
    if (x < y) {
      return goesLeft ? Direction.Left : Direction.Right;
    } else {
      return goesUp ? Direction.Up : Direction.Down;
    }
  }
  return Direction.None;
};

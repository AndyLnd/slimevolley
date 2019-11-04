import {writable} from 'svelte/store';

export const createGameStore = () => {
  const maxScore = 6;
  const {subscribe, set, update} = writable({
    leftWonLast: false,
    scoreL: 0,
    scoreR: 0,
    ballIsHot: false,
    gameOver: true,
    started: false,
  });

  const winRound = (left = false) => {
    update(({scoreL, scoreR}) => {
      const newScoreL = left ? scoreL + 1 : scoreL;
      const newScoreR = left ? scoreR : scoreR + 1;
      const gameOver = Math.max(newScoreL, newScoreR) >= maxScore;

      return {scoreL: newScoreL, scoreR: newScoreR, gameOver, leftWonLast: left, ballIsHot: false, started: true};
    });
  };

  const startRound = () => {
    update(state => {
      return {
        ...state,
        ballIsHot: true,
      };
    });
  };

  const startGame = () => {
    set({
      leftWonLast: false,
      scoreL: 0,
      scoreR: 0,
      ballIsHot: true,
      gameOver: false,
      started: true,
    });
  };

  return {
    subscribe,
    winRoundL: () => winRound(true),
    winRoundR: () => winRound(),
    startRound,
    startGame,
  };
};

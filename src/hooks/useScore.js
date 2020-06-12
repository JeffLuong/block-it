import { useReducer } from 'react';

export const RESET_SCORE = 'RESET_SCORE';
export const UPDATE_SCORE = 'UPDATE_SCORE';

const scoreReducer = (state, action) => {
  const { type, payload } = action;
  if (type === 'UPDATE_SCORE') {
    const newScore = state + payload.score;
    return newScore;
  }
  if (type === 'RESET_SCORE') {
    return 0;
  }
  return state;
};

const useScore = (initial = 0) => {
  const [score, dispatch] = useReducer(scoreReducer, initial);
  return [score, dispatch];
};

export default useScore;

import { useReducer } from 'react';

export const RESET_SCORE = 'RESET_SCORE';
export const UPDATE_SCORE = 'UPDATE_SCORE';

export type ScoreAction = {
  type: typeof RESET_SCORE | typeof UPDATE_SCORE,
  payload?: {
    score: number
  }
}
type UseScore = (init: number) => [number, React.Dispatch<ScoreAction>];
type ScoreReducer = (state: number, action: ScoreAction) => number;

const scoreReducer: ScoreReducer = (state, action) => {
  const { type, payload } = action;
  if (type === 'UPDATE_SCORE' && payload) {
    const newScore = state + payload.score;
    return newScore;
  }
  if (type === 'RESET_SCORE') {
    return 0;
  }
  return state;
};

const useScore: UseScore = (initial: number = 0) => {
  const [score, dispatch] = useReducer(scoreReducer, initial);
  return [score, dispatch];
};

export default useScore;

import { useReducer } from 'react';

enum ActionTypes {
  RESET_SCORE = 'RESET_SCORE',
  UPDATE_SCORE = 'UPDATE_SCORE'
};

export const RESET_SCORE = ActionTypes.RESET_SCORE;
export const UPDATE_SCORE = ActionTypes.UPDATE_SCORE;

export type MetricsState = { score: number, rows: number };

export type ScoreAction = {
  type: ActionTypes.RESET_SCORE | ActionTypes.UPDATE_SCORE,
  payload?: MetricsState
};

type UseScore = (init: MetricsState) => [MetricsState, React.Dispatch<ScoreAction>];
type ScoreReducer = (state: MetricsState, action: ScoreAction) => MetricsState;

const scoreReducer: ScoreReducer = (state, action) => {
  const { type, payload } = action;
  if (type === UPDATE_SCORE && payload) {
    const { score, rows } = state;
    return {
      score: score + payload.score,
      rows: rows + payload.rows
    };
  }
  if (type === RESET_SCORE) {
    return {
      score: 0,
      rows: 0
    };
  }
  return state;
};

const useScore: UseScore = (initial: MetricsState = { score: 0, rows: 0 }) => {
  const [metrics, dispatch] = useReducer(scoreReducer, initial);
  return [metrics, dispatch];
};

export default useScore;

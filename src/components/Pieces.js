import Piece from '../models/Piece';

export const Colors = {
  1: 'yellow',
  2: 'purple',
  3: 'blue',
  4: 'green',
  5: 'cyan',
  6: 'red',
  7: 'orange'
};

const I = new Piece(
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ]
);

const J = new Piece(
  [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0]
  ]
);

const L = new Piece(
  [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3]
  ]
);

const O = new Piece(
  [
    [4, 4],
    [4, 4]
  ]
);

const S = new Piece(
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ]
);

const T = new Piece(
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ]
);

const Z = new Piece(
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
);

export default [I, J, L, O, S, T, Z ];

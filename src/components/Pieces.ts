export const Colors: {
  [num: number]: string
} = {
  1: '#ffd700', // navy
  2: '#b266b2', // purple
  3: '#0080ff', // blue
  4: '#32c232', // green
  5: '#66d1d1', // cyan
  6: '#cd0000', // red
  7: '#ffae19'  // orange
};

const I = [
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];


const J = [
  [2, 0, 0],
  [2, 2, 2],
  [0, 0, 0]
];


const L = [
  [0, 0, 3],
  [3, 3, 3],
  [0, 0, 0]
];


const O = [
  [4, 4],
  [4, 4]
];


const S = [
  [0, 5, 5],
  [5, 5, 0],
  [0, 0, 0]
];


const T = [
  [0, 6, 0],
  [6, 6, 6],
  [0, 0, 0]
];


const Z = [
  [7, 7, 0],
  [0, 7, 7],
  [0, 0, 0]
];


export default [I, J, L, O, S, T, Z ];

import * as React from 'react';

import Board from './Board';

const Tetris: React.FC<{}> = () => {
  const width = 10;
  return <Board width={width} height={width * 2} />;
};

export default Tetris;
import * as React from 'react';

import Board from '../Board';
import useTimeout from '../../hooks/useTimeout';
import Loader from '../Loader';
import Button from '../Button';

import './Tetris.css';

const { useState } = React;

const StartGame = ({ onStart }: { onStart: () => void }) => {
  const [startTriggered, triggerStart] = React.useState(false);

  useTimeout(() => {
    if (startTriggered) {
      onStart();
    }
  }, 2000, [startTriggered]);

  return (
    <div className="StartGameWrapper">
      {startTriggered ? (
        <Loader />
      ) : (
        <Button onClick={() => triggerStart(true)}>
          Start
        </Button>
      )}
    </div>
  );
};

const Tetris: React.FC<{}> = () => {
  const [start, initializeGame] = useState(false);
  const width = 10;

  return (
    <>
      <header>
        <h1 style={{ marginBottom: 0 }}>Block It</h1>
      </header>
      <div className="GameContainer">
        {start ? (
          <Board width={width} height={width * 2} />
        ) : (
          <StartGame onStart={() => initializeGame(true)} />
        )}
      </div>
    </>
  );
};

export default Tetris;
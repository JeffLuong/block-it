import React, { useRef, useEffect } from 'react';

import Game from '../models/Game';
import useEventListener from '../hooks/useEventListener';
import useScore from '../hooks/useScore';

const BOARD_SCALE = 35;
const Scoreboard = ({ score }) => <h4>{score}</h4>;

const Board = ({ width, height }) => {
  const canvasRef = useRef();
  const game = useRef();
  const [score, updateScore] = useScore(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.scale(BOARD_SCALE, BOARD_SCALE);

    game.current = new Game(context, updateScore);
    game.current.init();
  }, []);

  useEventListener('keydown', event => {
    const { current: _game } = game;
    const { keyCode } = event;
    switch(keyCode) {
      case 37:
        _game.movePlayer(-1);
        break;
      case 39:
        _game.movePlayer(1);
        break;
      case 40:
        _game.dropPlayer();
        break;
      case 65:
        _game.rotatePiece(-1);
        break;
      case 68:
        _game.rotatePiece(1);
        break;
      case 80:
        _game.pause();
        break;
      default:
        break;
    }
  });

  return (
    <>
      <Scoreboard score={score} />
      <canvas
        ref={canvasRef}
        id="Tetris"
        width={width * BOARD_SCALE}
        height={height * BOARD_SCALE}>
      </canvas>
    </>
  );
};

export default Board;
import * as React from 'react';

import Game from '../models/Game';
import useEventListener from '../hooks/useEventListener';
import useScore from '../hooks/useScore';

// Need to extend Event because KeyboardEvent is not compatible with Event
interface CustomKBEvent extends Event {
  keyCode?: number;
}

const { useRef, useEffect } = React;
const BOARD_SCALE = 35;
const Scoreboard: React.FC<{ score: number }> = ({ score }) => <h4>{score}</h4>;

const Board: React.FC<{ width: number, height: number }> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game>();
  const [score, updateScore] = useScore(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context =  canvas.getContext('2d');
  
      if (context) {
        context.scale(BOARD_SCALE, BOARD_SCALE);
        game.current = new Game(context, updateScore);
        game.current.init();
      }
    }
  }, []);

  useEventListener('keydown', (event: CustomKBEvent) => {
    const { current: _game } = game;
    const { keyCode } = event;
    if (_game) {
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
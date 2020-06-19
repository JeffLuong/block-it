import * as React from 'react';

import Game, { drawMatrix } from '../../models/Game';
import useEventListener from '../../hooks/useEventListener';
import useScore, { MetricsState } from '../../hooks/useScore';

import './Board.css';
import Button from '../Button';
import { Matrix } from '../../models/Piece';

// Need to extend Event because KeyboardEvent is not compatible with Event
interface CustomKBEvent extends Event {
  keyCode?: number;
}

const { useRef, useEffect, useState } = React;
const BOARD_SCALE = 35;
const getContext = (ref: React.RefObject<HTMLCanvasElement>) => ref.current && ref.current.getContext('2d');

const Scoreboard: React.FC<MetricsState> = ({ score, rows }) => (
  <aside className="Scoreboard">
    <p>Score</p>
    <h4 style={{ marginTop: 0 }}>{score}</h4>
    <p>Rows</p>
    <h4 style={{ marginTop: 0 }}>{rows}</h4>
  </aside>
);

const NextPieceDisplay: React.FC<{ piece: Matrix }> = ({ piece }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const context = getContext(canvasRef);
    if (!mounted.current && context) {
      context.scale(BOARD_SCALE, BOARD_SCALE);
      mounted.current = true;
    }
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      drawMatrix(context, piece, { x: 0, y: 0 });
    }
  }, [piece]);

  return (
    <div className="NextPieceDisplay">
      <p>Next</p>
      <canvas
        ref={canvasRef}
        width={4 * BOARD_SCALE}
        height={3 * BOARD_SCALE} />
    </div>
  );
};

const GameOver: React.FC<{ startGame: () => void }> = ({ startGame }) => (
  <div className="GameOverWrapper">
    <div className="GameOverContent">
      <h1>Game Over</h1>
      <Button onClick={startGame}>Play Again</Button>
    </div>
  </div>
);

const Controls: React.FC<{}> = () => (
  <div className="Controls">
    <h4>Controls</h4>
    <p><b>A</b>: rotate left</p>
    <p><b>D</b>: rotate right</p>
    <p><b>↓</b>: fast drop</p>
    <p><b>← →</b>: move piece</p>
  </div>
);

const Board: React.FC<{ width: number, height: number }> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game>();
  const [isGameOver, setGameOver] = useState(false);
  const [nextPiece, updateNextPiece] = useState<Matrix>([]);
  const [metrics, updateScore] = useScore({ score: 0, rows: 0 });
  const onGameOver = () => setGameOver(true);
  const onGameStart = () => setGameOver(false);
  const startGame = () => {
    if (game.current) {
      game.current.init();
    }
  };

  useEffect(() => {
    const context = getContext(canvasRef);
    if (context) {
      context.scale(BOARD_SCALE, BOARD_SCALE);
      game.current = new Game(context, updateScore, updateNextPiece, onGameStart, onGameOver);
      game.current.init();
    }
  }, []);

  useEventListener('keydown', (event: CustomKBEvent) => {
    const { current: _game } = game;
    const { keyCode } = event;
    if (_game && !isGameOver) {
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
      <Controls />
      <canvas
        ref={canvasRef}
        id="Tetris"
        width={width * BOARD_SCALE}
        height={height * BOARD_SCALE} />
      <div className="StatsBoard">
        <NextPieceDisplay piece={nextPiece} />
        <Scoreboard score={metrics.score} rows={metrics.rows} />
      </div>
      {isGameOver && <GameOver startGame={startGame} />}
    </>
  );
};

export default Board;
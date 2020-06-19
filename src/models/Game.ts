import Player from './Player';
import Piece, { Matrix } from './Piece';
import Pieces, { Colors } from '../components/Pieces';
import { UPDATE_SCORE, RESET_SCORE, ScoreAction } from '../hooks/useScore';

type CreateShadowBoard = (w: number, h: number) => number[][];
type DrawMatrix = (ctx: CanvasRenderingContext2D, matrix: Matrix, offset: { x: number, y: number }) => void;

const DROP_INTERVAL = 750;
const randomPiece = () => new Piece(Pieces[Math.floor(Math.random() * Pieces.length)]);
const createShadowBoard: CreateShadowBoard = (w, h) =>
  new Array(h).fill([]).reduce(a => ([...a, new Array(w).fill(0)]), []);

export const drawMatrix: DrawMatrix = (ctx, pieceMatrix, offset) => {
  pieceMatrix.forEach((row: number[], y: number) => {
    row.forEach((val: number, x: number) => {
      if (val > 0) {
        ctx.fillStyle = Colors[val];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  })
};

class Game {
  rotatePiece: (dir: number) => void;
  dropPlayer: () => void;
  movePlayer: (dir: number) => void;
  pause: () => void;
  init: () => void;

  constructor(
    context: CanvasRenderingContext2D,
    updateScore: React.Dispatch<ScoreAction>,
    updateNextPiece: (piece: Matrix) => void,
    onGameStart: () => void,
    onGameEnd: () => void
  ) {
    const player = new Player(randomPiece());
    const shadowBoard = createShadowBoard(context.canvas.width / 35, context.canvas.height / 35);
    let nextPiece = randomPiece();
    let prevTick = 0;
    let dropTick = 0;
    let paused = false;
    let gameOver = false;

    const trackPiece = (): void => {
      const { x, y } = player.getPos();
      player.getPiece().matrix.forEach((row, _y) => {
        row.forEach((value, _x) => {
          if (value > 0) {
            shadowBoard[_y + y][_x + x] = value;
          }
        });
      });
    };

    const hasCollided = (): { y: number } | null => {
      const { x, y } = player.getPos();
      const { matrix: m } = player.getPiece();
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
          if (m[i][j] !== 0 && (shadowBoard[i + y] && shadowBoard[i + y][j + x]) !== 0) {
            return { y: (i + y - 1) };
          }
        }
      }
      return null;
    };

    const draw = (): void => {
      context.fillStyle = '#e2e2e2';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      drawMatrix(context, shadowBoard, { x: 0, y: 0 });
      drawMatrix(context, player.getPiece().matrix, player.getPos());
    };

    const resetPlayer = (): void => {
      player.setPiece(nextPiece);
      player.setPos({
        y: 0,
        x: Math.floor(
          shadowBoard[0].length / 2
        ) - Math.floor(
          player.getPiece().matrix[0].length / 2
        )
      });

      const collided = hasCollided();
      if (collided && Number.isInteger(collided.y)) {
        // Filter the piece to make sure it is rendering as the 'last' piece that ends the game.
        const filtered = player.getPiece().matrix.filter(arr => arr.some(v => v > 0));
        const y = collided.y - (filtered.length - 1);
        player.setPos({ x: player.getPos().x, y });
        draw();
        onGameEnd();
        gameOver = true;
      }
      nextPiece = randomPiece();
      updateNextPiece(nextPiece.matrix);
    };

    const destroyRows = (): void => {
      let score = 0;
      let rowMultiplier = 1;
      let rows = 0;
      row: for (let y = shadowBoard.length - 1; y > 0; y--) {
        for (let x = 0; x < shadowBoard[y].length; x++) {
          if (shadowBoard[y][x] === 0) {
            continue row;
          }
        }
        const row = shadowBoard.splice(y, 1)[0].fill(0);
        shadowBoard.unshift(row);
        y++;
        score = rowMultiplier * 10;
        rowMultiplier *= 2;
        rows++;
      }
      updateScore({ type: UPDATE_SCORE, payload: { score, rows } });
    };

    this.rotatePiece = dir => {
      const { x, y } = player.getPos();
      let offset = 1;
      player.getPiece().rotate(dir);
      while (hasCollided()) {
        player.setPos({ y, x: player.getPos().x + offset });
        offset = -(offset + (offset > 0 ? 1 : -1))
        if (offset > player.getPiece().matrix[0].length) {
          player.getPiece().rotate(-dir);
          player.setPos({ y, x });
          break;
        }
      }
    };

    this.dropPlayer = () => {
      const { x, y } = player.getPos();
      player.setPos({ x, y: y + 1 });
      if (hasCollided()) {
        player.setPos({ x, y });
        trackPiece();
        resetPlayer();
        destroyRows();
      }
      dropTick = 0;
    };

    this.movePlayer = dir => {
      const { x, y } = player.getPos();
      player.setPos({ y, x: x + dir });
      if (hasCollided()) {
        player.setPos({ y, x });
      }
    };

    this.pause = () => {
      paused = !paused;
    };

    const update = (tick = 0) => {
      if (!gameOver) {
        if (!paused) {
          const delta = tick - prevTick;
          prevTick = tick;
  
          dropTick += delta;
  
          if (dropTick > DROP_INTERVAL) {
            this.dropPlayer();
          }
          draw();
        }
        window.requestAnimationFrame(update);
      }
    }

    this.init = () => {
      onGameStart();
      if (gameOver) {
        gameOver = false;
        shadowBoard.forEach(row => row.fill(0));
        updateScore({ type: RESET_SCORE });
        resetPlayer();
      }
      updateNextPiece(nextPiece.matrix);
      update();
    };
  }
}

export default Game;
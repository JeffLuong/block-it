import Player from './Player';
import Pieces, { Colors } from '../components/Pieces';
import { UPDATE_SCORE, RESET_SCORE, ScoreAction } from '../hooks/useScore';
import { Matrix } from './Piece';

type CreateShadowBoard = (w: number, h: number) => number[][];
type DrawMatrix = (matrix: Matrix, offset: { x: number, y: number }) => void;

const DROP_INTERVAL = 750;
const randomPiece = () => Pieces[Math.floor(Math.random() * Pieces.length)];
const createShadowBoard: CreateShadowBoard = (w, h) =>
  new Array(h).fill([]).reduce(a => ([...a, new Array(w).fill(0)]), []);

class Game {
  rotatePiece: (dir: number) => void;
  dropPlayer: () => void;
  movePlayer: (dir: number) => void;
  pause: () => void;
  init: (tick?: number) => void;

  constructor(context: CanvasRenderingContext2D, updateScore: React.Dispatch<ScoreAction>) {
    const player = new Player(randomPiece());
    const shadowBoard = createShadowBoard(context.canvas.width / 35, context.canvas.height / 35);
    let prevTick = 0;
    let dropTick = 0;
    let paused = false;

    const drawMatrix: DrawMatrix = (pieceMatrix, offset) => {
      pieceMatrix.forEach((row: number[], y: number) => {
        row.forEach((val: number, x: number) => {
          if (val > 0) {
            context.fillStyle = Colors[val];
            context.fillRect(
              x + offset.x,
              y + offset.y,
              1,
              1
            );
          }
        });
      })
    };

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

    const hasCollided = (): boolean => {
      const { x, y } = player.getPos();
      const { matrix: m } = player.getPiece();
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
          if (m[i][j] !== 0 && (shadowBoard[i + y] && shadowBoard[i + y][j + x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    };

    const draw = (): void => {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      drawMatrix(shadowBoard, { x: 0, y: 0 });
      drawMatrix(player.getPiece().matrix, player.getPos());
    };

    const resetPlayer = (): void => {
      player.setPiece(randomPiece());
      player.setPos({
        y: 0,
        x: Math.floor(
          shadowBoard[0].length / 2
        ) - Math.floor(
          player.getPiece().matrix[0].length / 2
        )
      })

      if (hasCollided()) {
        shadowBoard.forEach(row => row.fill(0));
        updateScore({ type: RESET_SCORE });
      }
    };

    const destroyRows = (): void => {
      let rows = 1;
      row: for (let y = shadowBoard.length - 1; y > 0; y--) {
        for (let x = 0; x < shadowBoard[y].length; x++) {
          if (shadowBoard[y][x] === 0) {
            continue row;
          }
        }
        const row = shadowBoard.splice(y, 1)[0].fill(0);
        shadowBoard.unshift(row);
        y++;

        updateScore({ type: UPDATE_SCORE, payload: { score: rows * 10 } });
        rows *= 2;
      }
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

    this.init = (tick = 0) => {
      if (!paused) {
        const delta = tick - prevTick;
        prevTick = tick;

        dropTick += delta;

        if (dropTick > DROP_INTERVAL) {
          this.dropPlayer();
        }
        draw();
      }
      window.requestAnimationFrame(this.init);
    }
  }
}

export default Game;
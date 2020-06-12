import Player from './Player';
import Pieces, { Colors } from '../components/Pieces';
import { UPDATE_SCORE, RESET_SCORE } from '../hooks/useScore';

const DROP_INTERVAL = 1000;
const randomPiece = () => Pieces[Math.floor(Math.random() * Pieces.length)];
const createShadowBoard = (w, h) => new Array(h).fill([]).reduce(a => ([...a, new Array(w).fill(0)]), []);

class Game {
  constructor(context, updateScore) {
    const piece = randomPiece();
    const player = new Player(piece);
    const shadowBoard = createShadowBoard(context.canvas.width / 35, context.canvas.height / 35);
    let prevTick = 0;
    let dropTick = 0;
    let paused = false;

    const createMatrix = (pieceMatrix, offset) => {
      pieceMatrix.forEach((row, y) => {
        row.forEach((val, x) => {
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

    const trackPiece = () => {
      const { piece: { matrix }, position } = player;
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            shadowBoard[y + position.y][x + position.x] = value;
          }
        });
      });
    };

    const hasCollided = () => {
      const { piece: { matrix: m }, position: { x, y } } = player;
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
          if (m[i][j] !== 0 && (shadowBoard[i + y] && shadowBoard[i + y][j + x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    };

    const draw = () => {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      createMatrix(shadowBoard, { x: 0, y: 0 });
      createMatrix(player.piece.matrix, player.position);
    };

    const resetPlayer = () => {
      player.piece = randomPiece();
      player.position.y = 0;
      player.position.x = Math.floor(
        shadowBoard[0].length / 2
      ) - Math.floor(
        player.piece.matrix[0].length / 2
      );

      if (hasCollided()) {
        shadowBoard.forEach(row => row.fill(0));
        updateScore({ type: RESET_SCORE });
      }
    };

    const destroyRows = () => {
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

    this.rotatePiece = (dir) => {
      const { piece, position } = player;
      const currPos = position.x;
      let offset = 1;
      piece.rotate(dir);
      while (hasCollided()) {
        position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1))
        if (offset > piece.matrix[0].length) {
          piece.rotate(-dir);
          player.position.x = currPos;
          break;
        }
      }
    };

    this.dropPlayer = () => {
      player.position.y += 1;
      if (hasCollided()) {
        player.position.y -= 1;
        trackPiece();
        resetPlayer();
        destroyRows();
      }
      dropTick = 0;
    };

    this.movePlayer = dir => {
      player.position.x += dir;
      if (hasCollided()) {
        player.position.x -= dir;
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
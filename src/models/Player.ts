import Piece from './Piece';

type Position = {
  x: number,
  y: number
};

class Player {
  getPiece: () => Piece;

  setPiece: (piece: Piece) => void;

  setPos: (pos: Position) => void;

  getPos: () => Position;

  constructor(piece: Piece) {
    this.getPiece = () => piece;

    this.setPiece = (_piece: Piece) => {
      this.getPiece = () => _piece;
    };

    this.getPos = () => ({ x: 5, y: -1 });

    this.setPos = (position: Position) => {
      this.getPos = () => position;
    }
  }
}

export default Player;
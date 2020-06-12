class Piece {
  constructor(matrix) {
    this.matrix = matrix;
  }

  rotate(dir) {
    const len = this.matrix.length;
    if (len > 2) {
      for (let y = 0; y < len; y++) {
        for (let x = 0; x < y; x++) {
          [
            this.matrix[x][y],
            this.matrix[y][x]
          ] = [
            this.matrix[y][x],
            this.matrix[x][y]
          ];
        }
      }
      if (dir > 0) {
        this.matrix.forEach(row => row.reverse());
      } else {
        this.matrix.reverse();
      }
    }
  }
}

export default Piece;
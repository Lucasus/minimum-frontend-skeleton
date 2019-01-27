export class Cell {
  public rowIndex: number;
  public columnIndex: number;
  public state: number = 0;
  public nextState: number = 0;
  public aliveNeighbours = 0;
  public onChange: (c: Cell) => void = null;

  public isAlive = () => this.state === 1;
  public isDead = () => this.state === 0;

  constructor(rowIndex: number, columnIndex: number) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;    
  }

  public switchState() {
    this.state = 1 - this.state;
    if(this.onChange) {
      this.onChange(this);
    }
  }

  public setState(newState: number) {
    const oldState = this.state;
    this.state = newState;
    if(this.onChange && oldState != newState) {
      this.onChange(this);
    }
  }

  public displayedState() {
    return this.state === 1 ? "cell-alive" : "cell-dead";
  }

  public subscribe(handler: (c: Cell) => void) {
      this.onChange = handler;
  }
}

export class Grid {
  private rowsCount: number;
  private columnsCount: number;
  private stopped = 0;

  public board: Cell[][];

  constructor(rowsCount: number, columnsCount: number) {
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.board = [];

    for (let i = 0; i < rowsCount; ++i) {
      const row = [];
      for (let j = 0; j < columnsCount; ++j) {
        row.push(new Cell(i,j));
      }
      this.board.push(row);
    }
  }

  public getNeighbours(i: number, j: number): Cell[] {
     const rows = this.board.slice(Math.max(0,i-1), i+2);
     const neighbours: Cell[] = (rows.map(row => row.slice(Math.max(0,j-1), j+2)) as any).flat();
     return neighbours.filter(cell => !(cell.rowIndex === i && cell.columnIndex === j));
  }

  public update() {
    for(let i = 0; i < this.rowsCount; ++i) {
      for(let j = 0; j < this.columnsCount; ++j) {
         const cell = this.board[i][j];
         const aliveNeighbours = this.getNeighbours(i,j).filter((x: Cell) => x.state === 1).length;
         if(cell.isAlive()) {
           if(aliveNeighbours < 2 || aliveNeighbours > 3) {
             cell.nextState = 0;
           } else {
             cell.nextState = 1;
           }
         }
         if(cell.isDead()) {
            if(aliveNeighbours === 3) {
              cell.nextState = 1;
            } else {
              cell.nextState = 0;
            }
         }
      }
    }

    for(let i = 0; i < this.rowsCount; ++i) {
      for(let j = 0; j < this.columnsCount; ++j) {
        const cell = this.board[i][j];
        cell.setState(cell.nextState);
      }
    }
  }

  public startInternal() {
    setTimeout(() => {
      this.update();
      if(!this.stopped) {
        this.startInternal();
      }
    }, 500);
  }

  public start() {
    this.stopped = 0;
    this.startInternal();
  }

  public stop() {
    this.stopped = 1; 
  }

  public randomState() {
    for(let i = 0; i < this.rowsCount; ++i) {
      for(let j = 0; j < this.columnsCount; ++j) {
        const cell = this.board[i][j];
        cell.setState(Math.round(Math.random()));
      }
    }
  }
}
import { Grid } from "./grid";

export class GridView {
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  public render() {
    const table = document.createElement("table");

    this.grid.board.forEach((row, i) => {
      const rowElement = document.createElement("tr");

      row.forEach((cell, j) => {
        const cellElement = document.createElement("td");
        cellElement.setAttribute("row", `${cell.rowIndex}`);
        cellElement.setAttribute("column", `${cell.columnIndex}`);
        cellElement.className = cell.displayedState();

        cell.subscribe(c => {
            cellElement.className = c.displayedState();
        })

        rowElement.appendChild(cellElement);
      });

      table.appendChild(rowElement);
    });

    table.addEventListener("click", (ev: MouseEvent) => {
      const nodeName = (ev.target as any).nodeName;

      if (nodeName === "TD") {
        const cellElement = ev.target as HTMLTableDataCellElement;
        const rowIndex = parseInt(cellElement.getAttribute("row"));
        const columnIndex = parseInt(cellElement.getAttribute("column"));
        const cell = this.grid.board[rowIndex][columnIndex];
        cell.switchState();
        cellElement.className = cell.displayedState();
      }
    });

    table.className = "cell-table";

    return table;
  }
}

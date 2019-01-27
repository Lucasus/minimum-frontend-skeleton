import { add } from "./model"
import { GridView } from "./gridView"
import { Grid } from "./grid"

console.log("Hello world 123 " + add(2,3))

const root = document.getElementById("container");
const grid = new Grid(30,30);
const gridView = new GridView(grid);

root.appendChild(gridView.render());

document.getElementById("startBtn").addEventListener("click", ev => {
  grid.start();
})

document.getElementById("stopBtn").addEventListener("click", ev => {
  grid.stop();
})

document.getElementById("randomBtn").addEventListener("click", ev => {
  grid.randomState();
})

// root.innerHTML = grid.render();
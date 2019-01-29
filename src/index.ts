import { add } from "./model"

const root = document.getElementById("container");
root.innerHTML = "Hello world " + add(2,3);

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/grid.ts":
/*!*********************!*\
  !*** ./src/grid.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Cell {
    constructor(rowIndex, columnIndex) {
        this.state = 0;
        this.nextState = 0;
        this.aliveNeighbours = 0;
        this.onChange = null;
        this.isAlive = () => this.state === 1;
        this.isDead = () => this.state === 0;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }
    switchState() {
        this.state = 1 - this.state;
        if (this.onChange) {
            this.onChange(this);
        }
    }
    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        if (this.onChange && oldState != newState) {
            this.onChange(this);
        }
    }
    displayedState() {
        return this.state === 1 ? "cell-alive" : "cell-dead";
    }
    subscribe(handler) {
        this.onChange = handler;
    }
}
exports.Cell = Cell;
class Grid {
    constructor(rowsCount, columnsCount) {
        this.stopped = 0;
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.board = [];
        for (let i = 0; i < rowsCount; ++i) {
            const row = [];
            for (let j = 0; j < columnsCount; ++j) {
                row.push(new Cell(i, j));
            }
            this.board.push(row);
        }
    }
    getNeighbours(i, j) {
        const rows = this.board.slice(Math.max(0, i - 1), i + 2);
        const neighbours = rows.map(row => row.slice(Math.max(0, j - 1), j + 2)).flat();
        return neighbours.filter(cell => !(cell.rowIndex === i && cell.columnIndex === j));
    }
    update() {
        for (let i = 0; i < this.rowsCount; ++i) {
            for (let j = 0; j < this.columnsCount; ++j) {
                const cell = this.board[i][j];
                const aliveNeighbours = this.getNeighbours(i, j).filter((x) => x.state === 1).length;
                if (cell.isAlive()) {
                    if (aliveNeighbours < 2 || aliveNeighbours > 3) {
                        cell.nextState = 0;
                    }
                    else {
                        cell.nextState = 1;
                    }
                }
                if (cell.isDead()) {
                    if (aliveNeighbours === 3) {
                        cell.nextState = 1;
                    }
                    else {
                        cell.nextState = 0;
                    }
                }
            }
        }
        for (let i = 0; i < this.rowsCount; ++i) {
            for (let j = 0; j < this.columnsCount; ++j) {
                const cell = this.board[i][j];
                cell.setState(cell.nextState);
            }
        }
    }
    startInternal() {
        setTimeout(() => {
            this.update();
            if (!this.stopped) {
                this.startInternal();
            }
        }, 500);
    }
    start() {
        this.stopped = 0;
        this.startInternal();
    }
    stop() {
        this.stopped = 1;
    }
    randomState() {
        for (let i = 0; i < this.rowsCount; ++i) {
            for (let j = 0; j < this.columnsCount; ++j) {
                const cell = this.board[i][j];
                cell.setState(Math.round(Math.random()));
            }
        }
    }
}
exports.Grid = Grid;


/***/ }),

/***/ "./src/gridView.ts":
/*!*************************!*\
  !*** ./src/gridView.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GridView {
    constructor(grid) {
        this.grid = grid;
    }
    render() {
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
                });
                rowElement.appendChild(cellElement);
            });
            table.appendChild(rowElement);
        });
        table.addEventListener("click", (ev) => {
            const nodeName = ev.target.nodeName;
            if (nodeName === "TD") {
                const cellElement = ev.target;
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
exports.GridView = GridView;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
const gridView_1 = __webpack_require__(/*! ./gridView */ "./src/gridView.ts");
const grid_1 = __webpack_require__(/*! ./grid */ "./src/grid.ts");
console.log("Hello world 123 " + model_1.add(2, 3));
const root = document.getElementById("container");
const grid = new grid_1.Grid(30, 30);
const gridView = new gridView_1.GridView(grid);
root.appendChild(gridView.render());
document.getElementById("startBtn").addEventListener("click", ev => {
    grid.start();
});
document.getElementById("stopBtn").addEventListener("click", ev => {
    grid.stop();
});
document.getElementById("randomBtn").addEventListener("click", ev => {
    grid.randomState();
});


/***/ }),

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function add(x, y) {
    return x + y;
}
exports.add = add;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyaWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyaWRWaWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLE1BQWEsSUFBSTtJQVdmLFlBQVksUUFBZ0IsRUFBRSxXQUFtQjtRQVIxQyxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsYUFBUSxHQUFzQixJQUFJLENBQUM7UUFFbkMsWUFBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQ2pD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RSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNsRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QkYsU0FBZ0IsR0FBRyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLENBQUM7QUFGRCxrQkFFQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImV4cG9ydCBjbGFzcyBDZWxsIHtcbiAgcHVibGljIHJvd0luZGV4OiBudW1iZXI7XG4gIHB1YmxpYyBjb2x1bW5JbmRleDogbnVtYmVyO1xuICBwdWJsaWMgc3RhdGU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBuZXh0U3RhdGU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBhbGl2ZU5laWdoYm91cnMgPSAwO1xuICBwdWJsaWMgb25DaGFuZ2U6IChjOiBDZWxsKSA9PiB2b2lkID0gbnVsbDtcblxuICBwdWJsaWMgaXNBbGl2ZSA9ICgpID0+IHRoaXMuc3RhdGUgPT09IDE7XG4gIHB1YmxpYyBpc0RlYWQgPSAoKSA9PiB0aGlzLnN0YXRlID09PSAwO1xuXG4gIGNvbnN0cnVjdG9yKHJvd0luZGV4OiBudW1iZXIsIGNvbHVtbkluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLnJvd0luZGV4ID0gcm93SW5kZXg7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IGNvbHVtbkluZGV4OyAgICBcbiAgfVxuXG4gIHB1YmxpYyBzd2l0Y2hTdGF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlID0gMSAtIHRoaXMuc3RhdGU7XG4gICAgaWYodGhpcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0U3RhdGUobmV3U3RhdGU6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG4gICAgaWYodGhpcy5vbkNoYW5nZSAmJiBvbGRTdGF0ZSAhPSBuZXdTdGF0ZSkge1xuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGlzcGxheWVkU3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IDEgPyBcImNlbGwtYWxpdmVcIiA6IFwiY2VsbC1kZWFkXCI7XG4gIH1cblxuICBwdWJsaWMgc3Vic2NyaWJlKGhhbmRsZXI6IChjOiBDZWxsKSA9PiB2b2lkKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlID0gaGFuZGxlcjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JpZCB7XG4gIHByaXZhdGUgcm93c0NvdW50OiBudW1iZXI7XG4gIHByaXZhdGUgY29sdW1uc0NvdW50OiBudW1iZXI7XG4gIHByaXZhdGUgc3RvcHBlZCA9IDA7XG5cbiAgcHVibGljIGJvYXJkOiBDZWxsW11bXTtcblxuICBjb25zdHJ1Y3Rvcihyb3dzQ291bnQ6IG51bWJlciwgY29sdW1uc0NvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnJvd3NDb3VudCA9IHJvd3NDb3VudDtcbiAgICB0aGlzLmNvbHVtbnNDb3VudCA9IGNvbHVtbnNDb3VudDtcbiAgICB0aGlzLmJvYXJkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3NDb3VudDsgKytpKSB7XG4gICAgICBjb25zdCByb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uc0NvdW50OyArK2opIHtcbiAgICAgICAgcm93LnB1c2gobmV3IENlbGwoaSxqKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmJvYXJkLnB1c2gocm93KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0TmVpZ2hib3VycyhpOiBudW1iZXIsIGo6IG51bWJlcik6IENlbGxbXSB7XG4gICAgIGNvbnN0IHJvd3MgPSB0aGlzLmJvYXJkLnNsaWNlKE1hdGgubWF4KDAsaS0xKSwgaSsyKTtcbiAgICAgY29uc3QgbmVpZ2hib3VyczogQ2VsbFtdID0gKHJvd3MubWFwKHJvdyA9PiByb3cuc2xpY2UoTWF0aC5tYXgoMCxqLTEpLCBqKzIpKSBhcyBhbnkpLmZsYXQoKTtcbiAgICAgcmV0dXJuIG5laWdoYm91cnMuZmlsdGVyKGNlbGwgPT4gIShjZWxsLnJvd0luZGV4ID09PSBpICYmIGNlbGwuY29sdW1uSW5kZXggPT09IGopKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucm93c0NvdW50OyArK2kpIHtcbiAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnNDb3VudDsgKytqKSB7XG4gICAgICAgICBjb25zdCBjZWxsID0gdGhpcy5ib2FyZFtpXVtqXTtcbiAgICAgICAgIGNvbnN0IGFsaXZlTmVpZ2hib3VycyA9IHRoaXMuZ2V0TmVpZ2hib3VycyhpLGopLmZpbHRlcigoeDogQ2VsbCkgPT4geC5zdGF0ZSA9PT0gMSkubGVuZ3RoO1xuICAgICAgICAgaWYoY2VsbC5pc0FsaXZlKCkpIHtcbiAgICAgICAgICAgaWYoYWxpdmVOZWlnaGJvdXJzIDwgMiB8fCBhbGl2ZU5laWdoYm91cnMgPiAzKSB7XG4gICAgICAgICAgICAgY2VsbC5uZXh0U3RhdGUgPSAwO1xuICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIGNlbGwubmV4dFN0YXRlID0gMTtcbiAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgICAgaWYoY2VsbC5pc0RlYWQoKSkge1xuICAgICAgICAgICAgaWYoYWxpdmVOZWlnaGJvdXJzID09PSAzKSB7XG4gICAgICAgICAgICAgIGNlbGwubmV4dFN0YXRlID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNlbGwubmV4dFN0YXRlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzQ291bnQ7ICsraSkge1xuICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uc0NvdW50OyArK2opIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMuYm9hcmRbaV1bal07XG4gICAgICAgIGNlbGwuc2V0U3RhdGUoY2VsbC5uZXh0U3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGFydEludGVybmFsKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIGlmKCF0aGlzLnN0b3BwZWQpIHtcbiAgICAgICAgdGhpcy5zdGFydEludGVybmFsKCk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpIHtcbiAgICB0aGlzLnN0b3BwZWQgPSAwO1xuICAgIHRoaXMuc3RhcnRJbnRlcm5hbCgpO1xuICB9XG5cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgdGhpcy5zdG9wcGVkID0gMTsgXG4gIH1cblxuICBwdWJsaWMgcmFuZG9tU3RhdGUoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucm93c0NvdW50OyArK2kpIHtcbiAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnNDb3VudDsgKytqKSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLmJvYXJkW2ldW2pdO1xuICAgICAgICBjZWxsLnNldFN0YXRlKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCB7IEdyaWQgfSBmcm9tIFwiLi9ncmlkXCI7XG5cbmV4cG9ydCBjbGFzcyBHcmlkVmlldyB7XG4gIHByaXZhdGUgZ3JpZDogR3JpZDtcblxuICBjb25zdHJ1Y3RvcihncmlkOiBHcmlkKSB7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XG5cbiAgICB0aGlzLmdyaWQuYm9hcmQuZm9yRWFjaCgocm93LCBpKSA9PiB7XG4gICAgICBjb25zdCByb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuXG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgaikgPT4ge1xuICAgICAgICBjb25zdCBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgICAgY2VsbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm93XCIsIGAke2NlbGwucm93SW5kZXh9YCk7XG4gICAgICAgIGNlbGxFbGVtZW50LnNldEF0dHJpYnV0ZShcImNvbHVtblwiLCBgJHtjZWxsLmNvbHVtbkluZGV4fWApO1xuICAgICAgICBjZWxsRWxlbWVudC5jbGFzc05hbWUgPSBjZWxsLmRpc3BsYXllZFN0YXRlKCk7XG5cbiAgICAgICAgY2VsbC5zdWJzY3JpYmUoYyA9PiB7XG4gICAgICAgICAgICBjZWxsRWxlbWVudC5jbGFzc05hbWUgPSBjLmRpc3BsYXllZFN0YXRlKCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcm93RWxlbWVudC5hcHBlbmRDaGlsZChjZWxsRWxlbWVudCk7XG4gICAgICB9KTtcblxuICAgICAgdGFibGUuYXBwZW5kQ2hpbGQocm93RWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICB0YWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBub2RlTmFtZSA9IChldi50YXJnZXQgYXMgYW55KS5ub2RlTmFtZTtcblxuICAgICAgaWYgKG5vZGVOYW1lID09PSBcIlREXCIpIHtcbiAgICAgICAgY29uc3QgY2VsbEVsZW1lbnQgPSBldi50YXJnZXQgYXMgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50O1xuICAgICAgICBjb25zdCByb3dJbmRleCA9IHBhcnNlSW50KGNlbGxFbGVtZW50LmdldEF0dHJpYnV0ZShcInJvd1wiKSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gcGFyc2VJbnQoY2VsbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpKTtcbiAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMuZ3JpZC5ib2FyZFtyb3dJbmRleF1bY29sdW1uSW5kZXhdO1xuICAgICAgICBjZWxsLnN3aXRjaFN0YXRlKCk7XG4gICAgICAgIGNlbGxFbGVtZW50LmNsYXNzTmFtZSA9IGNlbGwuZGlzcGxheWVkU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRhYmxlLmNsYXNzTmFtZSA9IFwiY2VsbC10YWJsZVwiO1xuXG4gICAgcmV0dXJuIHRhYmxlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhZGQgfSBmcm9tIFwiLi9tb2RlbFwiXG5pbXBvcnQgeyBHcmlkVmlldyB9IGZyb20gXCIuL2dyaWRWaWV3XCJcbmltcG9ydCB7IEdyaWQgfSBmcm9tIFwiLi9ncmlkXCJcblxuY29uc29sZS5sb2coXCJIZWxsbyB3b3JsZCAxMjMgXCIgKyBhZGQoMiwzKSlcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuY29uc3QgZ3JpZCA9IG5ldyBHcmlkKDMwLDMwKTtcbmNvbnN0IGdyaWRWaWV3ID0gbmV3IEdyaWRWaWV3KGdyaWQpO1xuXG5yb290LmFwcGVuZENoaWxkKGdyaWRWaWV3LnJlbmRlcigpKTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXYgPT4ge1xuICBncmlkLnN0YXJ0KCk7XG59KVxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3BCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ID0+IHtcbiAgZ3JpZC5zdG9wKCk7XG59KVxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmRvbUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXYgPT4ge1xuICBncmlkLnJhbmRvbVN0YXRlKCk7XG59KVxuXG4vLyByb290LmlubmVySFRNTCA9IGdyaWQucmVuZGVyKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICByZXR1cm4geCArIHk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==
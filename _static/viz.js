const socket = io(`ws://${location.host}`);

const grid = document.getElementById("grid");
const gridSize = {
  height: 100,
  width: 100,
};

const rows = [];

const mouseState = { drawing: false };
const startDrawEvents = ["mousedown", "touchstart"];
const stopDrawEvents = ["mouseup", "touchend"];

startDrawEvents.forEach((startDrawEvent) =>
  document.addEventListener(startDrawEvent, () => {
    mouseState.drawing = true;
    console.log(mouseState);
  })
);

stopDrawEvents.forEach((stopDrawEvent) =>
  document.addEventListener(stopDrawEvent, () => {
    mouseState.drawing = false;
    console.log(mouseState);
    socket.emit("draw");
  })
);

for (let i = 0; i < gridSize.height; i++) {
  const row = document.createElement("div");
  row.classList.add("row");
  const rowArray = [];
  for (let j = 0; j < gridSize.width; j++) {
    const cell = document.createElement("div");

    cell.dataset.coordinates = JSON.stringify({ x: j, y: i });

    cell.dataset.state = 0;

    cell.classList.add("cell");

    // Add event listeners for mousenter and click
    const drawEvents = ["mouseenter", "click"];
    drawEvents.forEach((de) => {
      cell.addEventListener(de, () => {
        console.log(`clicked ${cell.dataset.coordinates}`);
        // if the event is click, do this
        if (de === "click") {
          cell.dataset.state > 0
            ? (cell.dataset.state = 0)
            : (cell.dataset.state = 1);
          // emit an event with info about the cell
          socket.emit("draw", {
            co: JSON.parse(cell.dataset.coordinates),
            state: cell.dataset.state,
          });
        }
        // if the event is mouseenter and we're drawing, do this
        if (de === "mouseenter" && mouseState.drawing) {
          cell.dataset.state > 0
            ? (cell.dataset.state = 0)
            : (cell.dataset.state = 1);
          // emit an event with info about the cell
          socket.emit("draw", {
            co: JSON.parse(cell.dataset.coordinates),
            state: cell.dataset.state,
          });
        }
      });
    });

    row.appendChild(cell);
    rowArray.push(cell);
  }

  // Now that the outer loop has finished, append the row element to the grid and push the rowArray into rows
  grid.appendChild(row);
  rows.push(rowArray);
}

socket.on("update", (info) => {
  console.log("UPDATE FROM SOCKET: ", info);
  rows[info.co.y][info.co.x].dataset.state = info.state;
});

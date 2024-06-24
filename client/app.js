const socket = io("ws://localhost:8080");

socket.emit("logon", Date.now());

socket.on("update", (text) => {
  const parent = document.querySelector("ul");
  parent.innerHTML = "";

  const arr = JSON.parse(text);
  arr.forEach((msg) => {
    const el = document.createElement("li");
    el.textContent = msg;
    parent.appendChild(el);
  });

  console.log(JSON.parse(text));
});

document.querySelector("button").onclick = () => {
  const text = document.querySelector("input").value;
  socket.emit("update", text);
};

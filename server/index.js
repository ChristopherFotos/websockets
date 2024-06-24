const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

const messages = [];

io.on("connection", (socket) => {
  const allMsgsStr = JSON.stringify(messages);

  io.to(socket.id).emit("update", allMsgsStr);

  console.log("Someone has connected");
  socket.on("update", (message) => {
    messages.push(message);
    const str = JSON.stringify(messages);
    console.log(str);

    io.emit("update", str);
  });
});

http.listen(8080, () => console.log("listening on 8080"));

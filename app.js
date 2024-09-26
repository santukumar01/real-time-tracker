const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    io.emit("user-disconnected", socket.id);
  });
  console.log("connected");
});

app.get("/", (req, res) => {
  //   res.send("hi");
  res.render("index");
});

const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`The server is running on post no : ${port}`);
// });

server.listen(port, () => {
  console.log(`The server is running on post no : ${port}`);
});

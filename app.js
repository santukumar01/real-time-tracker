const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
let count_connection = 0; // initialize correctly
app.get("/", (req, res) => {
  res.render("index", { count_connection });
=======
io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    io.emit("user-disconnected", socket.id);
  });
  console.log("connected");
>>>>>>> 5f2704931e1ed55068b87b373be7facce9d07635
});

io.on("connection", (socket) => {
  count_connection++;
  console.log(`User connected, current connections: ${count_connection}`);

  // Emit the current connection count when a new user connects
  io.emit("update-connection-count", count_connection);

  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    count_connection--;
    console.log(`User disconnected, current connections: ${count_connection}`);
    io.emit("update-connection-count", count_connection);
    io.emit("user-disconnected", socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});

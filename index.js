const PORT = 3000 || process.env.PORT;

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server);

const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send-position", (data) => {
    console.log(data);
    io.emit("recevie-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-dis", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server is running");
});

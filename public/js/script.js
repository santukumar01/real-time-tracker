var socket = io();

let user = prompt("Enter your name ", "@user");

if (navigator.geolocation) {
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log(latitude, longitude);

        socket.emit("send-position", { user, latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  }, 5000); // Send position every 5 seconds
}

var map = L.map("map").setView([0, 0], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var markers = {};

socket.on("recevie-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(data.user)
      .openPopup();
  }
});

socket.on("user-dis", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

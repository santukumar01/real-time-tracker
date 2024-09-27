const socket = io();

// navigator is preinstalled in window object
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      // sending location along with the user name (if available)
      const user = prompt("Enter your name"); // You may want to store and reuse this
      socket.emit("send-location", { latitude, longitude, user });
    },
    (error) => {
      console.log(error);
    },
    {
      // settings for watchPosition,
      maximumAge: 0, // caching
      enableHighAccuracy: true,
      timeout: 5000,
    }
  );
}

// Code for Leaflet
let mapInitialized = false;
const map = L.map("map").setView([0, 0], 2); // Initial view with zoom level 2
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

const markers = {};

// When receiving location updates
socket.on("receive-location", (data) => {
  const { id, latitude, longitude, user } = data;

  // Set map view to the user's location on the first update
  if (!mapInitialized) {
    map.setView([latitude, longitude], 13); // Set a zoom level more appropriate for cities
    mapInitialized = true;
  }

  // If the marker already exists, update its position
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Otherwise, create a new marker for this user
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(user || `User ${id}`) // Fallback to id if user name is not available
      .openPopup();
  }
});

// When a user disconnects, remove their marker
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

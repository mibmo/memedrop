let uiRefreshRate = 5;
let zoomLevel = 20;

let eDarkened = document.getElementById("bg-darken");

let dAchivements = document.getElementById("drawer-achivements");
let dDrops = document.getElementById("drawer-drops");
let dSettings = document.getElementById("drawer-settings");
let drawers = [dAchivements, dDrops, dSettings];

var lastPos = undefined;
var map = undefined;
var marker = undefined;

function closeDrawer() {
  eDarkened.classList.add("invisible");
  for (var drawer in drawers) {
    drawers[drawer].classList.add("invisible");
  }
}

function openDrawer(id) {
  let drawer = document.getElementById(id);

  eDarkened.classList.remove("invisible");
  drawer.classList.remove("invisible");
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async function(pos) {
      resolve({
        "lat": pos.coords.latitude,
        "long": pos.coords.longitude,
      });
    });
  });
}

function getClosestDrop(lat, long) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.status);
                }
            }
        };
        request.open("GET", `/near?lat=${lat}&long=${long}`, true);
        request.send();
    });
}

function updateUi() {
    getCurrentLocation()
        .then(pos => {
            map.setView([pos.lat, pos.long], zoomLevel);
            if (lastPos && haversine(pos, lastPos) < 10) {
                return;
            }

            lastPos = pos;
            return getClosestDrop(pos.lat, pos.long).then(drop => {
                return { "pos": pos, "drop": drop };
            });
        }).then(obj => {
            let pos = obj.pos;
            let drop = obj.drop;

            if (!marker) {
                marker = L.marker([drop.location.lat, drop.location.long]).addTo(map);
            }
        });
}

function initialise() {
    getCurrentLocation()
        .then(({lat, long}) => {
            map = L.map("map").setView([lat, long], zoomLevel);
            L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomain: ["a", "b", "c"]
            }).addTo(map);
            map.zoomControl.remove()

            return map;
        });

    setInterval(updateUi, 1000/uiRefreshRate);
}

function haversine(pos, other) {
        lat1 = Deg2Rad(pos.lat); 
        lat2 = Deg2Rad(other.lat); 
        long1 = Deg2Rad(pos.long); 
        long2 = Deg2Rad(other.long);
        latDiff = lat2-lat1;
        longDiff = long2-long1;
        var R = 6371000;
        var phi1 = lat1;
        var phi2 = lat2;
        var deltaPhi = latDiff;
        var deltaLambda = longDiff;

        var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);

        //var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        //var d = R * c;

        var dist = Math.acos( Math.sin(phi1)*Math.sin(phi2) + Math.cos(phi1)*Math.cos(phi2) * Math.cos(deltaLambda) ) * R;
        return dist;
}

function Deg2Rad( deg ) {
   return deg * Math.PI / 180;
}

initialise()

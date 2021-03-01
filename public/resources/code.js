let eDarkened = document.getElementById("bg-darken");

let dAchivements = document.getElementById("drawer-achivements");
let dDrops = document.getElementById("drawer-drops");
let dSettings = document.getElementById("drawer-settings");
let drawers = [dAchivements, dDrops, dSettings];

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
                    resolve(this.responseText);
                } else {
                    reject(this.status);
                }
            }
        };
        request.open("GET", `/near?lat=${lat}&long=${long}`, true);
        request.send();
    });
}

getCurrentLocation()
    .then(pos => {
        return getClosestDrop(pos.lat, pos.long).then(drop => {
            return { "pos": pos, "drop": drop };
        });
    }).then(({pos, drop}) => {
        console.log(pos);
        console.log(drop);
    });

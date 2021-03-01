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

/*
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

function getClosestDrop(lat, lon) {
  return new Promise((resolve, reject) => {
    let response = await fetch(`/near?lat=${lat}&long=${lon}`);

    if (response.ok) {
      resolve(await response.text());
    } else {
      reject(response.status);
    }
  });
}
*/

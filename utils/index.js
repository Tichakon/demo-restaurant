export function Marker(name, location) {
  const myLatLng = location

  const map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatLng,
  })

  new window.google.maps.Marker({
    position: myLatLng,
    map,
    title: name,
  })
}

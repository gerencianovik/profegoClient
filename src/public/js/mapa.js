let map;
let marker = null; // Mantén el marcador como una variable global inicializada en null

async function initMap() {
  // Esperar hasta que el DOM esté cargado completamente
  await new Promise(resolve => {
    window.addEventListener('DOMContentLoaded', resolve);
  });

  // Iterar sobre cada formulario de profesor para inicializar el mapa correctamente
  document.querySelectorAll('#contenedor form').forEach(form => {
    const ubicacionInput = form.querySelector('#ubicacion');
    const addressTeacherInput = form.querySelector('[name="addressTeacher"]');
    let lat = -0.13097336766634235; // Valor predeterminado si no hay coordenadas disponibles
    let lng = -78.45333414939553; // Valor predeterminado si no hay coordenadas disponibles

    // Verificar si hay coordenadas disponibles en addressTeacher
    if (addressTeacherInput.value) {
      const coordenadas = addressTeacherInput.value.split(',');
      lat = parseFloat(coordenadas[0].trim());
      lng = parseFloat(coordenadas[1].trim());
    }

    const position = { lat: lat, lng: lng };

    const map = new google.maps.Map(form.querySelector('#map'), {
      zoom: 20,
      center: position,
      mapId: "Ubicacion",
    });

    // No inicialices un nuevo marcador aquí, usarás el marcador global

    map.addListener('click', (e) => {
      placeMarkerAndPanTo(e.latLng, map, ubicacionInput, addressTeacherInput);
    });
  });
}

function placeMarkerAndPanTo(latLng, map, ubicacionInput, addressTeacherInput) {
  const ubicacion = {
    lat: latLng.lat(),
    lng: latLng.lng(),
  };

  // Si ya hay un marcador, elimínalo del mapa
  if (marker) {
    marker.setMap(null);
  }

  // Coloca un nuevo marcador en la ubicación clicada
  marker = new google.maps.Marker({
    position: ubicacion,
    map: map,
    title: "Estás aquí",
  });

  // Centra el mapa en la nueva ubicación
  map.panTo(ubicacion);

  // Actualiza el input con las nuevas coordenadas
  ubicacionInput.value = `${ubicacion.lat}, ${ubicacion.lng}`;
  addressTeacherInput.value = `${ubicacion.lat}, ${ubicacion.lng}`; // Actualiza el campo addressTeacher con las nuevas coordenadas
}

// Inicializa el mapa al cargar la página
initMap();
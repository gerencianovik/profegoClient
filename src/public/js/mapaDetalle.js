let marker
function initAutocomplete() {
  let ubicacion = document.getElementById('ubicacion');

  // Reemplazar paréntesis en el valor de la ubicación
  let a = ubicacion.value.replace(/[()]/g, '');

  // Separar las coordenadas de latitud y longitud por una coma
  let coordenadas = a.split(',');

  // Convertir las cadenas a números
  let latitud = parseFloat(coordenadas[0]);
  let longitud = parseFloat(coordenadas[1]);

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitud, lng: longitud },
    zoom: 13,
    mapTypeId: "hybrid",
  });

  marker = new google.maps.Marker({
    position: { lat: latitud, lng: longitud }, // Asignar coordenadas numéricas
    map: map,
    title: "Estás aquí",
  });
}



window.initAutocomplete = initAutocomplete;
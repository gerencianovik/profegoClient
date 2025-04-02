document.getElementById('seleccionvideo').addEventListener('change', function (event) {
    console.log('Evento change activado');

    const file = event.target.files[0];
    console.log(file);

    if (file && file.size > 0 && file.type.startsWith('video/')) {
        const videoElement = document.getElementById('videoPreview');
        const videoUrl = URL.createObjectURL(file);

        videoElement.src = videoUrl;
        videoElement.load();
    } else {
        alert("Por favor, selecciona un archivo de video válido.");
    }
});
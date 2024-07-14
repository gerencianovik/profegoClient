'use strict';

class FilePreviewer {
  constructor(inputElementId, previewElementId, previewType = 'image') {
    this._inputElement = document.getElementById(inputElementId);
    this._previewElement = document.getElementById(previewElementId);
    this._previewType = previewType;
    this._registerEvent();
  }

  _registerEvent() {
    this._inputElement.addEventListener('change', (event) => this._showFile(event));
  }

  _showFile(event) {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const safeUrl = URL.createObjectURL(file); // Cambiado a solo el archivo
        this._previewElement.src = safeUrl;
      };

      fileReader.onerror = (e) => {
        console.error('Error al leer el archivo:', e);
      };

      if (this._previewType === 'image') {
        fileReader.readAsDataURL(file);
      } else if (this._previewType === 'pdf') {
        fileReader.readAsArrayBuffer(file);
      }
    }
  }
}

// Activar el input de archivo al hacer clic en el botón
document.querySelectorAll('.botonImagen').forEach(button => {
  button.addEventListener('click', () => {
    const inputId = button.getAttribute('data-input-id');
    document.getElementById(inputId).click();
  });
});

// Uso de la clase FilePreviewer
new FilePreviewer('seleccionArchivos', 'imagenPrevisualizacion', 'image');
new FilePreviewer('seleccionTitulo', 'documentoTituloPrevisualizacion', 'pdf');
new FilePreviewer('seleccionHojaVida', 'documentoHojaVidaPrevisualizacion', 'pdf');
new FilePreviewer('seleccionAntecedentes', 'documentoAntecedentesPrevisualizacion', 'pdf');

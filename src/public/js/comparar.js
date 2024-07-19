'use strict';

class Comparar {
    constructor() {
        this.contrasenas = document.getElementById('contrasena');
        this.contraseñaRepetir = document.getElementById('contraseñaRepetir');
        this.mensajesa = document.getElementById('mensajesa');
    }

    comparativo() {
        if (this.contrasenas.value === this.contraseñaRepetir.value) {
            this.mensajesa.innerHTML = '<p>Contraseña coincide</p>';
        } else {
            this.mensajesa.innerHTML = '<p>Contraseña no coincide</p>';
        }
    }
}

let com = new Comparar();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contraseñaRepetir').addEventListener('input', function () {
        com.comparativo();
    });
});

'use strict';

class verContrasena {
    constructor() {
        this.contrasenas = document.getElementById('contrasena')
        this.ver = document.getElementById('ver')
        this.nover = document.getElementById('nover')
    }
    inicio() {
        this.nover.style.display = 'none'
    }
    mostrar() {
        if (this.nover.style.display == 'none') {
            this.contrasenas.setAttribute('type', 'text');
            this.ver.style.display = 'none'
            this.nover.style.display = 'block'
        } else {
            this.contrasenas.setAttribute('type', 'password');
            this.ver.style.display = 'block'
            this.nover.style.display = 'none'
        }
    }
}

let contrasena = new verContrasena()

window.onload = contrasena.inicio()

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ver').addEventListener('click', function () {
        contrasena.mostrar();
    });
    document.getElementById('nover').addEventListener('click', function () {
        contrasena.mostrar();
    });
});
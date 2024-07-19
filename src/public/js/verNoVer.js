'use strict';

class verContrasena {
    constructor() {
        this.contrasenas = document.getElementById('contrasena')
        this.contraseñaRepetir = document.getElementById('contraseñaRepetir')
        this.ver = document.getElementById('ver')
        this.nover = document.getElementById('nover')
        this.ver1 = document.getElementById('ver1')
        this.nover1 = document.getElementById('nover1')
    }
    inicio() {
        this.nover.style.display = 'none'
        if(this.nover1){
            this.nover1.style.display = 'none'
        }
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

    mostrar2(){
        if (this.nover1.style.display == 'none') {
            this.contraseñaRepetir.setAttribute('type', 'text');
            this.ver1.style.display = 'none'
            this.nover1.style.display = 'block'
        } else {
            this.contraseñaRepetir.setAttribute('type', 'password');
            this.ver1.style.display = 'block'
            this.nover1.style.display = 'none'
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
    document.getElementById('ver1').addEventListener('click', function () {
        contrasena.mostrar2();
    });
    document.getElementById('nover1').addEventListener('click', function () {
        contrasena.mostrar2();
    });
});
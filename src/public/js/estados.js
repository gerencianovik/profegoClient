'use strict';

class Estado {
    constructor() {
        this._idestado = document.getElementById('idestado');
        this._activarBtn = document.getElementById('activarBtn');
        this._desactivarBtn = document.getElementById('desactivarBtn');
    }

    inicio() {
        this.actualizarEstado();
    }

    actualizarEstado() {
        if (this._idestado.value === 'Activar') {
            this._activarBtn.style.display = 'none';
            this._desactivarBtn.style.display = 'block';
        } else {
            this._activarBtn.style.display = 'block';
            this._desactivarBtn.style.display = 'none';
        }
    }

    deshabilitar() {
        this._idestado.value = 'Desactivar';
        this.actualizarEstado();
    }

    habilitar() {
        this._idestado.value = 'Activar';
        this.actualizarEstado();
    }
}

const elecciones = new Estado();

window.onload = function () {
    elecciones.inicio();
};

document.addEventListener('DOMContentLoaded', function () {
    const activarBtn = document.getElementById('activarBtn');
    const desactivarBtn = document.getElementById('desactivarBtn');

    if (activarBtn && desactivarBtn) {
        activarBtn.addEventListener('click', function () {
            elecciones.habilitar();
        });

        desactivarBtn.addEventListener('click', function () {
            elecciones.deshabilitar();
        });
    }
});

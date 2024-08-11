'use strict';

class Checks {
    constructor() {
        this.si = document.getElementById('si');
        this.espesialidades = document.getElementById('espesialidades');
    }

    inicio() {
        this.espesialidades.style.display = 'none';
    }

    presionar() {
        if (this.si.checked) {
            this.espesialidades.style.display = 'block';
        } else {
            this.espesialidades.style.display = 'none';
        }
    }
}

let precionar = new Checks();

precionar.si.addEventListener('change', () => {
    precionar.presionar();
});

window.onload = precionar.inicio();


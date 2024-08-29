'use strict';

class Nosotros {
    constructor() {
        this.subNav5 = document.getElementById('subNav5');
        this.subNav4 = document.getElementById('subNav4');
        this.subNav3 = document.getElementById('subNav3');
        this.subNav2 = document.getElementById('subNav2');
        this.subNav1 = document.getElementById('subNav1');
        this.responsiveOnlyContainer= document.getElementById('responsiveOnlyContainer');
    }

    inicio() {
        this.subNav5.style.display = 'none';
        this.subNav4.style.display = 'none';
        this.subNav3.style.display = 'none';
        this.subNav2.style.display = 'none';
        this.subNav1.style.display = 'none';
        this.responsiveOnlyContainer.style.display = 'none';
    }

    cerrarTodos() {
        this.subNav5.style.display = 'none';
        this.subNav4.style.display = 'none';
        this.subNav3.style.display = 'none';
        this.subNav2.style.display = 'none';
        this.subNav1.style.display = 'none';
        this.responsiveOnlyContainer.style.display = 'none';
    }

    responsive(){
        if (this.responsiveOnlyContainer.style.display == 'none') {
            this.cerrarTodos();
            this.responsiveOnlyContainer.style.display = 'block';
        } else {
            this.responsiveOnlyContainer.style.display = 'none';
        }
    }

    cambio1() {
        if (this.subNav1.style.display == 'none') {
            this.cerrarTodos();
            this.subNav1.style.display = 'block';
        } else {
            this.subNav1.style.display = 'none';
        }
    }

    cambio2() {
        if (this.subNav2.style.display == 'none') {
            this.cerrarTodos();
            this.subNav2.style.display = 'block';
        } else {
            this.subNav2.style.display = 'none';
        }
    }

    cambio3() {
        if (this.subNav3.style.display == 'none') {
            this.cerrarTodos();
            this.subNav3.style.display = 'block';
        } else {
            this.subNav3.style.display = 'none';
        }
    }

    cambio3() {
        if (this.subNav3.style.display == 'none') {
            this.cerrarTodos();
            this.subNav3.style.display = 'block';
        } else {
            this.subNav3.style.display = 'none';
        }
    }

    cambio4() {
        if (this.subNav4.style.display == 'none') {
            this.cerrarTodos();
            this.subNav4.style.display = 'block';
        } else {
            this.subNav4.style.display = 'none';
        }
    }

    cambio5() {
        if (this.subNav5.style.display == 'none') {
            this.cerrarTodos();
            this.subNav5.style.display = 'block';
        } else {
            this.subNav5.style.display = 'none';
        }
    }
}

let nosotro = new Nosotros();
window.onload = function() {
    nosotro.inicio();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bajar0').addEventListener('click', function () {
        nosotro.cambio1();
    });

    document.getElementById('responsiveOnly').addEventListener('click', function () {
        nosotro.responsive();
    });

    document.getElementById('bajar1').addEventListener('click', function () {
        nosotro.cambio2();
    });

    document.getElementById('bajar2').addEventListener('click', function () {
        nosotro.cambio3();
    });
    document.getElementById('bajar3').addEventListener('click', function () {
        nosotro.cambio4();
    });
    document.getElementById('bajar4').addEventListener('click', function () {
        nosotro.cambio5();
    });
});

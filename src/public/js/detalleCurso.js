'use strict';
class Aparicion {
    constructor() {
        this.modalidad = document.getElementById('modalidad');
        this.Presencial = document.getElementById('Presencial');
        this.virtual = document.getElementById('virtual');
        this.curso = document.getElementById('curso');
        this.cursos = document.getElementById('cursos');
        this.Chouching = document.getElementById('Chouching');
    }

    posicionamiento() {
        if (this.modalidad.value == 'Presencial') {
            apariciones.Presencial.checked = true;
            document.getElementById('Virtual').style.display = 'none'
        }
        if (this.modalidad.value == 'virtual') {
            apariciones.virtual.checked = true
            document.getElementById('presencial').style.display = 'none'
        }
        if (this.curso.value == 'Curso') {
            apariciones.cursos.checked = true;
            document.getElementById('Chouching').style.display = 'none'
        }
        if (this.curso.value == 'Chouching') {
            apariciones.Chouching.checked = true;
            document.getElementById('Cursos').style.display = 'none'
        }
    }
}

let apariciones = new Aparicion();

window.onload = apariciones.posicionamiento();
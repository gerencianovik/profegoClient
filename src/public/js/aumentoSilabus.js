'use strict';

class Silabus {
    constructor() {
        this.moduleCurrucularContentCourse = document.getElementById('moduleCurrucularContentCourse');
        this.themesyllabusEducational = document.getElementById('themesyllabusEducational');
        this.timesyllabusEducational = document.getElementById('timesyllabusEducational');
        this.moduloBoton = document.getElementById('moduloBoton');
        this.temaBoton = document.getElementById('temaBoton');
        this.tiempoBoton = document.getElementById('tiempoBoton');
        this._listaValoresModulo = [];
        this._listaValoresTema = [];
        this._listaValoresTiempo = [];
        this.contador = new Contador();
    }

    actualizarModulos() {
        this._listaValoresModulo.push('');
        const listaHTML = this._listaValoresModulo.map(() => {
            return `
                    <div id="mod">
                        <input name="moduleCurrucularContentCourse" placeholder="Escriba su Modulo">
                        <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                    </div>
                `;
        }).join('');
        this.moduleCurrucularContentCourse.innerHTML = `<ul>${listaHTML}</ul>`;
        this.agregarEventosEliminar();
        this.contador.contadorTotalModulo();
    }

    actualizarTema() {
        this._listaValoresTema.push('');
        const listaHTML = this._listaValoresTema.map(() => {
            return `
                    <div id="tems">
                        <input name="themesyllabusEducational" placeholder="Escriba su Tema">
                        <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                    </div>
                `;
        }).join('');
        this.themesyllabusEducational.innerHTML = `<ul>${listaHTML}</ul>`;
        this.agregarEventosEliminar();
        this.contador.contadorTemaModulo();
    }

    actualizarTiempo() {
        this._listaValoresTiempo.push('');
        const listaHTML = this._listaValoresTiempo.map(() => {
            return `
                    <div id="tim">
                        <input name="timesyllabusEducational" placeholder="Escriba su Tiempo de Duracion">
                        <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                    </div>
                `;
        }).join('');
        this.timesyllabusEducational.innerHTML = `<ul>${listaHTML}</ul>`;
        this.agregarEventosEliminar();
        this.contador.contadorDuracionModulo();
    }

    agregarEventosEliminar() {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const li = event.target.closest('li');
                li.remove();
                this.contador.contadorTotalModulo();
                this.contador.contadorTemaModulo();
                this.contador.contadorDuracionModulo();
            });
        });
    }
}

class Contador {
    constructor() {
        this.ContadorModulos = document.getElementById('ContadorModulos');
        this.contadorClases = document.getElementById('contadorClases');
        this.contadorDuracion = document.getElementById('contadorDuracion');
    }

    contadorTotalModulo() {
        const modulos = document.getElementsByName('moduleCurrucularContentCourse');
        this.ContadorModulos.value = modulos.length;
    }

    contadorTemaModulo() {
        const temas = document.getElementsByName('themesyllabusEducational');
        this.contadorClases.value = temas.length;
    }

    contadorDuracionModulo() {
        const tiempos = document.getElementsByName('timesyllabusEducational');
        this.contadorDuracion.value = tiempos.length;
    }
}

// Instancia de la clase
document.addEventListener('DOMContentLoaded', function () {
    const silabusTotal = new Silabus();
    document.getElementById('moduloBoton').addEventListener('click', function () {
        silabusTotal.actualizarModulos();
    });
    document.getElementById('temaBoton').addEventListener('click', function () {
        silabusTotal.actualizarTema();
    });
    document.getElementById('tiempoBoton').addEventListener('click', function () {
        silabusTotal.actualizarTiempo();
    });
});
